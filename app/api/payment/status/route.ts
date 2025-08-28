import crypto from "crypto";

import { NextResponse } from "next/server";
import axios from "axios";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // PhonePe sends callback as form-urlencoded, not JSON
    const form = await req.formData();

    const transactionId =
      form.get("transactionId")?.toString() ||
      form.get("merchantTransactionId")?.toString();

    const merchantId = process.env.PHONEPE_MERCHANT_ID!;

    if (!transactionId) {
      return NextResponse.json({ error: "Transaction ID missing" }, { status: 400 });
    }

    // ---- Verify payment status with PhonePe ----
    const endpoint = `/pg/v1/status/${merchantId}/${transactionId}`;
    const xVerify = generateXVerify("", endpoint);

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
          <p>Your payment of <strong>₹${statusData.data.amount / 100}</strong> has been successfully received.</p>
          <p>Transaction ID: <strong>${transactionId}</strong></p>
          <p>Thank you for joining <strong>Frigus Fiesta</strong>. Stay tuned for exciting events!</p>
        `,
        recipients: ["info.frigusfiesta@gmail.com"], // replace with user email if you capture it
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
