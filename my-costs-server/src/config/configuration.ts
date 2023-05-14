export default () => ({
  database: {
    url: process.env.DATABASE_URL,
    name: process.env.DATABASE_NAME,
  },
  jwt: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION,
  },
});
