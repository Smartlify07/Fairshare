import { format, getMonth } from 'date-fns';

export const formatFromISOToDayMonthYear = (date_string: string) => {
  return format(new Date(date_string), 'MMMM d yyyy');
};

export const getMonthFromIsoString = (date_string: string) => {
  return getMonth(new Date(date_string));
};

export const getMonthDayYearFromIsoString = (date_string: string) => {
  const formattedDate = format(new Date(date_string), 'MMM dd, yyyy');
  return formattedDate;
};

export const getTimeFromIsoString = (date_string: string) => {
  const formattedTime = format(new Date(date_string), 'hh:mma');
  return formattedTime;
};
