import Sponsor from "../models/sponsor.js";
import Tag from "../models/tag.js";
import TargetParticipant from "../models/target_participant.js";
import User from "../models/user.js";
import { Op } from "sequelize";

export const getAllSponsors = async (req, res) => {
  const { search = '', sort = 'name', order = 'asc' } = req.query;

  try {
    const sponsors = await Sponsor.findAll({
      where: {
        status: "Approved"
      },
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
      profile_photo: sponsor.user_sponsors?.profile_photo,
      is_available: sponsor.is_available
    }));

    res.json(result);
  } catch (error) {
    console.error("Error in getAllSponsors:", error);
    res.status(500).json({ message: "Gagal mengambil data sponsor", error });
  }
};

function isUUID(str) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export const getSponsorById = async (req, res) => {
  const { id } = req.params;
  let where;
  console.log(isUUID(id))
  if(isUUID(id)){
    where = {
      sponsor_id: id
    }
  } else{
    where = {
      username: id
    }
  }
  console.log(where)

  try {
    const sponsor = await Sponsor.findOne({
      where: where,
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
        {
          model: User,
          as: "user_sponsors",
          required: false,
          attributes: ["name", "email", "profile_photo", "is_banned", "background_photo"],
          duplicating: false
        },
      ],
    });

    if (!sponsor) {
      return res.status(404).json({ message: "Sponsor tidak ditemukan" });
    }

    const result = {
      sponsor_id: sponsor.sponsor_id,
      username: sponsor.username,
      name: sponsor.user_sponsors?.name || null,
      email: sponsor.user_sponsors?.email || null,
      profile_photo: sponsor.user_sponsors?.profile_photo,
      nib: sponsor.nib,
      is_available: sponsor.is_available,
      status: sponsor.status,
      category_provides: sponsor.category_provides,
      tags_sponsors: sponsor.tags_sponsors,
      target_sponsors: sponsor.target_sponsors,
      background_photo: sponsor.user_sponsors?.background_photo || null
    };
    console.log(result)

    res.json(result);
  } catch (error) {
    console.error("Error in getSponsorById:", error);
    res.status(500).json({ message: "Gagal mengambil data sponsor", error });
  }
};

export const getPendingSponsors = async (req, res) => {
  try {
    const pendingSponsors = await Sponsor.findAll({
      where: {
        status: "Requested"
      },
      include: {
        model: User,
        as: "user_sponsors"
      }
    });

    res.status(200).json(pendingSponsors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching pending sponsors" });
  }
};

export const approveSponsor = async (req, res) => {
  const { username } = req.params;

  try {
    const sponsor = await Sponsor.findOne({ where: { username } });

    if (!sponsor) {
      return res.status(404).json({ message: "Sponsor not found" });
    }

    sponsor.status = "Approved";
    await sponsor.save();

    const user = await User.findOne({ where: { username } });
    if (user) {
      user.last_login = new Date();
      await user.save();
    }

    res.status(200).json({ message: "Sponsor approved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error approving sponsor" });
  }
};

export const rejectSponsor = async (req, res) => {
  const { username } = req.params;

  try {
    const sponsor = await Sponsor.findOne({ where: { username } });

    if (!sponsor) {
      return res.status(404).json({ message: "Sponsor Not Found" });
    }

    sponsor.status = "Rejected";
    await sponsor.save();

    res.status(200).json({ message: "Sponsor Rejected Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error Rejecting Sponsor" });
  }
};
