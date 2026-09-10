import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-cambiar";
const TOKEN_TTL = "7d";

export interface AuthResult {
  token: string;
  user: { id: string; email: string; username: string };
}

export async function registerUser(
  email: string,
  password: string,
  username: string,
): Promise<AuthResult> {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Ese email ya está registrado.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, username },
  });

  return issueToken(user.id, user.email, user.username);
}

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResult> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Credenciales incorrectas.");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new Error("Credenciales incorrectas.");
  }

  return issueToken(user.id, user.email, user.username);
}

function issueToken(id: string, email: string, username: string): AuthResult {
  const token = jwt.sign({ sub: id, email }, JWT_SECRET, {
    expiresIn: TOKEN_TTL,
  });
  return { token, user: { id, email, username } };
}

export function verifyToken(token: string): { sub: string; email: string } {
  return jwt.verify(token, JWT_SECRET) as { sub: string; email: string };
}
