const express = require("express");
// const stripe = require("stripe")(process.env.secret_key); // real key
const stripe = require("stripe")(process.env.secret_test_key); // test key
const bodyParser = require("body-parser");
const { engine } = require("express-handlebars");

const app = express();
const port = process.env.PORT || 3000;
const YOUR_DOMAIN = `http://localhost:${port}`;

// Handlebars Middleware
app.engine("handlebars", engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set static folder
app.use(express.static(`${__dirname}/public`));

// index route
app.get("/", (req, res) => {
  res.render("index");
});

// checkout route
app.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    customer_email: "customer@example.com",
    submit_type: "donate",
    // billing_address_collection: "auto",
    // shipping_address_collection: {
    //   allowed_countries: ["US", "CA"],
    // },
    line_items: [
      {
        // price: "price_1Q5NktJPCGaf4hhjsUi7z1Rh", // real product
        price: "price_1Q5O1IJPCGaf4hhjJXAnMQjA", // test product
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}/cancel?session_id={CHECKOUT_SESSION_ID}`,
    automatic_tax: { enabled: true },
  });

  res.redirect(303, session.url);
});

// success payment
app.get("/success", (req, res) => {
  if (req.query.session_id) {
    res.send("Thanks for your order!");
  } else {
    res.send("Error!");
  }
});

// cancel payment
app.get("/cancel", (req, res) => {
  if (req.query.session_id) {
    res.send("Checkout cancelled!");
  } else {
    res.send("Error!");
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
