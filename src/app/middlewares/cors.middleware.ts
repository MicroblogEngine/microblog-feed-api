import { NextRequest, NextResponse } from "next/server";

// the list of all allowed origins
const allowedOrigins = [
  'https://appmicroblogararog.loclx.io', 
  'https://app.microblog.training', 
  'http://microblog-prometheus.default.svc.cluster.local', 
];

export function corsMiddleware(req:NextRequest) {
    // retrieve the current response
    const res = NextResponse.next()

    // retrieve the HTTP "Origin" header 
    // from the incoming request
    const origin = req.headers.get("Origin");
    if (! origin)
      return res;

    if (allowedOrigins.includes(origin)) {
      res.headers.append('Access-Control-Allow-Origin', origin);
    }

    // add the remaining CORS headers to the response
    res.headers.append('Access-Control-Allow-Credentials', "true")
    res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
    res.headers.append(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )

    return res
}
