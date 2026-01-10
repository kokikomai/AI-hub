import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 一時的に認証をスキップ（モックデータで動作確認）
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
