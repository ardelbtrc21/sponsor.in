/* eslint-disable no-unused-vars */
import Sponsor from "../models/sponsor.js";
import Sponsoree from "../models/sponsoree.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import sequelize, { Op } from "sequelize";
import path from "path";
import { unlink } from 'node:fs';

export const createUserAdmin = async () => {
    const username = "admin";
    const name = "Admin";
    const email = "sponsorin13@gmail.com";
    const password = await bcrypt.hash("adminsponsorin", 10);
    const role = "Admin"
    try {
        await User.create({
            username: username,
            name: name,
            email: email,
            password: password,
            role: role
        });
        console.log("Register Admin Berhasil!")
    } catch (error) {
        console.log(error);
    }
};


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
    let { username, name, email, password, confirmPassword, role, category, nib, document } = req.body;
    console.log(req.body)

    if (!username) {
        username = ""
    }
    if (!name) {
        name = ""
    }
    if (!email) {
        email = ""
    }
    if (!role) {
        role = ""
    }
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
        if (!email || email == "") errors.email = "Email must be filled in!";
        if (emailRegex.test(email) == false) errors.email = "Email is invalid!";
        if (!password || password == "") errors.password = "Password must be filled in!";
        if (!confirmPassword || confirmPassword == "") errors.confirmPassword = "Confirmation Password must be filled in!";
        if (passwordRegexUpperCase.test(password)) errors.password = "Password must contain at least one uppercase letter!";
        if (passwordRegexLowerCase.test(password)) errors.password = "Password must contain at least one lowercase letter!";
        if (passwordRegexDigit.test(password)) errors.password = "Password must contain at least one number!";
        if (passwordRegexSpecialChar.test(password)) errors.password = "Password must contain at least one special character!";
        if (passwordRegexMinLen.test(password)) errors.password = "Password at least minimum 8 characters!";
        if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match"
        if (!role || role == "") errors.role = "Role must be filled in!";
        if (role == "Sponsoree" && !category && category == "") errors.category = "Category must be filled in!"
        if (role == "Sponsor" && !nib && nib == ""){
            errors.nib = "NIB must be filled in!"
            console.log("masuk")
        }
        if (role == "Sponsor" && !document) errors.document = "Please submit NIB document!"

        // if (role == "sponsor"){
        //     for (let i = 1; i <= Object.keys(document).length; i++) {
        if (role == "Sponsor") {
            const file = eval("document.dokumen");
            const ext = path.extname(String(file.name)).toLowerCase();
            if (ext != "pdf") {
                errors.files = `File of ${file.name} file must be in PDF extension.`;
            }
            const fileSize = file.data.length;
            if (fileSize > 10000000) {
                errors.files = `File of ${file.name} must be less than 10 MB.`;
            }
            const fileName = username + "_" + String(file.name);
            const url = `../../data/nib/${fileName}`;
        }
        //     }
        // }

        if (Object.keys(errors).length != 0) {
            return res.status(404).json(errors);
        }

        const hashPassword = await bcrypt.hash(password, 10);
        await User.create({
            username: username.toLowerCase(),
            name: name,
            email: email,
            password: hashPassword,
            role: role
        });

        if (role == "Sponsor") {
            try {
                file.mv(`${url}`, async () => {
                    try {
                        await Sponsor.create({
                            username: username,
                            nib: nib,
                            document: url
                        })
                    } catch (error) {
                        console.log(error.message);
                    }
                });
            } catch (error) {
                console.log(error.message);
            }
        }
        if (role == "Sponsoree") {
            try {
                await Sponsoree.create({
                    username: username,
                    category: category
                })
            } catch (error) {
                console.log(error.message);
            }
        }
        res.status(201).json({ msg: "Register User Berhasil" });
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ msg: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const sortBy = req.query.sortBy || "name";
        const order = req.query.order || "ASC";
        const keyword = req.query.keyword || "";
        const role_req = req.query.role_req | ""

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
                    username: {
                        [Op.iLike]: "%" + keyword + "%"
                    }
                }
            ], [Op.and]: [
                {
                    username: {
                        [Op.not]: req.session.username
                    }
                }, {
                    role: role_req
                }
            ]

        };
        let include;

        if (role_req == "Sponsor") {
            include = [
                {
                    model: Sponsor,
                    as: "user_sponsors",
                    required: true,
                    attributes: ["username", "nib", "document"],
                    duplicating: false
                }
            ];
        }
        if (role_req == "Sponsoree") {
            include = [
                {
                    model: Sponsoree,
                    as: "user_sponsorees",
                    required: true,
                    attributes: ["username", "category"],
                    duplicating: false
                }
            ];
        }
        if (role_req == "") {
            include = [
                {
                    model: Sponsor,
                    as: "user_sponsors",
                    required: true,
                    attributes: ["username", "nib", "document"],
                    duplicating: false
                },
                {
                    model: Sponsoree,
                    as: "user_sponsorees",
                    required: true,
                    attributes: ["username", "category"],
                    duplicating: false
                }
            ];
        }

        let result = await User.findAll({
            where: where,
            include: include,
            order: [
                [`${sortBy}`, `${order}`]
            ],
            attributes: ["username", "name", "email", "role", "profile_photo", "last_login"]
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
        const username = req.params.username.toLowerCase();

        // //mau edit akun user lain
        // if (udomain !== req.session.userId) {
        //     //cek user yang akses, admin atau bukan
        //     const userCheck = await User.findOne({
        //         where: {
        //             udomain: req.session.userId
        //         }
        //     });

        //     if (userCheck.role !== "Admin") {
        //         return res.status(400).json({ msg: "Access Forbidden !" });
        //     }
        // }

        const user = await User.findOne({
            where: {
                username: username
            }, include: [
                {
                    model: Sponsor,
                    as: "user_sponsors",
                    required: true,
                    attributes: ["username", "nib", "document"],
                    duplicating: false
                },
                {
                    model: Sponsoree,
                    as: "user_sponsorees",
                    required: true,
                    attributes: ["username", "category"],
                    duplicating: false
                }
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

// export const resetPassword = async (req, res) => {
//     try {
//         let { udomain } = req.body;

//         //mau edit akun user lain
//         if (udomain !== req.session.userId) {
//             //cek user yang akses, admin atau bukan
//             const userCheck = await User.findOne({
//                 where: {
//                     udomain: req.session.userId
//                 }
//             });

//             if (userCheck.role !== "Admin") {
//                 return res.status(400).json({ msg: "Access Forbidden !" });
//             }
//         }

//         const user = await User.findOne({
//             where: {
//                 udomain: udomain.toLowerCase()
//             }
//         });

//         if (!user) {
//             return res.status(400).json({ msg: "User not found !" });
//         }

//         let password = "Bcabca01";
//         const hashPassword = await bcrypt.hash(password, 10);

//         await User.update({
//             password: hashPassword,
//             ever_reset_password: "false"
//         }, {
//             where: {
//                 udomain: udomain
//             }
//         });

//         res.status(200).json(user);
//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// };

export const updateUserAccount = async (req, res) => {
    let { username, name, email, profile_photo } = req.body;

    try {
        let errors = {};
        const user = await getUserDetail(username);

        //cek user yang akses, admin atau bukan
        //mau edit akun user lain
        if (username !== req.session.username) {
            return res.status(403).json({ msg: "Access Forbidden !" });
        }

        if (!user) {
            errors.username = "Username not found !";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!name || name == "") errors.name = "Name must be filled in!";
        if (name && name != "" && name.length < 3) errors.name = "Name at least minimum 3 characters!";
        if (emailRegex.test(email) == false) errors.email = "Email is invalid!";
        const ext_photo = ["jpg", "jpeg", "png"]
        // if (role == "sponsor"){
        //     for (let i = 1; i <= Object.keys(document).length; i++) {
        const file = eval("profile_photo.photo");
        const ext = path.extname(String(file.name)).toLowerCase();
        if (!ext_photo.includes(ext)) {
            errors.files = `File of ${file.name} file must be in .jpg/.jpeg/.png extension.`;
        }
        const fileSize = file.data.length;
        if (fileSize > 10000000) {
            errors.files = `File of ${file.name} must be less than 10 MB.`;
        }
        const fileName = username + "_" + String(file.name);
        const url = `../../data/photo_profile/${fileName}`;
        //     }
        // }

        if (Object.keys(errors).length != 0) {
            return res.status(404).json(errors);
        }
        unlink(`${user.profile_photo}`, file.mv(`${url}`, async () => {
            try {
                await User.update({
                    name: name,
                    email: email,
                    profile_photo: profile_photo
                });
            } catch (error) {
                console.log(error.message);
            }
        }));
        res.status(201).json({ msg: "Update User Berhasil" });
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
            username: req.session.username
        }
    });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(400).json({ msg: "Current password is incorrect !" });

    try {
        const hashPassword = await bcrypt.hash(newPassword, 10);
        await User.update({
            password: hashPassword
        }, {
            where: {
                username: req.session.username
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
            username: req.session.username
        }
    });
    if (!user) return res.status(404).json({ msg: "User Not Found" });
    try {
        await User.destroy({
            where: {
                username: user.username
            }
        });
        res.status(200).json({ msg: "User Successfully Deleted!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
