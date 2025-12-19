import checkAuthAndCookie from "@/utils/checkAuth";

export default function handler(req, res) {
    checkAuthAndCookie(req);
    res.status(200).json({ message: 'Hello from the API!' });
}