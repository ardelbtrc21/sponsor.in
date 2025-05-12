/* eslint-disable no-unused-vars */
import Sponsor from "../models/sponsor.js";
import Sponsoree from "../models/sponsoree.js";
import User from "../models/user.js";
import Report from "../models/report.js";
import bcrypt from "bcryptjs";
import sequelize, { Op, where } from "sequelize";
import path from "path";
import { unlink } from 'node:fs';
import { fileURLToPath } from 'url';
import fs from 'fs';
import SponsorshipPhotos from "../models/sponsorship_photos.js";
import Tag from "../models/tag.js";
import TargetParticipant from "../models/target_participant.js";
import SponsorTag from "../models/sponsor_tag.js";
import SponsorTargetParticipant from "../models/sponsor_target_participant.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        res.status(500).json({ msg: error.message });
    }
};

export const createUser = async (req, res) => {
    let { username, name, email, password, confirmPassword, role, category, nib } = req.body;
    let document = req.files?.document || null;

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
        const numberOnly = /^\d+$/;
        if (!username || username == "") errors.username = "Username must be filled in!";
        if (username && username != "" && username.length < 5) errors.username = "Username at least minimum 5 characters!";
        //cek jika user sudah terdaftar atau belum
        const user = await User.findOne({
            where: {
                username: username.toLowerCase()
            }
        });
        const email_found = await User.findOne({
            where: {
                email: email.toLowerCase()
            }
        });
        if (user) errors.username = "Username is already registered";
        if (!name || name == "") errors.name = "Name must be filled in!";
        if (name && name != "" && name.length < 3) errors.name = "Name at least minimum 3 characters!";
        if (!email || email == "") errors.email = "Email must be filled in!";
        if (email_found) errors.email = "Email already registered!";
        if (email && emailRegex.test(email) == false) errors.email = "Email is invalid!";
        if (!password || password == "") errors.password = "Password must be filled in!";
        if (password && !confirmPassword || confirmPassword == "") errors.confirmPassword = "Confirmation Password must be filled in!";
        if (password && !passwordRegexUpperCase.test(password)) errors.password = "Password must contain at least one uppercase letter!";
        if (password && !passwordRegexLowerCase.test(password)) errors.password = "Password must contain at least one lowercase letter!";
        if (password && !passwordRegexDigit.test(password)) errors.password = "Password must contain at least one number!";
        if (password && !passwordRegexSpecialChar.test(password)) errors.password = "Password must contain at least one special character!";
        if (password && password.length < 8) errors.password = "Password at least minimum 8 characters!";
        if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match"
        if (!role || role == "") errors.role = "Role must be filled in!";
        if (role == "Sponsoree" && !category && category == "") errors.category = "Category must be filled in!"
        if (role == "Sponsor" && !nib && nib == "") {
            errors.nib = "NIB must be filled in!"
            if (!numberOnly.test(nib)) {
                errors.nib = "NIB only contains number!"
            } else if (nib.length != 13) {
                errors.nib = "NIB invalid!"
            }
        }
        if (role == "Sponsor" && !document) errors.document = "Please submit NIB document!"

        let uploadPath = ""
        let fileName = ""
        if (role == "Sponsor" && document !== null) {
            const ext = path.extname(String(document.name)).toLowerCase();
            if (ext != ".pdf") {
                errors.files = `File of ${document.name} file must be in PDF extension.`;
            }
            const fileSize = document.data.length;
            if (fileSize > 10000000) {
                errors.files = `File of ${document.name} must be less than 10 MB.`;
            }
            fileName = username + "_" + String(document.name);
            uploadPath = path.join(__dirname, "..", "..", "data", "nib", fileName);
        }

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
        if (role === "Sponsor") {
            document.mv(uploadPath, async (err) => {
                if (err) {
                    return res.status(500).json({ msg: "File upload failed", error: err });
                }

                try {
                    await Sponsor.create({
                        username: username,
                        nib: nib,
                        document: fileName
                    });
                    return res.status(201).json({ msg: "Account created successfully" });
                } catch (error) {
                    return res.status(400).json({ msg: error.message });
                }
            });
        }
        if (role === "Sponsoree") {
            try {
                await Sponsoree.create({
                    username: username,
                    category: category
                })
                return res.status(201).json({ msg: "Account created successfully" });
            } catch (error) {
                res.status(400).json({ msg: error.message });
            }
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
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
        console.log("req sini: " + req.params.username)
        const username = req.params.username.toLowerCase();
        let user = await User.findOne({
            where: {
                username: username
            }, include: [
                {
                    model: Sponsor,
                    as: "user_sponsors",
                    required: false,
                    duplicating: false,
                    include: [
                        {
                            model: Tag,
                            as: "tags_sponsors",
                            required: false,
                            attributes: ["tag_name"],
                            duplicating: false
                        },
                        {
                            model: TargetParticipant,
                            as: "target_sponsors",
                            required: false,
                            attributes: ["target_participant_category"],
                            duplicating: false
                        },
                    ]
                },
                {
                    model: Sponsoree,
                    as: "user_sponsorees",
                    required: false,
                    duplicating: false
                },
                {
                    model: SponsorshipPhotos,
                    as: "photo_sponsorship_users",
                    required: false,
                    duplicating: false
                }
            ],
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            return res.status(400).json({ msg: "User not found !" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateUserAccount = async (req, res) => {
    try {
        const { username, email, password, confirmPassword, availability } = req.body;
        const photo = req.files?.photo || null;

        let errors = {};

        if (!username) {
            return res.status(403).json({ msg: "Access Forbidden!" });
        }

        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ msg: "User not found!" });
        }

        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errors.email = "Email is invalid!";
            }
        }

        if (password) {
            const passwordRegexUpperCase = /^(?=.*?[A-Z])/;
            const passwordRegexLowerCase = /(?=.*?[a-z])/;
            const passwordRegexDigit = /(?=.*?[0-9])/;
            const passwordRegexSpecialChar = /(?=.*?[^A-Za-z0-9])/;

            if (!confirmPassword) errors.confirmPassword = "Confirmation Password must be filled in!";
            if (!passwordRegexUpperCase.test(password)) errors.password = "Password must contain at least one uppercase letter!";
            if (!passwordRegexLowerCase.test(password)) errors.password = "Password must contain at least one lowercase letter!";
            if (!passwordRegexDigit.test(password)) errors.password = "Password must contain at least one number!";
            if (!passwordRegexSpecialChar.test(password)) errors.password = "Password must contain at least one special character!";
            if (password.length < 8) errors.password = "Password at least minimum 8 characters!";
            if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";
        }

        if (Object.keys(errors).length !== 0) {
            return res.status(404).json(errors);
        }

        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);
        if (photo) {
            const ext = path.extname(String(photo.name)).toLowerCase();
            const allowedExt = [".jpg", ".jpeg", ".png"];
            if (!allowedExt.includes(ext)) {
                return res.status(404).json({ photo: "Invalid photo extension. Only jpg, jpeg, png allowed." });
            }
            const photoSize = photo.data.length;
            if (photoSize > 5 * 1024 * 1024) {
                return res.status(404).json({ photo: "Photo must be less than 5 MB." });
            }
            const photoName = `${username}_profile${ext}`;
            const photoPath = path.join(__dirname, "..", "..", "data", "profile_photo", photoName);
            photo.mv(photoPath, async (err) => {
                if (err) {
                    return res.status(500).json({ msg: "Photo upload failed", error: err });
                }
                user.profile_photo = photoName;
                await user.save();
            });
        } else {
            await user.save();
        }

        if (user.role === "Sponsor" && availability !== undefined) {
            await Sponsor.update({ availability }, { where: { username } });
        }

        res.status(200).json({ msg: "Account updated successfully" });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const editProfile = async (req, res) => {
    try {
        const { username } = req.body;
        const {
            is_available,
            category_provides,
            description,
            tags,
            targets,
            name,
            category
        } = req.body;
        console.log("disini", category)

        const removedPhotos = JSON.parse(req.body.removed_photos || '[]');
        console.log(req.body)
        removedPhotos.forEach(async (item) => {
            await SponsorshipPhotos.destroy({
                where: { photo: item }
            });
            fs.unlinkSync(path.join(__dirname, "..", "..", "data", "sponsorship_photo", item));
        });

        const backgroundPhoto = req.files?.background_photo || null;
        const sponsorshipPhotos = req.files?.sponsorship_photos || null;
        const user = await User.findOne({ where: { username } });

        if (user.role === "Sponsor") {
            const sponsor = await Sponsor.findOne({ where: { username } });

            if (!sponsor || !user) {
                return res.status(404).json({ msg: "Sponsor not found!" });
            }

            // Update sponsor fields
            if (is_available !== undefined) sponsor.is_available = is_available;
            if (category_provides !== undefined) sponsor.category_provides = category_provides;
            if (description !== undefined) sponsor.description = description;

            // Update background photo
            if (backgroundPhoto) {
                const ext = path.extname(backgroundPhoto.name).toLowerCase();
                const allowedExt = [".jpg", ".jpeg", ".png"];
                if (!allowedExt.includes(ext)) {
                    return res.status(400).json({ background_photo: "Invalid file extension." });
                }
                if (backgroundPhoto.data.length > 5 * 1024 * 1024) {
                    return res.status(400).json({ background_photo: "Max size 5MB." });
                }

                const filename = `${username}_background${ext}`;
                const filepath = path.join(__dirname, "..", "..", "data", "background_photo", filename);

                backgroundPhoto.mv(filepath, async (err) => {
                    if (err) return res.status(500).json({ msg: "Background upload failed", error: err });
                });

                user.background_photo = filename;
            }

            // Update tags
            if (tags) {
                await SponsorTag.destroy({ where: { sponsor_id: sponsor.sponsor_id } });
                const parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags);
                for (const tag of parsedTags) {
                    const response = await Tag.findOne({
                        where: {
                            tag_name: tag.tag_name,
                        },
                        attributes: ["tag_id"]
                    })
                    await SponsorTag.create({
                        sponsor_id: sponsor.sponsor_id,
                        tag_id: response.dataValues.tag_id
                    });
                }
            }

            // Update target participants
            if (targets) {
                await SponsorTargetParticipant.destroy({ where: { sponsor_id: sponsor.sponsor_id } });
                const parsedTargets = Array.isArray(targets) ? targets : JSON.parse(targets);
                for (const target of parsedTargets) {
                    console.log(target)
                    const response = await TargetParticipant.findOne({
                        where: {
                            target_participant_category: target.target_participant_category,
                        },
                        attributes: ["target_participant_id"]
                    })
                    await SponsorTargetParticipant.create({
                        sponsor_id: sponsor.sponsor_id,
                        target_participant_id: response.dataValues.target_participant_id
                    });
                }
            }

            // Upload multiple sponsorship photos
            if (sponsorshipPhotos) {
                const files = Array.isArray(sponsorshipPhotos) ? sponsorshipPhotos : [sponsorshipPhotos];

                for (const file of files) {
                    const ext = path.extname(file.name).toLowerCase();
                    const allowedExt = [".jpg", ".jpeg", ".png"];
                    if (!allowedExt.includes(ext)) {
                        return res.status(400).json({ sponsorship_photos: "Invalid photo extension" });
                    }
                    if (file.data.length > 5 * 1024 * 1024) {
                        return res.status(400).json({ sponsorship_photos: "Each photo max 5MB" });
                    }

                    const photoName = `${username}_${Date.now()}${ext}`;
                    const photoPath = path.join(__dirname, "..", "..", "data", "sponsorship_photo", photoName);
                    file.mv(photoPath, async (err) => {
                        if (err) {
                            return res.status(500).json({ msg: "Photo upload failed", error: err });
                        }
                    });

                    await SponsorshipPhotos.create({
                        username,
                        photo: photoName
                    });
                }
            }
            if (name !== undefined) user.name = name;

            await user.save();
            await sponsor.save();

            return res.status(200).json({ msg: "Sponsor profile updated successfully." });
        } else if (user.role === "Sponsoree") {
            const sponsoree = await Sponsoree.findOne({ where: { username } });

            if (!sponsoree || !user) {
                return res.status(404).json({ msg: "Sponsoree not found!" });
            }
            sponsoree.category = category
            // Update background photo
            if (backgroundPhoto) {
                const ext = path.extname(backgroundPhoto.name).toLowerCase();
                const allowedExt = [".jpg", ".jpeg", ".png"];
                if (!allowedExt.includes(ext)) {
                    return res.status(400).json({ background_photo: "Invalid file extension." });
                }
                if (backgroundPhoto.data.length > 5 * 1024 * 1024) {
                    return res.status(400).json({ background_photo: "Max size 5MB." });
                }

                const filename = `${username}_background${ext}`;
                const filepath = path.join(__dirname, "..", "..", "data", "background_photo", filename);

                backgroundPhoto.mv(filepath, async (err) => {
                    if (err) return res.status(500).json({ msg: "Background upload failed", error: err });
                });

                user.background_photo = filename;
            }

            // Upload multiple sponsorship photos
            if (sponsorshipPhotos) {
                const files = Array.isArray(sponsorshipPhotos) ? sponsorshipPhotos : [sponsorshipPhotos];

                for (const file of files) {
                    const ext = path.extname(file.name).toLowerCase();
                    const allowedExt = [".jpg", ".jpeg", ".png"];
                    if (!allowedExt.includes(ext)) {
                        return res.status(400).json({ sponsorship_photos: "Invalid photo extension" });
                    }
                    if (file.data.length > 5 * 1024 * 1024) {
                        return res.status(400).json({ sponsorship_photos: "Each photo max 5MB" });
                    }

                    const photoName = `${username}_${Date.now()}${ext}`;
                    const photoPath = path.join(__dirname, "..", "..", "data", "sponsorship_photo", photoName);
                    file.mv(photoPath, async (err) => {
                        if (err) {
                            return res.status(500).json({ msg: "Photo upload failed", error: err });
                        }
                    });

                    await SponsorshipPhotos.create({
                        username,
                        photo: photoName
                    });
                }
            }
            if (name !== undefined) user.name = name;

            await user.save();
            await sponsoree.save();

            return res.status(200).json({ msg: "Sponsoree profile updated successfully." });
        }

    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

export const changePassword = async (req, res) => {
    const { currentPassword, newPassword, } = req.body;
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

export const banAccount = async (req, res) => {
    try {
        const username = req.body.username;
        const report_id = req.body.report_id;
        const user = await User.findOne({
            where: {
                username: username
            }
        });
        if (!user) return res.status(404).json({ msg: "User Not Found" });
        if (user) {
            await Report.update({
                status: "approved"
            }, {
                where: {
                    report_id: report_id
                }
            })
            await User.update({
                is_banned: true
            }, {
                where: {
                    username: username
                }
            });
            res.status(200).json({ msg: "User Successfully Banned!" });
        }
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}
