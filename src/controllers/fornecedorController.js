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

export const getFornecedores = async (req, res) => {
  try {
    const { id_usuario } = req.query;

    const where = {};
    if (id_usuario) {
      where.id_usuario = Number(id_usuario);
    }

    const fornecedores = await prisma.tb_fornecedor.findMany({
      where,
      orderBy: { id: "asc" },
      take: 50,
    });

    const safeData = JSON.parse(
      JSON.stringify(fornecedores, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.json(safeData);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao listar fornecedores",
      details: error.message,
    });
  }
};

export const getFornecedorById = async (req, res) => {
  try {
    const fornecedor = await prisma.tb_fornecedor.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!fornecedor)
      return res.status(404).json({ message: "Fornecedor não encontrado" });

    res.json(serializeBigInt(fornecedor));
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar fornecedor",
      details: error.message,
    });
  }
};

export const createFornecedor = async (req, res) => {
  try {
    const {
      id_conta,
      razao_social,
      nome_fantasia,
      cnpj,
      email_fornecedor,
      telefone,
      site,
      ativo,
      gerarCredenciais,
      senhaGerada,
      endereco,
      contato,
    } = req.body;

    if (!id_conta || !cnpj || !email_fornecedor)
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });

    let id_usuario_criado = req.body.id_usuario || 1;

    // Se deve gerar credenciais, cria o usuário primeiro
    if (gerarCredenciais && senhaGerada) {
      // Verifica se já existe usuário com esse email
      const usuarioExistente = await prisma.tb_sistema_usuario.findFirst({
        where: {
          email: email_fornecedor,
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
          email: email_fornecedor,
          senha: senhaHash,
          cnpj: cnpj,
          telefone: telefone || null,
          ativo: true,
        },
      });

      id_usuario_criado = Number(novoUsuario.id);

      // Cria o perfil do usuário como "fornecedor"
      try {
        await prisma.tb_sistema_usuario_perfil.create({
          data: {
            id_usuario: id_usuario_criado,
            perfil: "fornecedor",
          },
        });
      } catch (perfilError) {
        console.error("Erro ao criar perfil do usuário:", perfilError);
      }
    }

    const novoFornecedor = await prisma.tb_fornecedor.create({
      data: {
        id_conta: Number(id_conta),
        id_usuario: BigInt(id_usuario_criado),
        razao_social,
        nome_fantasia,
        cnpj,
        email_fornecedor,
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
        await prisma.tb_fornecedor_endereco.create({
          data: {
            id_fornecedor: novoFornecedor.id,
            logradouro: endereco.logradouro || null,
            numero: endereco.numero || null,
            bairro: endereco.bairro || null,
            cidade: endereco.cidade || null,
            estado: endereco.estado || null,
            cep: endereco.cep || null,
          },
        });
      } catch (enderecoError) {
        console.error("Erro ao criar endereço do fornecedor:", enderecoError);
        // Não falha se endereço não conseguir ser criado
      }
    }

    // Cria o contato se foi fornecido
    if (contato && (contato.nome || contato.email)) {
      try {
        await prisma.tb_fornecedor_contato.create({
          data: {
            id_fornecedor: novoFornecedor.id,
            nome: contato.nome || null,
            email: contato.email || null,
            fone1: contato.fone1 || null,
            is_responsavel: contato.is_responsavel ?? false,
          },
        });
      } catch (contatoError) {
        console.error("Erro ao criar contato do fornecedor:", contatoError);
        // Não falha se contato não conseguir ser criado
      }
    }

    res.status(201).json({
      message: "Fornecedor criado com sucesso",
      data: serializeBigInt(novoFornecedor),
    });
  } catch (error) {
    console.error("Erro ao criar fornecedor:", error);
    res.status(500).json({
      error: "Erro ao criar fornecedor",
      details: error.message,
    });
  }
};

export const updateFornecedor = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const fornecedorExistente = await prisma.tb_fornecedor.findUnique({
      where: { id },
    });

    if (!fornecedorExistente)
      return res.status(404).json({ message: "Fornecedor não encontrado" });

    const fornecedorAtualizado = await prisma.tb_fornecedor.update({
      where: { id },
      data: req.body,
    });

    res.json(serializeBigInt(fornecedorAtualizado));
  } catch (error) {
    res.status(500).json({
      error: "Erro ao atualizar fornecedor",
      details: error.message,
    });
  }
};

export const deleteFornecedor = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const fornecedorExistente = await prisma.tb_fornecedor.findUnique({
      where: { id },
    });

    if (!fornecedorExistente)
      return res.status(404).json({ message: "Fornecedor não encontrado" });

    await prisma.tb_fornecedor.delete({ where: { id } });

    res.json({ message: "Fornecedor removido com sucesso" });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao deletar fornecedor",
      details: error.message,
    });
  }
};
