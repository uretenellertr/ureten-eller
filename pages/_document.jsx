import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="tr">
        <Head>
          {/* FAVICONS - cache kırmak için yeni dosya adları (v8) */}
          <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=9" />
          <link rel="icon" type="image/png" href="/favicon.png?v=9" />
          <meta name="theme-color" content="#0b0b0b" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
