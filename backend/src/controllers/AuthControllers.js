import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const Login = async (req, res) => {
    if (!req.body.username) return res.status(400).json({ msg: "Username must be filled in !" });
    if (!req.body.password) return res.status(400).json({ msg: "Password must be filled in !" });
    const user = await User.findOne({
        where: {
            username: req.body.username.toLowerCase()
        }
    });
    if (!user) return res.status(404).json({ msg: "User Not Found !" });
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).json({ msg: "Wrong Password !" });
    
    req.session.username = user.username;
    req.session.last_login = user.last_login;

    //set last login
    let d = new Date();
    let dateNow = d.toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
    await User.update({
        last_login: dateNow
    }, {
        where: {
            username: req.body.username.toLowerCase()
        }
    });

    const username = user.username;
    const name = user.name;
    const email = user.email;
    const role = user.role;
    const profile_photo = user.profile_photo
    res.status(200).json({ username, name, email, role, profile_photo });
};

export const Me = async (req, res) => {
    //{ msg: "Please login to your account !" }
    if (!req.session.username) {
        return res.status(401).json();
    }
    const user = await User.findOne({
        attributes: ["username", "name", "email", "role", "profile_photo"],
        where: {
            udomain: req.session.username
        }
    });
    user.dataValues.last_login = req.session.last_login;
    if (!user) return res.status(404).json({ msg: "User Not Found !" });
    return res.status(200).json(user);
};

export const logout = (req, res) => {
    try {
        req.session.destroy();
        res.status(200).json({ msg: "You have successfully logged out " });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};