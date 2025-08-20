import crypto from "crypto";

import axios from "axios";
import {NextResponse} from "next/server";

let salt_key = "96434309-7796-489d-8924-ab56988a6076";
let merchant_id = "PGTESTPAYUAT86";

export const runtime = 'edge';

export async function POST(req){
    try {
        const searchParams = req.nextUrl.searchParams;
        const merchantTransactionId = searchParams.get('id');
        const keyIndex = 1;

        const string = `/pg/v1/status/${merchant_id}/${merchantTransactionId}` + salt_key;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + "###" + keyIndex;

        const options = {
            method: "GET",
            url: `https://api-prepod.phonepe.com/apis/pg-sandbox/pg/v1/pay/${merchant_id}/${merchantTransactionId}`,
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "X-VERIFY": checksum,
            },
        }
        const response = await axios(options);

        if (response.data.success === true){
            return NextResponse.redirect('/success',{
                status:301
            })
        }
        else {
            return NextResponse.redirect('/failed',{
                status:301
            })
        }
    } catch (error) {
     console.log(error)

    return NextResponse.json({error: "Payment check failed", details:error.message}, {status: 500});   
    }
}