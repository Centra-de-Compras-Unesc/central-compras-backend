import { PrismaClient } from "../generated/prisma/index.js";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

function serializeBigInt(obj) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export const getLojas = async (req, res) => {
  try {
    const lojas = await prisma.tb_loja.findMany({
      orderBy: { id: "asc" },
      take: 50,
    });

    res.json(serializeBigInt(lojas));
  } catch (error) {
    res.status(500).json({
      error: "Erro ao listar lojas",
      details: error.message,
    });
  }
};

export const getLojaById = async (req, res) => {
  try {
    const loja = await prisma.tb_loja.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!loja) return res.status(404).json({ message: "Loja não encontrada" });

    res.json(serializeBigInt(loja));
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar loja",
      details: error.message,
    });
  }
};

export const createLoja = async (req, res) => {
  try {
    const {
      id_conta,
      razao_social,
      nome_fantasia,
      cnpj,
      email_loja,
      telefone,
      site,
      ativo,
      gerarCredenciais,
      senhaGerada,
      endereco,
      contato,
    } = req.body;

    // Validação de campos obrigatórios
    const camposAusentes = [];
    if (!id_conta) camposAusentes.push("id_conta");
    if (!razao_social) camposAusentes.push("razao_social");
    if (!cnpj) camposAusentes.push("cnpj");
    if (!email_loja) camposAusentes.push("email_loja");

    if (camposAusentes.length > 0) {
      return res.status(400).json({
        message: "Validação falhou: campos obrigatórios ausentes",
        fields: camposAusentes,
        error: `Os seguintes campos são obrigatórios: ${camposAusentes.join(
          ", "
        )}. Todos devem ser fornecidos para criar uma loja.`,
      });
    }

    // Validação de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email_loja)) {
      return res.status(400).json({
        message: "Formato de e-mail inválido",
        field: "email_loja",
        value: email_loja,
        expected: "Um endereço de e-mail válido (exemplo: loja@empresa.com)",
      });
    }

    // Validação de formato de CNPJ (básica - apenas dígitos e comprimento)
    const cnpjLimpo = cnpj.replace(/\D/g, "");
    if (cnpjLimpo.length !== 14) {
      return res.status(400).json({
        message: "Formato de CNPJ inválido",
        field: "cnpj",
        value: cnpj,
        expected:
          "Um CNPJ válido com 14 dígitos (formato: XX.XXX.XXX/XXXX-XX ou apenas dígitos)",
      });
    }

    // Validação de formato de telefone (se fornecido)
    if (telefone) {
      const telefoneLimpo = telefone.replace(/\D/g, "");
      if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
        return res.status(400).json({
          message: "Formato de telefone inválido",
          field: "telefone",
          value: telefone,
          expected:
            "Um telefone válido com 10 ou 11 dígitos (formato: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX)",
        });
      }
    }

    let id_usuario_criado = req.body.id_usuario || 1;

    // Se deve gerar credenciais, cria o usuário primeiro
    if (gerarCredenciais && senhaGerada) {
      // Verifica se já existe usuário com esse email
      const usuarioExistente = await prisma.tb_sistema_usuario.findFirst({
        where: {
          email: email_loja,
          id_conta: Number(id_conta),
        },
      });

      if (usuarioExistente) {
        return res.status(400).json({
          message: "E-mail já cadastrado",
          field: "email_loja",
          value: email_loja,
          error: `Já existe um usuário com o e-mail "${email_loja}" nesta conta. Utilize um e-mail diferente ou não gere novas credenciais.`,
        });
      }

      // Hash da senha
      const senhaHash = await bcrypt.hash(senhaGerada, 10);

      // Cria o usuário
      const novoUsuario = await prisma.tb_sistema_usuario.create({
        data: {
          id_conta: Number(id_conta),
          nome: nome_fantasia || razao_social,
          email: email_loja,
          senha: senhaHash,
          cnpj: cnpj,
          telefone: telefone || null,
          ativo: true,
        },
      });

      id_usuario_criado = Number(novoUsuario.id);

      // Cria o perfil do usuário como "lojista"
      try {
        await prisma.tb_sistema_usuario_perfil.create({
          data: {
            id_usuario: id_usuario_criado,
            perfil: "lojista",
          },
        });
      } catch (perfilError) {
        console.error("Erro ao criar perfil do usuário:", perfilError);
        // Tenta criar com "loja" se "lojista" falhar
        try {
          await prisma.tb_sistema_usuario_perfil.create({
            data: {
              id_usuario: id_usuario_criado,
              perfil: "loja",
            },
          });
        } catch (perfilError2) {
          console.error("Erro ao criar perfil 'loja':", perfilError2);
        }
      }
    }

    // Cria a loja vinculada ao usuário
    const novaLoja = await prisma.tb_loja.create({
      data: {
        id_conta: Number(id_conta),
        id_usuario: BigInt(id_usuario_criado),
        razao_social,
        nome_fantasia: nome_fantasia || null,
        cnpj,
        email_loja,
        telefone,
        site,
        ativo: ativo ?? true,
      },
    });

    // Cria o endereço se foi fornecido
    if (
      endereco &&
      (endereco.logradouro || endereco.numero || endereco.cidade)
    ) {
      try {
        await prisma.tb_loja_endereco.create({
          data: {
            id_loja: novaLoja.id,
            logradouro: endereco.logradouro || null,
            numero: endereco.numero || null,
            bairro: endereco.bairro || null,
            cidade: endereco.cidade || null,
            estado: endereco.estado || null,
            cep: endereco.cep || null,
          },
        });
      } catch (enderecoError) {
        console.error("Erro ao criar endereço da loja:", enderecoError);
        // Não falha se endereço não conseguir ser criado
      }
    }

    // Cria o contato se foi fornecido
    if (contato && (contato.nome || contato.email)) {
      try {
        await prisma.tb_loja_contato.create({
          data: {
            id_loja: novaLoja.id,
            nome: contato.nome || null,
            email: contato.email || null,
            fone1: contato.fone1 || null,
            is_responsavel: contato.is_responsavel ?? false,
          },
        });
      } catch (contatoError) {
        console.error("Erro ao criar contato da loja:", contatoError);
        // Não falha se contato não conseguir ser criado
      }
    }

    res.status(201).json({
      message: "Loja criada com sucesso",
      data: serializeBigInt(novaLoja),
    });
  } catch (error) {
    console.error("Erro ao criar loja:", error);
    res.status(500).json({
      error: "Erro ao criar loja",
      details: error.message,
    });
  }
};

export const updateLoja = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const lojaExistente = await prisma.tb_loja.findUnique({
      where: { id },
    });

    if (!lojaExistente)
      return res.status(404).json({ message: "Loja não encontrada" });

    const lojaAtualizada = await prisma.tb_loja.update({
      where: { id },
      data: req.body,
    });

    res.json(serializeBigInt(lojaAtualizada));
  } catch (error) {
    res.status(500).json({
      error: "Erro ao atualizar loja",
      details: error.message,
    });
  }
};

export const deleteLoja = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const lojaExistente = await prisma.tb_loja.findUnique({
      where: { id },
    });

    if (!lojaExistente)
      return res.status(404).json({ message: "Loja não encontrada" });

    await prisma.tb_loja.delete({ where: { id } });

    res.json({ message: "Loja removida com sucesso" });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao deletar loja",
      details: error.message,
    });
  }
};
