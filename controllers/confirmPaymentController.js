import { PrismaClient } from "@prisma/client";
import { sendPaymentMail, transporter } from "../nodemailer.js";

const confirmPayment = async (req, res, next) => {
  const prisma = new PrismaClient();
  try {
    const { payment_intent, link_token } = req.body;

    if (payment_intent && link_token) {
      if (
        payment_intent?.status === "requires_action" &&
        payment_intent?.next_action.type === "use_stripe_sdk"
      ) {
        res
          .status(200)
          .json({
            requires_action: true,
            payment_intent_client_secret: payment_intent.client_secret,
          });
      } else if (payment_intent.staus === "succeeded") {
        try {
          const user = await prisma.orders.update({
            where: { link_token: link_token },
            data: {
              payment_status: payment_intent.status,
            },
          });

          if (user) {
            // Retreive Payment Intent Charge
            const charge = await stripe.charges.retrieve(
              payment_intent.latest_charge
            );

            const paid_amount = charge["amount_captured"] / 100;
            const payment_status = charge["status"];

            const send_mail = await sendPaymentMail(
              user.email,
              user.txn_id,
              paid_amount,
              payment_intent.currency,
              payment_status,
              user.project_name,
              user.description,
              user.packages,
              user.sales_email,
              user.phone,
              user.firstname,
              user.lastname,
              user.address,
              user.address2,
              user.city,
              user.state,
              user.zip,
              user.country
            );
          }

          transporter.close();
          res.status(200).json({
            success: true,
            message: "Payment Intent has been created successfully!",
          });
        } catch (error) {
          res
            .status(500)
            .json({
              success: false,
              message: "Error updating customer in DB",
              error,
            });

          console.log(error);
        }
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Unexpected error occured", error });

    console.log(error);
  }
};

export default confirmPayment;
