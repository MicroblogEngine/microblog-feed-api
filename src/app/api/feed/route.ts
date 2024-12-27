import { PrismaClient } from '@prisma/client'
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const data = await request.json();

  await prisma.post.create({
    data: data,
  });

  return new NextResponse(null, {
    status: 200,
  });    
}

export async function GET() {
  const feed = await prisma.post.findMany();

  return new NextResponse(JSON.stringify(feed), {
    status: 200,
  });
};

