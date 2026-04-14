import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "../utils/prisma";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import * as R from "../utils/response";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  role: z.enum(["TENANT", "LANDLORD"]).default("TENANT"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function omitPassword(user: { password: string; [key: string]: unknown }) {
  const { password: _, ...rest } = user;
  return rest;
}

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    R.error(res, "Validation failed", 422, parsed.error.flatten().fieldErrors);
    return;
  }

  const { name, email, password, phone, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    R.error(res, "An account with this email already exists", 409);
    return;
  }

  const hashed = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { name, email, password: hashed, phone, role },
  });

  // Initialise credit score record for the new user
  await prisma.creditScore.create({
    data: { userId: user.id, score: 500, history: JSON.stringify([]) },
  });

  // Welcome notification
  await prisma.notification.create({
    data: {
      userId: user.id,
      title: "Welcome to Rentmo!",
      message:
        "Your account is ready. Start browsing properties or complete your KYC to unlock all features.",
      type: "success",
    },
  });

  const payload = { userId: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  R.created(res, { user: omitPassword(user), accessToken, refreshToken });
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    R.error(res, "Validation failed", 422, parsed.error.flatten().fieldErrors);
    return;
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    R.unauthorized(res, "Invalid email or password");
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    R.unauthorized(res, "Invalid email or password");
    return;
  }

  const payload = { userId: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  R.success(res, { user: omitPassword(user), accessToken, refreshToken }, "Login successful");
}

export async function refreshToken(req: Request, res: Response) {
  const { refreshToken: token } = req.body;
  if (!token) {
    R.unauthorized(res, "Refresh token required");
    return;
  }

  const stored = await prisma.refreshToken.findUnique({ where: { token } });
  if (!stored || stored.expiresAt < new Date()) {
    R.unauthorized(res, "Invalid or expired refresh token");
    return;
  }

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    R.unauthorized(res, "Invalid refresh token");
    return;
  }

  // Rotate token
  await prisma.refreshToken.delete({ where: { token } });

  const newPayload = { userId: payload.userId, email: payload.email, role: payload.role };
  const accessToken = signAccessToken(newPayload);
  const newRefreshToken = signRefreshToken(newPayload);

  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: payload.userId,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  R.success(res, { accessToken, refreshToken: newRefreshToken });
}

export async function logout(req: Request, res: Response) {
  const { refreshToken: token } = req.body;
  if (token) {
    await prisma.refreshToken.deleteMany({ where: { token } });
  }
  R.success(res, null, "Logged out successfully");
}

export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    include: {
      creditScore: true,
      leases: {
        where: { status: "ACTIVE" },
        include: { property: true },
        take: 1,
      },
      insuranceSubscription: { include: { plan: true } },
    },
  });

  if (!user) {
    R.notFound(res, "User");
    return;
  }

  R.success(res, omitPassword(user));
}
