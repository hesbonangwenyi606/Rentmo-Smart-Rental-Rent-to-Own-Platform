import { Request, Response } from "express";
import { z } from "zod";
import prisma from "../utils/prisma";
import * as R from "../utils/response";

// SQLite stores JSON as string; these helpers parse and stringify arrays
function parseJson<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}

function formatProperty(p: {
  images: string;
  features: string;
  type: string;
  [key: string]: unknown;
}) {
  return {
    ...p,
    images: parseJson<string[]>(p.images, []),
    features: parseJson<string[]>(p.features, []),
    type: p.type === "RENT_TO_OWN" ? "rent-to-own" : "rent",
  };
}

const createSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  location: z.string().min(3),
  neighborhood: z.string().min(2),
  price: z.number().positive(),
  type: z.enum(["RENT", "RENT_TO_OWN"]),
  bedrooms: z.number().int().positive(),
  bathrooms: z.number().int().positive(),
  size: z.number().int().positive(),
  images: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  available: z.boolean().default(true),
  propertyValue: z.number().optional(),
  equityRate: z.number().optional(),
});

export async function list(req: Request, res: Response) {
  const {
    search = "",
    neighborhood = "",
    type = "",
    bedrooms = "",
    priceMax = "",
    available = "",
    page = "1",
    limit = "20",
  } = req.query as Record<string, string>;

  const p = parseInt(page, 10) || 1;
  const l = Math.min(parseInt(limit, 10) || 20, 100);
  const skip = (p - 1) * l;

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { location: { contains: search } },
      { neighborhood: { contains: search } },
    ];
  }
  if (neighborhood && neighborhood !== "All") {
    where.neighborhood = neighborhood;
  }
  if (type && type !== "All") {
    where.type = type === "rent-to-own" ? "RENT_TO_OWN" : "RENT";
  }
  if (bedrooms && bedrooms !== "Any") {
    if (bedrooms === "4+") {
      where.bedrooms = { gte: 4 };
    } else {
      where.bedrooms = parseInt(bedrooms, 10);
    }
  }
  if (priceMax) {
    where.price = { lte: parseInt(priceMax, 10) };
  }
  if (available === "true") {
    where.available = true;
  }

  const [total, properties] = await Promise.all([
    prisma.property.count({ where }),
    prisma.property.findMany({
      where,
      skip,
      take: l,
      orderBy: { createdAt: "desc" },
      include: { owner: { select: { id: true, name: true, email: true } } },
    }),
  ]);

  R.paginated(
    res,
    properties.map(formatProperty),
    total,
    p,
    l
  );
}

export async function getById(req: Request, res: Response) {
  const property = await prisma.property.findUnique({
    where: { id: req.params.id },
    include: {
      owner: { select: { id: true, name: true, email: true, phone: true } },
    },
  });

  if (!property) {
    R.notFound(res, "Property");
    return;
  }

  R.success(res, formatProperty(property));
}

export async function create(req: Request, res: Response) {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    R.error(res, "Validation failed", 422, parsed.error.flatten().fieldErrors);
    return;
  }

  const { images, features, ...rest } = parsed.data;

  const property = await prisma.property.create({
    data: {
      ...rest,
      images: JSON.stringify(images),
      features: JSON.stringify(features),
      ownerId: req.user!.userId,
    },
  });

  R.created(res, formatProperty(property));
}

export async function update(req: Request, res: Response) {
  const property = await prisma.property.findUnique({
    where: { id: req.params.id },
  });

  if (!property) {
    R.notFound(res, "Property");
    return;
  }

  // Only owner or admin can update
  if (
    property.ownerId !== req.user!.userId &&
    req.user!.role !== "ADMIN"
  ) {
    R.forbidden(res);
    return;
  }

  const updateSchema = createSchema.partial();
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    R.error(res, "Validation failed", 422, parsed.error.flatten().fieldErrors);
    return;
  }

  const { images, features, ...rest } = parsed.data;

  const updated = await prisma.property.update({
    where: { id: req.params.id },
    data: {
      ...rest,
      ...(images !== undefined && { images: JSON.stringify(images) }),
      ...(features !== undefined && { features: JSON.stringify(features) }),
    },
  });

  R.success(res, formatProperty(updated));
}

export async function remove(req: Request, res: Response) {
  const property = await prisma.property.findUnique({
    where: { id: req.params.id },
  });

  if (!property) {
    R.notFound(res, "Property");
    return;
  }

  if (
    property.ownerId !== req.user!.userId &&
    req.user!.role !== "ADMIN"
  ) {
    R.forbidden(res);
    return;
  }

  await prisma.property.delete({ where: { id: req.params.id } });
  R.success(res, null, "Property deleted");
}

export async function myProperties(req: Request, res: Response) {
  const properties = await prisma.property.findMany({
    where: { ownerId: req.user!.userId },
    orderBy: { createdAt: "desc" },
    include: {
      leases: {
        where: { status: "ACTIVE" },
        include: { tenant: { select: { id: true, name: true, email: true } } },
      },
    },
  });

  R.success(res, properties.map(formatProperty));
}
