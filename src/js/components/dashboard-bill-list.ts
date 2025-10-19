import {
  findFriendWithUserId,
  getFriendsWhoHaveSettled,
} from "../utils/bills.utils";
import { formatFromISOToDayMonthYear } from "../utils/date.utils";
import Component from "../lib/component";
import store from "../store";
import type { ExtendedBillWithFriends } from "../store/types/bills.type";

export default class DashboardBillList extends Component {
  constructor() {
    super({
      element: document.querySelector("#bills-section"),
      store: store,
    });
  }

  render(): void {
    let self = this;
    const { state } = store;
    const { user } = state;
    const element = self.element;
    element!.innerHTML = ``;
    if (state.bills.length === 0) {
      if (element!.querySelector("#empty-state")) return;

      const billsEmptyState = document.createElement("div");
      billsEmptyState.className = "flex flex-col gap-2 items-center";
      billsEmptyState.id = "bills-empty-state";
      billsEmptyState.innerHTML = `
        <div class="flex justify-center items-center">
          <img class="rounded-avatar size-10 object-cover" src="/public/images/boy_avatar.png" alt="boy-avatar-with-sunglasses" />
          <img class="rounded-avatar size-10 object-cover -ml-2" src="/public/images/girl-avatar-1-with-sunglasses.png" alt="boy-avatar-with-sunglasses" />
          <img class="rounded-avatar size-10 object-cover -ml-2" src="/public/images/girl-avatar-2-with-sunglasses.png" alt="boy-avatar-with-sunglasses" />
        </div>


        <div class="flex flex-col gap-2 items-center">
          <h1 class="text-text font-heading text-lg font-medium">Nothing to split yet</h1>
          <p class="text-muted text-base font-display">Add a bill, whether it’s pizza night or project expenses.</p>
          <button id="add-new-bill-btn" class="rounded-2xl bg-surface text-primary border border-border px-4 py-1 shadow-xs font-medium font-display tracking-tight text-base whitespace-nowrap cursor-pointer">
            Create a bill
          </button>
        </div>
      `;
      element!.appendChild(billsEmptyState);
      return;
    } else {
      const billsList = document.createElement("div") as HTMLDivElement;
      billsList.className = "grid grid-cols-2 gap-4 w-full";
      billsList.id = "bill-list";
      (
        document.querySelector("#bills-empty-state") as HTMLDivElement
      )?.remove();
      const topSection = document.createElement("div");
      topSection.innerHTML = `
          <h1 class="text-lg font-normal text-text font-heading tracking-tight">Things to Settle</h1>
          <button
            id="add-new-bill-btn"
            class="rounded-2xl bg-surface text-primary border border-border px-4 py-1 shadow-xs font-medium font-display tracking-tight text-base whitespace-nowrap cursor-pointer">Add a bill</button>
      `;
      topSection.className = "flex items-center w-full justify-between";
      store.state.bills.forEach((bill: ExtendedBillWithFriends) => {
        const billCard = document.createElement("div");
        const friendsToShow = bill.bill_friends.slice(0, 3);
        const remaining = bill.bill_friends.length - 3;
        const settledFriends = getFriendsWhoHaveSettled(bill.bill_friends);
        let billFriendsInnerHTML = ``;
        const foundFriend = findFriendWithUserId(
          bill.bill_friends,
          store.state.user.id
        );
        let general_status = `
        <span
        class="px-2 py-0.5 text-sm rounded-2xl font-medium font-display bg-success/10 text-success"
        >
          ${settledFriends.length} of ${bill.bill_friends.length} settled
        </span>
      `;

        let user_status = `
        <span
        class="px-2 py-0.5 text-sm rounded-2xl truncate font-medium font-display ${
          foundFriend?.payment_status === "settled"
            ? "bg-success/10 text-success"
            : "bg-error/10 text-error"
        }"
        >
          ${
            foundFriend?.amount_paid! > foundFriend?.amount_assigned!
              ? `${bill.creator?.name} owes you ₦${
                  foundFriend?.amount_paid! - foundFriend?.amount_assigned!
                }`
              : foundFriend?.payment_status === "owing"
              ? `You owe ₦${
                  foundFriend?.amount_assigned - (foundFriend?.amount_paid ?? 0)
                } to ${bill.creator?.name}`
              : foundFriend?.payment_status === "settled"
              ? `All settled — you're square with ${bill.creator?.name}`
              : "Pending"
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
                    ${formatFromISOToDayMonthYear(bill.created_at)}
                   </h5>
                  </div>
                  <p class="font-display font-medium text-lg text-primary">
                    ₦${bill.amount.toLocaleString()}
                  </p>
                </div>

                <!-- Avatars + status -->
                <div id="avatars" class="flex border-t py-4 px-4 border-t-border justify-between items-center">
                  <div class="flex items-center gap-2">

                    <div class="flex items-center gap-1">
                      ${
                        bill.creator_id === store.state.user?.id
                          ? billFriendsInnerHTML
                          : ""
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
                              : ""
                          }
                        `}
                      </div>
                  </div>
                 ${bill.creator_id === user?.id ? general_status : user_status}
                 ${
                   bill.creator_id !== user?.id &&
                   findFriendWithUserId(bill.bill_friends, user?.id)
                     ?.payment_status === "owing"
                     ? `<button id="settle-up-btn" class="primary-btn px-2 py-1 text-white font-medium active:scale-[0.9]">Settle up</button>`
                     : ""
                 }
                </div>
              </div>`;

        billsList.appendChild(billCard);
        billCard
          ?.querySelector("#settle-up-btn")
          ?.addEventListener("click", () => {
            store.dispatch("updateSelectedBill", bill);
          });
      });
      element?.appendChild(topSection);
      element?.appendChild(billsList);

      return;
    }
  }
}
