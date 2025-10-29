import BillList from '../components/bills/bill-list';
import UserAvatar from '../components/dashboard/user-avatar';
import store from '../store';

// const trigger = document.getElementById('filter-trigger');

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
        // TODO: Hook this into your filtering logic
        console.log('Selected:', item.dataset.value);
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

window.addEventListener('DOMContentLoaded', () => {
  store.query('getUser');
  store.query('getUserProfile');
  store.query('getBills');
});

const AvatarInstance = new UserAvatar();
AvatarInstance.render();

const BillListInstance = new BillList();
BillListInstance.render();
