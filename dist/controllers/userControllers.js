"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userService_1 = require("../services/userService");
const userService = new userService_1.UserService();
class UserController {
    constructor() {
        this.ParseAdhaarData = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const multerReq = req;
                const frontImage = (_b = (_a = multerReq.files) === null || _a === void 0 ? void 0 : _a["frontImage"]) === null || _b === void 0 ? void 0 : _b[0];
                const backImage = (_d = (_c = multerReq.files) === null || _c === void 0 ? void 0 : _c["backImage"]) === null || _d === void 0 ? void 0 : _d[0];
                if (!frontImage || !backImage) {
                    res.status(400).json({
                        message: "Front and back images are required.",
                    });
                    return;
                }
                const extractedData = yield userService.parseAadharData(frontImage, backImage);
                // console.log('extractedData',extractedData);
                res.status(200).json(extractedData);
            }
            catch (error) {
                console.log('error', error);
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
        });
    }
}
exports.UserController = UserController;
