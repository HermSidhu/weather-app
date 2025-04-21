/**
 * Date formatting and manipulation utilities
 */

/**
 * Format a date string into a more readable format for the UI
 */
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
  };
  const dayStr = date.toLocaleDateString("en-US", options);

  const hours = date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return {
    day: dayStr,
    time: `${displayHours}:00 ${ampm}`,
  };
};

/**
 * Get today's date as a formatted string
 */
export const getTodayDateString = (): string => {
  const today = new Date();
  return today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

/**
 * Display time in 12-hour format
 */
export const getDisplayTime = (
  hour: number | null | undefined,
  dateString?: string
): string => {
  if (hour !== null && hour !== undefined) {
    const displayHour = hour % 12 || 12;
    const ampm = hour >= 12 ? "PM" : "AM";
    return `${displayHour}:00 ${ampm}`;
  } else if (dateString) {
    const date = new Date(dateString);
    const hours = date.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:00 ${ampm}`;
  }

  return "Unknown";
};
