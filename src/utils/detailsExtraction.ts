const extractAadharDetails = (
  front: { aadharNumber?: string | null; rawText: string; name?: string | null }, 
  back: { rawText: string }
) => {
    
    const details = {
        aadharNumber: front.aadharNumber ?? null, 
        name: extractName(front.rawText, front.name ?? null),
        dob: extractDOB(front.rawText),
        gender: extractGender(front.rawText),
        address: extractAddress(back.rawText),
        pin: extractPin(back.rawText)
    };
    return details;
};

const extractName = (rawText: string, name: string | null): string | null => {
    if (name) return name; 
    const nameMatch = rawText.match(/Name:\s?([A-Za-z\s]+)/);
    return nameMatch ? nameMatch[1].trim() : null;
};

const extractDOB = (rawText: string): string | null => {
    const dobMatch = rawText.match(/DOB[:\s~]*(\d{2}\/\d{2}\/\d{4})/);
    return dobMatch ? dobMatch[1] : null;
};

const extractGender = (rawText: string): string | null => {
    const genderMatch = rawText.match(/\b(Male|Female|Other)\b/i);
    return genderMatch ? genderMatch[1] : null;
};

function extractAddress(rawText:any) {

    const addressRegex = /Addresss\/[^\w]*(\w[\w\s]+).*?wa:\s([^,]+,[^,]+)/;
    const match = rawText.match(addressRegex);
  
  
   
  
    if (match) {
      const name = match[1].trim(); 
      const location = match[2].trim(); 
      return `${name}, ${location}`;
    }
  
    return null; 
  }
  

const extractPin = (rawText: string): string | null => {
    const pinMatch = rawText.match(/\b\d{6}\b/);
    return pinMatch ? pinMatch[0] : null;
};

export default extractAadharDetails;
