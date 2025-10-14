import type { User } from "@supabase/supabase-js";
import {
  getFriends,
  getReceivedFriendRequests,
  getSentFriendRequests,
  getSuggestedFriends,
  sendFriendRequest,
  updateFriendRequest,
} from "../../api/friends";
import { getAuthState } from "../../api/auth";
import { renderProfilePicture } from "./user";

const friendSectionElement = document.querySelector("#friends-section");
const friendsListElement = document.querySelector("#friend-list");
const suggestedFriendsListElement = document.querySelector(
  "#suggested-friends-list"
);
const suggestedFriendsSectionElement = document.querySelector(
  "#suggested-friends-section"
);
const friendRequestsList = document.querySelector("#friend-requests-list");
const friendRequestsSectionElement = document.querySelector(
  "#friend-requests-section"
);

const sentFriendRequestsList = document.querySelector(
  "#sent-friend-requests-list"
);
const sentFriendRequestsSectionElement = document.querySelector(
  "#sent-friend-requests-section"
);

const handleGetFriends = async (user_id: User["id"]) => {
  const friends = await getFriends(user_id);

  if (friends?.length === 0) {
    const emptyFriendList = document.createElement("div");
    emptyFriendList.innerHTML = `
    <div class="flex flex-col gap-6 items-center justify-center">
      <div class="flex gap-0 justify-center items-center">
          <img class="rounded-avatar size-10 object-cover" src="/public/images/boy_avatar.png" alt="boy-avatar-with-sunglasses" />
          <img class="rounded-avatar size-10 object-cover -ml-2" src="/public/images/girl-avatar-1-with-sunglasses.png" alt="boy-avatar-with-sunglasses" />
          <img class="rounded-avatar size-10 object-cover -ml-2" src="/public/images/girl-avatar-2-with-sunglasses.png" alt="boy-avatar-with-sunglasses" />
      </div>

      <div class="flex flex-col items-center gap-2">
        <h1 class="font-heading text-lg text-text">No friends yet</h1>
        <p class="font-display text-base text-muted font-normal text-center">
            Your friends list is looking a little lonely. Start connecting and this space will fill up fast!
        </p>
      </div>
    </div>
    `;
    friendSectionElement?.appendChild(emptyFriendList);
  } else {
    friends?.forEach((friend) => {
      const profile = friend;
      const friendCardElement = document.createElement("div");
      friendCardElement.className =
        "flex items-center rounded-card p-4 justify-between border shadow-xs border-border bg-surface";
      friendCardElement.innerHTML = `
              <div class="flex items-center gap-4">
                ${
                  profile.avatar_url
                    ? `<img
                  src=${profile.avatar_url}
                  alt=${profile.name}
                  class="rounded-avatar size-10 object-cover"
                />`
                    : `<div class="rounded-avatar bg-bg size-10 flex items-center text-text font-body justify-center">
                        ${profile.name.charAt(0)}              
                      </div>`
                }
                <div>
                  <h3
                    class="text-base font-medium overflow-hidden w-[200px] whitespace-nowrap text-ellipsis font-heading text-text"
                  >
                    ${profile.name}
                  </h3>
                  <p
                    class="text-sm font-normal tracking-tight text-muted font-display"
                  >
                    @${profile?.name}
                  </p>
                </div>
              </div>


    `;
      friendsListElement?.appendChild(friendCardElement);
    });
  }
};

const handleSendFriendRequest = async (
  receiver_id: string,
  requester_id: string
) => {
  try {
    await sendFriendRequest(requester_id, receiver_id);
  } catch (error) {
    console.error(error);
  }
};

const handleUpdateFriendRequest = async (
  receiver_id: string,
  requester_id: string,
  status: "accepted" | "declined"
) => {
  try {
    await updateFriendRequest(requester_id, receiver_id, status);
  } catch (error) {
    console.error(error);
  }
};

const handleGetSuggestedFriends = async () => {
  const user = await getAuthState();

  const suggestedFriends = await getSuggestedFriends(user?.id!);
  if (suggestedFriends?.length === 0) {
    const emptyFriendList = document.createElement("div");
    emptyFriendList.innerHTML = `
    <div class="flex flex-col gap-6 items-center justify-center">
      <div class="flex gap-0 justify-center items-center">
          <img class="rounded-avatar size-10 object-cover" src="/public/images/boy_avatar.png" alt="boy-avatar-with-sunglasses" />
          <img class="rounded-avatar size-10 object-cover -ml-2" src="/public/images/girl-avatar-1-with-sunglasses.png" alt="boy-avatar-with-sunglasses" />
          <img class="rounded-avatar size-10 object-cover -ml-2" src="/public/images/girl-avatar-2-with-sunglasses.png" alt="boy-avatar-with-sunglasses" />
      </div>

      <div class="flex flex-col items-center gap-2">
        <h1 class="font-heading text-lg text-text">No friends yet</h1>
        <p class="font-display text-base text-muted font-normal text-center">
            Your friends list is looking a little lonely. Start connecting and this space will fill up fast!
        </p>
      </div>
    </div>
    `;
    suggestedFriendsSectionElement?.appendChild(emptyFriendList);
  } else {
    suggestedFriends?.forEach((friend: any) => {
      const friendCardElement = document.createElement("div");
      friendCardElement.className =
        "flex items-center rounded-card p-4 justify-between border shadow-xs border-border bg-surface";
      friendCardElement.innerHTML = `
              <div class="flex items-center gap-4">
                ${
                  friend?.avatar_url
                    ? `<img
                  src=${friend?.avatar_url ?? ""}
                  alt=${friend.name}
                  class="rounded-avatar size-10 object-cover"
                />`
                    : `<div class="rounded-avatar bg-bg size-10 flex items-center text-text font-body justify-center">
                        ${friend.name.charAt(0)}              
                      </div>`
                }
                <div>
                  <h3
                    class="text-base font-medium overflow-hidden w-[200px] whitespace-nowrap text-ellipsis font-heading text-text"
                  >
                    ${friend.name}
                  </h3>
                  <p
                    class="text-sm font-normal tracking-tight text-muted font-display"
                  >
                    @${friend?.username ?? friend?.name}
                  </p>
                </div>
              </div>

              <button

                id=${`send-request-button`}
                class="rounded-2xl bg-surface text-success border border-border px-4 py-1 shadow-xs font-medium font-display tracking-tight text-sm whitespace-nowrap cursor-pointer"
              >
                Send request
              </button>
    `;

      suggestedFriendsListElement?.appendChild(friendCardElement);
      friendCardElement
        .querySelector("#send-request-button")
        ?.addEventListener("click", () => {
          handleSendFriendRequest(friend.id, user?.id!);
        });
    });
  }
};

const handleGetReceivedFriendRequests = async () => {
  const user = await getAuthState();

  const friendRequests = await getReceivedFriendRequests(user?.id!);
  if (friendRequests?.length === 0) {
    const emptyFriendRequestList = document.createElement("div");
    emptyFriendRequestList.innerHTML = `
    <div class="flex flex-col gap-6 items-center justify-center">
      <div class="flex gap-0 justify-center items-center">
          <img class="rounded-avatar size-10 object-cover" src="/public/images/boy_avatar.png" alt="boy-avatar-with-sunglasses" />
          <img class="rounded-avatar size-10 object-cover -ml-2" src="/public/images/girl-avatar-1-with-sunglasses.png" alt="boy-avatar-with-sunglasses" />
          <img class="rounded-avatar size-10 object-cover -ml-2" src="/public/images/girl-avatar-2-with-sunglasses.png" alt="boy-avatar-with-sunglasses" />
      </div>

      <div class="flex flex-col items-center gap-2">
        <h1 class="font-heading text-lg text-text">No friends yet</h1>
        <p class="font-display text-base text-muted font-normal text-center">
            Your friends list is looking a little lonely. Start connecting and this space will fill up fast!
        </p>
      </div>
    </div>
    `;
    friendRequestsSectionElement?.appendChild(emptyFriendRequestList);
  } else {
    friendRequests?.forEach((friend: any) => {
      const profile = friend.profiles;
      const friendCardElement = document.createElement("div");
      friendCardElement.className =
        "flex items-center rounded-card p-4 justify-between border shadow-xs border-border bg-surface";
      friendCardElement.innerHTML = `
              <div class="flex items-center gap-4">
                ${
                  friend?.avatar_url
                    ? `<img
                  src=${profile.avatar_url ?? ""}
                  alt=${profile.name}
                  class="rounded-avatar size-10 object-cover"
                />`
                    : `<div class="rounded-avatar bg-bg size-10 flex items-center text-text font-body justify-center">
                        ${profile.name.charAt(0)}              
                      </div>`
                }
                <div>
                  <h3
                    class="text-base font-medium overflow-hidden w-[200px] whitespace-nowrap text-ellipsis font-heading text-text"
                  >
                    ${profile.name}
                  </h3>
                  <p
                    class="text-sm font-normal tracking-tight text-muted font-display"
                  >
                    @${profile?.username ?? profile?.name}
                  </p>
                </div>

                       
              </div>

              <div class="flex items-center gap-2">
                  <button id="accept-btn" class="accept-btn rounded-2xl bg-surface text-success border border-border px-4 py-1 shadow-xs font-medium font-display tracking-tight text-sm">
                    Accept
                  </button>
                  <button id="decline-btn" class="decline-btn rounded-2xl bg-surface text-error border border-border px-4 py-1 shadow-xs font-medium font-display tracking-tight text-sm">
                    Decline
                  </button>
              </div>     
    `;
      friendRequestsList?.append(friendCardElement);
      friendCardElement
        .querySelector("#accept-btn")
        ?.addEventListener("click", () => {
          handleUpdateFriendRequest(
            friend.receiver_id,
            friend.requester_id,
            "accepted"
          );
        });
      friendCardElement
        .querySelector("#decline-btn")
        ?.addEventListener("click", () => {
          handleUpdateFriendRequest(
            friend.receiver_id,
            friend.requester_id,
            "declined"
          );
        });
    });
  }
};

const handleGetSentFriendRequests = async () => {
  const user = await getAuthState();

  const friendRequests = await getSentFriendRequests(user?.id!);
  if (friendRequests?.length === 0) {
    const emptyFriendRequestList = document.createElement("div");
    emptyFriendRequestList.innerHTML = `
    <div class="flex flex-col gap-6 items-center justify-center">
      <div class="flex gap-0 justify-center items-center">
          <img class="rounded-avatar size-10 object-cover" src="/public/images/boy_avatar.png" alt="boy-avatar-with-sunglasses" />
          <img class="rounded-avatar size-10 object-cover -ml-2" src="/public/images/girl-avatar-1-with-sunglasses.png" alt="boy-avatar-with-sunglasses" />
          <img class="rounded-avatar size-10 object-cover -ml-2" src="/public/images/girl-avatar-2-with-sunglasses.png" alt="boy-avatar-with-sunglasses" />
      </div>

      <div class="flex flex-col items-center gap-2">
        <h1 class="font-heading text-lg text-text">No friend requests sent yet</h1>
        <p class="font-display text-base text-muted font-normal text-center">
            Your friends list is looking a little lonely. Start connecting and this space will fill up fast!
        </p>
      </div>
    </div>
    `;
    sentFriendRequestsSectionElement?.appendChild(emptyFriendRequestList);
  } else {
    friendRequests?.forEach((friend: any) => {
      const profile = friend.profiles;
      const friendCardElement = document.createElement("div");
      friendCardElement.className =
        "flex items-center rounded-card p-4 justify-between border shadow-xs border-border bg-surface";
      friendCardElement.innerHTML = `
              <div class="flex items-center gap-4">
                ${
                  friend?.avatar_url
                    ? `<img
                  src=${profile.avatar_url ?? ""}
                  alt=${profile.name}
                  class="rounded-avatar size-10 object-cover"
                />`
                    : `<div class="rounded-avatar bg-bg size-10 flex items-center text-text font-body justify-center">
                        ${profile.name.charAt(0)}              
                      </div>`
                }
                <div>
                  <h3
                    class="text-base font-medium overflow-hidden w-[200px] whitespace-nowrap text-ellipsis font-heading text-text"
                  >
                    ${profile.name}
                  </h3>
                  <p
                    class="text-sm font-normal tracking-tight text-muted font-display"
                  >
                    @${profile?.username ?? profile?.name}
                  </p>
                </div>

                
              </div>
              <div class="rounded-2xl items-center flex justify-center text-sm font-medium font-display px-2 py-1 ${
                friend.status === "declined"
                  ? "bg-error/20 text-error"
                  : friend.status === "pending"
                  ? "bg-primary/20 text-primary"
                  : "bg-success/20 text-success"
              }">${friend.status}</div>
    `;
      sentFriendRequestsList?.append(friendCardElement);
    });
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const user = await getAuthState();
  renderProfilePicture();
  handleGetFriends(user?.id!);
  handleGetSuggestedFriends();
  handleGetReceivedFriendRequests();
  handleGetSentFriendRequests();
});
