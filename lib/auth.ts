// Swap this file for Clerk/NextAuth without touching anything else.
// Only these two functions need to keep working with the same signatures.

export type AuthUser = {
  id: string
  name: string
  email: string
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  // TODO: replace with real auth — e.g. `const { userId } = await auth()` from Clerk
  return { id: 'user_1', name: 'Demo User', email: 'demo@humz.app' }
}

export async function getCurrentOrgId(): Promise<string | null> {
  // TODO: replace with real org from session
  return process.env.NEXT_PUBLIC_DEFAULT_ORG_ID ?? null
}
