import type { User } from "@supabase/supabase-js";
import { supabase } from "../supabase";

export const getAuthState = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};

export const getProfile = async (user_id: User["id"]) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user_id)
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return data;
};
