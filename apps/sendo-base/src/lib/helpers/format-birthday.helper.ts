export const formatBirthday = (input?: string) => {
  const numericInput = input?.replace(/\D/g, "") ?? "";

  let formattedBirthday = "";

  for (let i = 0; i < numericInput.length && i < 8; i++) {
    if (i == 2 || i == 4) {
      formattedBirthday += "/";
    }
    formattedBirthday += numericInput[i];
  }

  return formattedBirthday;
};

export const handleUpdateBirthday = (
  e: React.ChangeEvent<HTMLInputElement>,
) => {
  const input = e.target.value;
  const formattedDocument = formatBirthday(input);
  e.target.value = formattedDocument;
};
