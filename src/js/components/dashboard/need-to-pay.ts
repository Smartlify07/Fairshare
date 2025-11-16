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

    const billsToShow = sortBillsByRecent(bills.data)
      .filter((bill) =>
        bill.bill_friends.some(
          (bf) =>
            bf.friend_id === user.data?.id &&
            calculateUserOwedAmount(bill.bill_friends, user.data?.id) > 0
        )
      )
      .slice(0, 3);

    let contentHTML = '';

    if (bills.loading) {
      const skeletonItems = Array.from({ length: 3 })
        .map(
          () => `
      <li class="bg-bg p-4 flex flex-col gap-4 border border-border rounded-md animate-pulse">

        <!-- Top section -->
        <div class="flex items-start justify-between">

          <!-- Title + date -->
          <div class="flex flex-col gap-2 w-full max-w-[70%]">
            <!-- Title -->
            <div class="h-5 w-32 bg-muted/10 rounded-md"></div>

            <!-- Date + Time -->
            <div class="flex gap-2 items-center">
              <div class="h-4 w-20 bg-muted/10 rounded-md"></div>
              <div class="h-4 w-4 bg-muted/10 rounded-md"></div>
              <div class="h-4 w-16 bg-muted/10 rounded-md"></div>
            </div>
          </div>

          <!-- Avatars -->
          <div class="flex items-center -space-x-3">
            <div class="size-8 bg-muted/10 rounded-full border border-border"></div>
            <div class="size-8 bg-muted/10 rounded-full border border-border"></div>
            <div class="size-8 bg-muted/10 rounded-full border border-border"></div>
          </div>
        </div>

        <!-- Divider -->
        <div class="border-t border-t-border w-full pt-4"></div>

        <!-- Footer -->
        <div class="flex items-center justify-between">
          <div class="h-4 w-24 bg-muted/10 rounded-md"></div>
          <div class="h-4 w-16 bg-muted/10 rounded-md"></div>
        </div>

      </li>
    `
        )
        .join('');

      this.element!.innerHTML = `
    <div class="card grid gap-[var(--space-lg)] recent-bills-card">
      <div class="flex items-center justify-between">
        <h1 class="text-size-lg font-heading text-text">Need to pay</h1>
     
            <div class="h-4 w-20 bg-muted/10 animate-pulse rounded-md"></div>
      </div>

      <div class="card__content">
        <ul class="grid gap-[var(--space-sm)]">
          ${skeletonItems}
        </ul>
      </div>
    </div>
  `;
      return;
    }

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
            user.data?.id!
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
          <h1 class="text-size-lg font-heading text-text">Need to pay</h1>
          <button class="text-sm text-muted">See more</button>
        </div>
        <div class="card__content">
          ${contentHTML}
        </div>
      </div>
    `;
  }
}
