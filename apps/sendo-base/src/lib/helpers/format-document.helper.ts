export const formatDocument = (input?: string) => {
  const numericInput = input?.replace(/\D/g, "") ?? "";

  let formattedDocument = "";

  for (let i = 0; i < numericInput.length && i < 11; i++) {
    if (i == 3 || i == 6) {
      formattedDocument += ".";
    } else if (i === 9) {
      formattedDocument += "-";
    }
    formattedDocument += numericInput[i];
  }

  return formattedDocument;
};

export const handleUpdateDocument = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const input = e.target.value;
  const formattedDocument = formatDocument(input);
  e.target.value = formattedDocument;
};

export function validateDocument(document?: string): boolean {
  if (document === undefined) return false;

  let cpf = document.replace(/[^\d]+/g, "");

  if (cpf == "") return false;
  if (
    cpf.length != 11 ||
    cpf == "00000000000" ||
    cpf == "11111111111" ||
    cpf == "22222222222" ||
    cpf == "33333333333" ||
    cpf == "44444444444" ||
    cpf == "55555555555" ||
    cpf == "66666666666" ||
    cpf == "77777777777" ||
    cpf == "88888888888" ||
    cpf == "99999999999"
  )
    return false;
  let add = 0;
  for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
  let rev = 11 - (add % 11);
  if (rev == 10 || rev == 11) rev = 0;
  if (rev != parseInt(cpf.charAt(9))) return false;
  let addTwo = 0;
  for (let i = 0; i < 10; i++) addTwo += parseInt(cpf.charAt(i)) * (11 - i);
  rev = 11 - (addTwo % 11);
  if (rev == 10 || rev == 11) rev = 0;
  if (rev != parseInt(cpf.charAt(10))) return false;
  return true;
}
