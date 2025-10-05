import express from "express";
import cors from 'cors'
import { llm_call } from "./Llm.js";

const app = express();
app.use(express.json());  // middle-ware for json data 
app.use(cors());
const port = 3000;

app.get("/", (req, res) => {
  res.send("Server se hello !");
});

app.post("/chat" , async (req,res) => {
  const {message} = req.body;
  const result = await llm_call(message);
  let finalRes = result.replaceAll("*" , "");
  finalRes = finalRes.replaceAll("|","\n");
  res.json({
    "message" : finalRes
  })
  
})

app.listen(port, () => {
  console.log(`Server is running at port : ${port}`);
});
