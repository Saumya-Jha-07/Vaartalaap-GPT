import "dotenv/config";
import { tavily } from "@tavily/core";
import Groq from "groq-sdk";

const model = "openai/gpt-oss-120b";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = new tavily({ apiKey: process.env.TAVILY_API_KEY });

async function webSearch({ query }) {
  console.log("web search called....");
  const response = await tvly.search(query);
  const textRes = response.results.map((res) => res.content).join("\n\n");
  return textRes;
}

const userQuery = "What is the weather in Mumbai ?"

export async function llm_call(userQuery) {
  
  const messages = [
    {
      role: "system",
      content: `You are a helpful assistant who answers the asked questions in a single line .
        Be concise and relevant. 
        Call the tools as needed according to the job .
        Some tools you have the access to is :- 
          1. webSearch() // for searching the internet/web`,
    },
    {
      role: "user",
      content: userQuery,
    },
  ];

  const res = await groq.chat.completions.create({
    model: model,
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant , whose job is to tell if you can answer the question asked by yourself or do you need an external tool . Give one word answer ,return yes if you need one tool or no otherwise ONLY`,
      },
      {
        role: "user",
        content: userQuery,
      },
    ],
    temperature: 0,
  });

  const toolRequired = res.choices[0].message.content.toLowerCase();

  // user queries to llm and llm returns
  if (toolRequired == "no") {
    const ans = await groq.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant. Answer the questions consisely and be relevant.`,
        },
        {
          role: "user",
          content: userQuery,
        },
      ],
    });
    console.log(ans.choices[0].message.content);
    return;
  }

  while (true) {
    const res2 = await groq.chat.completions.create({
      model: model,
      messages: messages,
      tools: [
        {
          type: "function",
          function: {
            name: "webSearch",
            description:
              "Search the real time latest information available on the internet",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "The search query to perform web search on",
                },
              },
              required: ["query"],
            },
          },
        },
      ],
      tool_choice: "auto",
    });

    const message = res2.choices[0].message;
    messages.push(message); // for maintaining the chat history (ye llm ka tool call wala msg hai)

    const toolCalls = message.tool_calls;

    // extra check isliye lagana pda kyuki llm kai baar structured way m ouput ni deta
    if (!toolCalls) {
      if (message.content[0] != "<") {
        console.log(`Assistant : ${message.content}`);
      } else {
        console.log("LLM structured ni de rha hai kch krna pdega iska ");
      }
      break;
    }

    for (const tool of toolCalls) {
      const functionName = tool.function.name;
      const args = JSON.parse(tool.function.arguments);

      if (functionName === "webSearch") {
        // tool returns the response
        const toolResult = await webSearch(args);

        // object bnega and push krenge chat history ke liye
        const msg = {
          tool_call_id: tool.id,
          role: "tool",
          name: functionName,
          content: toolResult,
        };
        messages.push(msg);
      }
    }
  }
}


llm_call(userQuery)