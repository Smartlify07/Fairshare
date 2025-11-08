import { getProfile } from '../../api/auth';
import { getBills } from '../../api/bills.api';
import {
  getFriendRequests,
  getFriends,
  getSuggestedFriends,
} from '../../api/friends.api';
import { supabase } from '../../supabase';
import type { State } from './types/state.type';

export default {
  async getUser(state: State) {
    const { data } = await supabase.auth.getUser();
    const newState = { ...state, user: data.user };
    return newState;
  },

  async getUserProfile(state: State) {
    await this.getUser(state);
    const data = await getProfile(state.user?.id!);
    const newState = { ...state, profile: data };
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

  async getSuggestedFriends(state: State) {
    await this.getUser(state);
    const suggestedFriends = await getSuggestedFriends(state?.user?.id ?? '');
    const newState = { ...state, suggestedFriends };
    return newState;
  },

  async getFriendRequests(state: State) {
    await this.getUser(state);
    const friendRequests = await getFriendRequests(state?.user?.id ?? '');
    const newState = { ...state, friendRequests };
    return newState;
  },
};
