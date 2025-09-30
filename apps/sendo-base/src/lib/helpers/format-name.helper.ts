export function getFirstLastName(nome: string) {
  const nameFormatted = nome.split(" ");
  return `${nameFormatted[0]} ${nameFormatted[nameFormatted.length - 1]}`;
}

export const getInitialsOfName = (name: string) => {
  if (!name) {
    return "";
  }

  const nameFormatted = name?.split(" ");
  const firstInitial = nameFormatted[0]?.at(0) || "";
  const lastInitial =
    nameFormatted.length > 1
      ? nameFormatted[nameFormatted.length - 1]?.at(0) || ""
      : "";

  return `${firstInitial}${lastInitial}`;
};

export const getFirstName = (name: string) => {
  if (!name) {
    return "";
  }

  const nameFormatted = name?.split(" ");
  return `${nameFormatted[0]} ${nameFormatted[1]}`;
};
