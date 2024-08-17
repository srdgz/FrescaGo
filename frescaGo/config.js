const checkConfig = (server) => {
  let config = {};
  switch (server) {
    case "production":
      config = {
        baseUrl: import.meta.env.VITE_BASE_URL_PRODUCTION,
      };
      break;
    case "local":
      config = {
        baseUrl: import.meta.env.VITE_BASE_URL_LOCAL,
      };
      break;
    default:
      break;
  }
  return config;
};

export const selectServer = "local";
export const config = checkConfig(selectServer);
