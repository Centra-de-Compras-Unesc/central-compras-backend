/**
 * Middleware global para tratar BigInt em respostas JSON
 */
export const jsonBigIntMiddleware = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    const safeData = JSON.parse(
      JSON.stringify(data, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
    return originalJson.call(this, safeData);
  };

  next();
};
