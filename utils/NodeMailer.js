import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
});

export async function sendMail() {
  const info = await transporter.sendMail({
    from: process.env.FROM, // sender address
    to: process.env.TO, // list of receivers
    subject: "New Payment Invoice Link", // Subject line
    text: "Hello world?", // plain text body
    html: `<html><style>table, th, td {
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
      </style><body><div><img src="https://codernative.com/assets/images/logo.png" class="mb-4" style="width: 200px;"></div><h2>Invoice Details:</h2>';
      $mail->Body .= '<table style="text-align:left; border: 1px solid black; border-collapse: collapse;">';
      $mail->Body .= '<tbody>';
      $mail->Body .= '<tr><th style="font-size: 14px; padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">Client Name:</th><td style="padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">'.$name.'</td></tr>';
      $mail->Body .= '<tr><th style="font-size: 14px; padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">Project Description:</th><td style="padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">'.$desc.'</td></tr>';
      $mail->Body .= '<tr><th style="font-size: 14px; padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">Amount:</th><td style="padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">'.$amount.$currency.'</td></tr>';
      $mail->Body .= '<tr><th style="font-size: 14px; padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">Packages:</th><td style="padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">'.$packages.'</td></tr>';
      $mail->Body .= '<tr><th style="font-size: 14px; padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;">Invoice Link :</th><td style="padding:5px 10px 5px 2px; border: 1px solid black; border-collapse: collapse;"><a href="https://codernative.com/payments/paynow.php?token='.$link_token.'">https://codernative.com/payments/paynow.php?token='.$link_token.'</a></td></tr>';
      $mail->Body .= '</tbody></table><br>';
       $mail->Body .= '<p>Please feel free to send us an email at billing@codernative.com or call us at (858) 301-6320  for billing related queries.</p>';
       $mail->Body .= '<p>Thank you for choosing <a href="https://codernative.com/"> codernative</a>.</p></body></html>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
}

sendMail().catch(console.error);
