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
      const amountShared = getTotalAmountShared(store.state.bills);

      if (store.state.user) {
        this.element.innerHTML = `
             <h2
              class="text-size-2xl font-medium font-heading text-text"
            >
              Hey, ${store.state.user?.user_metadata.name}
            </h2>
            <p id="summary-text" class="text-size-md text-muted">
              You've shared
              <strong class="text-primary">₦${amountShared.toLocaleString()}</strong> with friends this
              month
            </p>
        `;
      } else {
        this.element.innerHTML = `
          <div class="h-[54px] w-[357px] bg-muted/10 rounded-sm animate-pulse">
          </div>
          <div class="h-[24px] w-[357px] bg-muted/10 rounded-sm animate-pulse">
          </div>
        `;
      }
    }
  }
}
