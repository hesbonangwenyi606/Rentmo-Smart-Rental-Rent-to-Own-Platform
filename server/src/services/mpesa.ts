import axios from "axios";
import { config } from "../config";

interface StkPushParams {
  phone: string;      // e.g. "254712345678"
  amount: number;     // in KES (integer)
  accountRef: string; // e.g. "Lease-123"
  description: string;
}

interface StkPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

interface AccessTokenResponse {
  access_token: string;
  expires_in: string;
}

/**
 * Get M-Pesa OAuth access token from Safaricom Daraja
 */
export async function getMpesaToken(): Promise<string> {
  const credentials = Buffer.from(
    `${config.mpesa.consumerKey}:${config.mpesa.consumerSecret}`
  ).toString("base64");

  const response = await axios.get<AccessTokenResponse>(
    `${config.mpesa.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: { Authorization: `Basic ${credentials}` },
      timeout: 10000,
    }
  );

  return response.data.access_token;
}

/**
 * Generate the timestamp used in STK push (YYYYMMDDHHmmss)
 */
export function generateTimestamp(): string {
  return new Date()
    .toISOString()
    .replace(/[-T:.Z]/g, "")
    .slice(0, 14);
}

/**
 * Generate the base64 password for STK push
 */
export function generatePassword(timestamp: string): string {
  const raw = `${config.mpesa.shortCode}${config.mpesa.passKey}${timestamp}`;
  return Buffer.from(raw).toString("base64");
}

/**
 * Normalise phone number to 254XXXXXXXXX format
 */
export function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) return `254${cleaned.slice(1)}`;
  if (cleaned.startsWith("+")) return cleaned.slice(1);
  return cleaned;
}

/**
 * Initiate M-Pesa STK Push payment
 */
export async function initiateSTKPush(
  params: StkPushParams
): Promise<StkPushResponse> {
  const token = await getMpesaToken();
  const timestamp = generateTimestamp();
  const password = generatePassword(timestamp);
  const phone = normalizePhone(params.phone);

  const payload = {
    BusinessShortCode: config.mpesa.shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: Math.ceil(params.amount), // M-Pesa requires integer
    PartyA: phone,
    PartyB: config.mpesa.shortCode,
    PhoneNumber: phone,
    CallBackURL: config.mpesa.callbackUrl,
    AccountReference: params.accountRef,
    TransactionDesc: params.description,
  };

  const response = await axios.post<StkPushResponse>(
    `${config.mpesa.baseUrl}/mpesa/stkpush/v1/processrequest`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    }
  );

  return response.data;
}

/**
 * Query STK Push transaction status
 */
export async function querySTKStatus(checkoutRequestId: string) {
  const token = await getMpesaToken();
  const timestamp = generateTimestamp();
  const password = generatePassword(timestamp);

  const payload = {
    BusinessShortCode: config.mpesa.shortCode,
    Password: password,
    Timestamp: timestamp,
    CheckoutRequestID: checkoutRequestId,
  };

  const response = await axios.post(
    `${config.mpesa.baseUrl}/mpesa/stkpushquery/v1/query`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000,
    }
  );

  return response.data;
}
