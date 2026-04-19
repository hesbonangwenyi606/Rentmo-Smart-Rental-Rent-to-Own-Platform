/**
 * Rentmo API Client
 *
 * All requests go to /api — Vite proxies them to the Express server at
 * localhost:3001 during development. In production, configure your reverse
 * proxy (nginx/Caddy) to forward /api to the Express server.
 */

const BASE_URL = "/api";

// ─── Token storage ────────────────────────────────────────────────────────────

export function getAccessToken() {
  return localStorage.getItem("rentmo_token");
}

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem("rentmo_token", accessToken);
  localStorage.setItem("rentmo_refresh", refreshToken);
}

export function clearTokens() {
  localStorage.removeItem("rentmo_token");
  localStorage.removeItem("rentmo_refresh");
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

interface RequestOptions extends RequestInit {
  auth?: boolean; // attach Bearer token (default: true)
}

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { auth = true, headers: extraHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(extraHeaders as Record<string, string>),
  };

  if (auth) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { headers, ...rest });

  // Auto-refresh on 401
  if (res.status === 401 && auth) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      headers["Authorization"] = `Bearer ${getAccessToken()}`;
      const retried = await fetch(`${BASE_URL}${path}`, { headers, ...rest });
      const retryData = await retried.json() as { success: boolean; data: T; message: string };
      if (!retried.ok) throw new ApiError(retryData.message, retried.status);
      return retryData.data;
    } else {
      clearTokens();
      window.location.href = "/login";
      throw new ApiError("Session expired. Please log in again.", 401);
    }
  }

  const data = await res.json() as { success: boolean; data: T; message: string; pagination?: unknown };

  if (!res.ok) throw new ApiError(data.message || "Request failed", res.status);

  return data.data;
}

export class ApiError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function tryRefreshToken(): Promise<boolean> {
  const refresh = localStorage.getItem("rentmo_refresh");
  if (!refresh) return false;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refresh }),
    });

    if (!res.ok) return false;

    const data = await res.json() as { data: { accessToken: string; refreshToken: string } };
    setTokens(data.data.accessToken, data.data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: "TENANT" | "LANDLORD" | "ADMIN";
  kycStatus: "PENDING" | "VERIFIED" | "REJECTED";
  avatar?: string;
  createdAt: string;
  creditScore?: { score: number; history: unknown[] };
  leases?: unknown[];
  insuranceSubscription?: unknown;
}

export const auth = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: "TENANT" | "LANDLORD";
  }) =>
    request<{ user: User; accessToken: string; refreshToken: string }>(
      "/auth/register",
      { method: "POST", body: JSON.stringify(data), auth: false }
    ),

  login: (data: { email: string; password: string }) =>
    request<{ user: User; accessToken: string; refreshToken: string }>(
      "/auth/login",
      { method: "POST", body: JSON.stringify(data), auth: false }
    ),

  logout: (refreshToken: string) =>
    request<null>("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }),

  me: () => request<User>("/auth/me"),
};

// ─── Properties ───────────────────────────────────────────────────────────────

export interface Property {
  id: string;
  title: string;
  description?: string;
  location: string;
  neighborhood: string;
  price: number;
  type: "rent" | "rent-to-own";
  bedrooms: number;
  bathrooms: number;
  size: number;
  images: string[];
  features: string[];
  available: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rating: number;
  reviews: number;
  propertyValue?: number;
  equityRate?: number;
  owner?: { id: string; name: string; email: string };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export const properties = {
  list: (params?: {
    search?: string;
    neighborhood?: string;
    type?: string;
    bedrooms?: string;
    priceMax?: number;
    available?: boolean;
    page?: number;
    limit?: number;
  }) => {
    const qs = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== "")
          .map(([k, v]) => [k, String(v)])
      )
    ).toString();
    return fetch(`${BASE_URL}/properties${qs ? `?${qs}` : ""}`)
      .then((r) => r.json() as Promise<{
        success: boolean;
        data: Property[];
        pagination: PaginatedResponse<Property>["pagination"];
      }>)
      .then((d) => ({ data: d.data, pagination: d.pagination }));
  },

  getById: (id: string) => request<Property>(`/properties/${id}`),

  create: (data: Partial<Property>) =>
    request<Property>("/properties", { method: "POST", body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Property>) =>
    request<Property>(`/properties/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id: string) =>
    request<null>(`/properties/${id}`, { method: "DELETE" }),

  mine: () => request<Property[]>("/properties/mine"),
};

// ─── Payments ─────────────────────────────────────────────────────────────────

export interface Payment {
  id: string;
  amount: number;
  method: "MPESA" | "CARD" | "BANK" | "LOAN";
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  transactionRef?: string;
  mpesaReceiptNo?: string;
  description: string;
  createdAt: string;
  lease?: { property: { title: string } };
}

export const payments = {
  list: (page = 1, limit = 20) =>
    request<Payment[]>(`/payments?page=${page}&limit=${limit}`),

  initiateMpesa: (data: {
    amount: number;
    phone: string;
    leaseId?: string;
    description?: string;
  }) =>
    request<{
      paymentId: string;
      checkoutRequestId: string;
      message: string;
    }>("/payments/mpesa/initiate", { method: "POST", body: JSON.stringify(data) }),

  getById: (id: string) =>
    request<{
      id: string;
      status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
      amount: number;
      method: string;
      mpesaReceiptNo?: string;
      transactionRef?: string;
      description: string;
      createdAt: string;
    }>(`/payments/${id}`),

  simulate: (paymentId: string) =>
    request<{ receipt: string }>(`/payments/simulate/${paymentId}`, { method: "POST" }),

  record: (data: {
    amount: number;
    method: "CARD" | "BANK";
    leaseId?: string;
    description: string;
    transactionRef?: string;
  }) =>
    request<Payment>("/payments/record", { method: "POST", body: JSON.stringify(data) }),

  getReceipt: (id: string) => request<Payment>(`/payments/receipt/${id}`),
};

// ─── Loans ────────────────────────────────────────────────────────────────────

export interface LoanApplication {
  id: string;
  amount: number;
  purpose: string;
  status: "PENDING" | "APPROVED" | "DISBURSED" | "REJECTED" | "REPAID";
  monthlyRepayment?: number;
  interestRate: number;
  disbursedAt?: string;
  createdAt: string;
}

export const loans = {
  list: () => request<LoanApplication[]>("/loans"),
  apply: (data: { amount: number; purpose: string }) =>
    request<LoanApplication>("/loans", { method: "POST", body: JSON.stringify(data) }),
  getById: (id: string) => request<LoanApplication>(`/loans/${id}`),
  updateStatus: (id: string, data: { status: "APPROVED" | "DISBURSED" | "REJECTED" | "REPAID"; notes?: string }) =>
    request<LoanApplication>(`/loans/${id}/status`, { method: "PATCH", body: JSON.stringify(data) }),
};

// ─── Insurance ────────────────────────────────────────────────────────────────

export interface InsurancePlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: { label: string; included: boolean }[];
}

export interface InsuranceClaim {
  id: string;
  reason: string;
  amount: number;
  description: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reference: string;
  filedAt: string;
  resolvedAt?: string;
}

export const insurance = {
  getPlans: () => request<InsurancePlan[]>("/insurance/plans", { auth: false }),

  getSubscription: () =>
    request<{
      plan: InsurancePlan;
      status: string;
      renewsAt: string;
      claims: InsuranceClaim[];
    } | null>("/insurance/subscription"),

  subscribe: (planId: string) =>
    request<unknown>("/insurance/subscribe", {
      method: "POST",
      body: JSON.stringify({ planId }),
    }),

  cancel: () =>
    request<null>("/insurance/subscription", { method: "DELETE" }),

  getClaims: () => request<InsuranceClaim[]>("/insurance/claims"),

  fileClaim: (data: {
    reason: string;
    amount: number;
    description: string;
  }) =>
    request<InsuranceClaim>("/insurance/claims", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ─── Credit Score ─────────────────────────────────────────────────────────────

export interface CreditScoreData {
  score: number;
  label: string;
  history: { month: string; year: number; score: number }[];
  stats: { totalPayments: number; onTimePayments: number; onTimePercent: number };
}

export const creditScore = {
  get: () => request<CreditScoreData>("/credit-score"),
  recalculate: () =>
    request<CreditScoreData>("/credit-score/recalculate", { method: "POST" }),
};

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = {
  getProfile: () => request<User>("/users/profile"),
  updateProfile: (data: { name?: string; phone?: string; avatar?: string }) =>
    request<User>("/users/profile", { method: "PUT", body: JSON.stringify(data) }),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    request<null>("/users/password", { method: "PUT", body: JSON.stringify(data) }),
  getDashboard: () => request<unknown>("/users/dashboard"),
  getLandlordDashboard: () => request<unknown>("/users/dashboard/landlord"),
};

// ─── Notifications ────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  createdAt: string;
}

export const notifications = {
  list: () => request<Notification[]>("/notifications"),
  markRead: (id: string) =>
    request<null>(`/notifications/${id}/read`, { method: "PATCH" }),
  markAllRead: () =>
    request<null>("/notifications/read-all", { method: "PATCH" }),
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface AdminStats {
  users: { total: number; byRole: { TENANT?: number; LANDLORD?: number; ADMIN?: number } };
  properties: { total: number; activeLeases: number };
  payments: { total: number; totalAmountKES: number };
  pendingLoans: number;
  pendingClaims: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "TENANT" | "LANDLORD" | "ADMIN";
  kycStatus: "PENDING" | "VERIFIED" | "REJECTED";
  createdAt: string;
  _count: { leases: number; payments: number };
}

export interface AdminProperty {
  id: string;
  title: string;
  location: string;
  neighborhood: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  images: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  available: boolean;
  createdAt: string;
  owner: { id: string; name: string; email: string };
}

export interface AdminLoan {
  id: string;
  amount: number;
  purpose: string;
  status: "PENDING" | "APPROVED" | "DISBURSED" | "REJECTED" | "REPAID";
  monthlyRepayment?: number;
  interestRate: number;
  notes?: string;
  disbursedAt?: string;
  createdAt: string;
  tenant: { id: string; name: string; email: string; creditScore?: { score: number } };
}

export const admin = {
  getStats: () => request<AdminStats>("/admin/stats"),
  getUsers: (params?: { page?: number; limit?: number; role?: string; search?: string }) => {
    const qs = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params || {}).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
      )
    ).toString();
    return request<AdminUser[]>(`/admin/users${qs ? `?${qs}` : ""}`);
  },
  updateUser: (id: string, data: { role?: string; kycStatus?: string }) =>
    request<AdminUser>(`/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  getPayments: (params?: { page?: number; status?: string }) => {
    const qs = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params || {}).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
      )
    ).toString();
    return request<Payment[]>(`/admin/payments${qs ? `?${qs}` : ""}`);
  },
  getLoans: (params?: { page?: number; limit?: number; status?: string }) => {
    const qs = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params || {}).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
      )
    ).toString();
    return request<AdminLoan[]>(`/admin/loans${qs ? `?${qs}` : ""}`);
  },
  getClaims: () => request<InsuranceClaim[]>("/admin/claims"),
  getProperties: (params?: { page?: number; status?: string }) => {
    const qs = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== "").map(([k, v]) => [k, String(v)])
      )
    ).toString();
    return request<AdminProperty[]>(`/admin/properties${qs ? `?${qs}` : ""}`);
  },
  updatePropertyStatus: (id: string, data: { status: "APPROVED" | "REJECTED"; reason?: string }) =>
    request<AdminProperty>(`/admin/properties/${id}/status`, { method: "PATCH", body: JSON.stringify(data) }),
};
