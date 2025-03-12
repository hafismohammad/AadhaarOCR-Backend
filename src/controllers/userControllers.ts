import Tesseract from "tesseract.js";
import { StatusCode } from "../enum/statusCode";
import extractAadharDetails from "../utils/detailsExtraction";

export class UserController {
  async ParseAdhaarData(req: any, res: any) {
    try {
      const frontImage = req.files["frontImage"][0];
      const backImage = req.files["backImage"][0];

      if (!frontImage || !backImage) {
        return res
          .status(StatusCode.BAD_REQUEST)
          .json({ message: "Front and back images are required." });
      }

      const frontOCR = await this.performOCR(frontImage.buffer);
      const backOCR = await this.performOCR(backImage.buffer);

      const extractedData: any = extractAadharDetails(frontOCR, backOCR);
      // console.log('extractedData',extractedData);
      const age = this.calculateAge(extractedData.dob);
      extractedData.age = age;
     // console.log('extractedData',extractedData);

      res.status(StatusCode.OK).json(extractedData);
    } catch (error: any) {
      console.error("Error while parsing data:", error);

      return res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({
          message: "An error occurred while parsing data",
          error: error.message,
        });
    }
  }

  async performOCR(imageBuffer: any) {
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(imageBuffer, "eng");
      const cleanedText = this.cleanOCRText(text);
      // console.log("Cleaned Text:", cleanedText);
      // console.log('text',text);

      return cleanedText;
    } catch (error) {
      console.error("Error during OCR processing:", error);
      throw error;
    }
  }

  cleanOCRText(text: any) {
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

  extractAadharNumber(text: any) {
    const aadharRegex = /\b\d{4}\s?\d{4}\s?\d{4}\b/;
    const match = text.match(aadharRegex);
    return match ? match[0].replace(/\s/g, "") : null;
  }

  extractName(text: any) {
    const nameRegex = /[A-Z][a-z]+ [A-Z][a-z]+/;
    const match = text.match(nameRegex);
    return match ? match[0] : null;
  }

  calculateAge(dob: any) {
    const [day, month, year] = dob.split("/").map(Number);
    const birthDate = new Date(year, month - 1, day);
    const currentDate = new Date();

    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }
}
