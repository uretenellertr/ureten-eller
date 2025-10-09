import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="tr">
        <Head>
          {/* FAVICONS - cache kırmak için yeni dosya adları (v8) */}
          <link rel="icon" href="/favicon.ico?v=8" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.v8.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.v8.png" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.v8.png" />
          <link rel="icon" type="image/png" href="/favicon.v8.png" />
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
