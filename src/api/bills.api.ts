import type {
  BillFriendCreationPayload,
  BillFriend,
  ExtendedBillWithFriends,
  PayBillPayload,
} from "../js/store/types/bills.type";
import { supabase } from "../supabase";

export const getBills = async () => {
  const { data, error } = await supabase.from("bills").select(`
    *,
    creator:profiles!bills_creator_id_fkey(name),
    bill_friends(
      *,
      friend:profiles!bill_friends_friend_id_fkey(name)
    )
  `);
  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
  return data as ExtendedBillWithFriends[];
};

export const createBill = async (
  creator_id: string,
  title: string,
  amount: number
) => {
  const { data, error } = await supabase
    .from("bills")
    .insert({
      title,
      amount,
      creator_id,
    })
    .select("*")
    .maybeSingle();

  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
  return data;
};

export const getBillFriends = async () => {
  const { data, error } = await supabase
    .from("bill_friends")
    .select("*,friend:profiles(*)");
  if (error) {
    console.error("Error trying to get friends in this bill", error.message);
    throw new Error(error.message);
  }
  return data;
};

export const createBillFriends = async (
  payload: BillFriendCreationPayload[]
) => {
  const { data, error } = await supabase
    .from("bill_friends")
    .insert(payload)
    .select("*,friend:profiles(*)");
  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
  return data;
};

export const payBill = async (payload: PayBillPayload) => {
  const { data, error } = await supabase
    .from("bill_friends")
    .update({ ...payload })
    .eq("bill_id", payload.bill_id)
    .eq("friend_id", payload.friend_id)
    .select()
    .maybeSingle();
  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
  return data as BillFriend;
};
