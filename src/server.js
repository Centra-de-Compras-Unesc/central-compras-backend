import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { jsonBigIntMiddleware } from "./middlewares/jsonBigIntMiddleware.js";

import fornecedoresRoutes from "./routes/fornecedores.js";
import lojaRoutes from "./routes/lojas.js";
import produtoRoutes from "./routes/produtos.js";
import campanhaRoutes from "./routes/campanhas.js";
import campanhaProdutoRoutes from "./routes/campanhaProduto.js";
import pedidoRoutes from "./routes/pedidos.js";
import pedidoItensRoutes from "./routes/pedidoItens.js";
import usuariosRoutes from "./routes/usuarios.js";
import authRoutes from "./routes/auth.js";
import condicoesComerciaisRoutes from "./routes/condicoesComercias.js";
import cashbackRoutes from "./routes/cashback.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(jsonBigIntMiddleware);

app.use("/fornecedores", fornecedoresRoutes);
app.use("/lojas", lojaRoutes);
app.use("/produtos", produtoRoutes);
app.use("/campanhas", campanhaRoutes);
app.use("/campanha-produto", campanhaProdutoRoutes);
app.use("/pedidos", pedidoRoutes);
app.use("/pedido-itens", pedidoItensRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/auth", authRoutes);
app.use("/condicoes-comerciais", condicoesComerciaisRoutes);
app.use("/cashback", cashbackRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
