import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@ararog/microblog-feed-api-db"

export const POST = async(req: NextRequest) => {
  const data = await req.json();

  await prisma.post.create({
    data: data,
  });

  return new NextResponse(null, {
    status: 200,
  });    
};

export const GET = async () => {
  const feed = await prisma.post.findMany();

  return new NextResponse(JSON.stringify(feed), {
    status: 200,
  });
};
