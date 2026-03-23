export default function generateToken() {
  let token = Math.floor(100000 + Math.random() * 900000);
  return token.toString();
}
