import { getProfile } from '../../api/auth';
import { getBills } from '../../api/bills.api';
import {
  getFriendRequests,
  getFriends,
  getSuggestedFriends,
} from '../../api/friends.api';
import { supabase } from '../../supabase';
import { tryCatch } from '../utils/try-catch';
import type { State } from './types/state.type';

export default {
  async getUser(state: State) {
    const { error, data } = await tryCatch(supabase.auth.getUser());

    state.user.loading = false;
    state.user.error = error?.message ?? null;
    state.user.data = data?.data.user ?? null;

    return state;
  },

  async getUserProfile(state: State) {
    state.profile.loading = true;

    await this.getUser(state);

    const { error, data } = await tryCatch(
      getProfile(state.user.data?.id ?? '')
    );

    state.profile.loading = false;
    state.profile.error = error?.message ?? null;
    state.profile.data = data ?? null; // ✅ complete data assignment
  },

  async getBills(state: State) {
    state.bills.loading = true;

    const { error, data } = await tryCatch(getBills());

    state.bills.loading = false;
    state.bills.error = error?.message ?? null;
    state.bills.data = data ?? []; // ✅ complete data assignment
  },

  async getFriends(state: State) {
    state.friends.loading = true;

    await this.getUser(state);

    const { error, data } = await tryCatch(
      getFriends(state.user?.data?.id ?? '')
    );

    state.friends.loading = false;
    state.friends.error = error?.message ?? null;
    state.friends.data = data ?? []; // ✅ complete data assignment
  },

  async getSuggestedFriends(state: State) {
    state.suggestedFriends.loading = true;

    await this.getUser(state);

    const { error, data } = await tryCatch(
      getSuggestedFriends(state.user?.data?.id ?? '')
    );

    state.suggestedFriends.loading = false;
    state.suggestedFriends.error = error?.message ?? null;
    state.suggestedFriends.data = data ?? []; // ✅ complete data assignment
  },

  async getFriendRequests(state: State) {
    state.friendRequests.loading = true;

    await this.getUser(state);

    const { error, data } = await tryCatch(
      getFriendRequests(state.user?.data?.id ?? '')
    );

    state.friendRequests.loading = false;
    state.friendRequests.error = error?.message ?? null;
    state.friendRequests.data = data ?? []; // ✅ complete data assignment
  },
};
