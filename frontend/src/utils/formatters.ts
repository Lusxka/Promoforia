/**
 * Formata um valor numérico para o formato de moeda brasileira (R$)
 * 
 * @param value Valor numérico a ser formatado
 * @returns String formatada no padrão de moeda brasileira
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata uma data para o formato brasileiro (dd/mm/aaaa)
 * 
 * @param date Data a ser formatada
 * @returns String formatada no padrão de data brasileira
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Formata um número de telefone para o padrão brasileiro
 * 
 * @param phone Número de telefone (apenas números)
 * @returns String formatada no padrão de telefone brasileiro
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6, 10)}`;
  }
  
  return phone;
};

/**
 * Formata um CPF para o padrão brasileiro
 * 
 * @param cpf Número de CPF (apenas números)
 * @returns String formatada no padrão de CPF brasileiro
 */
export const formatCPF = (cpf: string): string => {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
  }
  
  return cpf;
};

/**
 * Trunca um texto para um número máximo de caracteres, adicionando "..." ao final
 * 
 * @param text Texto a ser truncado
 * @param maxLength Comprimento máximo desejado
 * @returns Texto truncado com "..." ao final, se necessário
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.slice(0, maxLength) + '...';
};