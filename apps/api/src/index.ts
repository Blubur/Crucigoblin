import Fastify from "fastify";
import "dotenv/config";
import { authRoutes } from "./modules/auth/auth.routes.js";

const app = Fastify({ logger: true });

app.get("/health", async () => {
  return { status: "ok", service: "crucigrama-api" };
});

app.register(authRoutes);

const port = Number(process.env.API_PORT ?? 3001);

app
  .listen({ port, host: "0.0.0.0" })
  .then(() => app.log.info(`API escuchando en http://localhost:${port}`))
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
