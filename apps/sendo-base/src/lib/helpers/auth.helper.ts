import bcrypt from "bcryptjs";

/**
 * Hash de senha usando bcrypt
 * @param password - Senha em texto plano
 * @returns Promise com a senha hasheada
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Verifica se a senha está correta
 * @param password - Senha em texto plano
 * @param hashedPassword - Senha hasheada
 * @returns Promise com boolean indicando se a senha está correta
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Valida força da senha
 * @param password - Senha para validar
 * @returns Objeto com validação e mensagens
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("A senha deve ter pelo menos 8 caracteres");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra maiúscula");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra minúscula");
  }

  if (!/\d/.test(password)) {
    errors.push("A senha deve conter pelo menos um número");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("A senha deve conter pelo menos um caractere especial");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Limpa CPF removendo caracteres não numéricos
 * @param cpf - CPF com ou sem formatação
 * @returns CPF apenas com números
 */
export function cleanCpf(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

/**
 * Valida formato do CPF
 * @param cpf - CPF para validar
 * @returns boolean indicando se o CPF é válido
 */
export function isValidCpf(cpf: string): boolean {
  const cleanCpfValue = cleanCpf(cpf);

  // Verifica se tem 11 dígitos
  if (cleanCpfValue.length !== 11) {
    return false;
  }

  // Verifica se não são todos os dígitos iguais
  if (/^(\d)\1{10}$/.test(cleanCpfValue)) {
    return false;
  }

  // Validação do algoritmo do CPF
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCpfValue.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpfValue.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCpfValue.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpfValue.charAt(10))) return false;

  return true;
}
