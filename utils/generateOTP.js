export default function generateToken() {
  let token = Math.floor(100000 + Math.random() * 90000);
  return token.toString();
}
