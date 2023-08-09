import nodemailer from "nodemailer";

// Setup transporter using SMTP transport
export const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    pool: true,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD
    }
});

export async function sendGeneratedLink(recipientsEmail, name, description, amount, currency, packages, token) {
    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_SENDER,
      to: recipientsEmail,
      subject: "New Payment Invoice Link",
      text: "New Payment Invoice Link",
      html: `
      <html>
        <style>
            table, th, td {
            border: 1px solid black;
            border-collapse: collapse;
            }
            th {
                font-size: 14px;
                padding:5px 10px 5px 2px;
            }
            td{
                padding:5px 10px 5px 2px;
            }
        </style>
        <body>
            <div>
                <img src="https://codernative.com/assets/images/logo.png" class="mb-4" style="width: 200px;">
            </div>
            <h2>Invoice Details:</h2>
            <table style="text-align:left; border: 1px solid black; border-collapse: collapse;">
                <tbody>
                    <tr>
                        <th style="font-size: 14px; padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">Client Name:</th>
                        <td style="padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">${name}</td>
                    </tr>
                    <tr>
                        <th style="font-size: 14px; padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">Project Description:</th>
                        <td style="padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">${description}</td>
                    </tr>
                    <tr>
                        <th style="font-size: 14px; padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">Amount:</th>
                        <td style="padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">${amount}${currency}</td>
                    </tr>
                    <tr>
                        <th style="font-size: 14px; padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">Packages:</th>
                        <td style="padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">${packages}</td>
                    </tr>
                    <tr>
                        <th style="font-size: 14px; padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">Invoice Link :</th>
                        <td style="padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;"><a href="${process.env.REDIRECT_LINK}${token}">${process.env.REDIRECT_LINK}${token}</a></td>
                    </tr>
                </tbody>
            </table>
            <br>
            <p>Please feel free to send us an email at ${process.env.SUPPORT_ADDRESS} or call us at ${process.env.SUPPORT_CONTACT}  for billing related queries.</p>
            <p>Thank you for choosing <a href="${process.env.SUPPORT_WEBSITE}"> ${process.env.SUPPORT_COMPANY}</a>.</p>
        </body>
    </html>`
    });
  
    console.log("Message sent: %s", info.messageId);
}

export async function sendPaymentMail(recipientsEmail, transactionID, paid_amount, paid_amount_currency, payment_status, name, description, packages, email, phone, firstname, lastname, address, address2, city, state, zip, country) {
    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_SENDER,
      to: recipientsEmail,
      subject: "New Payment Recieved!",
      text: "New Payment Recieved!",
      html: `
      <html>
        <style>
            table, th, td {
                border-collapse: collapse;
            }
            th {
                font-size: 14px;
                padding:5px 10px 5px 2px;
            }
            td{
                padding:5px 10px 5px 2px;
            }
      </style>
      <body>
        <div>
            <img src="https://codernative.com/assets/images/logo.png" class="mb-4" style="width: 200px;">
        </div>
        <p>Thank you for choosing <a href="${process.env.SUPPORT_WEBSITE}">${process.env.SUPPORT_COMPANY}</a>. We have successfully charged your card and below is a summary of your transaction.</p>
        <table style="text-align:left;">
            <thead>
                    <tr>
                        <th style="border:none"><h2>Payment Detail</h2>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th style="font-size: 14px; padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">Transaction ID:</th>
                    <td style="padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">${transactionID}</td>
                </tr>
                <tr>
                    <th style="font-size: 14px; padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">Paid Amount:</th>
                    <td style="padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">${paid_amount} . ${paid_amount_currency}</td>
                </tr>
                <tr>
                    <th style="font-size: 14px; padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">Payment Status:</th>
                    <td style="padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">${payment_status}</td>
                </tr>

                <tr style="border:none">
                    <th colspan="2" style="border:none"><h3 style="padding-top: 20px; text-align:left;">Project Details</th>
                    </td>
                </tr>

                <tr>
                    <th style="font-size: 14px; padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">Clients Name:</th><td style="padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">${name}</td>
                </tr>
                <tr>
                    <th style="font-size: 14px; padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">Desc:</th>
                    <td style="padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">${description}</td>
                </tr>
                <tr>
                    <th style="font-size: 14px; padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">Service:</th>
                    <td style="padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">${packages}</td>
                </tr>
                <tr>
                    <th style="font-size: 14px; padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">Email:</th>
                    <td style="padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">${email}</td></tr>
                <tr>
                    <th style="font-size: 14px; padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">Phone:</th>
                    <td style="padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">${phone}</td></tr>'

                <tr style="border:none">
                    <th colspan="2" style="border:none"><h3 style="padding-top: 20px; text-align:left;">Billing Details</th>
                    </td>
                </tr>

                <tr>
                    <th style="padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">Name:</th>
                    <td style="padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">${firstname} ${lastname}</td>
                </tr>
                <tr>
                    <th style="font-size: 14px; padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">Address:</th>
                    <td style="padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">${address}</td>
                </tr>
                <tr>
                    <th style="font-size: 14px; padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">Address2:</th>
                    <td style="padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">${address2}</td>
                </tr>
                <tr>
                    <th style="font-size: 14px; padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">City:</th>
                    <td style="padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">${city}</td>
                </tr>
                <tr>
                    <th style="font-size: 14px; padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">State:</th>
                    <td style="padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">${state}</td>
                </tr>
                <tr>
                    <th style="font-size: 14px; padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">Zip:</th>
                    <td style="padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">${zip}</td>
                </tr>
                <tr>
                    <th style="font-size: 14px; padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">Country:</th>
                    <td style="padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">${country}</td>
                    </tr>'
            </tbody>
        </table>
        <br>
        <p>Please feel free to send us an email at ${process.env.SUPPORT_ADDRESS} or call us at ${process.env.SUPPORT_CONTACT}  for billing related queries.</p>
        <p>Thank you for choosing <a href="${process.env.SUPPORT_WEBSITE}">${process.env.SUPPORT_COMPANY}</a>.</p>
      </body>
    </html>`
    });
  
    console.log("Message sent: %s", info.messageId);
}
  
sendGeneratedLink().catch(console.error);
sendPaymentMail().catch(console.error);