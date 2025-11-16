import Component from '../../lib/component';
import store from '../../store';
import { getTotalAmountShared } from '../../utils/dashboard.utils';

export default class SummaryText extends Component {
  constructor() {
    super({
      element: document.querySelector('#greeting-section'),
      store: store,
    });
  }

  render(): void {
    if (this.element) {
      const { user, bills } = store.state;
      const amountShared = getTotalAmountShared(bills.data);
      if (user.loading) {
        this.element.innerHTML = `
          <div class="h-[54px] w-[247px] md:w-[357px] bg-muted/10 rounded-sm animate-pulse">
          </div>
          <div class="h-[24px] w-[247px] md:w-[357px] bg-muted/10 rounded-sm animate-pulse">
          </div>
        `;
      } else {
        this.element.innerHTML = `
               <h2
                class="text-size-xl md:text-size-2xl w-[246px] overflow-ellipsis max-w-[246px] truncate font-medium font-heading text-text"
              >
                Hey, ${user.data?.user_metadata.name.split(' ')[0]}
              </h2>
              <p id="summary-text" class="text-size-md text-muted">
                You've shared
                <strong class="text-primary">₦${amountShared.toLocaleString()}</strong> with friends this
                month
              </p>
          `;
      }
    }
  }
}
