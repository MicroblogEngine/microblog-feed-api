import { fakeFeed } from "@/db/feed";
import { NextResponse } from "next/server";

export async function GET() {

    return new NextResponse(JSON.stringify(fakeFeed), {
        status: 200,
    });
}