import Tesseract from "tesseract.js";
import extractAadharDetails from "../utils/detailsExtraction";
import { Express } from "express";

export class UserService {
  async parseAadharData(frontImage: Express.Multer.File, backImage: Express.Multer.File) {
    if (!frontImage || !backImage) {
      throw new Error("Front and back images are required.");
    }

    const frontOCR = await this.performOCR(frontImage.buffer);
    const backOCR = await this.performOCR(backImage.buffer);

    const combinedText = `${frontOCR.rawText} ${backOCR.rawText}`;
    
    const extractedData: any = extractAadharDetails(frontOCR, backOCR);
    
    // console.log('***combinedText', combinedText);
    extractedData.age = this.calculateAge(extractedData.dob);

    const isValid = this.isValidAadharText(combinedText);
    if (!isValid) {
      throw new Error("Uploaded aadhaar images");
    }
      // console.log('extractedData',extractedData);


    return extractedData;
  }

  async performOCR(imageBuffer: Buffer): Promise<{ aadharNumber: string | null; name: string | null; rawText: string }> {
    try {
      const { data: { text } } = await Tesseract.recognize(imageBuffer, "eng");
      
      
      return this.cleanOCRText(text);
    } catch (error) {
      console.error("Error during OCR processing:", error);
      throw error;
    }
  }

  cleanOCRText(text: string): { aadharNumber: string | null; name: string | null; rawText: string } {
    let cleanedText = text.replace(/\s+/g, " ").trim();
    return {
      aadharNumber: this.extractAadharNumber(cleanedText),
      name: this.extractName(cleanedText),
      rawText: cleanedText,
    };
  }

  extractAadharNumber(text: string): string | null {
    const aadharRegex = /\b\d{4}\s?\d{4}\s?\d{4}\b/;
    const match = text.match(aadharRegex);
    return match ? match[0].replace(/\s/g, "") : null;
  }

  extractName(text: string): string | null {
    const nameRegex = /[A-Z][a-z]+ [A-Z][a-z]+/;
    const match = text.match(nameRegex);
    return match ? match[0] : null;
  }

  calculateAge(dob: string | null): number | null {
    if (!dob) return null;
    const [day, month, year] = dob.split("/").map(Number);
    const birthDate = new Date(year, month - 1, day);
    const currentDate = new Date();

    let age = currentDate.getFullYear() - birthDate.getFullYear();
    if (
      currentDate.getMonth() < birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  isValidAadharText(text: string): boolean {
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