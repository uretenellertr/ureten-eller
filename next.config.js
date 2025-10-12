/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',        // static export
  trailingSlash: true,     // /path/ -> path/index.html
  images: { unoptimized: true }, // next/image kullanıyorsan statik olsun
};
module.exports = nextConfig;
