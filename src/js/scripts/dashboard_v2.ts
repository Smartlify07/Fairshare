import SummaryCards from "../components/dashboard/summary-cards";
import store from "../store";

const SummaryCardsInstance = new SummaryCards();
SummaryCardsInstance.render();

window.addEventListener("DOMContentLoaded", () => {
  store.query("getBills");
  store.query("getUser");
  store.query("getUserProfile");
});
