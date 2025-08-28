import crypto from "crypto";

import { NextResponse } from "next/server";
import axios from "axios";

export const runtime = "nodejs";

// POST is used because PhonePe sends callback in POST mode
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // PhonePe sends transaction info in callback body
    const transactionId = body?.transactionId || body?.data?.merchantTransactionId;
    const merchantId = process.env.PHONEPE_MERCHANT_ID!;

    if (!transactionId) {
      return NextResponse.json({ error: "Transaction ID missing" }, { status: 400 });
    }

    // ---- Verify payment status with PhonePe ----
    const endpoint = `/pg/v1/status/${merchantId}/${transactionId}`;
    const xVerify = generateXVerify("", endpoint); // No base64 payload for status

    const response = await axios.get(
      `https://api.phonepe.com/apis/hermes${endpoint}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerify,
          "X-MERCHANT-ID": merchantId,
        },
      }
    );

    const statusData = response.data;

    // ---- Trigger Mail ----
    if (statusData?.code === "PAYMENT_SUCCESS") {
      const mailPayload = {
        mail_name: "Frigus Fiesta",
        subject: "Payment Confirmation - Frigus Fiesta",
        html: `
          <h2>Payment Successful 🎉</h2>
          <p>Hi ${transactionId},</p>
          <p>Your payment of <strong>₹${statusData.data.amount / 100}</strong> has been successfully received.</p>
          <p>Transaction ID: <strong>${transactionId}</strong></p>
          <p>Thank you for joining <strong>Frigus Fiesta</strong>. Stay tuned for exciting events!</p>
        `,
        recipients: [body?.email || "info.frigusfiesta@gmail.com"],
      };

      await axios.post(
        "https://backend-server.developer-frigus-fiesta.workers.dev/mail/send-on-server-2",
        mailPayload,
        { headers: { "Content-Type": "application/json" } }
      );
    }

    return NextResponse.json(statusData);
  } catch (error: any) {
    console.error("Payment Status Error:", error?.response?.data || error.message);

    return NextResponse.json(
      { error: "Status check failed", details: error?.response?.data },
      { status: 500 }
    );
  }
}

// Utility for generating X-VERIFY for status calls
function generateXVerify(base64Payload: string, endpoint: string) {
  const saltKey = process.env.PHONEPE_SALT_KEY!;
  const saltIndex = process.env.PHONEPE_SALT_INDEX!;
  const hash = crypto
    .createHash("sha256")
    .update(base64Payload + endpoint + saltKey)
    .digest("hex");

  return `${hash}###${saltIndex}`;
}
