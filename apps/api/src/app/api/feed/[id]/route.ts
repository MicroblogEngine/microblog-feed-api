import { NextResponse } from "next/server";
import { RequestPathProps } from "@ararog/microblog-types";
import { prisma } from "@ararog/microblog-feed-api-db"


export const GET = async(req: Request, { params }: { params: RequestPathProps } ) => {
  const { id } = await params;
  if (!id)
    return new NextResponse(null, {
      status: 400,
    });

  const post = await prisma.post.findUnique({
    where: {
      id: id,
    },
  });

  return new NextResponse(JSON.stringify(post), {
    status: 200,
  });
};

export const PUT = async(req: Request, { params }: { params: RequestPathProps }) => {
  const { id } = await params;
  if (!id)
    return new NextResponse(null, {
      status: 400,
    });

  const data = await req.json();

  await prisma.post.update({
    where: {
      id: id,
    },
    data: data
  })

  return new NextResponse(null, {
    status: 200,
  });        
};

export const DELETE = async(req: Request, { params }: { params: RequestPathProps }) => {
  const { id } = await params;
  if (!id)
    return new NextResponse(null, {
      status: 400,
    });

  await prisma.post.delete({
    where: {
      id: id,
    },
  })

  return new NextResponse(null, {
    status: 200,
  });         
};
