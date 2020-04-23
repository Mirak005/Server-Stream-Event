const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static(__dirname + "/public"));

let data = {
  sub1: 0,
  sub2: 0,
  sub3: 0
};

//global version will increment on each post
let globalVersion = 0;

app.post("/sub", (req, res) => {
  let subs = req.body;
  //update the data
  data = { ...data, ...subs };
  //increment global version
  globalVersion++;
  console.log(data);
  return res.send(data);
});

//Steam Server Event Route

app.get("/sse", (req, res) => {
  // Mandatory headers and http status to keep connection open
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache"
  };

  res.writeHead(200, headers);

  setInterval(() => {
    let currentVersion = 0;
    //check the difference betwen versions each 0.5 second
    if (currentVersion < globalVersion) {
      res.write(`data:${JSON.stringify(data)}\n\n`);
      currentVersion = globalVersion;
    }
  }, 500);
});

//Start the server
app.listen(5000, err => {
  err
    ? console.error(err.message)
    : console.log("Server is running on port 5000");
});
