import { dayjs } from "../dayjs";

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
};

const formatDate = (date: Date) => {
  return dayjs(date).format("DD/MM/YYYY");
};

const formatTime = (date: Date) => {
  return date?.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateTime = (date: Date) => {
  return date?.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export { formatDate, formatDateTime, formatDuration, formatTime };
