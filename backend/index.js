import express from "express";
import cors from "cors";
import db from "./config/Database.js";
import session from "express-session";
import SequelizeStore from "connect-session-sequelize";

const app = express ();

const sessionStore = SequelizeStore(session.Store)
const store = new sessionStore({
    db: db,
})
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
app.listen(process.env.APP_PORT, ()=>{
    console.log("Server up and running...")
});