'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/layout/Header';

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/';
  const supabase = createClient();

  return (
    <div className="min-h-screen">
      <Header title="Connexion" backHref="/" backLabel="Accueil" />

      <main className="mx-auto max-w-sm px-4 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Bienvenue sur TCF Prep
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Connectez-vous pour accéder aux fonctionnalités PRO
          </p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google', 'facebook']}
          redirectTo={`${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Adresse email',
                password_label: 'Mot de passe',
                button_label: 'Se connecter',
                link_text: 'Vous avez déjà un compte ? Connectez-vous',
                email_input_placeholder: 'votre@email.com',
                password_input_placeholder: 'Votre mot de passe',
              },
              sign_up: {
                email_label: 'Adresse email',
                password_label: 'Mot de passe',
                button_label: 'Créer un compte',
                link_text: 'Pas encore de compte ? Inscrivez-vous',
                email_input_placeholder: 'votre@email.com',
                password_input_placeholder: 'Choisissez un mot de passe',
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
