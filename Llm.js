import "dotenv/config";
import { tavily } from "@tavily/core";
import Groq from "groq-sdk";
import NodeCache from "node-cache";

const model = "openai/gpt-oss-120b";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = new tavily({ apiKey: process.env.TAVILY_API_KEY });
const cache = new NodeCache({stdTTL : 60 * 60}) // 1 hr ke liye store hoga then delete

async function webSearch({ query }) {
  console.log("web search called....");
  const response = await tvly.search(query);
  const textRes = response.results.map((res) => res.content).join("\n\n");
  return textRes;
}


export async function llm_call(userQuery,threadId) {
  
  const baseMessage = [
    {
      role: "system",
      content: `You are a smart personal assistant.
          Answer the question without any bold or extra style , just plain text , format the answers properly just text and nothing else .. no bold text etc
          If you know the answer to a question, answer it directly in plain English.
          If the answer requires real-time, local, or up-to-date information, or if you don't know the answer, use the available tools to find it.
          You have access to the following tool:

          webSearch(query: string): Use this to search the internet for current or unknown information.

          Decide when to use your own knowledge and when to use the tool.
          Do not mention the tool unless needed.

          Examples:
          Q: What is the capital of France?
          A: The capital of France is Paris.

          Q: What's the weather in Mumbai right now?
          A: (use the search tool to find the latest weather)

          Q: Who is the Prime Minister of India?
          A: The current Prime Minister of India is Narendra Modi

          Q: Tell me the latest IT news.
          A: (use the search tool to get the latest news)

          current date and time: ${new Date().toUTCString()},

`,
    }
  ];

  const messages = cache.get(threadId) ?? baseMessage ;  // ya to phle se kch hoga wo de do , if not basemessage kyuki start hua hoga abhi convo

  messages.push({
    role: "user",
    content: userQuery,
  });

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
  messages.push(res.choices[0].message);

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
    messages.push(ans.choices[0].message);
    cache.set(threadId,messages);  // cache
    console.log(cache)
    return ans.choices[0].message.content;
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
        return message.content;
      } 
      else {
        return "LLm responded wrongly ! Please try again."
      }
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


