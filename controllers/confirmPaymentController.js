import { PrismaClient } from "@prisma/client";
import { sendPaymentMail, transporter } from "../nodemailer.js";

const confirmPayment = async (req, res, next) => {
    try {
        const session = req.session;
        const prisma = new PrismaClient();

        if (session) {
            console.log(session)
            if (session.paymentIntent?.status === 'requires_action' && session.paymentIntent?.next_action.type === 'use_stripe_sdk') {
                res.status(200).json({ requires_action: true, payment_intent_client_secret: session.paymentIntent.client_secret });
            } else if (session.paymentIntent.staus === 'succeeded') {
                try {
                    const user = await prisma.orders.update({
                      where: { link_token: session.link_token },
                      data: {
                        payment_status: session.paymentIntent.status
                      },
                    });
                
                    if (user) {
                        const paid_amount = session.paymentIntent['charges']['data'][0]['amount_captured'] / 100;
                        const payment_status = session.paymentIntent['charges']['data'][0]['status']

                        const send_mail = await sendPaymentMail(user.email, user.txn_id, paid_amount, paymentIntent.currency, payment_status, user.project_name, user.description, user.packages, user.sales_email, user.phone, user.firstname, user.lastname, user.address, user.address2, user.city, user.state, user.zip, user.country)
                    }
          
                    transporter.close();
                    res.status(200).json({
                    success: true,
                    message: "Payment Intent has been created successfully!"
                    });
                } catch (error) {
                    res
                      .status(500)
                      .json({ success: false, message: "Error updating customer in DB", error });
                
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