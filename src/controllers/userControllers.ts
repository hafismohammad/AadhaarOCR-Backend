import { Request, Response, RequestHandler } from "express";
import { StatusCode } from "../enum/statusCode";
import { UserService } from "../services/userService";

const userService = new UserService();

// Extend Express Request to include 'files' property
interface MulterRequest extends Request {
  files?: { [fieldname: string]: Express.Multer.File[] };
}

export class UserController { 
  ParseAdhaarData: RequestHandler = async (req, res) => {
    try {
      const multerReq = req as MulterRequest;

      const frontImage = multerReq.files?.["frontImage"]?.[0];
      const backImage = multerReq.files?.["backImage"]?.[0];

      if (!frontImage || !backImage) {
        res.status(StatusCode.BAD_REQUEST).json({
          message: "Front and back images are required.",
        });
        return;
      }

      const extractedData = await userService.parseAadharData(frontImage, backImage);
      res.status(StatusCode.OK).json(extractedData); 
    } catch (error: any) {
      console.error("Error while parsing data:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        message: "An error occurred while parsing data",
        error: error.message,
      });
    }
  };
}
