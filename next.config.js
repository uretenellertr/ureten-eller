/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',        // build sırasında statik export yap
  trailingSlash: true,     // GitHub Pages 404 olmasın
  images: { unoptimized: true }
};
module.exports = nextConfig;
