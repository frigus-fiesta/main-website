import crypto from "crypto";

import { NextResponse } from "next/server";
import axios from "axios";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { amount, userId, callbackUrl } = await req.json();

    const merchantId = process.env.PHONEPE_MERCHANT_ID!;
    const endpoint = "/pg/v1/pay";

    const payload = {
      merchantId,
      merchantTransactionId: `txn_${Date.now()}`,
      merchantUserId: userId,
      amount: amount * 100, // in paise
      redirectUrl: callbackUrl,
      redirectMode: "POST",
      callbackUrl,
      paymentInstrument: { type: "PAY_PAGE" },
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");

    const xVerify = generateXVerify(base64Payload, endpoint);

    const response = await axios.post(
      `https://api-preprod.phonepe.com/apis/pg-sandbox${endpoint}`,
      { request: base64Payload },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerify,
          "X-MERCHANT-ID": merchantId, // ✅ important
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("PhonePe API Error:", error?.response?.data || error.message);

    return NextResponse.json(
      { error: "Payment initiation failed", details: error?.response?.data },
      { status: 500 }
    );
  }
}

function generateXVerify(base64Payload: string, endpoint: string) {
  const saltKey = process.env.PHONEPE_SALT_KEY!;
  const saltIndex = process.env.PHONEPE_SALT_INDEX!;
  const hash = crypto
    .createHash("sha256")
    .update(base64Payload + endpoint + saltKey)
    .digest("hex");

  return `${hash}###${saltIndex}`;
}
