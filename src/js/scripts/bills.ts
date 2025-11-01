import { payBill } from '../../api/bills.api';
import BillList from '../components/bills/bill-list';
import UserAvatar from '../components/dashboard/user-avatar';
import store from '../store';
import type {
  BillFriend,
  ExtendedBillWithFriends,
} from '../store/types/bills.type';
import {
  calculateTotalPaidPercentage,
  calculateUserOwedAmount,
  findFriendWithUserId,
  getBillOwner,
} from '../utils/bills.utils';
import {
  getMonthDayYearFromIsoString,
  getTimeFromIsoString,
} from '../utils/date.utils';

document!.addEventListener('click', (e) => {
  const trigger =
    e.target && (e.target as HTMLElement).closest('#filter-trigger');
  if (e.target && trigger && trigger instanceof HTMLElement) {
    const isOpen = trigger!.dataset.state === 'open';
    const options = document.getElementById('filter-options');
    const dropdown = document.getElementById('filter-dropdown');
    const selectedText = document.getElementById('filter-selected');

    trigger!.dataset.state = isOpen ? 'closed' : 'open';
    trigger!.setAttribute('aria-expanded', String(!isOpen));
    document.getElementById('filter-options')!.dataset.state = isOpen
      ? 'closed'
      : 'open';
    dropdown!.dataset.state = isOpen ? 'closed' : 'open';
    options!.querySelectorAll<HTMLElement>('.dropdown-item').forEach((item) => {
      item.addEventListener('click', () => {
        selectedText!.textContent = item.textContent;
        dropdown!.dataset.state = 'closed';

        trigger!.setAttribute('aria-expanded', 'false');
        options!.dataset.state = 'closed';
        store.dispatch('updateSelectedFilter', item.dataset.value);
        document.querySelector('#filter-selected')!.textContent =
          item.textContent;
      });
    });

    document.addEventListener('click', (e) => {
      if (!dropdown!.contains(e.target as Node)) {
        dropdown!.dataset.state = 'closed';
        options!.dataset.state = 'closed';
        trigger!.setAttribute('aria-expanded', 'false');
      }
    });
  }
});

const drawer = document.getElementById('pay-bill-drawer');
const backdrop = drawer?.parentElement;
const openPayDrawer = (bill: ExtendedBillWithFriends) => {
  backdrop?.setAttribute('data-state', 'open');
  drawer?.setAttribute('data-state', 'open');
  const drawerContent = drawer?.querySelector(
    '.drawer__content'
  ) as HTMLElement;
  const owedAmount = calculateUserOwedAmount(
    bill.bill_friends,
    store.state.user?.id!
  );
  let friends = ``;
  const owner = getBillOwner(bill.bill_friends, bill.creator_id);
  let ownerAvatar = `
                 ${
                   owner?.friend.avatar_url
                     ? `<img src='${owner.friend.avatar_url}' alt='${owner.friend.name}' class='size-10 rounded-full! border-border border avatar' />`
                     : `
                      <div class='size-10 avatar-fallback bg-neutral-100 flex items-center justify-center rounded-full! border-border border'>${owner?.friend.name.charAt(
                        0
                      )}</div>`
                 }
    
  `;
  bill.bill_friends.forEach((billFriend) => {
    friends += ` <li>  
                    <div class="flex flex-col items-center gap-1">
                    ${
                      billFriend.friend.avatar_url
                        ? `<img src='${billFriend.friend.avatar_url}' alt='${billFriend.friend.name}' class='size-10 rounded-full! border-border border avatar' />`
                        : `
                      <div class='size-10 avatar-fallback bg-neutral-100 flex items-center justify-center rounded-full! border-border border'>${billFriend.friend.name.charAt(
                        0
                      )}</div> `
                    }
                      <p class="text-text text-sm font-body font-medium">
                        ${
                          billFriend.friend_id === store.state.user?.id!
                            ? 'You'
                            : billFriend.friend.name.split(' ')[0]
                        }
                      </p>
                    </div>
                  </li>`;
  });

  drawerContent.innerHTML = `<div class="card p-4 bg-bg! flex flex-col gap-4">
                <div class="pb-2 flex items-center justify-between border-b border-b-border">
  
                  <div class="flex flex-col gap-1">
                    <h1 class="font-heading font-medium text-text text-size-base">
                      ${bill?.title} 
                    </h1>
                    <p class="text-muted text-sm flex items-center gap-1">
                      ${getMonthDayYearFromIsoString(bill?.created_at! ?? '')}
                        <span class="text-[10px]">•</span>
                      ${getTimeFromIsoString(bill?.created_at! ?? '')}
                    </p>
                  </div>
                  ${ownerAvatar}
                </div>

                <div class="flex flex-col gap-2">
                  <div class="flex items-center justify-between">
                    <p class="text-muted text-sm font-medium">
                      Total
                    </p>
                    <p class="text-text text-sm font-medium">
                      $${bill?.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div class="card p-4 bg-bg! flex flex-col gap-4">
                <div class="flex items-center justify-between">
                  <h3 class="font-medium text-size-base font-heading text-text">Partcipants</h3>
                  <p class="text-muted text-sm">
                    <span class="text-accent-2">
                    ${calculateTotalPaidPercentage(
                      bill?.bill_friends!,
                      bill?.amount!
                    )}%
                    </span> paid
                  </p>
                </div>

                <ul class="flex items-center w-full gap-4 overflow-x-auto">
                  ${friends}
                </ul>

                <div class="flex flex-col gap-2">
                  <h3 class="text-text font-medium font-heading text-size-sm">
                    Individual Share
                  </h3>
                  <div class="p-2 bg-surface border border-border shadow-none! rounded-sm!">
                    <p class="text-text text-sm">
                       $${(bill?.amount / bill?.bill_friends.length).toFixed(
                         2
                       )} each
                    </p>
                  </div>
                </div>
              </div>
              
              <form id="payment-form" class="flex flex-col gap-1">
               <div class="card p-4 bg-bg! flex flex-col gap-4">
                 <div class="flex items-center justify-between">
                  <h3 class="font-medium text-size-base font-heading text-text">Payment</h3>
                  <p class="text-muted text-sm">
                   You owe <span class="text-error font-medium">$${owedAmount}</span>
                  </p>
                </div>

                  <div class="form-group">
                    <label class="label" for="amount">Amount to Pay</label>
                    <input type="text" name="amount" id="amount" class="rounded-sm!" placeholder="$0.00" />
                    
                  </div>
                </div>
                <button class="button button-primary rounded-sm! mt-4 shadow-none! w-full">
                  Settle Up
                </form>
              </button>`;
};
const closeDrawer = () => {
  backdrop?.setAttribute('data-state', 'closed');
  drawer?.setAttribute('data-state', 'closed');
};

drawer?.querySelector('.close-button')?.addEventListener('click', () => {
  closeDrawer();
});

document.addEventListener('click', (e) => {
  const payNowBtn = (e.target as HTMLElement).closest('#pay-now-btn');
  if (!payNowBtn) return;

  const billId = (payNowBtn.closest('[data-bill-id]') as HTMLElement)?.dataset
    .billId;
  const selectedBill = store.state.bills.find((b) => b.id === Number(billId));
  if (!selectedBill) return;

  store.dispatch('updateSelectedBill', selectedBill);
  openPayDrawer(selectedBill);
});

document.addEventListener('submit', async (e) => {
  if ((e.target as HTMLElement).id !== 'payment-form') return;
  e.preventDefault();
  const amountInput = (e.target as HTMLFormElement).querySelector(
    '#amount'
  ) as HTMLInputElement;
  const amountToPay = parseFloat(amountInput.value.replace(/[^0-9.-]+/g, ''));
  const selectedBill = store.state.selectedBill;
  if (!selectedBill) return;
  const you = findFriendWithUserId(
    selectedBill.bill_friends,
    store.state.user?.id!
  );
  const assignedAmount = you?.amount_assigned;
  const amountEntered = Number(amountToPay);
  const payment_status: BillFriend['payment_status'] =
    amountEntered >= assignedAmount! ? 'settled' : 'owing';

  await payBill({
    bill_id: selectedBill.id,
    amount_paid: amountEntered + (you?.amount_paid || 0),
    friend_id: store.state.user?.id!,
    creator_id: selectedBill.creator_id,
    payment_status,
  });
  store.dispatch('updateBillStatus', {
    bill_id: selectedBill.id,
    friend_id: store.state.user?.id!,
    amount_paid: amountEntered + (you?.amount_paid || 0),
    payment_status,
  });
  closeDrawer();
});

window.addEventListener('DOMContentLoaded', () => {
  store.query('getUser');
  store.query('getUserProfile');
  store.query('getBills');
});

const AvatarInstance = new UserAvatar();
AvatarInstance.render();

const BillListInstance = new BillList();
BillListInstance.render();
