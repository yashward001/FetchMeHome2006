const express = require("express");
const axios = require("axios");
const ollamaChat = require("../Controller/PersonalityController");
const router = express.Router();

// API Endpoint for Pet Personality Quiz
router.post("/personality", async (req, res) => {
    try {
        const quizAnswers = req.body.answers;

        if (!quizAnswers || typeof quizAnswers !== "object") {
            return res.status(400).json({ error: "Invalid input format." });
        }

        console.log("Received Quiz Answers:", quizAnswers);

        const personalityType = await ollamaChat.determinePersonality(quizAnswers);

        res.json({ personality: personalityType });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Failed to generate personality" });
    }
});

router.get("/suggest-breeds", async (req, res) => {
    const traits = req.query.traits;
    if (!traits) return res.status(400).json({ error: "Traits required" });

    const userTraits = traits.split(",").map(t => t.trim().toLowerCase());

    try {
        const dogResponse = await axios.get("https://api.thedogapi.com/v1/breeds", {
            headers: { "x-api-key": process.env.DOG_API_KEY }
        });

        const dogBreeds = dogResponse.data.map(breed => {
            const temperamentList = (breed.temperament || "").toLowerCase().split(",").map(t => t.trim());
            const matchScore = userTraits.filter(trait =>
                temperamentList.some(temp => temp.includes(trait))
            ).length;
            return { ...breed, matchScore, species: "Dog" };
        });

        const catResponse = await axios.get("https://api.thecatapi.com/v1/breeds", {
            headers: { "x-api-key": process.env.CAT_API_KEY }
        });

        const catBreeds = catResponse.data.map(breed => {
            const temperamentList = (breed.temperament || "").toLowerCase().split(",").map(t => t.trim());
            const matchScore = userTraits.filter(trait =>
                temperamentList.some(temp => temp.includes(trait))
            ).length;
            return { ...breed, matchScore, species: "Cat" };
        });

        res.json({
            dogs: dogBreeds
                .filter(b => b.matchScore > 0)
                .sort((a, b) => b.matchScore - a.matchScore)
                .slice(0, 5),
            cats: catBreeds
                .filter(b => b.matchScore > 0)
                .sort((a, b) => b.matchScore - a.matchScore)
                .slice(0, 5)
        });
    } catch (error) {
        console.error("Suggest breed error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch breeds" });
    }
});


module.exports = router;
