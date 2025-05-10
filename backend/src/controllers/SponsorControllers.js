import Sponsor from "../models/sponsor.js";
import User from "../models/user.js";
import { Op } from "sequelize";

export const getAllSponsors = async (req, res) => {
  const { search = '', sort = 'name', order = 'asc' } = req.query;

  try {
    const sponsors = await Sponsor.findAll({
      include: {
        model: User,
        as: "user_sponsors",
        attributes: ["name", "profile_photo"],
        where: search
          ? { name: { [Op.iLike]: `%${search}%` } }
          : undefined,
      },
      order: [
        [{ model: User, as: "user_sponsors" }, sort, order.toUpperCase()]
      ],
    });

    const result = sponsors.map(sponsor => ({
      sponsor_id: sponsor.sponsor_id,
      username: sponsor.username,
      name: sponsor.user_sponsors?.name || null,
      nib: sponsor.nib,
      profile_photo: sponsor.user_sponsors?.profile_photo
    }));

    res.json(result);
  } catch (error) {
    console.error("Error in getAllSponsors:", error);
    res.status(500).json({ message: "Gagal mengambil data sponsor", error });
  }
};

export const getSponsorById = async (req, res) => {
  const { id } = req.params; 

  try {
    const sponsor = await Sponsor.findOne({
      where: { username: id },  
      include: {
        model: User,
        as: "user_sponsors",
        attributes: ["name", "profile_photo"], 
      },
    });

    if (!sponsor) {
      return res.status(404).json({ message: "Sponsor tidak ditemukan" });
    }

    const result = {
      sponsor_id: sponsor.sponsor_id,
      username: sponsor.username,
      name: sponsor.user_sponsors?.name || null,
      profile_photo: sponsor.user_sponsors?.profile_photo,
      nib: sponsor.nib,
      status: sponsor.status
    };

    res.json(result);
  } catch (error) {
    console.error("Error in getSponsorById:", error);
    res.status(500).json({ message: "Gagal mengambil data sponsor", error });
  }
};