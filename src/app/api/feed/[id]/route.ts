import { NextResponse } from "next/server";
import { prisma } from "@/helpers/prisma"

type Props = {
  params?: { id: string }
}

export const GET = async(req: Request, props: Awaited<Props> ) => {
  if (!props.params)
    return new NextResponse(null, {
      status: 400,
    });

  const id = (await props.params).id;
  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  return new NextResponse(JSON.stringify(post), {
    status: 200,
  });
};

export const PUT = async(req: Request, props: Awaited<Props>  ) => {
  if (!props.params)
    return new NextResponse(null, {
      status: 400,
    });

  const id = (await props.params).id;
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
};

export const DELETE = async(req: Request, props: Awaited<Props>) => {
  if (!props.params)
    return new NextResponse(null, {
      status: 400,
    });

  const id = (await props.params).id;
  await prisma.post.delete({
    where: {
      id: parseInt(id),
    },
  })

  return new NextResponse(null, {
    status: 200,
  });         
};
