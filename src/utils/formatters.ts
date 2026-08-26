/**
 * Helper utilities for formatting profile information (Idade, Altura, Peso)
 * following strict format rules:
 * - Idade: "29anos" (ex: "29anos", "21anos", "30anos")
 * - Altura: "1,69m" (ex: "1,69m", "1,70m", "1,65m")
 * - Peso: "66kg" (ex: "66kg", "59kg", nunca "59k")
 * - Informações alinhadas na mesma linha sem pontos de separação: "29anos 1,69m 66kg"
 * - Letras e números em branco (#FFFFFF) de alta legibilidade
 */

export interface FormattedProfileData {
  nome: string;
  idade: string;
  altura: string;
  peso: string;
  combinedInfo: string;
  parts: string[];
}

export interface ProfileFormatOptions {
  idadeFormato?: 'sem_espaco' | 'anos' | 'apenas_numero';
  alturaFormato?: 'virgula_m' | 'virgula';
  pesoFormato?: 'kg_junto' | 'kg_espaco' | 'apenas_numero';
  separadorSimbolo?: string;
}

export function formatProfileInfo(
  nome?: string,
  idadeVal?: string | number,
  alturaVal?: string | number,
  pesoVal?: string | number,
  manequimVal?: string | number,
  pesVal?: string | number,
  options?: ProfileFormatOptions
): FormattedProfileData {
  const nomeClean = (nome !== undefined && nome !== null) ? String(nome).trim() : '';
  const opts = options || {};

  // 1. Format Idade (Padrão: "29anos")
  let idStr = '';
  if (idadeVal !== undefined && idadeVal !== null && String(idadeVal).trim() !== '') {
    const raw = String(idadeVal).trim();
    // Extrai dígitos
    const digitsMatch = raw.match(/^\d+/);
    const num = digitsMatch ? digitsMatch[0] : raw;
    
    if (opts.idadeFormato === 'anos') {
      idStr = `${num} anos`;
    } else if (opts.idadeFormato === 'apenas_numero') {
      idStr = `${num}`;
    } else {
      // Padrão solicitado: "29anos" (sem espaço)
      idStr = `${num}anos`;
    }
  }

  // 2. Format Altura (Padrão: "1,69m")
  let altStr = '';
  if (alturaVal !== undefined && alturaVal !== null && String(alturaVal).trim() !== '') {
    let raw = String(alturaVal).trim().replace(/[mM]/g, '').trim().replace('.', ',');
    // Se digitou apenas 3 dígitos inteiros como 169 -> 1,69
    if (/^\d{3}$/.test(raw)) {
      raw = `${raw[0]},${raw.slice(1)}`;
    }
    
    if (opts.alturaFormato === 'virgula') {
      altStr = raw;
    } else {
      // Padrão solicitado: "1,69m" (com 'm' junto)
      altStr = `${raw}m`;
    }
  }

  // 3. Format Peso (Padrão: "66kg")
  let pesoStr = '';
  if (pesoVal !== undefined && pesoVal !== null && String(pesoVal).trim() !== '') {
    let raw = String(pesoVal).trim().replace(/[kK][gG]?/g, '').trim().replace('.', ',');
    
    if (opts.pesoFormato === 'kg_espaco') {
      pesoStr = `${raw} kg`;
    } else if (opts.pesoFormato === 'apenas_numero') {
      pesoStr = `${raw}`;
    } else {
      // Padrão solicitado: "66kg" (com 'kg' junto)
      pesoStr = `${raw}kg`;
    }
  }

  // Manequim e Calçado desativados por padrão conforme solicitação
  const parts = [idStr, altStr, pesoStr].filter((p) => Boolean(p && p.trim()));
  const sep = opts.separadorSimbolo !== undefined ? opts.separadorSimbolo : '';

  return {
    nome: nomeClean,
    idade: idStr,
    altura: altStr,
    peso: pesoStr,
    combinedInfo: sep ? parts.join(` ${sep} `) : parts.join(' '),
    parts,
  };
}


