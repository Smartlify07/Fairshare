import type {
  Bill,
  BillFriend,
  ExtendedBillWithFriends,
} from "../js/store/types/bills.type";
import type { Friend } from "../js/store/types/friends.type";
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

export type Payload = {
  bill_id: string;
  friend_id: string;
  amount_assigned: number;
  payment_status: "owing" | "paid";
};
export const createBillFriends = async (payload: Payload[]) => {
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

export type PayBillPayload = {
  bill_id: Bill["id"];
  amount_paid: number;
  friend_id: Friend["id"];
  creator_id: Bill["creator_id"];
  payment_status: BillFriend["payment_status"];
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
