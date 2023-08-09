import { PrismaClient } from "@prisma/client";
import { validateParameters } from "../utils/Utils.js";
import express from "express";
import Stripe from "stripe";
import sessions from "express-session"
import { sendPaymentMail, transporter } from "../nodemailer.js";

const createPayment = async (req, res, next) => {
  const app = express();
  try {
    const prisma = new PrismaClient();
    const {
      payment_method_id,
      amount,
      currency,
      project_name,
      description,
      firstname,
      lastname,
      email,
      phone,
      address,
      address2,
      city,
      state,
      zip,
      country,
      link_token,
    } = req.body;

    if (link_token) {
      const parametersCheck = validateParameters(req.body);

      if (parametersCheck.response === false) {
        res.status(400).json({
          success: false,
          message: "Invalid Parameter Value",
          type: parametersCheck.type,
        });
        return;
      }


      const stripe = new Stripe(process.env.STRIPE_KEY);
      let user = null, 
          customer = null, 
          paymentIntent = null,
          total = 0;

      user = await prisma.orders.findUnique({
        where: {
          link_token: link_token,
        },
      });

      if (user.stripe_customer_id) {
        customer = await stripe.customers.retrieve(user.stripe_customer_id, {
          apiKey: process.env.STRIPE_KEY,
        });
      }
      
      try {
        customer = await createCustomer(res, firstname, lastname, email, payment_method_id, link_token, prisma, stripe)
        const metadata = {
          first_name: firstname,
          last_name: lastname,
          product_name: firstname,
        }

        paymentIntent = await createPaymentIntent(
          res, stripe, payment_method_id, amount, currency, customer, metadata, description, firstname
        )

        if (paymentIntent) {
          //session middleware
          app.use(sessions({
            secret: process.env.SESSION_KEY,
            saveUninitialized: true,
            cookie: { paymentIntent: paymentIntent },
            resave: false
          }));

          // Checking Payment Intent Status
          if (paymentIntent.status === 'requires_action' && paymentIntent.next_action.type === 'use_stripe_sdk') {
            res.status(202).json({ requires_action: true, payment_intent_client_secret: paymentIntent.client_secret });
          }
  
          else if (paymentIntent.status === 'succeeded') {
            const paid_amount = paymentIntent['charges']['data'][0]['amount_captured'] / 100;
            const payment_status = paymentIntent['charges']['data'][0]['status']

            user = await updateUser(res, prisma, amount, currency, project_name, description, firstname, lastname, email, phone, address, address2, city, state, zip, country, link_token, paymentIntent)

            if (user) {
              const send_mail = await sendPaymentMail(user.email, user.txn_id, paid_amount, paymentIntent.currency, payment_status, user.project_name, user.description, user.packages, user.sales_email, user.phone, user.firstname, user.lastname, user.address, user.address2, user.city, user.state, user.zip, user.country)
            }

            transporter.close();
            res.status(200).json({
              success: true,
              message: "Payment Intent has been created successfully!"
            });
          }
          else {
            res.status(500).json({
              success: false,
              message: "Invalid PaymentIntent Status"
            });
          }
        }
        else {
          res
            .status(500)
            .json({ success: false, message: "Error creating payment intent" });
        }

      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Error creating customer",
          error,
        });

        console.log(error);
      }
    } else {
      res.status(400).json({ success: false, message: "Error fetching Token" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Unexpected error occured", error });

    console.log(error);
  }
};

// Utility Functions
const calculateAmount = (amount) => {
  var total = amount * 100;
  for (let index = 1; index < 4; index++) {
    if (index === 1) {
      total = (amount - 3) * 100;
    } else if (index === 2) {
      total = 2 * 100;
    } else if (index === 3) {
      total = 1 * 100;
    }
  }

  return total
}

const createCustomer = async (res, firstname, lastname, email, payment_method_id, link_token, prisma, stripe) => {
  try {
    let customer = await stripe.customers.create({
      name: firstname,
      email: email,
      payment_method: payment_method_id,
      metadata: {
        firstname: firstname,
        lastname: lastname,
        user_id: link_token,
      },
    });

    await prisma.orders.update({
      where: { link_token: link_token },
      data: { stripe_customer_id: customer.id },
    });
    
    return customer
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error creating stripe customer", error });

    console.log(error);
  }
}

const updateUser = async (res, prisma, amount, currency, project_name, description, firstname, lastname, email, phone, address, address2, city, state, zip, country, link_token, paymentIntent) => {
  try {
    const user = await prisma.orders.update({
      where: { link_token: link_token },
      data: {
        item_price: amount,
        item_price_currency: currency,
        project_name: project_name,
        description: description,
        fname: firstname,
        lname: lastname,
        email: email,
        phone: phone,
        address: address,
        address2: address2,
        city: city,
        state: state,
        zip: zip,
        country: country,
        link_token: link_token,
        paid_amount: amount,
        txn_id: paymentIntent.id,
        payment_status: paymentIntent.status
      },
    });

    return user
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating customer in DB", error });

    console.log(error);
  }
}

const createPaymentIntent = async (res, stripe, payment_method_id, amount, currency, customer, metadata, description, firstname) => {
  var total = amount * 100;
  const intents = [];
  
  for (let index = 1; index < 4; index++) {
    if (index === 1) {
      total = (amount - 3) * 100;
    } else if (index === 2) {
      total = 2 * 100;
    } else if (index === 3) {
      total = 1 * 100;
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        payment_method: payment_method_id,
        amount: total,
        currency: currency,
        customer: customer.id,
        metadata: metadata,
        statement_descriptor_suffix: 'codernative',
        confirmation_method: 'manual',
        confirm: true,
        description: description ? `${description.substring(0, 900)}...` : `New payment by ${firstname}`
      });

      intents.push(paymentIntent)
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error creating payment intent", error });
  
      console.log(error);
    }

  }
  
  return intents.length > 0 ? intents[intents.length - 1] : null;
}

export default createPayment;