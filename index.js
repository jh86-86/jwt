const express = require("express");
const auth = require("./routes/auth");

const app = express();

app.use(express.json())  //lets app use json on request...needs to be above auth
app.use("/auth", auth);

app.get('/', (req,res)=>{
    res.send("Hi I am working");
})

app.listen(5000, ()=>{
  console.log("running on port 5000");  
});

