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
    try {
      const { data } = await supabase.auth.getUser();
      state.user.data = data.user;
      return state;
    } catch (error) {
      console.error(error);
      state.user.error = error;
      return state;
    } finally {
      state.user.loading = false;
    }
  },

  async getUserProfile(state: State) {
    state.profile.loading = true;
    try {
      await this.getUser(state);
      console.log(state);
      const data = await getProfile(state.user?.data?.id!);
      state.profile.data = data;
      return state;
    } catch (error) {
      console.error(error);
      state.profile.error = error;
    } finally {
      state.profile.loading = false;
    }
  },

  async getBills(state: State) {
    state.bills.loading = true;

    try {
      const bills = await getBills();
      state.bills.data = bills;
      return state;
    } catch (error) {
      console.error(error);
      state.bills.error = error instanceof Error ? error?.message : error;
    } finally {
      state.bills.loading = false;
    }
  },

  async getFriends(state: State) {
    try {
      await this.getUser(state);
      const friends = await getFriends(state.user?.data?.id!);

      state.friends.data = friends;
      return state;
    } catch (error) {
      console.error(error);
      state.friends.error = error instanceof Error ? error?.message : error;
    } finally {
      state.friends.loading = false;
    }
  },

  async getSuggestedFriends(state: State) {
    state.suggestedFriends.loading = true;

    try {
      await this.getUser(state);
      const suggestedFriends = await getSuggestedFriends(
        state?.user?.data?.id ?? ''
      );
      state.suggestedFriends.data = suggestedFriends;
      return state;
    } catch (error) {
      console.error(error);
      state.suggestedFriends.error =
        error instanceof Error ? error?.message : error;
    } finally {
      state.suggestedFriends.loading = false;
    }
  },

  async getFriendRequests(state: State) {
    try {
      await this.getUser(state);
      const friendRequests = await getFriendRequests(
        state?.user?.data?.id ?? ''
      );

      state.friendRequests.data = friendRequests;
      return state;
    } catch (error) {
      console.error(error);
      state.friendRequests.error =
        error instanceof Error ? error?.message : error;
    } finally {
      state.friendRequests.loading = false;
    }
  },
};
