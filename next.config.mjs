/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      // Ignore source map files from chrome-aws-lambda
      config.module.rules.push({
        test: /\.map$/,
        use: "ignore-loader"
      });
  
      return config;
    },
  }
  
export default nextConfig