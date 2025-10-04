import "dotenv/config"
import Groq from "groq-sdk"
import { tavily } from "@tavily/core"

const tvly = new tavily({apiKey : process.env.TAVILY_API_KEY})
const groq = new Groq({apiKey : process.env.GROQ_API_KEY})

function webSearch(demo){
    return `hello ${demo}`
}

async function llm_call(userMessage) {
    const messages = [
        {
            role : "system" ,
            content : `You are a very helpful personal assistant who answers the question asked by the user.
            Answer the question in polite way with as much as required only .
            In case you don't have the answer you have  access to certain tools such as :- 
            1. webSearch() // this tool is when you need to search the web / internet
            `
        } ,
        {
            role : "user" ,
            content : userMessage
        }
    ]

    const tools = [
    {
      "type": "function",
      "function": {
        "name": "webSearch",
        "description": "Search the internet and get the latest information from the web",
        "parameters": {
          "type": "object",
          "properties": {
            "query": {
              "type": "string",
              "description": "The user query that needs to be answered"
            },

          },
          "required": ["query"]
        }
      }
    }
    ]

    const res = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: messages,
      tools: tools,
      tool_choice: "auto",
    });

    const msg = res.choices[0].message
    messages.push(msg)

    // tool call needed
    if(msg.tool_calls){
        console.log("Structured tool call : " , msg)
    } 
    
    //  tool call needed but llm string response de rha hai
    else if(msg.content.includes("<function=")){
        console.log("llm chutiya hai : ",msg)
        // remove all the un-necassary things
        let newMsg = msg.content.replace("<function=","");
        newMsg = newMsg.replace("</function>","");
        newMsg = newMsg.replace(" ","");

        const firstBrace = newMsg.indexOf("{");
        const fnName = newMsg.slice(0,firstBrace);
        const args = newMsg.slice(firstBrace);
        args = JSON.parse(args)

        
    } 
    
    // tool call not needed 
    else {
        return msg.content
    }
}

llm_call("Weather of Mumbai ?")