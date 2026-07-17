export const BRAND_NAMES = [
    'microsoft',
    'google',
    'amazon',
    'paypal',
    'apple',
    'github',
    'netflix',
    'bank of america',
    'chase',
    'facebook',
    'instagram',
    'linkedin',
    'dropbox',
    'docusign',
    'adobe',
    'office 365',
    'm365',
    'outlook',
];
export const URGENCY_REGEX = /\b(urgent|immediately|asap|act now|within 24 hours|today only|right away|final notice|verify now)\b/i;
export const THREAT_REGEX = /\b(account locked|account suspended|disabled|expired|security alert|unusual activity|unauthorized|confirm your identity)\b/i;
export const CREDENTIAL_REGEX = /\b(password|otp|one[- ]time code|verification code|login|sign in|credentials|pin|ssn|social security|cvv|bank account)\b/i;
export const FINANCIAL_REGEX = /\b(gift card|wire transfer|bitcoin|crypto|payment|invoice|refund|payroll|beneficiary)\b/i;
export const AUTHORITY_REGEX = /\b(ceo|cfo|hr|payroll|security team|admin|it support|help desk)\b/i;
export const GRAMMAR_REGEX = /\b(recieve|wich|seperate|definately|untill|thier|occured|teh)\b/i;
export const SUSPICIOUS_TLD_REGEX = /\.(xyz|top|tk|ml|ga|cf|click|download|review|work|loan|vip|shop)(\/|$)/i;
export const IP_URL_REGEX = /^https?:\/\/\d{1,3}(\.\d{1,3}){3}(:\d+)?(\/|$)/i;
export const HTTP_REGEX = /^http:\/\//i;
export const SHORTENER_REGEX = /\b(bit\.ly|tinyurl\.com|t\.co|goo\.gl|is\.gd|cutt\.ly|shorturl\.at|buff\.ly)\b/i;
export const LOGIN_PATH_REGEX = /\b(login|verify|confirm|update|secure|account|signin|password|unlock|reset)\b/i;
export const HOMOGLYPH_REGEX = /\b(micros0ft|go0gle|paypaI|arnazon|faceb00k|app1e|g00gle|micr0soft)\b/i;
export const DANGEROUS_ATTACHMENT_REGEX = /\.(exe|dll|scr|bat|cmd|vbs|js|jse|ps1|msi|msp|hta|lnk|iso|img|jar|docm|xlsm|pptm|zip|rar)(\b|$)/i;
export const MIME_FILENAME_MISMATCH_PATTERNS = [
    { ext: /\.pdf$/i, mime: /msword|officedocument/i, label: 'PDF filename but Office MIME type' },
    { ext: /\.docx$/i, mime: /pdf/i, label: 'DOCX filename but PDF MIME type' },
    { ext: /\.xls[xm]?$/i, mime: /pdf|text\/plain/i, label: 'Spreadsheet filename but unexpected MIME type' },
    { ext: /\.zip$/i, mime: /pdf|msword|officedocument/i, label: 'Archive filename but document MIME type' },
    { ext: /\.exe$/i, mime: /pdf|text\/plain|image\//i, label: 'Executable filename but benign MIME type' },
];
export const DEFAULT_MITIGATION = [
    'Do not click links or download attachments from untrusted senders',
    'Verify sender email address by hovering over the display name',
    'Contact the organization directly using a known phone number or website',
    'Report the email as phishing to your email provider',
    'Enable multi-factor authentication on all accounts',
];
//# sourceMappingURL=email-rules.js.map