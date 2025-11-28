import { NextApiRequest, NextApiResponse } from "next";
import { NextkitError } from "nextkit";

type RateLimitScope = "auth" | "api";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const STATE_CHANGING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

const RATE_LIMITS: Record<RateLimitScope, { limit: number; windowMs: number }> =
  {
    auth: { limit: 5, windowMs: FIFTEEN_MINUTES_MS },
    api: { limit: 100, windowMs: FIFTEEN_MINUTES_MS },
  };

const rateLimitBuckets: Record<RateLimitScope, Map<string, RateLimitEntry>> = {
  auth: new Map(),
  api: new Map(),
};

const parseHost = (value?: string): string => {
  if (!value) {
    return "";
  }

  try {
    const withProtocol = value.startsWith("http") ? value : `https://${value}`;
    return new URL(withProtocol).host.toLowerCase();
  } catch {
    return "";
  }
};

const resolveAllowedHost = (req: NextApiRequest): string => {
  const configuredHost =
    parseHost(process.env.NEXTAUTH_URL) || parseHost(process.env.PUBLIC_URL);
  const requestHost = (req.headers.host ?? "").toLowerCase();

  return configuredHost || requestHost;
};

const getClientIdentifier = (req: NextApiRequest): string => {
  const forwardedFor = (req.headers["x-forwarded-for"] as string | undefined)
    ?.split(",")[0]
    ?.trim();

  return (
    forwardedFor ||
    req.socket.remoteAddress ||
    (req.headers["x-real-ip"] as string | undefined) ||
    "unknown"
  );
};

export const isStateChangingMethod = (method?: string): boolean =>
  STATE_CHANGING_METHODS.has((method ?? "").toUpperCase());

export const enforceCsrfProtection = (req: NextApiRequest): void => {
  if (!isStateChangingMethod(req.method)) {
    return;
  }

  const allowedHost = resolveAllowedHost(req);
  if (!allowedHost) {
    throw new NextkitError(
      400,
      "CSRF protection: unable to determine allowed host"
    );
  }

  const originHost = parseHost(req.headers.origin as string | undefined);
  const refererHost = parseHost(req.headers.referer as string | undefined);

  if (!originHost && !refererHost) {
    throw new NextkitError(
      403,
      "CSRF protection: Origin or Referer header required"
    );
  }

  if (originHost && originHost !== allowedHost) {
    throw new NextkitError(403, "CSRF protection: invalid Origin header");
  }

  if (refererHost && refererHost !== allowedHost) {
    throw new NextkitError(403, "CSRF protection: invalid Referer header");
  }
};

export const enforceRateLimit = (
  req: NextApiRequest,
  res: NextApiResponse,
  scope: RateLimitScope
): void => {
  const { limit, windowMs } = RATE_LIMITS[scope];
  const bucketKey = `${scope}:${getClientIdentifier(req)}`;
  const store = rateLimitBuckets[scope];
  const now = Date.now();

  const bucket = store.get(bucketKey);

  if (!bucket || bucket.resetAt <= now) {
    store.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (bucket.count >= limit) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((bucket.resetAt - now) / 1000)
    );
    res.setHeader("Retry-After", retryAfterSeconds);
    throw new NextkitError(
      429,
      `Rate limit exceeded. Try again in ${retryAfterSeconds} seconds.`
    );
  }

  bucket.count += 1;
};

export const handleSecurityError = (
  res: NextApiResponse,
  error: unknown
): boolean => {
  if (error instanceof NextkitError) {
    res.status(error.code).json({ message: error.message });
    return true;
  }

  return false;
};
