import "dotenv/config";
import Fastify from "fastify";
import { z } from "zod";

const app = Fastify({ logger: true });
const port = Number(process.env.API_GATEWAY_PORT ?? 4000);
const travelServiceUrl = process.env.TRAVEL_SERVICE_URL ?? "http://localhost:4101";
const scoreApiServiceUrl = process.env.SCORE_API_SERVICE_URL ?? "http://localhost:4105";

const requestSchema = z.object({
  flightNumber: z.string(),
  departureAirport: z.string(),
  arrivalAirport: z.string(),
  departureDate: z.string()
});

app.get("/health", async () => ({ service: "api-gateway", status: "ok" }));

app.post("/v1/flight-health/request", async (request, reply) => {
  const payload = requestSchema.parse(request.body);
  const response = await fetch(`${travelServiceUrl}/v1/flight-health/request`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });

  const body = (await response.json()) as unknown;
  reply.code(response.status);
  return body;
});

app.get("/v1/scores/:flightNumber", async (request, reply) => {
  const { flightNumber } = request.params as { flightNumber: string };
  const response = await fetch(`${scoreApiServiceUrl}/v1/scores/${flightNumber}`);
  const body = (await response.json()) as unknown;
  reply.code(response.status);
  return body;
});

app.listen({ port, host: "0.0.0.0" }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
