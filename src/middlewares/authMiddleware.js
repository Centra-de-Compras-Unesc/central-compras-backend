import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "segredo_super_seguro";

/**
 * Middleware para verificar o token JWT
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader)
    return res.status(401).json({ message: "Token não fornecido" });

  const token = authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token)
    return res.status(401).json({ message: "Token inválido ou ausente" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // salva os dados do usuário no request
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido ou expirado" });
  }
};
