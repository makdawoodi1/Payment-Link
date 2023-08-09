import { PrismaClient } from "@prisma/client";

const fetchSessionDetails = async (req, res, next) => {
    try {
      const prisma = new PrismaClient();
      const { token } = req.query;
  
      if (token) {
        const session_data = await prisma.orders.findUnique({
          where: {
            link_token: token,
          },
        });

        if (session_data) {
          res.status(200).json({
            success: true,
            message: "Data fetched successfully!",
            session_data: session_data,
          });
        } else {
          res
            .status(400)
            .json({ success: false, message: "Error while fetching data" });
        }
      } else {
        res
          .status(400)
          .json({ success: false, message: "Error when accessing token" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Unexpected error occured", error });
  
      console.log(error);
    }
};

export default fetchSessionDetails;