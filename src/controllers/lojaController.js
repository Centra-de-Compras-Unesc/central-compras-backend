import { PrismaClient } from "@prisma/client";
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

    if (!id_conta || !razao_social || !cnpj || !email_loja) {
      return res.status(400).json({
        message:
          "Campos obrigatórios ausentes: id_conta, razao_social, cnpj, email_loja",
      });
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
          message: "Já existe um usuário com este e-mail.",
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
