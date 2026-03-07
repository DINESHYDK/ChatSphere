import { Inria_Serif } from "next/font/google";
import "../styles/globals.css";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
const inria = Inria_Serif({
  subsets: ["latin"],
  weight: ["400", "700"], // choose weights you need
  variable: "--font-inria",
});

export default function App({ Component, pageProps }) {
  // useEffect(() => {
  //   const MAX_SYNC_TIME = process.env.MAX_SYNC_TIME;
  //   const interval = setInterval(() => {
  //     fetch("/api/poll/handleSync.js");
  //   }, MAX_SYNC_TIME);
  //   clearInterval(interval);
  // }, []);

  return (
    <>
      <main className={inria.variable}>
        <Component {...pageProps} />
      </main>
      {/* <ToastContainer
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
      /> */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false} // A thin, subtle progress bar looks very modern
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // Using light theme as a base for custom CSS
        className="modern-toast-container"
        toastClassName="modern-toast"
        bodyClassName="modern-toast-body"
        progressClassName="modern-toast-progress"
      />
    </>
  );
}
