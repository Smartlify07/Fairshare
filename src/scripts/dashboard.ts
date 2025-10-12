import { getAuthState } from '../auth/auth';
import store from '../js/store';
import { getReceivedFriendRequests, updateFriendRequest } from '../api/friends';
import {
  createBill,
  createBillFriends,
  payBill,
  type Payload,
} from '../api/bills';
import UserAvatar from '../js/components/user-avatar';
import DashboardGreeting from '../js/components/dashboard-greeting';
import DashboardBillList from '../js/components/dashboard-bill-list';
import type { Friend } from '../js/store/types/friends.type';
import { findFriendWithUserId } from '../utils/bills.utils';
import type { BillFriend } from '../js/store/types/bills.type';

const friendRequestsElement = document.querySelector(
  '#friend-requests'
) as HTMLElement;
const friendRequestsListElement = document.querySelector(
  '#friend-requests-list'
) as HTMLUListElement;

const popOver = document.querySelector('#bill-form-popover');
const billsForm = document.querySelector('form');

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

const handleCloseBillSheet = () => {
  popOver?.classList.add('hidden');
  billsForm
    ?.querySelectorAll('#friend-checkbox')
    .forEach((element) => element.remove());
};

const handleOpenBillSheet = () => {
  popOver?.classList.remove('hidden');

  store.state.friends?.forEach((friend: Friend) => {
    const friendCheckBox = document.createElement('div');
    friendCheckBox.id = 'friend-checkbox';
    friendCheckBox.className = 'flex items-center gap-1';
    friendCheckBox.innerHTML = `
      <label for="friend-checkbox-${friend.name}">${friend.name}</label>
      <input name="friend" id="friend-checkbox-${friend.name}" value="${friend.id}" type="checkbox"/>
    `;
    billsForm?.insertBefore(friendCheckBox, billsForm.querySelector('button'));
  });
};

popOver?.querySelector('.close-button')?.addEventListener('click', () => {
  handleCloseBillSheet();
});

billsForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (e.target instanceof HTMLElement) {
    const billTitleInput = e.target!.querySelector(
      '#bill-title'
    ) as HTMLInputElement;
    const amountInput = e.target!.querySelector(
      '#bill-amount'
    ) as HTMLInputElement;
    const checkboxes = e.target!.querySelectorAll(
      'input[type="checkbox"]'
    ) as NodeListOf<HTMLInputElement>;

    const isFriendSelected = [...checkboxes]
      .map((checkbox) => checkbox)
      .some((checkbox) => checkbox.checked);
    if (
      billTitleInput.value.trim() === '' ||
      amountInput.value.trim() === '' ||
      !isFriendSelected
    ) {
      alert('Fill in all fields');
      return;
    } else {
      const response = await createBill(
        store.state.user?.id!,
        billTitleInput.value,
        Number(amountInput.value)
      );
      const payload = [...checkboxes].map((checkbox) => ({
        friend_id: checkbox.value as string,
        bill_id: response.id,
        creator_id: store.state.user?.id!,
        amount_assigned:
          Number(amountInput.value) / store.state.friends?.length!,
        payment_status: 'owing' as Payload['payment_status'],
      }));
      const billFriendsResponse = await createBillFriends(payload);
      const combinedResponse = {
        ...response,
        bill_friends: billFriendsResponse,
      };
      store.dispatch('createBill', combinedResponse);
      billTitleInput.value = '';
      amountInput.value = '';
      handleCloseBillSheet();
    }
  }

  // divide amount by friends length.

  //close the modal/panel
});
const paymentModal = document.querySelector('#settle-bill-modal');
const paymentModalPopover = document.querySelector(
  '#settle-bill-modal-popover'
);
const handleClosePaymentPopover = () => {
  paymentModalPopover?.classList.add('hidden');
  paymentModalPopover?.classList.remove('flex');
};

paymentModal?.querySelector('.close-button')?.addEventListener('click', () => {
  handleClosePaymentPopover();
  paymentModal.querySelector('#payment-modal-header')?.remove();
});

const handleOpenPaymentModal = async () => {
  const { selectedBill } = store.state;
  const paymentModalHeader = document.createElement('p');
  paymentModalHeader.id = 'payment-modal-header';
  paymentModalHeader.className =
    'font-display text-base text-muted text-center mb-6';
  paymentModalHeader.innerHTML = `
      You owe <span class="text-primary font-semibold">₦
${selectedBill.amount.toLocaleString()}</span> to <span class="font-semibold text-text">${
    selectedBill.creator.name
  }</span> for <span class="text-accent font-semibold">“${
    selectedBill.title
  }”</span>
  `;
  const inputWrapper = paymentModal?.querySelector('#amount-input-wrapper');
  const paymentForm = paymentModal?.querySelector('#payment-form');

  paymentModalPopover?.classList.remove('hidden');
  paymentModalPopover?.classList.add('flex');
  paymentModal?.insertBefore(paymentModalHeader, paymentForm!);

  paymentForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const paymentAmountInput = inputWrapper?.querySelector(
      '#payment-amount'
    ) as HTMLInputElement;

    if (paymentAmountInput.value.trim() === '') {
      return;
    } else {
      const assignedAmount = findFriendWithUserId(
        selectedBill.bill_friends,
        store.state.user.id
      )?.amount_assigned;
      const amountEntered = Number(paymentAmountInput.value);
      const payment_status: BillFriend['payment_status'] =
        amountEntered >= assignedAmount! ? 'settled' : 'owing';

      await payBill({
        bill_id: selectedBill.id,
        amount_paid: amountEntered,
        friend_id: store.state.user.id,
        creator_id: selectedBill.creator_id,
        payment_status,
      });
      handleClosePaymentPopover();
    }
  });
};

document.querySelector('#bills-section')?.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;

  if (target.matches('#add-new-bill-btn')) {
    handleOpenBillSheet();
  }

  if (target.matches('#settle-up-btn')) {
    handleOpenPaymentModal();
  }
});

window.addEventListener('DOMContentLoaded', () => {
  handleGetReceivedFriendRequests();
  store.query('getUser');
  store.query('getBills');
  store.query('getFriends');
});

const UserProfileInstance = new UserAvatar();
const GreetingSectionInstance = new DashboardGreeting();
const DashboardBillListInstance = new DashboardBillList();

UserProfileInstance.render();
GreetingSectionInstance.render();
DashboardBillListInstance.render();
