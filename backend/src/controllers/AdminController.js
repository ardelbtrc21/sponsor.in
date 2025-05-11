import Sponsor from "../models/sponsor.js";
import User from "../models/user.js";

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
      return res.status(404).json({ message: "Sponsor not found" });
    }

    sponsor.status = "rejected";
    await sponsor.save();

    res.status(200).json({ message: "Sponsor rejected successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error rejecting sponsor" });
  }
};
