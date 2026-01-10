import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  // Vercel環境でのリダイレクト先を決定
  const getRedirectUrl = (path: string) => {
    const forwardedHost = request.headers.get('x-forwarded-host')
    if (forwardedHost) {
      return `https://${forwardedHost}${path}`
    }
    return `${origin}${path}`
  }

  if (code) {
    const cookieStore = await cookies()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase environment variables not configured')
      return NextResponse.redirect(getRedirectUrl('/login?error=config'))
    }

    try {
      const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll()
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) =>
                  cookieStore.set(name, value, options)
                )
              } catch {
                // Ignore errors in read-only context
              }
            },
          },
        }
      )

      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('Auth error:', error.message)
        return NextResponse.redirect(getRedirectUrl('/login?error=auth'))
      }

      return NextResponse.redirect(getRedirectUrl(next))
    } catch (error) {
      console.error('Callback error:', error)
      return NextResponse.redirect(getRedirectUrl('/login?error=callback'))
    }
  }

  return NextResponse.redirect(getRedirectUrl('/login?error=no_code'))
}
