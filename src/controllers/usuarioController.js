import { PrismaClient } from "../generated/prisma/index.js";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

function serializeBigInt(obj) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      if (typeof value === "bigint") return value.toString();
      if (
        typeof value === "object" &&
        value !== null &&
        value.constructor?.name === "Decimal"
      )
        return parseFloat(value.toString());
      return value;
    })
  );
}

export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.tb_sistema_usuario.findMany({
      orderBy: { id: "asc" },
      take: 100,
      include: {
        tb_sistema_conta: { select: { id: true, nm_conta: true } },
        tb_sistema_usuario_perfil: true,
      },
    });

    res.json(serializeBigInt(usuarios));
  } catch (error) {
    res.status(500).json({
      error: "Erro ao listar usuários",
      details: error.message,
    });
  }
};

export const getUsuarioById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const usuario = await prisma.tb_sistema_usuario.findUnique({
      where: { id },
      include: {
        tb_sistema_conta: { select: { id: true, nm_conta: true } },
        tb_sistema_usuario_perfil: true,
        tb_loja: { select: { id: true, nome_fantasia: true } },
        tb_fornecedor: { select: { id: true, nome_fantasia: true } },
      },
    });

    if (!usuario)
      return res.status(404).json({ message: "Usuário não encontrado" });

    const usuarioComIds = {
      ...usuario,
      id_loja: usuario.tb_loja?.[0]?.id || null,
      id_fornecedor: usuario.tb_fornecedor?.[0]?.id || null,
    };

    res.json(serializeBigInt(usuarioComIds));
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar usuário",
      details: error.message,
    });
  }
};

export const createUsuario = async (req, res) => {
  try {
    const { id_conta, nome, email, senha, ativo } = req.body;

    if (!id_conta || !nome || !email || !senha)
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });

    // Hash da senha antes de salvar
    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = await prisma.tb_sistema_usuario.create({
      data: {
        id_conta: Number(id_conta),
        nome,
        email,
        senha: senhaHash,
        ativo: ativo ?? true,
      },
    });

    res.status(201).json(serializeBigInt(novoUsuario));
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ message: "E-mail já cadastrado para esta conta." });
    }

    res.status(500).json({
      error: "Erro ao criar usuário",
      details: error.message,
    });
  }
};

export const updateUsuario = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const usuarioExistente = await prisma.tb_sistema_usuario.findUnique({
      where: { id },
      include: { tb_sistema_usuario_perfil: true },
    });

    if (!usuarioExistente)
      return res.status(404).json({ message: "Usuário não encontrado" });

    const {
      nome,
      email,
      senha,
      ativo,
      telefone,
      cnpj,
      cep,
      endereco,
      numero,
      bairro,
      cidade,
      estado,
      avatarUrl,
      loja,
      perfil,
    } = req.body;

    const dataAtualizar = {};
    if (nome !== undefined) dataAtualizar.nome = nome;
    if (email !== undefined) dataAtualizar.email = email;
    if (senha !== undefined) {
      // Hash da senha antes de salvar
      dataAtualizar.senha = await bcrypt.hash(senha, 10);
    }
    if (ativo !== undefined) dataAtualizar.ativo = ativo;
    if (telefone !== undefined) dataAtualizar.telefone = telefone;
    if (cnpj !== undefined) dataAtualizar.cnpj = cnpj;
    if (cep !== undefined) dataAtualizar.cep = cep;
    if (endereco !== undefined) dataAtualizar.endereco = endereco;
    if (numero !== undefined) dataAtualizar.numero = numero;
    if (bairro !== undefined) dataAtualizar.bairro = bairro;
    if (cidade !== undefined) dataAtualizar.cidade = cidade;
    if (estado !== undefined) dataAtualizar.estado = estado;
    if (avatarUrl !== undefined) dataAtualizar.avatarUrl = avatarUrl;
    if (loja !== undefined) dataAtualizar.loja = loja;

    // Atualiza o usuário
    const usuarioAtualizado = await prisma.tb_sistema_usuario.update({
      where: { id },
      data: dataAtualizar,
      include: {
        tb_sistema_conta: { select: { id: true, nm_conta: true } },
        tb_sistema_usuario_perfil: true,
      },
    });

    // Atualiza o perfil se foi enviado
    if (perfil !== undefined) {
      // Verifica se já existe um perfil para o usuário
      const perfilExistente = usuarioExistente.tb_sistema_usuario_perfil?.[0];
      const perfilAnterior = perfilExistente?.perfil;
      const id_conta = usuarioExistente.id_conta;

      // ========== VERIFICAÇÃO DE DEPENDÊNCIAS ANTES DE ALTERAR ==========

      // Se o perfil anterior era fornecedor e o novo não é, verifica dependências
      if (perfilAnterior === "fornecedor" && perfil !== "fornecedor") {
        const fornecedor = await prisma.tb_fornecedor.findFirst({
          where: { id_usuario: BigInt(id) },
        });

        if (fornecedor) {
          const campanhasVinculadas = await prisma.tb_fornecedor_campanha.count(
            {
              where: { id_fornecedor: fornecedor.id },
            }
          );

          const produtosVinculados = await prisma.tb_fornecedor_produto.count({
            where: { id_fornecedor: fornecedor.id },
          });

          if (campanhasVinculadas > 0 || produtosVinculados > 0) {
            return res.status(400).json({
              message: `Não é possível alterar o perfil. Este fornecedor possui ${campanhasVinculadas} campanha(s) e ${produtosVinculados} produto(s) vinculados. Remova-os antes de alterar o perfil.`,
            });
          }
        }
      }

      // Se o perfil anterior era loja e o novo não é, verifica dependências
      if (perfilAnterior === "loja" && perfil !== "loja") {
        const loja = await prisma.tb_loja.findFirst({
          where: { id_usuario: BigInt(id) },
        });

        if (loja) {
          const pedidosVinculados = await prisma.tb_pedido.count({
            where: { id_loja: loja.id },
          });

          const cashbacksVinculados = await prisma.tb_loja_cashback.count({
            where: { id_loja: loja.id },
          });

          if (pedidosVinculados > 0 || cashbacksVinculados > 0) {
            return res.status(400).json({
              message: `Não é possível alterar o perfil. Esta loja possui ${pedidosVinculados} pedido(s) e ${cashbacksVinculados} cashback(s) vinculados. Remova-os antes de alterar o perfil.`,
            });
          }
        }
      }

      // ========== ATUALIZA O PERFIL (após verificações passarem) ==========

      if (perfilExistente) {
        await prisma.tb_sistema_usuario_perfil.update({
          where: { id: perfilExistente.id },
          data: { perfil: perfil },
        });
      } else {
        await prisma.tb_sistema_usuario_perfil.create({
          data: {
            id_usuario: BigInt(id),
            perfil: perfil,
          },
        });
      }

      // ========== REMOVE REGISTROS ANTIGOS ==========

      // Se o perfil anterior era fornecedor e o novo não é, remove da tabela tb_fornecedor
      if (perfilAnterior === "fornecedor" && perfil !== "fornecedor") {
        const fornecedor = await prisma.tb_fornecedor.findFirst({
          where: { id_usuario: BigInt(id) },
        });
        if (fornecedor) {
          await prisma.tb_fornecedor.delete({
            where: { id: fornecedor.id },
          });
        }
      }

      // Se o perfil anterior era loja e o novo não é, remove da tabela tb_loja
      if (perfilAnterior === "loja" && perfil !== "loja") {
        const loja = await prisma.tb_loja.findFirst({
          where: { id_usuario: BigInt(id) },
        });
        if (loja) {
          await prisma.tb_loja.delete({
            where: { id: loja.id },
          });
        }
      }

      // ========== CRIA NOVOS REGISTROS ==========
      if (perfil === "fornecedor" && perfilAnterior !== "fornecedor") {
        const fornecedorExistente = await prisma.tb_fornecedor.findFirst({
          where: { id_usuario: BigInt(id) },
        });

        if (!fornecedorExistente) {
          await prisma.tb_fornecedor.create({
            data: {
              id_conta: BigInt(id_conta),
              id_usuario: BigInt(id),
              email_fornecedor: usuarioAtualizado.email,
              nome_fantasia: usuarioAtualizado.nome,
              razao_social: usuarioAtualizado.nome,
              cnpj: usuarioAtualizado.cnpj || null,
              telefone: usuarioAtualizado.telefone || null,
              ativo: true,
            },
          });
        }
      }

      // Se o novo perfil é loja e não existia antes, cria entrada em tb_loja
      if (perfil === "loja" && perfilAnterior !== "loja") {
        const lojaExistente = await prisma.tb_loja.findFirst({
          where: { id_usuario: BigInt(id) },
        });

        if (!lojaExistente) {
          // Gera um CNPJ temporário único se não tiver
          const cnpjLoja = usuarioAtualizado.cnpj || `TEMP-${Date.now()}-${id}`;

          await prisma.tb_loja.create({
            data: {
              id_conta: BigInt(id_conta),
              id_usuario: BigInt(id),
              cnpj: cnpjLoja,
              nome_fantasia: usuarioAtualizado.nome || "Nova Loja",
              razao_social: usuarioAtualizado.nome || "Nova Loja",
              email_loja: usuarioAtualizado.email,
              telefone: usuarioAtualizado.telefone || null,
              ativo: true,
              termo_aceito: false,
            },
          });
        }
      }

      // Recarrega o usuário com o perfil atualizado
      const usuarioComPerfil = await prisma.tb_sistema_usuario.findUnique({
        where: { id },
        include: {
          tb_sistema_conta: { select: { id: true, nm_conta: true } },
          tb_sistema_usuario_perfil: true,
        },
      });

      return res.json(serializeBigInt(usuarioComPerfil));
    }

    res.json(serializeBigInt(usuarioAtualizado));
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ message: "E-mail já cadastrado para esta conta." });
    }

    res.status(500).json({
      error: "Erro ao atualizar usuário",
      details: error.message,
    });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const usuarioExistente = await prisma.tb_sistema_usuario.findUnique({
      where: { id },
    });

    if (!usuarioExistente)
      return res.status(404).json({ message: "Usuário não encontrado" });

    // Se já está inativo, deleta permanentemente
    if (usuarioExistente.ativo === false) {
      try {
        // Deleta os perfis do usuário
        await prisma.tb_sistema_usuario_perfil.deleteMany({
          where: { id_usuario: id },
        });

        // Busca lojas e fornecedores do usuário
        const lojasDoUsuario = await prisma.tb_loja.findMany({
          where: { id_usuario: BigInt(id) },
        });

        const fornecedoresDoUsuario = await prisma.tb_fornecedor.findMany({
          where: { id_usuario: BigInt(id) },
        });

        // Deleta itens de pedidos relacionados
        await prisma.tb_pedido_item.deleteMany({
          where: { id_usuario: id },
        });

        // Deleta pedidos relacionados
        await prisma.tb_pedido.deleteMany({
          where: { id_usuario: id },
        });

        // Deleta dados de lojas
        for (const loja of lojasDoUsuario) {
          await prisma.tb_loja_cashback_detalhes.deleteMany({
            where: { id_loja: loja.id },
          });
          await prisma.tb_loja_cashback.deleteMany({
            where: { id_loja: loja.id },
          });
          await prisma.tb_loja_endereco.deleteMany({
            where: { id_loja: loja.id },
          });
          await prisma.tb_loja_contato.deleteMany({
            where: { id_loja: loja.id },
          });
          await prisma.tb_loja.delete({ where: { id: loja.id } });
        }

        // Deleta dados de fornecedores
        for (const fornecedor of fornecedoresDoUsuario) {
          await prisma.tb_fornecedor_campanha_produto.deleteMany({
            where: {
              id_campanha: {
                in: (
                  await prisma.tb_fornecedor_campanha.findMany({
                    where: { id_fornecedor: fornecedor.id },
                    select: { id: true },
                  })
                ).map((c) => c.id),
              },
            },
          });
          await prisma.tb_fornecedor_campanha.deleteMany({
            where: { id_fornecedor: fornecedor.id },
          });
          await prisma.tb_fornecedor_produto.deleteMany({
            where: { id_fornecedor: fornecedor.id },
          });
          await prisma.tb_fornecedor_condicao.deleteMany({
            where: { id_fornecedor: fornecedor.id },
          });
          await prisma.tb_fornecedor_endereco.deleteMany({
            where: { id_fornecedor: fornecedor.id },
          });
          await prisma.tb_fornecedor_contato.deleteMany({
            where: { id_fornecedor: fornecedor.id },
          });
          await prisma.tb_fornecedor.delete({ where: { id: fornecedor.id } });
        }

        // Deleta o usuário
        await prisma.tb_sistema_usuario.delete({ where: { id } });

        return res.json({
          message: "Usuário removido permanentemente do sistema",
        });
      } catch (deleteError) {
        return res.status(500).json({
          error:
            "Não foi possível excluir o usuário devido a dependências no sistema",
          details: deleteError.message,
        });
      }
    }

    // Se está ativo, apenas desativa (exclusão lógica)
    await prisma.tb_sistema_usuario.update({
      where: { id },
      data: { ativo: false },
    });

    await prisma.tb_loja.updateMany({
      where: { id_usuario: BigInt(id) },
      data: { ativo: false },
    });

    await prisma.tb_fornecedor.updateMany({
      where: { id_usuario: BigInt(id) },
      data: { ativo: false },
    });

    res.json({ message: "Usuário desativado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).json({
      error: "Erro ao deletar usuário",
      details: error.message,
    });
  }
};
