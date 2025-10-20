import SummaryCards from "../components/dashboard/summary-cards";
import SummaryText from "../components/dashboard/greeting-section";
import store from "../store";
import UserAvatar from "../components/dashboard/user-avatar";

const SummaryCardsInstance = new SummaryCards();
SummaryCardsInstance.render();

const SummaryTextInstance = new SummaryText();
SummaryTextInstance.render();

const AvatarInstance = new UserAvatar();

AvatarInstance.render();
window.addEventListener("DOMContentLoaded", () => {
  store.query("getBills");
  store.query("getUser");
  store.query("getUserProfile");
});
