import { PrismaClient } from '@prisma/client'
import { NextResponse } from "next/server";
import { auth } from '@/auth';

const prisma = new PrismaClient();

type Props = {
  params?: Record<string, string | string[]>
}

export const GET = auth(async(request, props: Props ) => {
  if (!props.params)
    return new NextResponse(null, {
      status: 400,
    });

  const id = props.params.id as string;
  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  return new NextResponse(JSON.stringify(post), {
    status: 200,
  });
});

export async function PUT(request: Request, props: Props ) {
  if (!props.params)
    return new NextResponse(null, {
      status: 400,
    });

  const id = props.params.id as string;
  const data = await request.json();

  await prisma.post.update({
    where: {
      id: parseInt(id),
    },
    data: data
  })

  return new NextResponse(null, {
    status: 200,
  });        
}

export async function DELETE(request: Request, props: Props) {
  if (!props.params)
    return new NextResponse(null, {
      status: 400,
    });

  const id = props.params.id as string;
  await prisma.post.delete({
    where: {
      id: parseInt(id),
    },
  })

  return new NextResponse(null, {
    status: 200,
  });         
}