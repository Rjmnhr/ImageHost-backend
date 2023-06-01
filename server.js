const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Image = require("./model/Db-Schema");

//App config
const app = express();
const port = process.env.PORT || 8002;

//middleware
dotenv.config();
app.use(Cors());
app.use(express.json());

//DB config
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

cloudinary.config({
  cloud_name: "dsw1ubwyh",
  api_key: "828222755219982",
  api_secret: "MolGuQIrdoVwSH6cTgQdmPt0bak",
});

const upload = multer({ dest: "/uploads" });

app.post("/api/image", upload.single("image"), async (req, res) => {
  if (!req.file) {
    res.status(400).send("No file uploaded");
    return;
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    const content = new Image({
      image: result.secure_url,
    });
    const savedContent = await content.save();
    res.send(savedContent);
  } catch (err) {
    res.status(404).send(err);
  }
});

app.get("/api/image", (req, res) => {
  Image.find({})
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send(err));
});

//listener
app.listen(port, () => console.log(`server is up on ${port}`));
