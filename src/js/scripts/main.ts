import { getAuthState } from '../../api/auth.ts';

const callToActionButton = document.querySelector(
  '#landing-call-to-action'
) as HTMLAnchorElement;
const getUser = async () => {
  const user = await getAuthState();

  if (user) {
    callToActionButton.href = '/src/pages/dashboard.html';
    callToActionButton.textContent = 'Go to App';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  getUser();
});
