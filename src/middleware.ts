import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from 'jose';

const ignoredRoutes = [
  '/api/feed/health',
  '/api/feed/metrics',
]

export async function middleware(req:NextRequest) {
  const res = NextResponse.next();

  if(! ignoredRoutes.includes(req.url)) {
    const authorization = req.headers.get('authorization');
    if(!authorization)
      return new NextResponse(null, { status: 401 });

    // Bearer token
    const token = authorization?.split(" ")[1];
    try{
      if(process.env.AUTH_SECRET) {
        const { payload: { id }} = await jwtVerify(token, 
          new TextEncoder().encode(process.env.AUTH_SECRET),
          {
            algorithms: ['HS256'],
          });
        if(id) {
          req.headers.append("user", id as string);
        }
        else
          return new NextResponse(null, { status: 401 });
      }
    }
    catch{
      return new NextResponse(null, { status: 401 });
    }    
  }

  return res;
}

// specify the path regex to apply the middleware to
export const config = {
  matcher: '/api/:path*',
}