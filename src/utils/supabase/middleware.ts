import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Get user session info
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Protect dashboard and onboarding routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding') || pathname.startsWith('/app')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Check if onboarding is needed
    if (user && !pathname.startsWith('/onboarding')) {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', user.id)
          .single()

        if (!error && !profile?.company_id) {
          const url = request.nextUrl.clone()
          url.pathname = '/onboarding'
          return NextResponse.redirect(url)
        }
      } catch (e) {
        console.error('Middleware profile check error:', e)
      }
    }
  }

  // Redirect to dashboard/onboarding if logged in and accessing login/signup
  if (user && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single()

      const url = request.nextUrl.clone()
      if (profile?.company_id) {
        url.pathname = '/dashboard'
      } else {
        url.pathname = '/onboarding'
      }
      return NextResponse.redirect(url)
    } catch (e) {
      console.error('Middleware auth redirect error:', e)
    }
  }

  return supabaseResponse
}
