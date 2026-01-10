import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  // リダイレクト先URLを構築
  const redirectTo = (path: string) => {
    // Vercel環境ではx-forwarded-hostを使用
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host')
    const protocol = request.headers.get('x-forwarded-proto') || 'https'

    if (host) {
      return NextResponse.redirect(`${protocol}://${host}${path}`)
    }
    return NextResponse.redirect(new URL(path, requestUrl.origin))
  }

  if (!code) {
    return redirectTo('/login?error=no_code')
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return redirectTo('/login?error=config')
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('Auth exchange error:', error)
    return redirectTo('/login?error=auth')
  }

  // ログイン成功 - ユーザー情報をURLパラメータで渡す
  if (data.user) {
    const userInfo = {
      name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || '',
      email: data.user.email || '',
      avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || '',
    }

    // Base64エンコードしてURLパラメータで渡す
    const encodedInfo = Buffer.from(JSON.stringify(userInfo)).toString('base64')
    return redirectTo(`/?user_info=${encodedInfo}`)
  }

  return redirectTo(next)
}
