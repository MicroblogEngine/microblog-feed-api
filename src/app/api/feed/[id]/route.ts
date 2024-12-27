import { PrismaClient } from '@prisma/client'
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

type Props = {
  params: Promise<{
    id: number
  }>
}

export async function GET(request: Request, props: Props ) {
  const id = (await props.params).id
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });

  return new NextResponse(JSON.stringify(post), {
    status: 200,
  });
};

export async function PUT(request: Request, props: Props ) {
  const id = (await props.params).id
  const data = await request.json();

  await prisma.post.update({
    where: {
      id,
    },
    data: data
  })

  return new NextResponse(null, {
    status: 200,
  });        
}

export async function DELETE(request: Request, props: Props) {
  const id = (await props.params).id
  await prisma.post.delete({
    where: {
      id,
    },
  })

  return new NextResponse(null, {
    status: 200,
  });         
}