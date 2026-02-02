/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://neondb_owner:vQ5PMU0FoYbd@ep-tiny-hill-a5e1lklf.us-east-2.aws.neon.tech/ai-interview-mockup?sslmode=require',
    }
  };