import express from "express";
import { mongoURI, PORT } from "./config.js";
import mongoose from "mongoose";
import booksRoute from "./routes/booksRoute.js";
import cors from "cors";

const app = express();

app.use(express.json());

//Middleware for handling CORS
//app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));

//Books
app.use("/books", booksRoute);

mongoose
  .connect(mongoURI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
