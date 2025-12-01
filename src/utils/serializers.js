
export function serializeBigInt(obj) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      if (typeof value === "bigint") return value.toString();
      if (typeof value === "object" && value !== null && value.constructor?.name === "Decimal") {
        return parseFloat(value.toString());
      }
      return value;
    })
  );
}

export function parseNumericId(id) {
  return Number(id) || BigInt(id);
}
