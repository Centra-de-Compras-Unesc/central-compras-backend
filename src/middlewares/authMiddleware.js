import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "segredo_super_seguro";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader)
    return res.status(401).json({ message: "Token não fornecido" });

  const token = authHeader.split(" ")[1]; 

  if (!token)
    return res.status(401).json({ message: "Token inválido ou ausente" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido ou expirado" });
  }
};
