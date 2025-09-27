import type { User } from '@supabase/supabase-js';
import { supabase } from '../supabase';

export const getFriends = async () => {
  const { data: friends } = await supabase
    .from('friendships')
    .select('*')
    .eq('status', 'accepted');

  return friends;
};

export const getSuggestedFriends = async () => {
  const { data: suggestedFriends } = await supabase
    .from('profiles')
    .select('*');
  return suggestedFriends;
};

export const addFriend = async (user_id: User['id'], friend_id: string) => {
  const { error, data } = await supabase.from('friendships').insert({
    receiver_id: friend_id,
    status: 'pending',
    requester_id: user_id,
  });

  if (error) {
    console.error('An error occurred trying to add that friend', error.message);
    throw new Error(error.message);
  }

  return data;
};
export const updateFriendRequest = async (
  requester_id: string,
  receiver_id: string,
  status: 'accepted' | 'pending' | 'rejected'
) => {
  const { error, data } = await supabase
    .from('friendships')
    .update({
      status,
      receiver_id,
      requester_id,
    })
    .eq('receiver_id', receiver_id)
    .eq('requester_id', requester_id);

  if (error) {
    console.error('An error occurred trying to add that friend', error.message);
    throw new Error(error.message);
  }

  return data;
};

export const getFriendRequests = async () => {
  const { data, error } = await supabase
    .from('friendships')
    .select(`*,profiles!friendships_receiver_id_fkey1(*)`)
    .eq('status', 'pending');
  if (error) {
    console.error(
      'An error occurred trying to get your friend requests',
      error.message
    );
    throw new Error(error.message);
  }

  return data;
};
