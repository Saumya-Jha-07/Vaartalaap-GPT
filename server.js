import "dotenv/config"
import Groq from 'groq-sdk'
import { tavily } from "@tavily/core"

const groq = new Groq({apiKey : process.env.GROQ_API_KEY})
// const tvly = new tavily({apiKey : process.env.TAVILY_API_KEY})

async function llm(userQuery) {
    const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: userQuery,
      },
    ],
  });
  return completion.choices[0]?.message?.content;
};


module.exports = {llm}