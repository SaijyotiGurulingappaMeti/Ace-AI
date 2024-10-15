/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://ai-int_owner:bBmnIc8aeW4j@ep-sparkling-snowflake-a5sci5ps.us-east-2.aws.neon.tech/ai-int?sslmode=require',
    }
  };