import pkg from "pg";

const {Pool} = pkg;

//check if we have all the environment variables we need
if (!process.env.POSTGRES_HOST      ||
    !process.env.POSTGRES_USER      ||
    !process.env.POSTGRES_PASSWORD  ||
    !process.env.POSTGRES_DB        ||
    !process.env.POSTGRES_PORT) {
        console.error("Environment variables are not set!");
        process.exit(1);
    }

const dbConnection = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB
});

export default dbConnection