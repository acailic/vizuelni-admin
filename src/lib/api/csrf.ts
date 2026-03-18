import { NextRequest, NextResponse } from 'next/server'

/**
 * Validate CSRF by checking Origin/Referer headers against the host.
 * Returns a 403 response if validation fails, or null if the request is valid.
 */
export function validateCsrf(request: NextRequest): NextResponse | null {
  const method = request.method
  // Only validate state-changing methods
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return null
  }

  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  const host = request.headers.get('host')

  if (!host) {
    return NextResponse.json({ error: 'Missing host header' }, { status: 403 })
  }

  // Check Origin header first (preferred)
  if (origin) {
    try {
      const originHost = new URL(origin).host
      if (originHost === host) {
        return null // Valid
      }
    } catch {
      // Invalid origin URL
    }
    return NextResponse.json({ error: 'CSRF validation failed' }, { status: 403 })
  }

  // Fall back to Referer header
  if (referer) {
    try {
      const refererHost = new URL(referer).host
      if (refererHost === host) {
        return null // Valid
      }
    } catch {
      // Invalid referer URL
    }
    return NextResponse.json({ error: 'CSRF validation failed' }, { status: 403 })
  }

  // No Origin or Referer header on a state-changing request
  return NextResponse.json({ error: 'CSRF validation failed: missing origin' }, { status: 403 })
}
