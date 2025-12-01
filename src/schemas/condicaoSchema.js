
export const criarCondicaoSchema = {
  estado: { required: true, type: "string", minLength: 2, maxLength: 2 },
  percentual_cashback: { required: false, type: "number", min: 0, max: 100 },
  prazo_pagamento_dias: { required: false, type: "number", min: 1 },
  ajuste_unitario: { required: false, type: "number" },
  pedido_minimo: { required: false, type: "number", min: 0 },
  pedido_minimo_frete_cif: { required: false, type: "number", min: 0 },
  prazo_entrega: { required: false, type: "number", min: 1 },
  observacoes: { required: false, type: "string", maxLength: 500 },
  condicao_especial: { required: false, type: "string" },
  politica_devolucao: { required: false, type: "string" },
  prazo_pagamento: { required: false, type: "string" },
  link_catalogo: { required: false, type: "string" },
};

export const atualizarCondicaoSchema = {
  ...criarCondicaoSchema,
  estado: { ...criarCondicaoSchema.estado, required: false },
};

export function validarDados(data, schema) {
  const erros = [];

  for (const [campo, regras] of Object.entries(schema)) {
    const valor = data[campo];

    if (
      regras.required &&
      (valor === undefined || valor === null || valor === "")
    ) {
      erros.push(`${campo} é obrigatório`);
      continue;
    }

    if (
      !regras.required &&
      (valor === undefined || valor === null || valor === "")
    ) {
      continue;
    }

    if (regras.type && typeof valor !== regras.type) {
      erros.push(`${campo} deve ser do tipo ${regras.type}`);
    }

    if (regras.minLength && valor.length < regras.minLength) {
      erros.push(`${campo} deve ter no mínimo ${regras.minLength} caracteres`);
    }

    if (regras.maxLength && valor.length > regras.maxLength) {
      erros.push(`${campo} deve ter no máximo ${regras.maxLength} caracteres`);
    }

    if (regras.min !== undefined && valor < regras.min) {
      erros.push(`${campo} deve ser no mínimo ${regras.min}`);
    }

    if (regras.max !== undefined && valor > regras.max) {
      erros.push(`${campo} deve ser no máximo ${regras.max}`);
    }
  }

  if (erros.length > 0) {
    return { isValid: false, error: erros.join("; ") };
  }

  return { isValid: true, data };
}
