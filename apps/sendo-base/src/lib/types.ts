type Teacher = {
  name: string;
  avatar_url: string;
  description: string;
  prefix: "PRA." | "PR.";
};

export { type Teacher };

// Exportar todos os tipos do diretório types/
export * from "./types/index";
