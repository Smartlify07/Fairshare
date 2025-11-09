import { supabase } from '../../supabase';

const signupButton = document.querySelector(
  '#auth-signup-google'
) as HTMLButtonElement;

const getURL = () => {
  let url =
    import.meta?.env?.VITE_SITE_URL ?? // Set this to your site URL in production env.
    import.meta?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:5173/';
  // Make sure to include `https://` when not localhost.
  url = url.startsWith('http') ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.endsWith('/') ? url : `${url}/`;
  return url;
};

const handleSignUpWithGoogle = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: getURL(),
    },
  });
};
signupButton.addEventListener('click', () => {
  handleSignUpWithGoogle();
});
