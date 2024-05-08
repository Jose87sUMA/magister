    const express = require('express');
    const app = express();
    app.use(express.json());

    "use strict";
    const Groq = require("groq-sdk");
    const groq = new Groq({
        apiKey:"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"
    });


    app.post('/api/generate-course', (req, res) => {

        const {topic, experience, intensity} = req.body;
        
        const prompt = generateCoursePrompt(topic,experience,intensity);
        
        const generatedCourse = getGroqChatCompletion(prompt);

        console.log(generatedCourse);
    });


    async function getGroqChatCompletion(prompt) {
        groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama3-70b-8192"
        });
        return chatCompletion.choices[0]?.message?.content || "ERROR: content returned"
    }




    // El servidor escucha en el puerto 4444
    app.listen(4444, () => {
        console.log('Servidor corriendo en http://localhost:4444');
    });


    const generateCoursePrompt = (topic, experience, intensity) => {
        return `Generate course on ${topic} for ${experience} users with ${intensity} intensity. The result must have the following format of a json:
        {
          "title": "Course Title",
          "description": "Course Description", //synopsis of the course
          "completionPercentage": 0, //initial value
          "stages": [
            {
              "id": 1, //unique identifier from 1 to n stages
              "title": "Stage Title", // title of the topic
              "description": "Stage Description", //synopsis of the topic
              "content": "", //full content of the stage. must be extensive text with all the content the user needs to know at their level on the topic. it must be adequate to the experience and intensity, also must have coherence with the other stages. after reading what you write on this section the user must be able to understand the topic. write the full content, dont skip anything on this section, be as extensive as needed.
              "completed": false, //initial value
              "testScore": 0, //initial value
              "questions": /*array of questions related to the content of the stage*/ [
                {
                  "question": "Question", //question related to the content of the stage
                  "answers": ["Answer 1", "Answer 2", "Answer 3", "Answer 4"], //array of possible answers, only one correct
                  "correctAnswer": 0, //index of the correct answer
                },
                // define around 5 - 10 questions per stage that are not too easy or too difficult and not too similar to each other
              ],
            }
            // define around 5 stages that are sequential and coherent with the topic
          ]
        }`;
      };