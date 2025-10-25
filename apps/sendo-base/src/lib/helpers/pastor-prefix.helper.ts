/**
 * Adiciona prefixo de pastor (Pr./Pra.) baseado no gênero do nome
 * @param name - Nome da pessoa
 * @param isPastor - Se a pessoa é pastor
 * @returns Nome com prefixo se for pastor, senão retorna o nome original
 */
export function addPastorPrefix(
  name: string | null | undefined,
  isPastor: boolean | undefined,
): string {
  if (!name || !isPastor) {
    return name || "Usuário";
  }

  // Lista de nomes femininos comuns para determinar o prefixo
  const femaleNames = [
    "ana",
    "maria",
    "joana",
    "carla",
    "patricia",
    "sandra",
    "lucia",
    "rita",
    "sara",
    "lucia",
    "fabiana",
    "cristina",
    "elena",
    "isabel",
    "rosa",
    "lucia",
    "marta",
    "paula",
    "sofia",
    "teresa",
    "vanessa",
    "adriana",
    "alessandra",
    "amanda",
    "beatriz",
    "camila",
    "daniela",
    "eliane",
    "fernanda",
    "gabriela",
    "helena",
    "ivone",
    "juliana",
    "karina",
    "lilian",
    "marcia",
    "natalia",
    "olivia",
    "patricia",
    "quenia",
    "raquel",
    "silvia",
    "tatiana",
    "ursula",
    "vera",
    "wanda",
    "xenia",
    "yara",
    "zilda",
  ];

  // Pega o primeiro nome e converte para minúsculo
  const firstName = name.split(" ")[0]?.toLowerCase() || "";

  // Determina se é nome feminino
  const isFemaleName = femaleNames.includes(firstName);

  // Retorna o nome com o prefixo apropriado
  return isFemaleName ? `Pra. ${name}` : `Pr. ${name}`;
}
