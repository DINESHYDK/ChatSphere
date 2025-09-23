import { Inria_Serif } from "next/font/google";
import "../styles/globals.css";
import { ToastContainer } from "react-toastify";
const inria = Inria_Serif({
  subsets: ["latin"],
  weight: ["400", "700"], // choose weights you need
  variable: "--font-inria",
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <main className={inria.variable}>
        <Component {...pageProps} />
      </main>
      <ToastContainer
        position="top-right"
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
        progressClassName="custom-progress"
        className="react_toast_styling"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}
