import { supabase } from "../supabase";

export const getAuthState = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};
