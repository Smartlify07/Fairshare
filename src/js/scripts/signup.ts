import { supabase } from "../../supabase";

const signupButton = document.querySelector(
  "#signup-with-google-button"
) as HTMLButtonElement;

const handleSignUpWithGoogle = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "/src/pages/share.html",
    },
  });
};
signupButton.addEventListener("click", () => {
  handleSignUpWithGoogle();
});
