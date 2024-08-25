export const LocalTime = (time) => {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    weekday: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(time));
};
