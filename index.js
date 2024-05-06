const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3001;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const verifyToken = require("jsonwebtoken");
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// console.log(process.env.ACCESS_TOKEN_SECRET)

//middlewares

app.use(cors());
app.use(express.json());

// mongodb configuration here

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fnmebyb.mongodb.net/foodappdb?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(console.log("mongodb connected successfully"))
  .catch((error) => console.log("error connecting to mongodb..", error));

//jwt authentication
app.post("/jwt", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1hr",
  });
  res.send({ token });
});

//middleware

//import routes



const menuRoutes = require("./api/routes/menuRoutes");
app.use("/menu", menuRoutes);

const cartRoutes = require("./api/routes/cartRoutes");
app.use("/carts", cartRoutes);

const userRoutes = require("./api/routes/userRoutes");
app.use("/users", userRoutes);

const paymentRoutes = require("./api/routes/paymentRoutes");
app.use('/payments',paymentRoutes)

// stripe payment routes

app.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body;
  const amount = price * 100;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "inr",
    payment_method_types: ["card"],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.get("/", (req, res) => {
  res.send("Hello to Food express World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
