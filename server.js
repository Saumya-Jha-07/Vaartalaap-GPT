import express from "express";

const app = express();
app.use(express.json());  // middle-ware for json data 
const port = 3000;

app.get("/", (req, res) => {
  res.send("Server se hello !");
});

app.post("/chat" , (req,res) => {
    const {message} = req.body; 
    res.json({'message' : message})
})

app.listen(port, () => {
  console.log(`Server is running at port : ${port}`);
});
