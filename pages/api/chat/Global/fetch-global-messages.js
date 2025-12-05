// pages/api/hello.js
export default async function FetchGlobalMessages(req, res) {
    
  res.status(200).json({ message: "Hello from Next.js API Routes!" });
}
