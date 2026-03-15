import { NextRequest, NextResponse } from 'next/server';

/**
 * Simple in-memory rate limiter
 * For production, use Redis or similar distributed cache
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up expired entries every minute
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
      if (now > entry.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 60000);
}

export interface RateLimitConfig {
  /** Time window in milliseconds */
  windowMs?: number;
  /** Maximum requests per window */
  maxRequests?: number;
  /** Skip rate limiting for certain IPs */
  skip?: (ip: string) => boolean;
}

const DEFAULT_CONFIG: Required<RateLimitConfig> = {
  windowMs: 60000, // 1 minute
  maxRequests: 100,
  skip: () => false,
};

/**
 * Check rate limit for a request
 * @returns null if allowed, NextResponse with error if limit exceeded
 */
export function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig = {}
): NextResponse | null {
  const { windowMs, maxRequests, skip } = { ...DEFAULT_CONFIG, ...config };

  // Get client IP
  const ip =
    request.ip ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  // Skip if whitelisted
  if (skip(ip)) {
    return null;
  }

  const key = `${ip}:${request.nextUrl.pathname}`;
  const now = Date.now();

  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    // Create new entry
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return null;
  }

  if (entry.count >= maxRequests) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

    return NextResponse.json(
      {
        error: 'Too many requests',
        retryAfter: `${retryAfter} seconds`,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(maxRequests),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(entry.resetTime / 1000)),
        },
      }
    );
  }

  // Increment counter
  entry.count++;

  // Add rate limit headers to indicate remaining requests
  // Note: This returns null to allow the request, but the headers won't be added
  // To add headers, we'd need to wrap the response, which is more complex

  return null;
}

/**
 * Higher-order function to add rate limiting to an API handler
 */
export function withRateLimit<T extends NextRequest>(
  handler: (request: T) => Promise<NextResponse>,
  config?: RateLimitConfig
) {
  return async (request: T): Promise<NextResponse> => {
    const rateLimitError = checkRateLimit(request, config);
    if (rateLimitError) {
      return rateLimitError;
    }

    return handler(request);
  };
}

/**
 * Rate limit configurations for different endpoint types
 */
export const RATE_LIMIT_CONFIGS = {
  // Strict limits for authentication endpoints
  auth: {
    windowMs: 60000, // 1 minute
    maxRequests: 5,
  },

  // Standard API limits
  api: {
    windowMs: 60000,
    maxRequests: 100,
  },

  // Relaxed limits for read-only operations
  readOnly: {
    windowMs: 60000,
    maxRequests: 200,
  },

  // Very strict for expensive operations
  expensive: {
    windowMs: 60000,
    maxRequests: 10,
  },

  // Proxy endpoint - prevent abuse
  proxy: {
    windowMs: 60000,
    maxRequests: 50,
  },
} as const;
