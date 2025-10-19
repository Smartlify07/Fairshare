import { format, getMonth } from "date-fns";

export const formatFromISOToDayMonthYear = (date_string: string) => {
  return format(new Date(date_string), "MMMM d yyyy");
};

export const getMonthFromIsoString = (date_string: string) => {
  return getMonth(new Date(date_string));
};
