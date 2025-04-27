import Tag from "../models/tag.js";

export const createTagsRecord = async () => {
    const datas = [
        "Health",
        "Mental Health",
        "Lifestyle",
        "Sport",
        "Beauty",
        "Fashion",
        "E-Sports",
        "Art",
        "Painting",
        "Visual Arts",
        "Dance",
        "Theater",
        "Photography",
        "Film",
        "Literature",
        "Cultural Festival",
        "Music",
        "Concert",
        "Education",
        "Soft Skills",
        "Technology",
        "Programming",
        "Artificial Intelligence",
        "Fintech",
        "Business",
        "Entrepreneurship",
        "Community",
        "Volunteering",
        "Social",
        "Activism",
        "Environment",
        "Food",
        "Culinary",
        "Cooking",
        "Coffee",
        "Baking",
        "Travel",
        "Adventure",
        "Family",
        "Spiritual",
        "Religious",
        "Entertainment",
        "Party",
        "Festival",
        "Comedy",
        "Politics",
        "Debate",
        "Civic",
        "Law",
        "Sustainability",
        "Climate",
        "Green Tech"
    ]
    try {
        for (const data of datas) {
            await Tag.create({
                tag_name: data
            });
        }
        console.log("Create Tags Berhasil!")
    } catch (error) {
        console.log(error);
    }
};

export const getAllTags = async (req, res) => {
    try {
        let result = await Tag.findAll({
            order: [['tag_name', 'ASC']]
        })
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}