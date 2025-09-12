export interface CepData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export interface CepError {
  erro: boolean;
  message: string;
}

/**
 * Busca dados de endereço através do CEP usando a API ViaCEP
 * @param cep - CEP no formato "00000-000" ou "00000000"
 * @returns Promise com os dados do endereço ou erro
 */
export async function fetchCepData(cep: string): Promise<CepData | CepError> {
  try {
    // Remove caracteres não numéricos do CEP
    const cleanCep = cep.replace(/\D/g, "");

    // Valida se o CEP tem 8 dígitos
    if (cleanCep.length !== 8) {
      return {
        erro: true,
        message: "CEP deve ter 8 dígitos",
      };
    }

    // Faz a requisição para a API ViaCEP
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);

    if (!response.ok) {
      return {
        erro: true,
        message: "Erro ao consultar CEP",
      };
    }

    const data: CepData = await response.json();

    // Verifica se o CEP foi encontrado
    if (data.erro) {
      return {
        erro: true,
        message: "CEP não encontrado",
      };
    }

    return data;
  } catch (error) {
    return {
      erro: true,
      message: "Erro de conexão ao consultar CEP",
    };
  }
}

/**
 * Formata CEP para exibição (00000-000)
 * @param cep - CEP no formato "00000000"
 * @returns CEP formatado
 */
export function formatCep(cep: string): string {
  const cleanCep = cep.replace(/\D/g, "");
  return cleanCep.replace(/(\d{5})(\d{3})/, "$1-$2");
}

/**
 * Remove formatação do CEP (00000000)
 * @param cep - CEP no formato "00000-000"
 * @returns CEP sem formatação
 */
export function cleanCep(cep: string): string {
  return cep.replace(/\D/g, "");
}

/**
 * Valida se o CEP está no formato correto
 * @param cep - CEP para validar
 * @returns true se válido, false caso contrário
 */
export function isValidCep(cep: string): boolean {
  const cleanCep = cep.replace(/\D/g, "");
  return cleanCep.length === 8 && /^\d{8}$/.test(cleanCep);
}
