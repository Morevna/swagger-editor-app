export const formatDateTime = (isoString: string, locale: string) => {
  return new Date(isoString).toLocaleString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
};
