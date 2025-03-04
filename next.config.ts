// next.config.js
module.exports = {
  experimental: {
    turbo: {
      loadExternalRuntime: true, // Ensure compatibility
    },
    turboEnabled: false, // Explicitly disable TurboPack
  },
};