import { PrismaClient } from '@prisma/client'
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

type Props = {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: Request, props: Props ) {
  const id = (await props.params).id
  const post = await prisma.user.findUnique({
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

  await prisma.user.update({
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
  await prisma.user.delete({
    where: {
      id: id,
    },
  })

  return new NextResponse(null, {
    status: 200,
  });         
}