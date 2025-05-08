import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/Database.js";
import session from "express-session";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./src/routes/UserRoute.js";
import AuthRoute from "./src/routes/AuthRoute.js";
import fileUpload from "express-fileupload";
import MilestoneRoute from './src/routes/MilestoneRoute.js';
import SponsorRoute from './src/routes/SponsorRoute.js'
import ReportRoute from './src/routes/ReportRoute.js';
import ProposalRoute from './src/routes/ProposalRoute.js';
import AdminRoute from './src/routes/AdminRoute.js';
import TagRoute from "./src/routes/TagRoute.js";
import TargetRoute from "./src/routes/TargetRoute.js";
import AgreementRoutes from "./src/routes/ProposalRoute.js";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(express.json()); 
const proposalFolder = path.join(__dirname, 'data/proposal');

app.use(cors({
    credentials: true,
    origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

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

app.set("query parser", "extended");
app.disable("etag");
app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));
app.use('/backend/data/proposal', express.static(proposalFolder));
app.use("/api/sponsors", SponsorRoute);
app.use(ReportRoute);
app.use(ProposalRoute);
app.use(MilestoneRoute);
app.use(AdminRoute);
app.use(AgreementRoutes);
app.use(UserRoute);
app.use(AuthRoute);
app.use(TagRoute);
app.use(TargetRoute);
app.use('/profile_photo', express.static('data/profile_photo'));
app.listen(process.env.APP_PORT, () => {
    console.log("Server up and running...")
});