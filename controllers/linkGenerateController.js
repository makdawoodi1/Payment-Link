import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { removeSpecialChar } from "../utils/Utils.js";
import { sendGeneratedLink, transporter } from "../nodemailer.js";

const linkGenerate = async (req, res, next) => {
    const prisma = new PrismaClient();
    try {
      const {
        p_name,
        amount,
        email,
        currency,
        package: pckg,
        description,
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
            description: description,
            item_price: parseInt(amount),
            sales_email: sales_mail,
            item_price_currency: currency,
          },
        });
  
        const mail_send = await sendGeneratedLink(email, name, description, amount, currency, packages, link_token)
        transporter.close();
        res.json({ success: true, message: "Data saved successfully!", user });
      }
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error while saving data", error });
  
      console.log(error);
    }
};

export default linkGenerate;