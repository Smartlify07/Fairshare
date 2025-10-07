import { getAuthState } from './auth/auth';
import {
  getFriends,
  getReceivedFriendRequests,
  updateFriendRequest,
} from './api/friends';
import {
  createBill,
  createBillFriends,
  getBills,
  type Payload,
} from './api/bills';

const friendRequestsElement = document.querySelector(
  '#friend-requests'
) as HTMLElement;
const friendRequestsListElement = document.querySelector(
  '#friend-requests-list'
) as HTMLUListElement;
const userProfileElement = document.querySelector(
  '#user-profile'
) as HTMLDivElement;
const userImageElement = document.querySelector(
  '#user-profile-avatar'
) as HTMLImageElement;
const greetingText = document.querySelector(
  '#greeting-section > h1'
) as HTMLHeadingElement;
const billsSection = document.querySelector('#bills-section') as HTMLDivElement;
const billsList = document.querySelector('#bills-list') as HTMLDivElement;
const popOver = document.querySelector('.popover');
const billsForm = document.querySelector('form');
const addNewBillBtn = document.querySelector(
  '#bills-section #add-new-bill-btn'
);
const settleUpButton = document.querySelector(
  '#settle-up-btn'
) as HTMLButtonElement;

const getUserProfile = async () => {
  const user = await getAuthState();
  if (user?.user_metadata?.picture) {
    userImageElement.src = user?.user_metadata?.picture;
  } else {
    userImageElement.style.display = 'none';
    userProfileElement.className =
      'rounded-avatar flex items-center justify-center bg-bg text-text';
    userProfileElement.textContent = user?.user_metadata.name.charAt(0);
  }
  greetingText.textContent = `Hello, ${user?.user_metadata?.name}`;
  return user;
};

const handleUpdateFriendRequest = async (
  receiver_id: string,
  requester_id: string,
  status: 'accepted' | 'declined'
) => {
  try {
    await updateFriendRequest(requester_id, receiver_id, status);
  } catch (error) {
    console.error(error);
  }
};

const handleGetReceivedFriendRequests = async () => {
  const user = await getAuthState();

  const friendRequests = await getReceivedFriendRequests(user?.id!);
  if (friendRequests?.length === 0) {
    const emptyFriendRequestList = document.createElement('div');
    emptyFriendRequestList.innerHTML = `
    <div class="flex flex-col gap-6 items-center justify-center">
      <div class="flex gap-0 justify-center items-center">
          <img class="rounded-avatar size-10 object-cover" src="/public/images/boy_avatar.png" alt="boy-avatar-with-sunglasses" />
          <img class="rounded-avatar size-10 object-cover -ml-2" src="/public/images/girl-avatar-1-with-sunglasses.png" alt="boy-avatar-with-sunglasses" />
          <img class="rounded-avatar size-10 object-cover -ml-2" src="/public/images/girl-avatar-2-with-sunglasses.png" alt="boy-avatar-with-sunglasses" />
      </div>

      <div class="flex flex-col items-center gap-2">
        <h1 class="font-heading text-lg text-text">No friends yet</h1>
        <p class="font-display text-base text-muted font-normal text-center">
            Your friends list is looking a little lonely. Start connecting and this space will fill up fast!
        </p>
      </div>
    </div>
    `;
    friendRequestsElement?.appendChild(emptyFriendRequestList);
  } else {
    friendRequests?.forEach((friend: any) => {
      const profile = friend.profiles;
      const friendCardElement = document.createElement('div');
      friendCardElement.className =
        'flex items-center rounded-card p-4 justify-between border shadow-xs border-border bg-surface';
      friendCardElement.innerHTML = `
              <div class="flex items-center gap-4">
                ${
                  friend?.avatar_url
                    ? `<img
                  src=${profile.avatar_url ?? ''}
                  alt=${profile.name}
                  class="rounded-avatar size-10 object-cover"
                />`
                    : `<div class="rounded-avatar bg-bg size-10 flex items-center text-text font-body justify-center">
                        ${profile.name.charAt(0)}              
                      </div>`
                }
                <div>
                  <h3
                    class="text-base font-medium overflow-hidden w-[200px] whitespace-nowrap text-ellipsis font-heading text-text"
                  >
                    ${profile.name}
                  </h3>
                  <p
                    class="text-sm font-normal tracking-tight text-muted font-display"
                  >
                    @${profile?.username ?? profile?.name}
                  </p>
                </div>

                       
              </div>

              <div class="flex items-center gap-2">
                  <button id="accept-btn" class="accept-btn rounded-2xl bg-surface text-success border border-border px-4 py-1 shadow-xs font-medium font-display tracking-tight text-sm">
                    Accept
                  </button>
                  <button id="decline-btn" class="decline-btn rounded-2xl bg-surface text-error border border-border px-4 py-1 shadow-xs font-medium font-display tracking-tight text-sm">
                    Decline
                  </button>
              </div>     
    `;
      friendRequestsListElement?.append(friendCardElement);
      friendCardElement
        .querySelector('#accept-btn')
        ?.addEventListener('click', () => {
          handleUpdateFriendRequest(
            friend.receiver_id,
            friend.requester_id,
            'accepted'
          );
        });
      friendCardElement
        .querySelector('#decline-btn')
        ?.addEventListener('click', () => {
          handleUpdateFriendRequest(
            friend.receiver_id,
            friend.requester_id,
            'declined'
          );
        });
    });
  }
};

const handleCreateBill = async () => {
  popOver?.classList.remove('hidden');
  const inputs = {
    title: '',
    amount: 0,
  };
  const user = await getAuthState();
  const friends = await getFriends();

  friends?.forEach((friend) => {
    const div = document.createElement('div');
    div.className = 'flex items-center gap-1';
    div.innerHTML = `
      <label for="friend-checkbox-${friend.profiles.name}">${friend.profiles.name}</label>
      <input name="friend" id="friend-checkbox-${friend.profiles.name}" value="${friend.profiles.id}" type="checkbox"/>
    `;
    billsForm?.insertBefore(div, billsForm.querySelector('button'));
  });

  billsForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const billTitle = e.target.querySelector('#bill-title');
    const amountInput = e.target.querySelector('#bill-amount');
    const checkboxes = e.target.querySelectorAll('input[type="checkbox"]');

    const response = await createBill(
      user?.id!,
      billTitle.value,
      amountInput.value
    );

    const payload = [...checkboxes].map((checkbox) => ({
      friend_id: checkbox.value as string,
      bill_id: response.id,
      creator_id: user?.id!,
      amount_assigned: amountInput.value / friends?.length!,
      payment_status: 'owing' as Payload['payment_status'],
    }));
    await createBillFriends(payload);

    // divide amount by friends length.

    //close the modal/panel
  });
  console.log(inputs);
};

const handleOpenPaymentModal = () => {
  const paymentModal = document.querySelector('#settle-bill-modal');
  paymentModal?.classList.remove('hidden');
  paymentModal?.classList.add('flex');
};

const selectedBill = {};

addNewBillBtn?.addEventListener('click', () => {
  handleCreateBill();
});

const handleGetBills = async () => {
  const bills = await getBills();
  const user = await getAuthState();
  if (bills.length === 0) {
    const billsEmptyState = document.createElement('div');
    billsEmptyState.innerHTML = `
        <div class="flex flex-col gap-2 items-center">
          <h1 class="text-text font-heading text-lg font-medium">Nothing to split yet</h1>
          <p class="text-muted text-base font-display">Add a bill, whether it’s pizza night or project expenses.</p>
          <button class="rounded-2xl bg-surface text-primary border border-border px-4 py-1 shadow-xs font-medium font-display tracking-tight text-base whitespace-nowrap cursor-pointer"
>
            Create a bill
          </button>
        </div>
      `;
    billsSection.appendChild(billsEmptyState);
    billsEmptyState.querySelector('button')?.addEventListener('click', () => {
      handleCreateBill();
    });
  } else {
    bills.forEach((bill) => {
      console.log(bill.bill_friends);
      const billCard = document.createElement('div');
      const friendsToShow = bill.bill_friends.slice(0, 3);
      const remaining = bill.bill_friends.length - 3;
      let billFriendsInnerHTML = ``;
      const foundFriend = bill.bill_friends.find(
        (friend) => friend.friend_id === user?.id
      );
      console.log(foundFriend);
      let general_status = `
        <span
        class="px-2 py-0.5 text-sm rounded-2xl font-medium font-display bg-success/10 text-success"
        >
          ${
            bill.bill_friends.filter(
              (friend) => friend.payment_status === 'settled'
            ).length
          } of ${bill.bill_friends.length} settled
        </span>
      `;

      let user_status = `
        <span
        class="px-2 py-0.5 text-sm rounded-2xl truncate font-medium font-display ${
          foundFriend?.payment_status === 'settled'
            ? 'bg-success/10 text-success'
            : 'bg-error/10 text-error'
        }"
        >
          ${
            foundFriend?.payment_status === 'owing'
              ? `You owe ₦${foundFriend.amount_assigned} to ${bill.creator?.name}`
              : foundFriend?.payment_status === 'settled'
              ? `You've settled ₦${foundFriend.amount_assigned}`
              : 'Pending'
          }
        </span>
      `;

      friendsToShow.forEach((friend) => {
        billFriendsInnerHTML += `${
          friend.friend.avatar_url
            ? `<img src="${friend.friend?.avatar_url} " alt="${friend.friend?.name} " />`
            : `<div class="avatar avatar-fallback size-8 bg-neutral-100 font-medium font-body text-text">${friend.friend?.name.charAt(
                0
              )}</div>`
        }`;
      });
      billCard.innerHTML = `
      <div
        class="rounded-card cursor-pointer border border-border bg-surface shadow-xs pt-4 flex flex-col gap-3 hover:shadow-sm transition"
      >
                <!-- Top row: title + amount -->
                <div class="flex justify-between items-start px-4">
                  <div class="flex flex-col gap-0.5">
                   <h3 class="font-heading text-base text-text">
                    ${bill.title}
                   </h3>
                   <h5 class="font-display text-sm text-muted">
                    ${bill.created_at}
                   </h5>
                  </div>
                  <p class="font-display font-medium text-lg text-primary">
                    ₦${bill.amount}
                  </p>
                </div>

                <!-- Avatars + status -->
                <div id="avatars" class="flex border-t py-4 px-4 border-t-border justify-between items-center">
                  <div class="flex items-center gap-2">

                    <div class="flex items-center gap-1">
                      ${
                        bill.creator_id === user?.id ? billFriendsInnerHTML : ''
                      }
                    </div>
                       <div class="flex -space-x-2">
                        ${`
                     
                          ${
                            remaining > 0
                              ? `<div id="remaining-friends-count"
                            class="rounded-avatar size-8 bg-accent flex items-center justify-center text-sm font-display text-surface"
                              >
                              ${remaining}
                            </div>`
                              : ''
                          }
                        `}
                      </div>
                  </div>
                 ${bill.creator_id === user?.id ? general_status : user_status}
                 ${
                   bill.creator_id !== user?.id
                     ? `<button id="settle-up-btn" class="primary-btn px-2 py-1 text-white font-medium active:scale-[0.9]">Settle up</button>`
                     : ''
                 }
                </div>
              </div>`;

      billsList.appendChild(billCard);
      billCard
        ?.querySelector('#settle-up-btn')
        ?.addEventListener('click', () => {
          handleOpenPaymentModal();
          selectedBill.bill = { ...bill };
          console.log(selectedBill);
        });
    });
  }
};

const handleSettleBill = async () => {};
console.log(selectedBill);
window.addEventListener('DOMContentLoaded', () => {
  getUserProfile();
  handleGetReceivedFriendRequests();
  handleGetBills();
});
