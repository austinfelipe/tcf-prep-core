"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/layout/Header";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const supabase = createClient();

  return (
    <div className="min-h-screen">
      <Header title="Login" backHref="/" backLabel="Home" />

      <main className="mx-auto max-w-sm px-4 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome to TCF Prep
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to access PRO features
          </p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={["google", "facebook"]}
          redirectTo={`${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=${encodeURIComponent(redirect)}`}
          localization={{
            variables: {
              sign_in: {
                email_label: "Email address",
                password_label: "Password",
                button_label: "Sign in",
                link_text: "Already have an account? Sign in",
                email_input_placeholder: "your@email.com",
                password_input_placeholder: "Your password",
              },
              sign_up: {
                email_label: "Email address",
                password_label: "Password",
                button_label: "Create account",
                link_text: "Don't have an account? Sign up",
                email_input_placeholder: "your@email.com",
                password_input_placeholder: "Choose a password",
              },
            },
          }}
        />
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
