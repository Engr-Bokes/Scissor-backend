module.exports = {
    presets: [
      ['@babel/preset-env', {
        targets: {
          node: 'current', // Ensures Babel targets the current version of Node.js
        },
      }],
      '@babel/preset-typescript' // TypeScript preset does not need additional options
    ],
  };
  