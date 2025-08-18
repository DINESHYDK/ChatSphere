import { Inria_Serif } from "next/font/google";
import "../styles/globals.css";

const inria = Inria_Serif({
  subsets: ["latin"],
  weight: ["400", "700"], // choose weights you need
  variable: "--font-inria",
});

export default function App({ Component, pageProps }) {
  return (
    <main className={inria.variable}>
      <Component {...pageProps} />
    </main>
  );
}
