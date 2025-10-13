// pages/_app.jsx
import "../styles/globals.css";
import "../styles/ue.css";   // <-- yeni satır (bizim CSS)

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
