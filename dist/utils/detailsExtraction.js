"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extractAadharDetails = (front, back) => {
    const details = {
        aadharNumber: front.aadharNumber || back.aadharNumber || null,
        name: extractName(front.rawText, front.name),
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
    const addressRegex = /Addresss\/[^\w]*(\w[\w\s]+).*?wa:\s([^,]+,[^,]+)/;
    const match = rawText.match(addressRegex);
    if (match) {
        const name = match[1].trim();
        const location = match[2].trim();
        return `${name}, ${location}`;
    }
    return null;
};
const extractPin = (rawText) => {
    const pinMatch = rawText.match(/\b\d{6}\b/);
    return pinMatch ? pinMatch[0] : null;
};
exports.default = extractAadharDetails;
