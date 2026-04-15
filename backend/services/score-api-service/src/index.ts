import "dotenv/config";
import Fastify from "fastify";
import { connect, type Channel, type ConsumeMessage } from "amqplib";
import {
  SCORE_EVENTS_EXCHANGE,
  SCORE_EVENTS_ROUTING_KEYS,
  type HealthScoreResult
} from "@travel-health/types";

const app = Fastify({ logger: true });
const port = Number(process.env.SCORE_API_SERVICE_PORT ?? 4105);
const rabbitMqUrl = process.env.RABBITMQ_URL ?? "amqp://guest:guest@localhost:5672";
const queueName = "score_api_service.health_score_computed";
const scoreStore = new Map<string, HealthScoreResult>();
let eventChannel: Channel | null = null;

async function handleMessage(message: ConsumeMessage | null) {
  if (!message || !eventChannel) {
    return;
  }

  try {
    const payload = JSON.parse(message.content.toString()) as HealthScoreResult;
    scoreStore.set(payload.flightNumber, payload);
    app.log.info({ flightNumber: payload.flightNumber }, "Stored computed health score");
    eventChannel.ack(message);
  } catch (error) {
    app.log.error({ error }, "Failed processing computed score event");
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
      SCORE_EVENTS_ROUTING_KEYS.healthScoreComputed
    );
    await eventChannel.consume(queueName, handleMessage);
    app.log.info("RabbitMQ consumer initialized");
  } catch (error) {
    app.log.warn({ error }, "Failed to connect RabbitMQ; score event consumption disabled");
  }
}

app.get("/health", async () => ({ service: "score-api-service", status: "ok" }));

app.get("/v1/scores", async () => {
  return {
    count: scoreStore.size,
    items: Array.from(scoreStore.values())
  };
});

app.get("/v1/scores/:flightNumber", async (request, reply) => {
  const { flightNumber } = request.params as { flightNumber: string };
  const result = scoreStore.get(flightNumber);
  if (!result) {
    reply.code(404);
    return { message: `No score found for flight ${flightNumber}` };
  }
  return result;
});

async function start() {
  await setupRabbitMq();
  await app.listen({ port, host: "0.0.0.0" });
}

start().catch((error) => {
  app.log.error(error);
  process.exit(1);
});
