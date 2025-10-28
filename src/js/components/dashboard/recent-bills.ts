import { format } from 'date-fns';
import Component from '../../lib/component';
import store from '../../store';
import {
  calculateTotalPaidPercentage,
  sortBillsByRecent,
} from '../../utils/bills.utils';

export default class RecentBills extends Component {
  constructor() {
    super({
      element: document.getElementById('recent-bills-section'),
      store: store,
    });
  }

  render(): void {
    const { bills } = store.state;
    const billsToShow = sortBillsByRecent(bills).slice(0, 3);
    let innerHTML = '';

    if (billsToShow.length === 0) {
      innerHTML = `
         <div class="card grid gap-[var(--space-lg)] recent-bills-card">
            <div class="flex items-center justify-between">
              <h1 class="text-size-base font-heading text-text">
                Recent Bills
              </h1>
              <button class="text-sm text-muted">See more</button>
            </div>
            <div class="card__content">
              <p class="text-muted text-center">
                You have no recent bills. Create a new bill to get started!
              </p>
            </div>
     </div>
      `;
    } else {
      const billsListHTML = billsToShow
        .map((bill) => {
          let friendsAvatars = '';
          const now = new Date(bill.created_at);
          const percentagePaid = calculateTotalPaidPercentage(
            bill.bill_friends,
            bill.amount
          );

          // Format: "Dec 15, 2023"
          const formattedDate = format(now, 'MMM dd, yyyy');
          const formattedTime = format(now, 'hh:mma');
          bill.bill_friends.slice(0, 2).forEach((friend) => {
            const friendData = friend.friend;

            friendsAvatars += `<div class='size-8 avatar-fallback bg-neutral-100 flex items-center justify-center nth-of-type-[2]:-ml-3 rounded-full! border-border border'>${friendData?.name.charAt(
              0
            )}</div>`;
          });

          return `
          <div
                  class="bg-bg p-4 flex flex-col gap-4 border border-border rounded-md"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex flex-col">
                      <h3 class="text-text font-medium font-body">
                        ${bill.title}
                      </h3>
                      <p class="text-muted text-sm flex items-center gap-2">
                        <span>${formattedDate}</span>
                        <span class="text-[10px]">•</span>
                        <span>${formattedTime}</span>
                      </p>
                    </div>

                    <div class="relative friends-avatars flex items-center">
                      ${friendsAvatars}

                       <div
                        class="size-8 avatar -bottom-4 text-text text-sm flex items-center justify-center left-5 bg-neutral-200 text-center rounded-full! border-border border -ml-3 z-10"
                      >
                        +2
                      </div>
                    </div>
                  </div>

                  <div
                    class="border-t border-t-border w-full flex items-center justify-between pt-4"
                  >
                    <p class="text-muted text-sm font-medium">
                      Total <span class="text-text">₦${bill.amount.toLocaleString()}</span>
                    </p>
                    <p class="text-muted text-sm font-medium">
                      <span class="text-accent-2">${percentagePaid}% </span>paid
                    </p>
                  </div>
                </div>
        `;
        })
        .join('');
      innerHTML = `
     <div class="card grid gap-[var(--space-lg)] recent-bills-card">
            <div class="flex items-center justify-between">
              <h1 class="text-size-base font-heading text-text">
                Recent Bills
              </h1>
              <button class="text-sm text-muted">See more</button>
            </div>
            <div class="card__content">
              <ul id="recent-bills-list" class="grid gap-[var(--space-sm)]">
                ${billsListHTML}
              </ul>
            </div>
     </div>
      `;
    }
    this.element!.innerHTML = innerHTML;
  }
}
