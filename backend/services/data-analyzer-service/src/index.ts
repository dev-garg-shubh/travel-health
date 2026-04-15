import "dotenv/config";
import Fastify from "fastify";
import { connect, type Channel, type ConsumeMessage } from "amqplib";
import {
  SCORE_EVENTS_EXCHANGE,
  SCORE_EVENTS_ROUTING_KEYS,
  type HealthScoreResult,
  type SourcePayload
} from "@travel-health/types";

const app = Fastify({ logger: true });
const port = Number(process.env.DATA_ANALYZER_SERVICE_PORT ?? 4104);
const rabbitMqUrl = process.env.RABBITMQ_URL ?? "amqp://guest:guest@localhost:5672";
const queueName = "data_analyzer_service.source_data";
let eventChannel: Channel | null = null;

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function computeHealthScore(sourcePayload: SourcePayload): HealthScoreResult {
  const airQualityIndex = Number(sourcePayload.data.airQualityIndex ?? 75);
  const delayProbability = Number(sourcePayload.data.delayProbability ?? 0.2);
  const airQualityScore = clampScore(airQualityIndex);
  const delayRiskScore = clampScore((1 - delayProbability) * 100);
  const cabinDensityScore = 76;
  const seasonalAlertsScore = 82;
  const overallScore = clampScore(
    airQualityScore * 0.35 +
      delayRiskScore * 0.25 +
      cabinDensityScore * 0.2 +
      seasonalAlertsScore * 0.2
  );

  return {
    id: crypto.randomUUID(),
    flightNumber: sourcePayload.flightNumber,
    overallScore,
    computedAt: new Date().toISOString(),
    breakdown: [
      {
        factor: "air_quality",
        weight: 0.35,
        score: airQualityScore,
        reason: "Derived from destination/source AQI"
      },
      {
        factor: "delay_risk",
        weight: 0.25,
        score: delayRiskScore,
        reason: "Computed from delay probability signal"
      },
      { factor: "cabin_density", weight: 0.2, score: cabinDensityScore, reason: "Baseline placeholder" },
      {
        factor: "seasonal_alerts",
        weight: 0.2,
        score: seasonalAlertsScore,
        reason: "No critical alerts in source feed"
      }
    ]
  };
}

async function publishScore(result: HealthScoreResult) {
  if (!eventChannel) {
    return;
  }
  eventChannel.publish(
    SCORE_EVENTS_EXCHANGE,
    SCORE_EVENTS_ROUTING_KEYS.healthScoreComputed,
    Buffer.from(JSON.stringify(result)),
    { contentType: "application/json", persistent: true }
  );
}

async function handleMessage(message: ConsumeMessage | null) {
  if (!message || !eventChannel) {
    return;
  }

  try {
    const payload = JSON.parse(message.content.toString()) as SourcePayload;
    const result = computeHealthScore(payload);
    await publishScore(result);
    app.log.info({ flightNumber: result.flightNumber }, "Published computed score");
    eventChannel.ack(message);
  } catch (error) {
    app.log.error({ error }, "Failed processing source data event");
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
      SCORE_EVENTS_ROUTING_KEYS.sourceDataFetched
    );
    await eventChannel.consume(queueName, handleMessage);
    app.log.info("RabbitMQ consumer initialized");
  } catch (error) {
    app.log.warn({ error }, "Failed to connect RabbitMQ; event consumption disabled");
  }
}

app.get("/health", async () => ({ service: "data-analyzer-service", status: "ok" }));

app.post("/v1/analyze", async () => {
  const result = computeHealthScore({
    flightNumber: "MANUAL",
    source: "manual-endpoint",
    fetchedAt: new Date().toISOString(),
    data: {
      airQualityIndex: 76,
      delayProbability: 0.24
    }
  });
  await publishScore(result);

  return {
    event: SCORE_EVENTS_ROUTING_KEYS.healthScoreComputed,
    payload: result
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
