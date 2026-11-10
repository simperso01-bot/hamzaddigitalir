const dateFormat = (
  date: Date | string,
  _pattern: string = "dd MMM, yyyy",
): string => {
  const dateObj = new Date(date);
  if (Number.isNaN(dateObj.getTime())) return "";
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    dateStyle: "medium",
    timeZone: "Asia/Tehran",
  }).format(dateObj);
};

export default dateFormat;
