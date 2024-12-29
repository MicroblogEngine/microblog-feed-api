import { NextResponse } from "next/server";
import { auth } from '@/auth';
import { prisma } from "@/helpers/prisma"

type Props = {
  params?: Record<string, string | string[]> | undefined
}

export const GET = auth(async(req, ctx: Props ) => {
  if (!ctx.params)
    return new NextResponse(null, {
      status: 400,
    });

  const id = ctx.params.id as string;
  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  return new NextResponse(JSON.stringify(post), {
    status: 200,
  });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;

export const PUT = auth(async(req: Request, ctx: Props ) => {
  if (!ctx.params)
    return new NextResponse(null, {
      status: 400,
    });

  const id = ctx.params.id as string;
  const data = await req.json();

  await prisma.post.update({
    where: {
      id: parseInt(id),
    },
    data: data
  })

  return new NextResponse(null, {
    status: 200,
  });        
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;

export const DELETE = auth(async(req: Request, ctx: Props) => {
  if (!ctx.params)
    return new NextResponse(null, {
      status: 400,
    });

  const id = ctx.params.id as string;
  await prisma.post.delete({
    where: {
      id: parseInt(id),
    },
  })

  return new NextResponse(null, {
    status: 200,
  });         
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;
