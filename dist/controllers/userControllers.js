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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const tesseract_js_1 = __importDefault(require("tesseract.js"));
const statusCode_1 = require("../enum/statusCode");
const detailsExtraction_1 = __importDefault(require("../utils/detailsExtraction"));
class UserController {
    ParseAdhaarData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const frontImage = req.files["frontImage"][0];
                const backImage = req.files["backImage"][0];
                if (!frontImage || !backImage) {
                    return res
                        .status(statusCode_1.StatusCode.BAD_REQUEST)
                        .json({ message: "Front and back images are required." });
                }
                const frontOCR = yield this.performOCR(frontImage.buffer);
                const backOCR = yield this.performOCR(backImage.buffer);
                const extractedData = (0, detailsExtraction_1.default)(frontOCR, backOCR);
                // console.log('extractedData',extractedData);
                const age = this.calculateAge(extractedData.dob);
                extractedData.age = age;
                // console.log('extractedData',extractedData);
                res.status(statusCode_1.StatusCode.OK).json(extractedData);
            }
            catch (error) {
                console.error("Error while parsing data:", error);
                return res
                    .status(statusCode_1.StatusCode.INTERNAL_SERVER_ERROR)
                    .json({
                    message: "An error occurred while parsing data",
                    error: error.message,
                });
            }
        });
    }
    performOCR(imageBuffer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data: { text }, } = yield tesseract_js_1.default.recognize(imageBuffer, "eng");
                const cleanedText = this.cleanOCRText(text);
                // console.log("Cleaned Text:", cleanedText);
                // console.log('text',text);
                return cleanedText;
            }
            catch (error) {
                console.error("Error during OCR processing:", error);
                throw error;
            }
        });
    }
    cleanOCRText(text) {
        let cleanedText = text.replace(/\s+/g, " ").trim();
        // console.log("cleanOCRText",cleanedText);
        const extractedInfo = {
            aadharNumber: this.extractAadharNumber(cleanedText),
            name: this.extractName(cleanedText),
            rawText: cleanedText,
        };
        // console.log('extractedInfo',extractedInfo);
        return extractedInfo;
    }
    extractAadharNumber(text) {
        const aadharRegex = /\b\d{4}\s?\d{4}\s?\d{4}\b/;
        const match = text.match(aadharRegex);
        return match ? match[0].replace(/\s/g, "") : null;
    }
    extractName(text) {
        const nameRegex = /[A-Z][a-z]+ [A-Z][a-z]+/;
        const match = text.match(nameRegex);
        return match ? match[0] : null;
    }
    calculateAge(dob) {
        const [day, month, year] = dob.split("/").map(Number);
        const birthDate = new Date(year, month - 1, day);
        const currentDate = new Date();
        let age = currentDate.getFullYear() - birthDate.getFullYear();
        const monthDifference = currentDate.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 ||
            (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
}
exports.UserController = UserController;
