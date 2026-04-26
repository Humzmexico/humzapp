# Humz — Setup Guide

## Environment Variables

The application requires the following environment variables to be configured:

### Development (`.env.local`)

```
DATABASE_URL="postgresql://user:password@host:port/database"
NEXT_PUBLIC_DEFAULT_ORG_ID="org_development_001"
NODE_ENV="development"
```

### Production (Vercel Dashboard)

Set these in Vercel Project Settings > Environment Variables:

**Required:**
- `DATABASE_URL` - PostgreSQL connection string from Supabase
  - Get from: Supabase > Settings > Database > Connection String > URI
  - Format: `postgresql://[user]:[password]@[host]:5432/postgres`
  
- `NEXT_PUBLIC_DEFAULT_ORG_ID` - Default organization for MVP
  - Example: `org_production_001`
  - This is a public variable (visible in browser), used to set a default org

**Optional (for future auth integrations):**
- `NEXTAUTH_SECRET` - For NextAuth.js integration
- `NEXTAUTH_URL` - For NextAuth.js integration

## Setup Steps

### 1. Supabase Configuration

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create one)
3. Navigate to Settings > Database
4. Copy the Connection String (URI format)
5. Set `DATABASE_URL` in Vercel with this value

### 2. Vercel Environment Setup

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select the "humzapp" project
3. Navigate to Settings > Environment Variables
4. Add the following variables:
   - `DATABASE_URL` (from Supabase)
   - `NEXT_PUBLIC_DEFAULT_ORG_ID` - set to any org ID like `org_001`

5. Redeploy the project to apply the environment variables

### 3. Local Development

1. Copy `.env.local.example` to `.env.local`
2. Fill in the database connection string from Supabase
3. Run `npm install && npm run dev`
4. Open http://localhost:3000

## API Authentication

The API routes use organization-based access control:
- All requests must belong to an organization (via `NEXT_PUBLIC_DEFAULT_ORG_ID`)
- The `getCurrentOrgId()` function in `lib/auth.ts` retrieves the current org
- Authentication is currently mocked — for production, integrate Clerk or NextAuth

## Database Migrations

The database schema is defined in `prisma/schema.prisma`. To apply migrations:

1. Ensure `DATABASE_URL` is set
2. Run: `npx prisma migrate deploy`
3. For development: `npx prisma migrate dev --name <migration-name>`

## Troubleshooting

### API returns 401 Unauthorized
- Check that `NEXT_PUBLIC_DEFAULT_ORG_ID` is set in Vercel environment
- Verify the environment variable was set correctly (wait a few minutes for deployment)

### Database connection errors
- Verify `DATABASE_URL` format is correct
- Check that your Supabase database allows connections from Vercel's IP range
- Ensure DATABASE_URL includes the correct user credentials

### Pages load but no data appears
- Check browser console for API errors
- Check Vercel runtime logs: Vercel Dashboard > Project > Analytics > Deployments > Logs
