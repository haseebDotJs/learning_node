const express = require("express");

// CONFIGURE DOTENV TO ACCESS ENF ACROSS THE PROJECT
require("dotenv").config();

// MONGODB CONNECTION
require("./db/mongoose");

// ROUTES
const userRoutes = require("./routers/users");
const taskRoutes = require("./routers/tasks");

const app = express();

// MIDDLEWARE

app.use(express.json());
app.use(userRoutes, taskRoutes);

const port = process.env.PORT || 3001;

app.connect(port);

app.listen(port, () => {
  console.log(`Server is up listening on port ${port}`);
});
