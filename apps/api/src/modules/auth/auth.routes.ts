import type { FastifyInstance } from "fastify";
import { registerUser, loginUser } from "./auth.service.js";

interface RegisterBody {
  email: string;
  password: string;
  username: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export async function authRoutes(app: FastifyInstance) {
  app.post<{ Body: RegisterBody }>("/auth/register", async (request, reply) => {
    const { email, password, username } = request.body;

    if (!email || !password || !username) {
      return reply.status(400).send({ error: "Faltan campos obligatorios." });
    }
    if (password.length < 8) {
      return reply
        .status(400)
        .send({ error: "La contraseña debe tener al menos 8 caracteres." });
    }

    try {
      const result = await registerUser(email, password, username);
      return reply.status(201).send(result);
    } catch (err) {
      return reply.status(409).send({ error: (err as Error).message });
    }
  });

  app.post<{ Body: LoginBody }>("/auth/login", async (request, reply) => {
    const { email, password } = request.body;

    if (!email || !password) {
      return reply.status(400).send({ error: "Faltan campos obligatorios." });
    }

    try {
      const result = await loginUser(email, password);
      return reply.send(result);
    } catch (err) {
      return reply.status(401).send({ error: (err as Error).message });
    }
  });
}
