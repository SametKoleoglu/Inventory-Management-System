export function generateSaleNumber(): string {
  const characters =
    "abcdefghijklmnopqrstuvwxy1234567890abcdefghijklmnopqrstuvw";
  let orderNumber = "";
  for (let i = 0; i < characters.length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    orderNumber += characters[randomIndex];
  }
  return orderNumber;
}
