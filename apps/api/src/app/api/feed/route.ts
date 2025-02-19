import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@ararog/microblog-feed-api-db"
import { FeedFormSchema } from "@ararog/microblog-validation"

export const POST = async(req: NextRequest) => {
  const authHeaders = await headers();
  const userId = authHeaders.get("user");

  if (!userId) {
    return new NextResponse(JSON.stringify({ errors: { user: ["Invalid user ID"] } }), {
      status: 400,
    });  
  }

  const feedPayload = await req.json();

  const {success, data, error} = FeedFormSchema.safeParse(feedPayload);

  if (!success) {
    return new NextResponse(JSON.stringify({ errors: error?.formErrors.fieldErrors }), {
      status: 400,
    });  
  }

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
