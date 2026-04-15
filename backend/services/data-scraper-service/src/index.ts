import "dotenv/config";
import Fastify from "fastify";
import { connect, type Channel, type ConsumeMessage } from "amqplib";
import {
  SCORE_EVENTS_EXCHANGE,
  SCORE_EVENTS_ROUTING_KEYS,
  type FlightHealthRequest,
  type SourcePayload
} from "@travel-health/types";

const app = Fastify({ logger: true });
const port = Number(process.env.DATA_SCRAPER_SERVICE_PORT ?? 4103);
const rabbitMqUrl = process.env.RABBITMQ_URL ?? "amqp://guest:guest@localhost:5672";
const queueName = "data_scraper_service.flight_requested";
let eventChannel: Channel | null = null;

function buildSourcePayload(flightNumber: string): SourcePayload {
  return {
    flightNumber,
    source: "mock-provider",
    fetchedAt: new Date().toISOString(),
    data: {
      airQualityIndex: Math.floor(65 + Math.random() * 20),
      delayProbability: Number((Math.random() * 0.4).toFixed(2))
    }
  };
}

async function publishSourceData(payload: SourcePayload) {
  if (!eventChannel) {
    return;
  }
  eventChannel.publish(
    SCORE_EVENTS_EXCHANGE,
    SCORE_EVENTS_ROUTING_KEYS.sourceDataFetched,
    Buffer.from(JSON.stringify(payload)),
    { contentType: "application/json", persistent: true }
  );
}

async function handleMessage(message: ConsumeMessage | null) {
  if (!message || !eventChannel) {
    return;
  }

  try {
    const payload = JSON.parse(message.content.toString()) as FlightHealthRequest;
    const sourceData = buildSourcePayload(payload.flightNumber);
    await publishSourceData(sourceData);
    app.log.info({ flightNumber: payload.flightNumber }, "Published source data");
    eventChannel.ack(message);
  } catch (error) {
    app.log.error({ error }, "Failed processing flight request event");
    eventChannel.nack(message, false, false);
  }
}

async function setupRabbitMq() {
  try {
    const connection = await connect(rabbitMqUrl);
    eventChannel = await connection.createChannel();
    await eventChannel.assertExchange(SCORE_EVENTS_EXCHANGE, "topic", { durable: true });
    await eventChannel.assertQueue(queueName, { durable: true });
    await eventChannel.bindQueue(
      queueName,
      SCORE_EVENTS_EXCHANGE,
      SCORE_EVENTS_ROUTING_KEYS.flightRequested
    );
    await eventChannel.consume(queueName, handleMessage);
    app.log.info("RabbitMQ consumer initialized");
  } catch (error) {
    app.log.warn({ error }, "Failed to connect RabbitMQ; event consumption disabled");
  }
}

app.get("/health", async () => ({ service: "data-scraper-service", status: "ok" }));

app.post("/v1/scrape/:flightNumber", async (request, reply) => {
  if (!eventChannel) {
    reply.code(503);
    return { accepted: false, error: "Event bus unavailable" };
  }

  const { flightNumber } = request.params as { flightNumber: string };
  const payload = buildSourcePayload(flightNumber);
  await publishSourceData(payload);

  return {
    event: SCORE_EVENTS_ROUTING_KEYS.sourceDataFetched,
    payload
  };
});

async function start() {
  await setupRabbitMq();
  await app.listen({ port, host: "0.0.0.0" });
}

start().catch((error) => {
  app.log.error(error);
  process.exit(1);
});
