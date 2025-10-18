import Typesense from "typesense";

const client = new Typesense.Client({
  nodes: [
    {
      host: "localhost",
      port: 8108,
      protocol: "http",
    },
  ],
  apiKey: "5DcmJ1K7mR2zRh26Ept9J2ttSfH0uUOvfMHc0jSVmXR0W9ce",
  connectionTimeoutSeconds: 2,
});

export default client;
