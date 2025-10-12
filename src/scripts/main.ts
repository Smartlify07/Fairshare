import { getAuthState } from '../auth/auth';

const main = document.querySelector('#app');

const getUser = async () => {
  const user = await getAuthState();

  if (user) {
    window.location.href = 'src/pages/dashboard.html';
  } else {
    main!.innerHTML = '<h1>No user</h1>';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  getUser();
});
