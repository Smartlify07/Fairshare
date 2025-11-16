import Component from '../../lib/component';
import store from '../../store';
import {
  getPendingBalanceForThisMonth,
  getTotalAmountPaidThisMonth,
  getTotalAmountShared,
  getTotalBillsSplitThisMonth,
} from '../../utils/dashboard.utils';

export default class SummaryCards extends Component {
  constructor() {
    super({
      element: document.querySelector('#summary-cards'),
      store: store,
    });
  }

  render(): void {
    const { bills, user } = store.state;
    const totalBills = getTotalBillsSplitThisMonth(bills.data);
    const totalAmountShared = getTotalAmountShared(bills.data);
    const totalAmountPaid = getTotalAmountPaidThisMonth(
      bills.data,
      user.data?.id!
    );
    const pendingBalance = getPendingBalanceForThisMonth(
      bills.data,
      user.data?.id!
    );

    const totalBillsSummaryCard = ` <div data-summary-type="bills" class="card summary-card">
            <div class="card__content gap-[var(--space-md)]">
              <div class="flex items-center gap-2">
                <div class="card-icon bg-primary/10 size-8 text-primary">
                  <i class="fa-solid fa-file-invoice-dollar"></i>
                </div>
                <p class="text-muted text-size-sm tracking-tight font-body">Total Splits</p>
              </div>

              <div class="card__info">
                <h3
                  class="text-size-xl/[100%] font-medium flex items-center gap-1 font-heading text-text"
                >
                 ${totalBills}
                  <sub
                    class="text-size-sm/[100%] text-muted shrink-0 whitespace-pre-line break-words max-w-[106px] text-wrap font-normal mt-2 font-body"
                    >splits this month</sub
                  >
                </h3>
              </div>
            </div>
          </div>`;

    const totalAmountSharedSummaryCard = `<div data-summary-type="total-shared" class="card summary-card">
            <div class="card__content gap-[var(--space-md)]">
              <div class="flex items-center gap-2">
                <div class="card-icon bg-accent-2/10 size-8 text-accent-2">
                  <i class="fa-solid fa-handshake"></i>
                </div>
                <p class="text-muted text-size-sm">Total Amount Shared</p>
              </div>

              <div class="card__info">
                <h3
                  class="text-size-xl/[100%] font-medium flex items-center gap-1 font-heading text-text"
                >
                  ₦${totalAmountShared.toLocaleString()}
                  <sub
                    class="text-size-sm/[100%] text-muted shrink-0 whitespace-pre-line break-words max-w-[106px] text-wrap font-normal mt-2 font-body"
                    > this month</sub
                  >
                </h3>
              </div>
            </div>
          </div>
`;

    const totalSharePaidCard = `<div data-summary-type="total-share-paid" class="card summary-card">
            <div class="card__content gap-[var(--space-md)]">
              <div class="flex items-center gap-2">
                <div class="card-icon bg-accent-3/10 size-8 text-accent-3">
                  <i class="fa-solid fa-check"></i>
                </div>
                <p class="text-muted text-size-sm">Total Amount Paid</p>
              </div>

              <div class="card__info">
                <h3
                  class="text-size-xl/[100%] font-medium flex items-center gap-1 font-heading text-text"
                >
                  ₦${totalAmountPaid?.toLocaleString()}
                  <sub
                    class="text-size-sm/[100%] text-muted shrink-0 whitespace-pre-line break-words max-w-[106px] text-wrap font-normal mt-2 font-body"
                  >
                    this month</sub
                  >
                </h3>
              </div>
            </div>
          </div>
`;
    const totalPendingBalanceCard = `<div
            data-summary-type="total-pending-balance"
            class="card summary-card"
          >
            <div class="card__content gap-[var(--space-md)]">
              <div class="flex items-center gap-2">
                <div class="card-icon bg-accent-4/10 size-8 text-accent-4">
                  <i class="fa-solid fa-clock"></i>
                </div>
                <p class="text-muted text-size-sm">Pending Balance</p>
              </div>

              <div class="card__info">
                <h3
                  class="text-size-xl/[100%] font-medium flex items-center gap-1 font-heading text-text"
                >
                  ₦${pendingBalance.toLocaleString()}
                  <sub
                    class="text-size-sm/[100%] text-muted shrink-0 whitespace-pre-line break-words max-w-[106px] text-wrap font-normal mt-2 font-body"
                  >
                    left to clear</sub
                  >
                </h3>
              </div>
            </div>
          </div>
`;
    if (bills.loading) {
      const skeleton = `
<div class="card summary-card animate-pulse h-[109px]">
  <div class="card__content gap-[var(--space-md)]">
    <div class="flex items-center gap-2">
      <div class="card-icon bg-muted/10 size-8 rounded-md"></div>
      <div class="h-3 w-20 bg-muted/10 rounded"></div>
    </div>

    <div class="card__info">
      <div class="flex items-center gap-1">
        <div class="h-6 w-40 bg-muted/10 rounded"></div>
        <div class="h-3 w-16 bg-muted/10 rounded mt-2"></div>
      </div>
    </div>
  </div>
</div>`;
      this.element!.innerHTML = Array.from({ length: 4 })
        .map(() => skeleton)
        .join('');
    } else {
      this.element!.innerHTML = `
        ${totalBillsSummaryCard} ${totalAmountSharedSummaryCard} ${totalSharePaidCard} ${totalPendingBalanceCard}
    `;
    }
  }
}
