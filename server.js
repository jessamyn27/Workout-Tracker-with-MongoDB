const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const PORT = process.env.PORT || 3000;
const db = require("./models");
const app = express();
const apiRoutes = require("./routes/api/apiRoutes.js");
const viewRoutes = require("./routes/view/viewRoutes.js");

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// whatever my db is named as endpoint
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

// routes
app.use("/api", apiRoutes);
app.use("/", viewRoutes);

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});

module.exports = db;