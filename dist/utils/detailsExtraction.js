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
    return details;
};
const extractName = (rawText, name) => {
    if (name)
        return name;
    const nameMatch = rawText.match(/Name:\s?([A-Za-z\s]+)/);
    return nameMatch ? nameMatch[1].trim() : null;
};
const extractDOB = (rawText) => {
    const dobMatch = rawText.match(/DOB[:\s~]*(\d{2}\/\d{2}\/\d{4})/);
    return dobMatch ? dobMatch[1] : null;
};
const extractGender = (rawText) => {
    const genderMatch = rawText.match(/\b(Male|Female|Other)\b/i);
    return genderMatch ? genderMatch[1] : null;
};
const extractAddress = (rawText) => {
    const addressRegex = /(S\/O|W\/O|D\/O|C\/O)[\s\S]{0,100}?(\d{6})/i;
    const match = rawText.match(addressRegex);
    if (match) {
        return match[0].replace(/\s+/g, " ").trim(); // Normalize whitespace
    }
    return null;
};
const extractPin = (rawText) => {
    const pinMatch = rawText.match(/\b\d{6}\b/);
    return pinMatch ? pinMatch[0] : null;
};
exports.default = extractAadharDetails;
