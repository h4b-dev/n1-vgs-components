/** @type {import('@ladle/react').UserConfig} */
export default {
  stories: "src/**/*.stories.{js,jsx,ts,tsx,mdx}",
  host: "0.0.0.0",
  port: 3001,
  open: false,
  addons: {
    msw: {
      enabled: true,
    },
  },
};
