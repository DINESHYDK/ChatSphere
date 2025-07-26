

export default async function verifyEmail(req, res) {
  if (req.method === "POST") {
    
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
