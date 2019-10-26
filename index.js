const express = require("express");
const app = express();
var cors = require("cors");
const fs = require("fs");

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use("/msx", express.static("msx"));

app.get("/", (req, res) => {
  res.send("is working!");
});

app.get("/videos", (req, res) => {
  let rawdata = fs.readFileSync("msx/videos.json");
  let data = JSON.parse(rawdata);
  console.log(data.items);
  res.status(200).json(data.items);
});

app.get("/youtube", (req, res) => {
  let rawdata = fs.readFileSync("msx/youtube.json");
  let data = JSON.parse(rawdata);
  console.log(data.items);
  res.status(200).json(data.items);
});

app.post("/videos", async (req, res, next) => {
  try {
    const item = req.body;

    let rawdata = await fs.readFileSync("msx/videos.json");
    let data = await JSON.parse(rawdata);

    const isUpdate = data.items.some(i => i.uid === item.uid);

    let n;

    if (isUpdate) {
      n = {
        ...data,
        items: data.items.map(i => {
          if (i.uid === item.uid) {
            return item;
          }
          return i;
        })
      };
    } else {
      n = {
        ...data,
        items: [...data.items, item]
      };
    }

    const newData = JSON.stringify(n, undefined, 2);
    fs.writeFileSync("msx/videos.json", newData);

    res.status(200).json({ message: "JSON updated!" });
  } catch (e) {
    //this will eventually be handled by your error handling middleware
    res.status(400).json({ message: e.message });
    next(e);
  }
});

app.get("/videos/delete/:uid", async (req, res, next) => {
  try {
    const uid = req.params.uid;

    let rawdata = await fs.readFileSync("msx/videos.json");
    let data = await JSON.parse(rawdata);

    const exists = data.items.some(i => i.uid === uid);

    if (exists) {
      const n = {
        ...data,
        items: data.items.filter(item => {
          if (item.uid !== uid) return item;
        })
      };
      const newData = JSON.stringify(n, undefined, 2);
      fs.writeFileSync("msx/videos.json", newData);
    }

    res.status(200).json({ message: "JSON updated, item was deleted!" });
  } catch (e) {
    //this will eventually be handled by your error handling middleware
    res.status(400).json({ message: e.message });
    next(e);
  }
});

app.listen(port, function() {
  console.log("Our app is running on http://localhost:" + port);
});
