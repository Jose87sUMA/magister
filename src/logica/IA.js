"use strict";
const Groq = require("groq-sdk");
const groq = new Groq({
    apiKey:"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"
});

async function main() {
    const chatCompletion = await getGroqChatCompletion();
    console.log(chatCompletion.choices[0]?.message?.content || "No content returned");
}

async function getGroqChatCompletion() {
    groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: "dime algo gracioso"
            }
        ],
        model: "llama3-70b-8192"
    });
    return chatCompletion.choices[0]?.message?.content || "No content returned"
}


module.exports = {
    main,
    getGroqChatCompletion
};

