import { getBills } from "../../api/bills";
import { getFriends } from "../../api/friends";
import { supabase } from "../../supabase";
import type { State } from "./types/state.type";

export default {
  async getUser(state: State) {
    const { data } = await supabase.auth.getUser();
    const newState = { ...state, user: data.user };
    return newState;
  },

  async getBills(state: State) {
    const bills = await getBills();
    const newState = { ...state, bills: bills };
    return newState;
  },

  async getFriends(state: State) {
    await this.getUser(state);
    const friends = await getFriends(state.user?.id!);
    const newState = { ...state, friends };
    return newState;
  },
};
