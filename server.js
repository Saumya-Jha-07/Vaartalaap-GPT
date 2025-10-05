import express from "express";
import { llm_call } from "./Llm.js";

const app = express();
app.use(express.json());  // middle-ware for json data 
const port = 3000;

app.get("/", (req, res) => {
  res.send("Server se hello !");
});

app.post("/chat" , async (req,res) => {
  const {message} = req.body;
  const result = await llm_call(message);
  res.json({
    "message" : result
  })
  
})

app.listen(port, () => {
  console.log(`Server is running at port : ${port}`);
});
