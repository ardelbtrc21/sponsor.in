import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/Database.js";
import session from "express-session";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./src/routes/UserRoute.js";
import AuthRoute from "./src/routes/AuthRoute.js";
// import { createUserAdmin } from "./src/controllers/UserControllers.js";
dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store)
const store = new sessionStore({
    db: db,
})

store.sync().then(() => {
    console.log("Session table synced!");
}).catch(err => {
    console.error("Gagal sync session store:", err);
});

app.use(session({
    secret: process.env.SESS_SECRET || "",
    resave: false,
    rolling: true,
    saveUninitialized: true,
    store: store,
    cookie: {
        maxAge: 8 * 60 * 60 * 1000,
        secure: "auto"
    }
}))
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000",
}));

app.set("query parser", "extended");
app.disable("etag");
app.use(express.json());
app.use(express.static("public"));
app.use(UserRoute);
app.use(AuthRoute);
app.listen(process.env.APP_PORT, () => {
    console.log("Server up and running...")
    // createUserAdmin();
});