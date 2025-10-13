import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="tr">
      <Head>
        {/* ---- Meta ---- */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.png" />
        <title>Üreten Eller</title>

        {/* ---- Harici CSS (statik /ue.css) ---- */}
        <link rel="preload" href="/ue.css" as="style" />
        <link rel="stylesheet" href="/ue.css" />
      </Head>

      <body className="bg-[#faf9f7] text-gray-900 antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
