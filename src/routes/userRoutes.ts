import { Router } from "express";
import { upload } from "../utils/imageUpload";
import { UserController } from "../controllers/userControllers";

const userControllerInstance = new UserController(); 
const route = Router();

route.post(
  "/parseData",
  upload.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "backImage", maxCount: 1 },
  ]),
  (err: any, req: any, res: any, next: any) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  },
  userControllerInstance.ParseAdhaarData.bind(userControllerInstance) 
);

export default route;
