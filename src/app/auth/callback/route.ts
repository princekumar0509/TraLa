import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    const response = NextResponse.redirect(new URL('/dashboard', request.url));

    if (code) {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return [...request.cookies.getAll()];
                    },
                    setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            response.cookies.set(name, value, options);
                        });
                    },
                },
            }
        );

        await supabase.auth.exchangeCodeForSession(code);

        // Upsert supervisor record for the authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase.from('supervisors').upsert(
                {
                    auth_user_id: user.id,
                    full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? '',
                    company_name: user.user_metadata?.company_name ?? '',
                },
                { onConflict: 'auth_user_id' }
            );
        }
    }

    return response;
}
