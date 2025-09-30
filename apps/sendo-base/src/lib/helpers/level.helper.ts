import { Course } from "@base-church/db/src";

const getLevelFormatted = (level: Course["level"]) => {
  switch (level) {
    case "beginner":
      return { color: "text-green-400 bg-green-400/20", text: "Iniciante" };
    case "intermediate":
      return {
        color: "text-yellow-400 bg-yellow-400/20",
        text: "Intermediário",
      };
    case "advanced":
      return { color: "text-red-400 bg-red-400/20", text: "Avançado" };
    default:
      return { color: "text-gray-400 bg-gray-400/20", text: "Desconhecido" };
  }
};

export { getLevelFormatted };
