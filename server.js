import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import colors from "colors";

// configure env
dotenv.config({ override: false });

//database config
connectDB();

const PORT = process.env.PORT || 6060;

const server = app.listen(PORT, () => {
    console.log(`Server running on ${process.env.DEV_MODE} mode on ${PORT}`.bgCyan.white,);
});

export { server };
