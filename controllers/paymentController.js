import { Prisma, PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { removeSpecialChar } from "../utils/Utils.js";
import stripe from "stripe";
// import { sendMail } from "../utils/NodeMailer.js"

export const linkGenerate = async (req, res, next) => {
  try {
    const prisma = new PrismaClient();
    const {
      p_name,
      amount,
      email,
      currency,
      package: pckg,
      desc,
      sales_mail,
    } = req.body;

    if ((p_name, amount, email, currency)) {
      const name = removeSpecialChar(p_name);
      const link_token = crypto
        .createHash("md5")
        .update(new Date().toISOString())
        .digest("hex");

      const packages = Array.isArray(pckg) ? pckg.join(", ") : "";
      const user = await prisma.orders.create({
        data: {
          project_name: name,
          email,
          link_token,
          packages: packages,
          description: desc,
          item_price: parseInt(amount),
          sales_email: sales_mail,
          item_price_currency: currency,
        },
      });

      res.json({ success: true, message: "Data saved successfully!", user });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error while saving data", error });

    console.log(error);
  }
};

export const createPayment = async (req, res, next) => {
  try {
    const prisma = new PrismaClient();
    const {
      amount,
      item_price_currency,
      p_name,
      desc,
      fname,
      lname,
      email,
      phone,
      address,
      address2,
      city,
      state,
      zip,
      country,
      link_token
    } = req.body;

    console.log(req.body)
    // if (link_token) {
    //   const stripe = stripe(process.env.STRIPE_KEY)
    //   let user =  await prisma.orders.findUnique({
    //     where: {
    //       link_token: token,
    //     },
    //   });

    //   customer = await stripe.customers.retrieve(
    //     user.stripe_customer_id,
    //     {
    //       apiKey: process.env.STRIPE_KEY
    //     }
    //   );

    //   if (user && customer) {
    //     user = await prisma.orders.update({
    //       where: { link_token: link_token },
    //       data: { ...req.body }
    //     });

    //     customer = await stripe.customers.update(
    //       user.stripe_customer_id,
    //       { metadata: 
    //         { 
    //           firstname: fname,
    //           lastname: lname,
    //           user_id: token
    //         }
    //       }
    //     );
        
        
    //   }

    //   else {
    //     customer = await stripe.customers.create({
    //       name: fname,
    //       email: email,
    //       payment_method: payment_method,
    //       metadata: {
    //         firstname: firstname,
    //         lastname: lastname,
    //         user_id: token
    //       }
    //     });
    //   }

    // } else {
    //   res
    //     .status(400)
    //     .json({ success: false, message: "Error while updating data", error });
    // }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Unexpected error occured", error });

    console.log(error);
  }
};

export const fetchSessionDetails = async (req, res, next) => {
  try {
    const prisma = new PrismaClient();
    const { token } = req.query;

    if (token) {
      const session_data = await prisma.orders.findUnique({
        where: {
          link_token: token,
        },
      });
      res
        .status(200)
        .json({
          success: true,
          message: "Data fetched successfully!",
          session_data: session_data,
        });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Error while fetching data", error });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Unexpected error occured", error });

    console.log(error);
  }
};
