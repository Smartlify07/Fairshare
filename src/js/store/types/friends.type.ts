import type { Profile } from './profile.type';

export type Friendships = {
  receiver_id: string;
  requester_id: string;
  id: number;
  status: 'pending' | 'accepted' | 'declined';
};

export type Friend = Profile & {};
export type FriendshipProfileJoin = Friendships & {
  profile: Profile;
};

export type SuggestedFriend = Profile & {
  friendship_status: Friendships['status'];
};

export type FriendRequest = {
  profile: Profile;
} & Friendships;
