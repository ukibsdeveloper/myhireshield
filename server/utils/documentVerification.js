/**
 * DOCUMENT VERIFICATION UTILITIES
 * Frontend Optimized Version
 */

// --- VERHOEFF ALGORITHM TABLES (For Aadhaar) ---
const d = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6], [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8], [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2], [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4], [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];
const p = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2], [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0], [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5], [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

// --- CORE VALIDATORS ---

// 1. Aadhaar Validator (12 Digits + Verhoeff Checksum)
export const validateAadhaar = (aadhaarNumber) => {
  const cleaned = String(aadhaarNumber).replace(/\s/g, '');
  
  // Aadhaar cannot start with 0 or 1 and must be 12 digits
  if (!/^[2-9]{1}[0-9]{11}$/.test(cleaned)) {
    return { valid: false, error: 'Aadhaar must be 12 digits and cannot start with 0 or 1' };
  }

  let c = 0;
  const reversedArray = cleaned.split('').map(Number).reverse();
  reversedArray.forEach((val, i) => {
    c = d[c][p[i % 8][val]];
  });

  return c === 0 
    ? { valid: true, message: 'Valid Aadhaar' } 
    : { valid: false, error: 'Invalid Aadhaar checksum' };
};

// 2. PAN Validator (AAAAA9999A format + Entity Check)
export const validatePAN = (panNumber) => {
  const cleaned = panNumber.replace(/\s/g, '').toUpperCase();
  // Fourth character: P (Individual), C (Company), H (HUF), F (Firm), A (AOP), T (Trust), B (BOI), L (Local), J (Artificial), G (Govt)
  const panRegex = /^[A-Z]{3}[PCHFATBLJG]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}$/;
  
  if (!panRegex.test(cleaned)) {
    return { valid: false, error: 'Invalid PAN format (e.g., ABCDE1234F)' };
  }
  return { valid: true, message: 'Valid PAN' };
};

// 3. Passport Validator (Letter + 7 Digits)
export const validatePassport = (passportNumber) => {
  const cleaned = passportNumber.replace(/\s/g, '').toUpperCase();
  const passportRegex = /^[A-Z]{1}[0-9]{7}$/;
  return passportRegex.test(cleaned) 
    ? { valid: true, message: 'Valid Passport' }
    : { valid: false, error: 'Invalid Passport format (e.g., A1234567)' };
};

// 4. Driving License Validator (Standard 15 characters)
export const validateDrivingLicense = (dlNumber) => {
  const cleaned = dlNumber.replace(/[-\s]/g, '').toUpperCase();
  const dlRegex = /^[A-Z]{2}[0-9]{2}[0-9]{11}$/;
  return dlRegex.test(cleaned)
    ? { valid: true, message: 'Valid Driving License' }
    : { valid: false, error: 'Invalid DL format (15 characters required)' };
};

// 5. GSTIN Validator (15 Chars)
export const validateGSTIN = (gstin) => {
  const cleaned = gstin.replace(/\s/g, '').toUpperCase();
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(cleaned)
    ? { valid: true, message: 'Valid GSTIN' }
    : { valid: false, error: 'Invalid GSTIN format' };
};

// --- AUTO VERIFICATION ENGINE ---

const VALIDATOR_MAP = {
  'aadhaar': validateAadhaar,
  'pan': validatePAN,
  'passport': validatePassport,
  'driving_license': validateDrivingLicense,
  'gstin': validateGSTIN
};

export const autoVerifyDocument = async (document) => {
  const results = {
    attempted: true,
    passed: false,
    checks: {
      format: false,
      fileSize: false,
      fileType: false
    },
    confidence: 0
  };

  try {
    // 1. Validate Document Format
    const validator = VALIDATOR_MAP[document.documentType];
    if (validator && document.documentNumber) {
      const validation = validator(document.documentNumber);
      results.checks.format = validation.valid;
      if (validation.valid) {
        results.confidence += 50; 
      } else {
        results.error = validation.error;
      }
    }

    // 2. File Integrity (Max 10MB)
    const MAX_SIZE = 10485760; // 10MB
    results.checks.fileSize = document.fileSize > 0 && document.fileSize <= MAX_SIZE;
    if (results.checks.fileSize) results.confidence += 25;

    // 3. File Type Check
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    results.checks.fileType = allowedTypes.includes(document.mimeType);
    if (results.checks.fileType) results.confidence += 25;

    // Overall Logic: Document must have correct format + pass at least one file check
    results.passed = results.checks.format && results.confidence >= 75;

  } catch (error) {
    console.error('Verification Engine Error:', error);
    results.error = 'Verification process failed';
  }

  return results;
};