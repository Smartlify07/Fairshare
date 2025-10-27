import { getAuthState } from '../../api/auth.ts';

const getUser = async () => {
  const user = await getAuthState();

  if (user) {
    window.location.href = '/src/pages/dashboard.html';
  } else {
    window.location.href = '/src/pages/signup.html';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  getUser();
});
