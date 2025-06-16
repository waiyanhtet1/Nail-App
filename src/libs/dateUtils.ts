export function formatDateString(dateStr: string) {
  const dateObj = new Date(dateStr);

  const formattedDate = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  return formattedDate;
}

export function formatTimeString(isoString: string) {
  const date = new Date(isoString);

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return formattedTime;
}

export function formatDateTimeString(isoDate: string) {
  const date = new Date(isoDate);

  const formatted = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Yangon",
  }).format(date);
  return formatted;
}

export const daysToNumbers = (days: string[]) => {
  const dayMap: Record<string, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  return days.map((day) => dayMap[day]);
};

export function formatWithLeadingZero(value: string) {
  const num = Number(value);

  if (num >= 0 && num <= 9) {
    return `0${num}`;
  } else {
    return value;
  }
}

export function removeLeadingZero(value: string) {
  if (value.startsWith("0")) {
    return value.slice(1);
  } else {
    return value;
  }
}
