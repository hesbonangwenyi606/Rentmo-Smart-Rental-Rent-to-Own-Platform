import { Request, Response } from "express";
import prisma from "../utils/prisma";
import * as R from "../utils/response";

export async function list(req: Request, res: Response) {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user!.userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  R.success(res, notifications);
}

export async function markRead(req: Request, res: Response) {
  const notif = await prisma.notification.findUnique({
    where: { id: req.params.id },
  });

  if (!notif || notif.userId !== req.user!.userId) {
    R.notFound(res, "Notification");
    return;
  }

  await prisma.notification.update({
    where: { id: req.params.id },
    data: { read: true },
  });

  R.success(res, null, "Marked as read");
}

export async function markAllRead(req: Request, res: Response) {
  await prisma.notification.updateMany({
    where: { userId: req.user!.userId, read: false },
    data: { read: true },
  });
  R.success(res, null, "All notifications marked as read");
}
