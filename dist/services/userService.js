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
exports.UserService = void 0;
const tesseract_js_1 = __importDefault(require("tesseract.js"));
const detailsExtraction_1 = __importDefault(require("../utils/detailsExtraction"));
class UserService {
    parseAadharData(frontImage, backImage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!frontImage || !backImage) {
                throw new Error("Front and back images are required.");
            }
            const frontOCR = yield this.performOCR(frontImage.buffer);
            const backOCR = yield this.performOCR(backImage.buffer);
            const combinedText = `${frontOCR.rawText} ${backOCR.rawText}`;
            const extractedData = (0, detailsExtraction_1.default)(frontOCR, backOCR);
            // console.log('***combinedText', combinedText);
            extractedData.age = this.calculateAge(extractedData.dob);
            const isValid = this.isValidAadharText(combinedText);
            if (!isValid) {
                throw new Error("Uploaded aadhaar images");
            }
            return extractedData;
        });
    }
    performOCR(imageBuffer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data: { text } } = yield tesseract_js_1.default.recognize(imageBuffer, "eng");
                return this.cleanOCRText(text);
            }
            catch (error) {
                console.error("Error during OCR processing:", error);
                throw error;
            }
        });
    }
    cleanOCRText(text) {
        let cleanedText = text.replace(/\s+/g, " ").trim();
        return {
            aadharNumber: this.extractAadharNumber(cleanedText),
            name: this.extractName(cleanedText),
            rawText: cleanedText,
        };
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
        if (!dob)
            return null;
        const [day, month, year] = dob.split("/").map(Number);
        const birthDate = new Date(year, month - 1, day);
        const currentDate = new Date();
        let age = currentDate.getFullYear() - birthDate.getFullYear();
        if (currentDate.getMonth() < birthDate.getMonth() ||
            (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    isValidAadharText(text) {
        const keywords = [
            "government of india",
            "unique identification authority",
            "uidai",
            "aadhaar",
            'www.uidai.gov.com',
            "year of birth",
            "dob",
            "male",
            "female",
            "address",
        ];
        const lowercaseText = text.toLowerCase();
        return keywords.some(keyword => lowercaseText.includes(keyword));
    }
}
exports.UserService = UserService;
