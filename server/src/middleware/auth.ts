import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, JwtPayload } from "../utils/jwt";
import { unauthorized, forbidden } from "../utils/response";

// Extend Express Request to carry the authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    unauthorized(res, "No token provided");
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    unauthorized(res, "Invalid or expired token");
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      unauthorized(res);
      return;
    }
    if (!roles.includes(req.user.role)) {
      forbidden(res, "You do not have permission to perform this action");
      return;
    }
    next();
  };
}

export const requireAdmin = requireRole("ADMIN");
export const requireLandlord = requireRole("LANDLORD", "ADMIN");
export const requireTenant = requireRole("TENANT", "ADMIN");
