import { PrismaClient } from '@prisma/client'
import { NextResponse } from "next/server";
import { auth } from "@/auth"

const prisma = new PrismaClient();

export const POST = auth(async(request) => {
  if (! request.auth)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })

  const data = await request.json();

  await prisma.post.create({
    data: data,
  });

  return new NextResponse(null, {
    status: 200,
  });    
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;

export const GET = auth(async () => {
  const feed = await prisma.post.findMany();

  return new NextResponse(JSON.stringify(feed), {
    status: 200,
  });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;
