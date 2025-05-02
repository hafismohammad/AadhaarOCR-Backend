"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extractAadharDetails = (front, back) => {
    var _a, _b;
    const details = {
        aadharNumber: (_a = front.aadharNumber) !== null && _a !== void 0 ? _a : null,
        name: extractName(front.rawText, (_b = front.name) !== null && _b !== void 0 ? _b : null),
        dob: extractDOB(front.rawText),
        gender: extractGender(front.rawText),
        address: extractAddress(back.rawText),
        pin: extractPin(back.rawText)
    };
    console.log('detilas', details);
    return details;
};
function extractName(rawText, name) {
    console.log("rawText before matching:", rawText);
    if (name)
        return name;
    const nameMatch = rawText.match(/Name:\s?([A-Za-z\s]+)/);
    return nameMatch ? nameMatch[1].trim() : null;
}
const extractDOB = (rawText) => {
    const dobMatch = rawText.match(/DOB[:\s~]*(\d{2}\/\d{2}\/\d{4})/);
    return dobMatch ? dobMatch[1] : null;
};
const extractGender = (rawText) => {
    const genderMatch = rawText.match(/\b(Male|Female|Other)\b/i);
    return genderMatch ? genderMatch[1] : null;
};
const extractAddress = (rawText) => {
    console.log('rawText address', rawText);
    // Look for "Address" or "S/O:" and capture from there until a likely ending (PIN or long uppercase string)
    const addressMatch = rawText.match(/(?:Address|S\/O:|D\/O:|C\/O:)[\s:]*([\s\S]{30,300}?)\s+\d{6}\b/);
    if (addressMatch) {
        let address = addressMatch[1];
        // Clean up OCR artifacts
        address = address
            .replace(/[^a-zA-Z0-9,\/\-#\.\s]/g, '') // remove garbage characters
            .replace(/\s{2,}/g, ' ') // multiple spaces to single
            .replace(/\b(?:S\/O|D\/O|C\/O)\b/g, '') // remove repeated S/O, etc
            .trim();
        return address;
    }
    return null;
};
const extractPin = (rawText) => {
    const pinMatch = rawText.match(/\b\d{6}\b/);
    return pinMatch ? pinMatch[0] : null;
};
exports.default = extractAadharDetails;
