import type { User } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import type { Friend } from '../js/store/types/friends.type';

export const getFriends = async (user_id: User['id']) => {
  const { data: sent } = await supabase
    .from('friendships')
    .select('*, receiver:profiles!friendships_receiver_id_fkey1(*)')
    .eq('requester_id', user_id)
    .eq('status', 'accepted');

  // Case 2: user is the receiver
  const { data: received } = await supabase
    .from('friendships')
    .select('*, sender:profiles!friendships_requester_id_fkey1(*)')
    .eq('receiver_id', user_id)
    .eq('status', 'accepted');

  // Merge and normalize both sides into a single list of "friends"
  const friends = [
    ...(sent?.map((f) => f.receiver) ?? []),
    ...(received?.map((f) => f.sender) ?? []),
  ];

  return friends as Friend[];
};

export const getSuggestedFriends = async (user_id: User['id']) => {
  const { data, error } = await supabase.rpc('get_suggested_friends', {
    uid: user_id,
  });
  if (error) throw error;
  return data;
};

export async function getReceivedFriendRequests(user_id: User['id']) {
  const { data, error } = await supabase
    .from('friendships')
    .select(
      `
      id,
      status,
      requester_id,receiver_id,
      profiles:requester_id (id, name)
    `
    )
    .eq('receiver_id', user_id)
    .eq('status', 'pending');

  if (error) throw error;
  return data;
}

export async function getSentFriendRequests(user_id: User['id']) {
  const { data, error } = await supabase
    .from('friendships')
    .select(
      `
      id,
      status,
      receiver_id,requester_id,
      profiles:receiver_id (id, name)
    `
    )
    .eq('requester_id', user_id);

  if (error) throw error;
  return data;
}

export const sendFriendRequest = async (
  requester_id: User['id'],
  receiver_id: string
) => {
  const { error, data } = await supabase.from('friendships').insert({
    receiver_id,
    requester_id,
    status: 'pending',
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
  status: 'accepted' | 'pending' | 'declined'
) => {
  const { error, data } = await supabase
    .from('friendships')
    .update({
      status: status,
      receiver_id: receiver_id,
      requester_id: requester_id,
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
