/** @type {import('next').NextConfig} */
const nextConfig = {
  // Двойной вызов эффектов в режиме разработки, как StrictMode в ЛР № 19-23
  reactStrictMode: true,
  // Заголовок X-Powered-By не нужен клиентам
  poweredByHeader: false,
};

module.exports = nextConfig;
