import TargetParticipant from "../models/target_participant.js";

export const createTargetsRecord = async () => {
    const datas = [
        "Students (Junior High / High School)",
        "University Students",
        "Fresh Graduate",
        "Employees",
        "Professionals",
        "Entrepreneurs / Business Owners",
        "Startup Founder",
        "Freelancer",
        "Influencer / Content Creator",
        "Marketer",
        "Salesperson",
        "Researcher",
        "Developer / Programmer",
        "Designer",
        "Artists / Musicians",
        "Athletes / Sports Enthusiasts",
        "Art Enthusiasts",
        "Music Lovers",
        "Travelers",
        "Photographers",
        "Food Enthusiasts",
        "Gamers",
        "Book Lovers",
        "Knowledge Seekers",
        "Inspiration Seekers",
        "Networkers",
        "Job Seekers",
        "Investors",
        "Recruiters",
        "Volunteers",
        "Social Activists",
        "Community Builders",
        "Parents",
        "Families",
        "People with Disabilities",
        "Environmental Enthusiasts",
        "Tech Enthusiasts",
        "Creative Industry Professionals",
        "Tech Industry Professionals",
        "Healthcare Industry Professionals",
        "Education Sector Professionals",
        "Finance Sector Professionals",
        "Tourism Industry Professionals",
        "Food and Beverage Industry Professionals"
    ]

    try {
        for (const data of datas) {
            await TargetParticipant.create({
                target_participant_category: data
            });
        }
        console.log("Create Targets Participants Berhasil!")
    } catch (error) {
        console.log(error);
    }
};

export const getAllTargets = async (req, res) => {
    try {
        let result = await TargetParticipant.findAll({
            order: [['target_participant_category', 'ASC']]
        })
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}