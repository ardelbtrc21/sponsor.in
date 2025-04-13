import User from "../models/user.js";
import bcrypt from "bcryptjs";
import basicAuthParser from "basic-auth-parser";

export const verifyUser = async (req, res, next) => {
    //pakai basic auth
    if (req.headers.authorization) {
        const auth = basicAuthParser(req.headers.authorization);

        let user;
        try {
            user = await User.findOne({
                where: {
                    username: auth.username
                }
            });
        } catch (error) {
            return res.status(404).json({ msg: "Authentication Invalid !" });
        }
        if (!user) return res.status(404).json({ msg: "User Not Found !" });
        const match = await bcrypt.compare(auth.password, user.password);
        if (!match) return res.status(400).json({ msg: "Wrong Password !" });
        // if (user.status !== "Active") return res.status(400).json({ msg: "Your account is no longer active !" });

        // req.session.username = user.username;
        // req.session.last_login = user.last_login;

    } else {
        //pakai session
        if (!req.session.username) {
            return res.status(401).json({ msg: "Please login to your account!" });
        }

        let user;
        try {
            user = await User.findOne({
                where: {
                    username: req.session.username
                }
            });
        } catch (error) {
            return res.status(404).json({ msg: "Authentication Invalid !" });
        }
        if (!user) return res.status(404).json({ msg: "User Not Found !" });
        req.username = user.username;
        req.role = user.role;

    }
    next();
};

export const adminOnly = async (req, res, next) => {
    const user = await User.findOne({
        where: {
            username: req.session.username
        }
    });
    if (!user) return res.status(404).json({ msg: "User Not Found !" });
    if (user.role !== "Admin") return res.status(403).json({ msg: "Access Forbidden !" });
    next();
};

export const checkUserRole = (role) => {
    return async (req, res, next) => {
        try {

            const user = await User.findOne({
                where: {
                    username: req.session.username
                }
            });

            if (user && typeof role === "object" && role.includes(user.role)) {
                return next();
            }
            res.status(403).json({ msg: "Access Forbidden !" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Access Forbidden !" });
        }
    };
};