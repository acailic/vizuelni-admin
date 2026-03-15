export async function register() {
  const { checkRequiredEnvVars } = await import('@/lib/env')
  const result = checkRequiredEnvVars()
  if (!result.success) {
    console.warn(
      `Missing required environment variables: ${result.missing.join(', ')}`
    )
  }
}
