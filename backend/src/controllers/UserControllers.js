/* eslint-disable no-unused-vars */
import Sponsor from "../models/sponsor.js";
import Sponsoree from "../models/sponsoree.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import schedule from "node-schedule";
import sequelize, { Op } from "sequelize";
import path from "path";

export const getUserDetail = async (username) => {
    try {
        const user = await User.findOne({
            where: {
                username: username.toLowerCase().trim()
            },
            attributes: ["username", "name", "role", "email", "profile_photo"],
            raw: true
        });

        return user;
    } catch (error) {
        console.log(error);
    }
};

export const createUser = async (req, res) => {
    const { username, name, email, password, role, category, nib, document } = req.body;
    try {
        let errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegexUpperCase = /^(?=.*?[A-Z])/;
        const passwordRegexLowerCase = /(?=.*?[a-z])/;
        const passwordRegexDigit = /(?=.*?[0-9])/;
        const passwordRegexSpecialChar = /(?=.*?[^A-Za-z0-9])/;
        const passwordRegexMinLen = /.{8,}$/;
        if (!username || username == "") errors.username = "Username must be filled in!";
        if (username && username != "" && username.length < 5) errors.username = "Username at least minimum 5 characters!";
        //cek jika user sudah terdaftar atau belum
        const user = await User.findOne({
            where: {
                username: username.toLowerCase()
            }
        });
        if (user) errors.username = "Username is already registered";
        if (!name || name == "") errors.name = "Name must be filled in!";
        if (name && name != "" && name.length < 3) errors.name = "Name at least minimum 3 characters!";
        if (emailRegex.test(email) == false) errors.email = "Email is invalid!";
        if (!password || password == "") errors.password = "Password must be filled in!";
        if (passwordRegexUpperCase.test(password)) errors.password = "Password must contain at least one uppercase letter!";
        if (passwordRegexLowerCase.test(password)) errors.password = "Password must contain at least one lowercase letter!";
        if (passwordRegexDigit.test(password)) errors.password = "Password must contain at least one number!";
        if (passwordRegexSpecialChar.test(password)) errors.password = "Password must contain at least one special character!";
        if (passwordRegexMinLen.test(password)) errors.password = "Password at least minimum 8 characters!";
        if (!role || role == "") errors.role = "Role must be filled in!";
        if (role == "sponsoree" && !category && category=="") errors.category = "Category must be filled in!"
        if (role == "sponsor" && !nib && nib=="") errors.nib = "NIB must be filled in!"
        if (role == "sponsor" && !document) errors.document = "Please submit NIB document!"

        if (role == "sponsor" && document.length > 0){
            for (let i = 1; i <= Object.keys(document).length; i++) {
                const file = eval("document.dokumen" + String(i));
                const ext = path.extname(String(file.name)).toLowerCase();
                if(ext != "pdf"){
                    errors.files = `File of ${file.name} file must be in PDF extension.`;
                }
                const fileSize = file.data.length;
                if (fileSize > 10000000) {
                    errors.files = `File of ${file.name} must be less than 10 MB.`;
                }
            }
        }

        if (Object.keys(errors).length != 0) {
            return res.status(404).json(errors);
        }

        //hari ini sampe sini
        const hashPassword = await bcrypt.hash(password, 10);
        await User.create({
            udomain: udomain.toLowerCase(),
            name: name,
            status: "Active",
            role: role,
            biro: biro,
            password: hashPassword,
            ever_reset_password: "false",
        });

        await UserRole.create({
            udomain: udomain.toLowerCase(),
            role: role
        });
        res.status(201).json({ msg: "Register User Berhasil" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const sortBy = req.query.sortBy || "name";
        const order = req.query.order || "ASC";
        const keyword = req.query.keyword || "";

        // pagination
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 10;

        let where = {
            [Op.or]: [
                {
                    name: {
                        [Op.iLike]: "%" + keyword + "%"
                    }
                }, {
                    udomain: {
                        [Op.iLike]: "%" + keyword + "%"
                    }
                }, {
                    name: {
                        [Op.iLike]: "%" + keyword + "%"
                    }
                }, {
                    role: {
                        [Op.iLike]: "%" + keyword + "%"
                    }
                }, {
                    email: {
                        [Op.iLike]: "%" + keyword + "%"
                    }
                }, {
                    position: {
                        [Op.iLike]: "%" + keyword + "%"
                    }
                }, {
                    biro: {
                        [Op.iLike]: "%" + keyword + "%"
                    }
                }, {
                    name: {
                        [Op.iLike]: "%" + keyword + "%"
                    }
                },
                { "$user_roles.role$": { [Op.iLike]: "%" + keyword + "%" } }
            ], [Op.and]: [
                {
                    udomain: {
                        [Op.not]: req.session.userId
                    }
                }
            ]

        };

        let include = [
            { model: UserRole, as: "user_roles", required: false, attributes: ["udomain", "role"], duplicating: false }
        ];

        let result = await User.findAll({
            where: where,
            include: include,
            order: [
                [`${sortBy}`, `${order}`],
                [{ model: UserRole, as: "user_roles" }, "role", "ASC"]
            ],
            attributes: ["name", "udomain", "role", "email", "position", "biro", "last_login"]
        });

        const totalRows = Object.keys(result).length;
        const totalPage = Math.ceil(totalRows / limit);

        const lastIndex = (page + 1) * limit;
        const firstIndex = lastIndex - limit;
        result = result.slice(firstIndex, lastIndex);

        res.json({
            result: result,
            page: page,
            limit: limit,
            totalRows: totalRows,
            totalPage: totalPage
        });


    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


export const getUserById = async (req, res) => {
    try {
        const udomain = req.params.udomain.toLowerCase();

        //mau edit akun user lain
        if (udomain !== req.session.userId) {
            //cek user yang akses, admin atau bukan
            const userCheck = await User.findOne({
                where: {
                    udomain: req.session.userId
                }
            });

            if (userCheck.role !== "Admin") {
                return res.status(400).json({ msg: "Access Forbidden !" });
            }
        }

        const user = await User.findOne({
            where: {
                udomain: udomain
            }, include: [
                { model: UserRole, as: "user_roles" }
            ], order: [
                [{ model: UserRole, as: "user_roles" }, "role", "ASC"]

            ]
        });

        if (!user) {
            return res.status(400).json({ msg: "User not found !" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        let { udomain } = req.body;

        //mau edit akun user lain
        if (udomain !== req.session.userId) {
            //cek user yang akses, admin atau bukan
            const userCheck = await User.findOne({
                where: {
                    udomain: req.session.userId
                }
            });

            if (userCheck.role !== "Admin") {
                return res.status(400).json({ msg: "Access Forbidden !" });
            }
        }

        const user = await User.findOne({
            where: {
                udomain: udomain.toLowerCase()
            }
        });

        if (!user) {
            return res.status(400).json({ msg: "User not found !" });
        }

        let password = "Bcabca01";
        const hashPassword = await bcrypt.hash(password, 10);

        await User.update({
            password: hashPassword,
            ever_reset_password: "false"
        }, {
            where: {
                udomain: udomain
            }
        });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateUserAccount = async (req, res) => {
    let { name, email, position, biro, udomain } = req.body;
    let errors = {};
    const user = await getUserDetail(udomain);
    const me = await getUserDetail(req.session.userId);

    //cek user yang akses, admin atau bukan
    //mau edit akun user lain
    if (me.role !== "Admin" && udomain !== req.session.userId) {
        return res.status(403).json({ msg: "Access Forbidden !" });
    }

    if (!user) {
        errors.udomain = "Udomain not found !";
    }


    const regex_contain_number = /[0-9]+/;
    if (!name) {
        errors.name = "Name must be filled in !";
    } else if (regex_contain_number.test(name)) {
        errors.name = "Name must not contain number !";
    }

    const regex_email = /(.)*@bca.co.id$/i;

    if (!email || email == "") { email = null; }
    else if (email && !regex_email.test(email)) {
        errors.email = "Email must be ended with \"@bca.co.id\" !";
    }

    if (position && regex_contain_number.test(position)) {
        errors.position = "Position must not contain number !";
    }

    if (!biro) {
        errors.biro = "Biro must be filled in !";
    } 

    if (Object.keys(errors).length != 0) {
        return res.status(404).json(errors);
    }


    try {
        await User.update({
            name: name,
            email: email,
            position: position,
            biro: biro
        }, {
            where: {
                udomain: udomain
            }
        });
        res.status(200).json({ msg: "User Updated" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const changePassword = async (req, res) => {
    const { currentPassword, newPassword, confPassword } = req.body;
    if (!currentPassword) return res.status(404).json({ msg: "Current Password must be filled in !" });
    if (!newPassword) return res.status(404).json({ msg: "New Password must be filled in !" });
    if (!confPassword) return res.status(404).json({ msg: "Confirm Password must be filled in !" });
    if (newPassword.length < 6) return res.status(404).json({ msg: "New Password at least minimum 6 characters !" });

    if (newPassword !== confPassword) return res.status(404).json({ msg: "New Password doesn't match !" });

    const user = await User.findOne({
        where: {
            udomain: req.session.userId
        }
    });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(400).json({ msg: "Current password is incorrect !" });

    try {
        const hashPassword = await bcrypt.hash(newPassword, 10);
        await User.update({
            password: hashPassword,
            ever_reset_password: true
        }, {
            where: {
                udomain: req.session.userId
            }
        });
        res.status(200).json({ msg: "Change Password Successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const deleteUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            udomain: req.params.udomain.toLowerCase()
        }
    });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
    try {
        await User.destroy({
            where: {
                udomain: user.udomain
            }
        });
        res.status(200).json({ msg: "User Deleted" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
