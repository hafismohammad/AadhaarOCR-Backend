import { Request, Response, RequestHandler } from "express";
import { UserService } from "../services/userService";

const userService = new UserService();

// Extend Express Request to include 'files' property
interface MulterRequest extends Request {
  files?: { [fieldname: string]: Express.Multer.File[] };
}

export class UserController { 
  ParseAdhaarData: RequestHandler = async (req, res): Promise<void> => {
    try {
      const multerReq = req as MulterRequest;

      const frontImage = multerReq.files?.["frontImage"]?.[0];
      const backImage = multerReq.files?.["backImage"]?.[0];

      if (!frontImage || !backImage) {
        res.status(400).json({
          message: "Front and back images are required.",
        });
        return;
      }

      const extractedData = await userService.parseAadharData(frontImage, backImage);
      console.log('extractedData',extractedData);

      res.status(200).json(extractedData);
    } catch (error: any) {
console.log('error',error);

      if (error.message === "Uploaded aadhaar images") {
        res.status(400).json({
          message: "Uploaded Aadhaar images are not valid",
        });
        return;
      }

      // You can uncomment this to handle other errors
      // res.status(500).json({
      //   message: "An error occurred while parsing data",
      //   error: error.message,
      // });
    }
  };
}
