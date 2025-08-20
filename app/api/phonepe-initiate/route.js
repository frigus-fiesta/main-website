// /* eslint-disable no-unused-vars */
// import crypto from 'crypto';

// import { NextRequest, NextResponse } from 'next/server';

// const phonePeBaseURL = 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay'; // Use staging URL for testing
// const saltKey = 'test_salt_key';
// const saltIndex = '1';
// const merchantId = 'TEST_MERCHANT_ID'; // Provided by PhonePe

// export async function POST(req: NextRequest) {
//   try {
//     const { amount, customerName, customerEmail, customerPhone, orderId, callbackUrl } = await req.json();

//     const redirectUrl = `${callbackUrl}?orderId=${orderId}`;

//     const payload = {
//       merchantId,
//       merchantTransactionId: orderId,
//       merchantUserId: customerPhone,
//       amount,
//       redirectUrl,
//       redirectMode: 'POST',
//       callbackUrl,
//       mobileNumber: customerPhone,
//       paymentInstrument: {
//         type: 'PAY_PAGE',
//       },
//     };

//     const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');

//     const stringToSign = base64Payload + '/pg/v1/pay' + saltKey;
//     const xVerify = crypto.createHash('sha256').update(stringToSign).digest('hex') + '###' + saltIndex;

//     const response = await fetch(phonePeBaseURL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-VERIFY': xVerify,
//         'accept': 'application/json',
//       },
//       body: JSON.stringify({
//         request: base64Payload,
//       }),
//     });

//     const result = await response.json();

//     if (result.success && result.data && result.data.instrumentResponse && result.data.instrumentResponse.redirectInfo) {
//       const paymentUrl = result.data.instrumentResponse.redirectInfo.url;
      
// return NextResponse.json({ url: paymentUrl });
//     } else {
//       console.error('PhonePe API error:', result);
      
// return NextResponse.json({ error: 'Failed to initiate payment' }, { status: 500 });
//     }
//   } catch (error) {
//     console.error('Server error:', error);
    
// return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }

import crypto from "crypto";

import axios from "axios";
import { NextResponse } from "next/server";

// Constants
let salt_key = "96434309-7796-489d-8924-ab56988a6076";
let merchant_id = "PGTESTPAYUAT86";

export const runtime = 'edge';

export async function POST(req) {
  try {
    let reqData = await req.json(); // Parse the request data

    // Extract transaction details
    let merchantTransactionId = reqData.transactionId;

    // Prepare the payload
    const data = {
      merchantId: merchant_id,
      merchantTransactionId: merchantTransactionId,
      name: reqData.name,
      amount: reqData.amount * 100, // Convert to paise (smallest currency unit)
      redirectUrl: `${reqData.baseUrl}/api/phonepe-status?id=${merchantTransactionId}`,
      redirectMode: "POST",
      callbackUrl: `${reqData.baseUrl}/api/phonepe-status?id=${merchantTransactionId}`,
      mobileNumber: reqData.mobile,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    // Encode payload as Base64
    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");

    // Generate checksum
    const keyIndex = 1;
    const string = payloadMain + "/pg/v1/pay" + salt_key;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = `${sha256}###${keyIndex}`;

    // Define PhonePe API URL
    const prod_URL =
      "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

    // API call options
    const options = {
      method: "POST",
      url: prod_URL,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: payloadMain,
      },
    };

    // Make the API call
    const response = await axios(options);

    // Return the response from PhonePe
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);

    // Handle errors
    return NextResponse.json(
      { error: "Payment initiation failed", details: error.message },
      { status: 500 }
    );
  }
}