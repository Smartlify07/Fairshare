import SummaryCards from '../components/dashboard/summary-cards';
import SummaryText from '../components/dashboard/greeting-section';
import store from '../store';
import UserAvatar from '../components/dashboard/user-avatar';
import { checkIsBrokenImage } from '../utils/images.utils';
import { createBill, createBillFriends } from '../../api/bills.api';
import type { BillFriendCreationPayload } from '../store/types/bills.type';
import RecentBills from '../components/dashboard/recent-bills';
import NeedToPay from '../components/dashboard/need-to-pay';
import { splitBill } from '../utils/bills.utils';

const newBillBtn = document.querySelector('#add-new-bill-btn');
const drawer = document.querySelector('.drawer') as HTMLDivElement;
const closeBtn = document.querySelector('.icon-btn') as HTMLButtonElement;
const popover = document.querySelector('.backdrop') as HTMLDivElement;
const openDrawer = () => {
  popover!.dataset.state = 'open';
  drawer!.dataset.state = 'open';
  let selectedFriends: string[] = [];
  const { friends, profile } = store.state;

  let innerHTML = '';
  friends.forEach(async (friend) => {
    const isImageBroken = await checkIsBrokenImage(friend?.avatar_url ?? '');
    innerHTML += `
    <button type="button" id="${friend.id}" class="friend">
      <div class="avatar flex items-center justify-center gap-1">
      ${
        isImageBroken
          ? `<img src=${friend?.avatar_url} alt=${friend.name + "'s avatar"}/>`
          : `<div class=${'avatar-fallback'}>${friend.name.charAt(0)}</div>`
      }
      </div>
     <span>${friend.name}</span> 
    </button>`;
    document.querySelector('.friend-selector')!.innerHTML =
      `<button type="button" id="${profile?.id}" class="friend">
      <div class="avatar flex items-center justify-center gap-1">
      ${
        isImageBroken
          ? `<img src=${profile?.avatar_url} alt=${
              profile?.name + "'s avatar"
            }/>`
          : `<div class=${'avatar-fallback'}>${profile?.name.charAt(0)}</div>`
      }
      </div>
     <span>${profile?.name}</span> 
    </button>` + innerHTML;

    document.querySelectorAll('.friend').forEach((element) => {
      const button = element as HTMLButtonElement;
      button.addEventListener('click', () => {
        if (button.dataset.state === 'active') {
          button.dataset.state = 'inactive';
          selectedFriends = selectedFriends.filter(
            (friend) => friend !== element.id
          );
          store.dispatch('updateSelectedFriendsToSplitWith', selectedFriends);
        } else {
          button.dataset.state = 'active';
          selectedFriends.push(element.id);
          store.dispatch('updateSelectedFriendsToSplitWith', selectedFriends);
        }
      });
    });
  });
};

const closeDrawer = () => {
  popover!.dataset.state = 'close';
  drawer!.dataset.state = 'close';
};

const billsForm = document.querySelector('#bill-form');

billsForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (e.target instanceof HTMLElement) {
    const billTitleInput = e.target!.querySelector(
      '#bill-name'
    ) as HTMLInputElement;
    const amountInput = e.target!.querySelector(
      '#bill-amount'
    ) as HTMLInputElement;
    const { selectedFriendsToSplitWith, user } = store.state;

    if (
      billTitleInput.value.trim() === '' ||
      amountInput.value.trim() === '' ||
      selectedFriendsToSplitWith.length === 0
    ) {
      return;
    } else {
      const response = await createBill(
        user?.id!,
        billTitleInput.value,
        Number(amountInput.value)
      );
      const amount_assigned = splitBill(
        Number(amountInput.value),
        selectedFriendsToSplitWith.length
      );
      const payload = [...selectedFriendsToSplitWith].map((id, index) => ({
        friend_id: id as string,
        bill_id: response.id,
        creator_id: user?.id!,
        amount_assigned: amount_assigned[index],
        payment_status: 'owing' as BillFriendCreationPayload['payment_status'],
      }));

      const billFriendsResponse = await createBillFriends(payload);
      const combinedResponse = {
        ...response,
        bill_friends: billFriendsResponse,
      };
      store.dispatch('createBill', combinedResponse);
      billTitleInput.value = '';
      amountInput.value = '';
      store.dispatch('updateSelectedFriendsToSplitWith', []);
      closeDrawer();
    }
  }
});

newBillBtn?.addEventListener('click', openDrawer);
closeBtn?.addEventListener('click', closeDrawer);

const SummaryCardsInstance = new SummaryCards();
SummaryCardsInstance.render();

const SummaryTextInstance = new SummaryText();
SummaryTextInstance.render();

const AvatarInstance = new UserAvatar();
AvatarInstance.render();

const RecentBillsInstance = new RecentBills();
RecentBillsInstance.render();

const NeedToPayInstance = new NeedToPay();
NeedToPayInstance.render();

window.addEventListener('DOMContentLoaded', () => {
  store.query('getBills');
  store.query('getUser');
  store.query('getUserProfile');
  store.query('getFriends');
});
