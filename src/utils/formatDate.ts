export function formatDate(date: string, includeRelative = false, locale = 'en') {
  const currentDate = new Date();

  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }

  const targetDate = new Date(date);
  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  const daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = "";

  const relativeStrings = {
    en: {
      yearsAgo: (n: number) => `${n}y ago`,
      monthsAgo: (n: number) => `${n}mo ago`,
      daysAgo: (n: number) => `${n}d ago`,
      today: 'Today',
    },
    es: {
      yearsAgo: (n: number) => `hace ${n}a`,
      monthsAgo: (n: number) => `hace ${n}m`,
      daysAgo: (n: number) => `hace ${n}d`,
      today: 'Hoy',
    },
  };

  const strings = relativeStrings[locale as keyof typeof relativeStrings] || relativeStrings.en;

  if (yearsAgo > 0) {
    formattedDate = strings.yearsAgo(yearsAgo);
  } else if (monthsAgo > 0) {
    formattedDate = strings.monthsAgo(monthsAgo);
  } else if (daysAgo > 0) {
    formattedDate = strings.daysAgo(daysAgo);
  } else {
    formattedDate = strings.today;
  }

  const localeMap = {
    en: 'en-us',
    es: 'es-mx',
  };

  const fullDate = targetDate.toLocaleString(localeMap[locale as keyof typeof localeMap] || 'en-us', {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${formattedDate})`;
}
