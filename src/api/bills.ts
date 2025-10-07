import { supabase } from '../supabase';

export const getBills = async () => {
  const { data, error } = await supabase.from('bills').select(`
    *,
    creator:profiles!bills_creator_id_fkey(name),
    bill_friends(
      *,
      friend:profiles!bill_friends_friend_id_fkey(name)
    )
  `);
  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
  return data;
};

export const createBill = async (
  creator_id: string,
  title: string,
  amount: number
) => {
  const { data, error } = await supabase
    .from('bills')
    .insert({
      title,
      amount,
      creator_id,
    })
    .select('*')
    .maybeSingle();

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
  return data;
};

export const getBillFriends = async () => {
  const { data, error } = await supabase
    .from('bill_friends')
    .select('*,profiles(*)');
  if (error) {
    console.error('Error trying to get friends in this bill', error.message);
    throw new Error(error.message);
  }
  return data;
};
export type Payload = {
  bill_id: string;
  friend_id: string;
  amount_assigned: number;
  payment_status: 'owing' | 'paid';
};
export const createBillFriends = async (payload: Payload[]) => {
  const { data, error } = await supabase
    .from('bill_friends')
    .insert(payload)
    .select('*');
  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
  return data;
};
