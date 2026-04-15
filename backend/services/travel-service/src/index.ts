import "dotenv/config";
import Fastify from "fastify";
import { connect, type Channel } from "amqplib";
import { z } from "zod";
import {
  SCORE_EVENTS_EXCHANGE,
  SCORE_EVENTS_ROUTING_KEYS,
  type FlightHealthRequest
} from "@travel-health/types";

const app = Fastify({ logger: true });
const port = Number(process.env.TRAVEL_SERVICE_PORT ?? 4101);
const rabbitMqUrl = process.env.RABBITMQ_URL ?? "amqp://guest:guest@localhost:5672";
let eventChannel: Channel | null = null;

const requestSchema = z.object({
  flightNumber: z.string(),
  departureAirport: z.string(),
  arrivalAirport: z.string(),
  departureDate: z.string()
});

async function setupRabbitMq() {
  try {
    const connection = await connect(rabbitMqUrl);
    eventChannel = await connection.createChannel();
    await eventChannel.assertExchange(SCORE_EVENTS_EXCHANGE, "topic", { durable: true });
    app.log.info("RabbitMQ channel initialized");
  } catch (error) {
    app.log.warn({ error }, "Failed to connect RabbitMQ; request publishing disabled");
  }
}

app.get("/health", async () => ({ service: "travel-service", status: "ok" }));

app.post("/v1/flight-health/request", async (request, reply) => {
  const payload = requestSchema.parse(request.body) as FlightHealthRequest;

  if (!eventChannel) {
    reply.code(503);
    return {
      accepted: false,
      error: "Event bus unavailable"
    };
  }

  eventChannel.publish(
    SCORE_EVENTS_EXCHANGE,
    SCORE_EVENTS_ROUTING_KEYS.flightRequested,
    Buffer.from(JSON.stringify(payload)),
    { contentType: "application/json", persistent: true }
  );

  return {
    accepted: true,
    event: SCORE_EVENTS_ROUTING_KEYS.flightRequested,
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
