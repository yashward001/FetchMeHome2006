const axios = require("axios");

class OllamaChat {
    constructor(modelName) {
        this.modelName = modelName;
        this.OLLAMA_API_URL = "http://127.0.0.1:11434/api/generate"; // Ollama API endpoint
    }

    async ask(prompt) {
        try {
            const response = await axios.post(this.OLLAMA_API_URL, {
                model: this.modelName,
                prompt: prompt,
                stream: false  //  Ensure full response, not streamed
            });

            console.log("🔹 Full Ollama Response:", response.data);  //  Log full response

            if (!response.data || !response.data.response) {
                console.error(" Invalid response format from Ollama:", response.data);
                return "Error fetching response from AI.";
            }

            return response.data.response.trim();
        } catch (error) {
            console.error("Error communicating with Ollama API:", error);
            return "Error fetching response from AI.";
        }
    }

    async determinePersonality(quizAnswers) {
        const formattedAnswers = Object.entries(quizAnswers)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n");

        const prompt = `
            I am conducting a pet personality quiz. Based on the user's responses below, 
            determine their personality type by selecting **exactly three words** that describe them best.  
            **DO NOT** include explanations. **Only return the three words.**
            
            User's Answers:
            ${formattedAnswers}
            
            Example Responses:  
            - **Energetic, Extroverted, Devoted**  
            - **Calm, Independent, Practical**  
            - **Adventurous, Playful, Charismatic**  
            - **Compassionate, Reserved, Loyal**  
            - **Efficient, Logical, Minimalist**  
            - **Productive, Adaptable, Responsible**  

            Respond only with three words, separated by commas. **Example Output: "Energetic, Playful, Social"**
        `;

        let personalityType = await this.ask(prompt);

        console.log("Raw Personality Response:", personalityType);  

        //  Ensure the response is valid
        if (!personalityType || !personalityType.includes(",")) {
            console.error("Invalid response from Ollama:", personalityType);
            return "Unknown, Please, Retry";
        }

        //  Extract only three words
        let words = personalityType.split(",").map(word => word.trim());
        
        if (words.length < 3) {
            console.error("Less than 3 words returned:", words);
            return "Unknown, Please, Retry";
        }

        return words.slice(0, 3).join(", ");  //  Ensure exactly 3 words
    }
}

const ollamaChat = new OllamaChat("llama3.2");
module.exports = ollamaChat;
    