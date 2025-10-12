import type { Profile } from './profile.type';

export type Friendships = {
  receiver_id: string;
  requester_id: string;
  id: number;
  status: 'pending' | 'accepted' | 'rejected';
};

export type Friend = Profile & {};
export type FriendshipProfileJoin = Friendships & {
  profile: Profile;
};
