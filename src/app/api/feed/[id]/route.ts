import { PrismaClient } from '@prisma/client'
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

interface IdParam {
  id: string
}

export async function GET(request: Request, { params }: { params: Awaited<IdParam> }) {
  const id = (await params).id 
  const post = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  return new NextResponse(JSON.stringify(post), {
    status: 200,
  });
};

export async function PUT(request: Request, { params }: { params: Awaited<IdParam> }) {
  const id = (await params).id 
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

export async function DELETE(request: Request, { params }: { params: Awaited<IdParam> }) {
  const id = (await params).id 

  await prisma.user.delete({
    where: {
      id: id,
    },
  })

  return new NextResponse(null, {
    status: 200,
  });         
}