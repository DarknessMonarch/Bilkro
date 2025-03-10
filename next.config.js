module.exports = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "iili.io",
        port: '',
      },
      {
        protocol: "https",
        hostname: "i.postimg.cc",
        port: "",
      }
    ],
  },
};
