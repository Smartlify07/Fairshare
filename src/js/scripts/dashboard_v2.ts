import SummaryCards from "../components/dashboard/summary-cards";
import SummaryText from "../components/dashboard/greeting-section";
import store from "../store";

const SummaryCardsInstance = new SummaryCards();
SummaryCardsInstance.render();

const SummaryTextInstance = new SummaryText();
SummaryTextInstance.render();

window.addEventListener("DOMContentLoaded", () => {
  store.query("getBills");
  store.query("getUser");
  store.query("getUserProfile");
});
