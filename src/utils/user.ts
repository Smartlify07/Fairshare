import { getAuthState } from '../auth/auth';

const userProfileElement = document.querySelector(
  '#user-profile'
) as HTMLDivElement;
const userImageElement = document.querySelector(
  '#user-profile-avatar'
) as HTMLImageElement;

export const renderProfilePicture = async () => {
  const user = await getAuthState();
  console.log('render profile');

  if (user?.user_metadata?.picture) {
    userImageElement.src = user?.user_metadata?.picture;
  } else {
    userImageElement.style.display = 'none';
    userProfileElement.className =
      'rounded-avatar flex items-center justify-center bg-bg text-text';
    userProfileElement.textContent = user?.user_metadata.name.charAt(0);
  }
};
