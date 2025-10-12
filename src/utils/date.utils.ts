import { format } from 'date-fns';

export const formatFromISOToDayMonthYear = (date_string: string) => {
  return format(new Date(date_string), 'MMMM d yyyy');
};
