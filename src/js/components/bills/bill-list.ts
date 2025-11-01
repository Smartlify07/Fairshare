import { format } from 'date-fns';
import Component from '../../lib/component';
import store from '../../store';
import {
  calculateTotalPaidPercentage,
  calculateUserOwedAmount,
  filterBills,
  sortBillsByRecent,
} from '../../utils/bills.utils';

export default class BillList extends Component {
  constructor() {
    super({
      element: document.getElementById('recent-bills-section'),
      store: store,
    });
  }

  render(): void {
    const { bills, user, selectedFilter } = store.state;
    const filteredBills = filterBills(bills, selectedFilter, user?.id || '');
    const sortedBills = sortBillsByRecent(filteredBills);
    let innerHTML = '';
    const triggerInner = ` <div class="relative" id="filter-dropdown">
          <!-- Trigger -->
          <button
            id="filter-trigger"
            aria-haspopup="listbox"
            aria-expanded="false"
            data-state="closed"
            class="flex items-center justify-between gap-2 bg-surface border border-border rounded-md px-[var(--space-md)] py-[var(--space-sm)] text-sm font-medium text-text hover:bg-surface-hover focus:outline-none"
          >
            <span id="filter-selected">Everything</span>
            <svg
              class="w-4 h-4 text-muted transition-transform duration-200"
              data-chevron
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown menu -->
          <ul
            id="filter-options"
            class="absolute right-0 mt-2 z-20 w-44 bg-surface border border-border rounded-md shadow-md p-[var(--space-xs)] grid gap-[var(--space-xs)] opacity-0 scale-95 pointer-events-none transition-all duration-150 origin-top"
            role="listbox"
            data-state="closed"
          >
            <li
              class="dropdown-item px-[var(--space-md)] py-[var(--space-sm)] rounded-md cursor-pointer text-sm text-text hover:bg-surface-hover"
              data-value="all"
            >
              Everything
            </li>
            <li
              class="dropdown-item px-[var(--space-md)] py-[var(--space-sm)] rounded-md cursor-pointer text-sm text-text hover:bg-surface-hover"
              data-value="you_owe"
            >
              What You Owe
            </li>
            <li
              class="dropdown-item px-[var(--space-md)] py-[var(--space-sm)] rounded-md cursor-pointer text-sm text-text hover:bg-surface-hover"
              data-value="as_creator"
            >
              Created by You
            </li>
          </ul>   
        </div>`;
    if (sortedBills.length === 0) {
      innerHTML = `
         <div class="card grid gap-[var(--space-lg)] recent-bills-card">
            <div class="flex items-center justify-between">
              <h1 class="text-size-2xl font-heading text-text">
                Your Bills
              </h1>
              ${triggerInner}
            </div>
            <div class="card__content">
              <p class="text-muted text-center">
              ${
                selectedFilter === 'you_owe'
                  ? 'You have no bills that you owe. Great job staying settled up!'
                  : 'You have no recent bills. Create a new bill to get started! '
              }
              </p>
            </div>
     </div>
      `;
    } else {
      let billsListHTML = '';
      sortedBills.forEach((bill) => {
        let friendsAvatars = '';
        const now = new Date(bill.created_at);
        const percentagePaid = calculateTotalPaidPercentage(
          bill.bill_friends,
          bill.amount
        );
        const owedAmount = calculateUserOwedAmount(
          bill.bill_friends,
          user?.id!
        );
        const remainingFriends = bill.bill_friends.length - 2;

        const formattedDate = format(now, 'MMM dd, yyyy');
        const formattedTime = format(now, 'hh:mma');
        bill.bill_friends.slice(0, 2).forEach((friend) => {
          const friendData = friend.friend;

          friendsAvatars += `<div class='size-8 avatar-fallback bg-neutral-100 flex items-center justify-center nth-of-type-[2]:-ml-3 rounded-full! border-border border'>${friendData?.name.charAt(
            0
          )}</div>`;
        });

        billsListHTML += `
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
                        class="size-8 avatar -bottom-4 text-text text-sm flex items-center justify-center left-5 bg-neutral-200 text-center rounded-full! border-border border -ml-3 z-10 ${
                          remainingFriends <= 0 ? 'hidden' : ''
                        }"
                      >
                        +${bill.bill_friends.length - 2}
                      </div>
                    </div>
                  </div>

                  <div
                    class="border-t border-t-border w-full flex items-center justify-between pt-4"
                  >
                    <p class="text-muted text-sm font-medium">
                      Total <span class="text-text">₦${bill.amount.toLocaleString()}</span>
                    </p>
                    <p class="text-muted text-sm font-medium ${
                      selectedFilter === 'you_owe' ? 'hidden' : 'inline'
                    }">
                      <span class="text-accent-2">${percentagePaid}% </span>paid
                    </p>
                     <p class="text-muted text-sm flex items-center gap-2 font-medium ${
                       selectedFilter !== 'you_owe' ? 'hidden' : 'inline'
                     }">
                      You owe <span class="text-error">₦${owedAmount.toLocaleString()}</span> 
                      <span class="text-[10px]">•</span>
                      <button data-bill-id=${
                        bill.id
                      } id="pay-now-btn" class="text-accent-1 underline text-sm font-medium">
                        Pay Now
                      </button>
                     </p>
                  </div>
                </div>
        `;
      });

      innerHTML = `
     <div class="card grid gap-[var(--space-lg)] recent-bills-card">
            <div id="header-container" class="flex items-center justify-between">
            <h1 class="text-size-2xl font-heading text-text">
                Your Bills
              </h1>
                ${triggerInner}
            </div>
            <div class="card__content">
              <ul id="recent-bills-list" class="grid md:grid-cols-2 gap-[var(--space-md)]">
                ${billsListHTML}
              </ul>
            </div>
     </div>
      `;
    }
    this.element!.innerHTML = innerHTML;
  }
}
