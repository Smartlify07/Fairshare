import { format } from 'date-fns';
import Component from '../../lib/component';
import store from '../../store';
import {
  calculateUserOwedAmount,
  sortBillsByRecent,
} from '../../utils/bills.utils';

export default class NeedToPay extends Component {
  constructor() {
    super({
      element: document.getElementById('need-to-pay-section'),
      store: store,
    });
  }

  render(): void {
    const { bills, user } = store.state;

    const billsToShow = sortBillsByRecent(bills)
      .filter((bill) =>
        bill.bill_friends.some(
          (bf) =>
            bf.friend_id === user?.id &&
            calculateUserOwedAmount(bill.bill_friends, user?.id) > 0
        )
      )
      .slice(0, 3);

    let contentHTML = '';

    if (billsToShow.length === 0) {
      contentHTML = `
        <p class="text-muted text-center">
          You don’t owe any bills. Nice and clean!
        </p>
      `;
    } else {
      const billsListHTML = billsToShow
        .map((bill) => {
          const now = new Date(bill.created_at);
          const formattedDate = format(now, 'MMM dd, yyyy');
          const formattedTime = format(now, 'hh:mma');
          const remainingFriends = bill.bill_friends.length - 2;
          const owedAmount = calculateUserOwedAmount(
            bill.bill_friends,
            user?.id!
          );

          const friendsAvatars = bill.bill_friends
            .slice(0, 2)
            .map(
              (friend) => `
                <div class='size-8 avatar-fallback bg-neutral-100 flex items-center justify-center nth-of-type-[2]:-ml-3 rounded-full! border-border border'>
                  ${friend.friend?.name.charAt(0)}
                </div>`
            )
            .join('');

          return `
            <div class="bg-bg p-4 flex flex-col gap-4 border border-border rounded-md">
              <div class="flex items-start justify-between">
                <div class="flex flex-col">
                  <h3 class="text-text font-medium font-body">${bill.title}</h3>
                  <p class="text-muted text-sm flex items-center gap-2">
                    <span>${formattedDate}</span>
                    <span class="text-[10px]">•</span>
                    <span>${formattedTime}</span>
                  </p>
                </div>

                <div class="relative friends-avatars flex items-center">
                  ${friendsAvatars}
                  <div
                    class="size-8 avatar -bottom-4 text-text text-sm flex items-center justify-center left-5 bg-neutral-200 text-center rounded-full! border-border border -ml-3 z-10 ${
                      remainingFriends <= 0 ? 'hidden' : ''
                    }"
                  >
                    +${bill.bill_friends.length - 2}
                  </div>
                </div>
              </div>

              <div class="border-t border-t-border w-full flex items-center justify-between pt-4">
                <p class="text-muted text-sm font-medium">
                  Total <span class="text-text">₦${bill.amount.toLocaleString()}</span>
                </p>
                <p class="text-muted text-sm font-medium">
                  You owe <span class="text-error">₦${owedAmount.toLocaleString()}</span>
                </p>
              </div>
            </div>
          `;
        })
        .join('');

      contentHTML = `
        <ul id="need-to-pay-list" class="grid gap-[var(--space-sm)]">
          ${billsListHTML}
        </ul>
      `;
    }

    this.element!.innerHTML = `
      <div class="card grid gap-[var(--space-lg)] need-to-pay-card">
        <div class="flex items-center justify-between">
          <h1 class="text-size-lg font-heading text-text">Need to Pay</h1>
          <button class="text-sm text-muted">See more</button>
        </div>
        <div class="card__content">
          ${contentHTML}
        </div>
      </div>
    `;
  }
}
