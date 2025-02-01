import { NextResponse } from 'next/server'

export function middleware(request) {
  // Add security headers
  const headers = new Headers(request.headers)
  
  const response = NextResponse.next({
    request: {
      headers,
    },
  })

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  return response
} 