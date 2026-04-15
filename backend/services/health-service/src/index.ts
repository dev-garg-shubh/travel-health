import "dotenv/config";
import Fastify from "fastify";

const app = Fastify({ logger: true });
const port = Number(process.env.HEALTH_SERVICE_PORT ?? 4102);

app.get("/health", async () => ({ service: "health-service", status: "ok" }));
app.get("/v1/health-criteria", async () => ({
  criteria: [
    { key: "air_quality", weight: 0.35 },
    { key: "delay_risk", weight: 0.25 },
    { key: "cabin_density", weight: 0.2 },
    { key: "seasonal_alerts", weight: 0.2 }
  ]
}));

app.listen({ port, host: "0.0.0.0" }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
