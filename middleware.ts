import { createServerClient } from '@supabase/ssr'
import createIntlMiddleware from 'next-intl/middleware'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip intl for public profile pages
  if (pathname.startsWith('/u/')) {
    return handleSupabase(request, NextResponse.next({ request }))
  }

  const intlResponse = intlMiddleware(request)
  return handleSupabase(request, intlResponse ?? NextResponse.next({ request }))
}

async function handleSupabase(request: NextRequest, response: NextResponse) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) return response

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user ?? null

  const { pathname } = request.nextUrl

  // Strip locale prefix to check path
  const strippedPath = pathname.replace(/^\/(en|he)/, '') || '/'

  const isAuthPage = strippedPath.startsWith('/sign-in') || strippedPath.startsWith('/sign-up')
  const isDashboard = strippedPath.startsWith('/dashboard')
  const isOnboarding = strippedPath.startsWith('/onboarding')
  const isRoot = strippedPath === '/'

  if (!user && (isDashboard || isOnboarding)) {
    const url = request.nextUrl.clone()
    url.pathname = '/sign-in'
    return NextResponse.redirect(url)
  }

  if (user && (isAuthPage || isRoot)) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next|api|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
