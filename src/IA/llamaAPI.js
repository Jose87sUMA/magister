//const express = require('express');
//const bodyParser = require('body-parser');
//const fs = require('fs');
//const Groq = require("groq-sdk");
import Groq from "groq-sdk";



/**
 * Initialize Groq SDK with API key and browser settings
 */
const groq = new Groq({
    apiKey: "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",
    dangerouslyAllowBrowser: true
});


// /**
//  * POST endpoint for generating a course
//  * @param {Object} req - The request object
//  * @param {Object} res - The response object
//  */
// app.post('/generar-curso', async (req, res) => {
//     const { topic, experience, intensity } = req.body;
//     if (!topic || !experience || !intensity) {
//         return res.status(400).send('Missing parameters: topic, experience, and intensity are required.');
//     }

//     try {
//         const newCourse = await generateCourse(topic, experience, intensity);
//         return res.status(200).send(newCourse)
//     } catch (error) {
//         console.error('Error generating course:', error);
//         res.status(500).send('Error generating course');
//     }
// });'


const schema = {
    title: "Curso de Desarrollo de JavaScript para Principiantes",
    type: "object",
    properties: {
      id: {
        type: "integer"
      },
      visible: {
        type: "boolean"
      },
      title: {
        type: "string"
      },
      description: {
        type: "string"
      },
      completionPercentage: {
        type: "integer"
      },
      isPublic: {
        type: "boolean",
        default: false
      },
      stages: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "integer"
            },
            title: {
              type: "string"
            },
            description: {
              type: "string"
            },
            content: {
              type: "string"
            },
            completed: {
              type: "boolean",
            },
            testScore: {
              type: "integer"
            },
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: {
                    type: "string"
                  },
                  answers: {
                    type: "array",
                    items: {
                      type: "string"
                    }
                  },
                  correctAnswer: {
                    type: "integer"
                  }
                },
                required: ["question", "answers", "correctAnswer"]
              }
            }
          },
          required: ["id", "title", "description", "content", "completed", "testScore", "questions"]
        }
      }
    },
    required: ["id", "visible", "title", "description", "completionPercentage", "isPublic", "stages"]
  }
  
/**
 * Function to generate a course
 * @param {string} topic - The topic of the course
 * @param {string} experience - The experience level of the course
 * @param {string} intensity - The intensity of the course
 * @returns {Promise<string>} The generated course
 */
const generateCourse = async (topic, experience, intensity) => {
    const prompt = generateCoursePrompt(topic, experience, intensity);
    const chatCompletion = await getGroqChatCompletion(prompt);
    const json = JSON.parse(chatCompletion.replace('`', ''));
    json.isPublic = false;
    return JSON.stringify(json, null, 4);
};

/**
 * Function to get chat completion from Groq
 * @param {string} prompt - The prompt for the chat
 * @returns {Promise<string>} The chat completion
 */
const getGroqChatCompletion = async (prompt) => {
    const jsonSchema = JSON.stringify(schema,null,4);
    const chatCompletion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `You are a course creator. \n'The JSON object of the course you create must use the schema: ${jsonSchema}. Make the course have 5 stages, each stage with 5 questions about the content. The amount of characters on the "content" of each stage must be as large as possible and not a synopsis or summary of the stage. Do not generate anything outside the schema`
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "model": "llama3-70b-8192",
        "temperature": 1,
        "max_tokens": 50000,
        "top_p": 1,
        "stream": false,
        "stop": null,
        response_format: {
            type: "json_object"
        }
    });

    return chatCompletion.choices[0].message.content;
};

const generateCoursePrompt = (topic, experience, intensity) => {
    return `Generate course on ${topic} for ${experience} users with ${intensity} intensity. You must reply with the specified format`;
};

export { generateCourse };
