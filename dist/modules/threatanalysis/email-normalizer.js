export function normalizeText(text) {
    return text.replace(/\s+/g, ' ').trim().toLowerCase();
}
export function extractDomain(value) {
    if (!value)
        return undefined;
    const cleaned = value.trim().toLowerCase().replace(/^mailto:/, '');
    const atIndex = cleaned.lastIndexOf('@');
    const domainPart = atIndex >= 0 ? cleaned.slice(atIndex + 1) : cleaned;
    return domainPart
        .replace(/^www\./, '')
        .split('/')[0]
        .split(':')[0];
}
export function extractUrlsFromText(text) {
    const matches = text.match(/https?:\/\/[^\s<>"'`]+/gi) || [];
    return [...new Set(matches.map((u) => u.replace(/[)\].,;!?]+$/g, '')))];
}
export function uniqueStrings(values) {
    return [...new Set(values.filter(Boolean))];
}
export function safeLower(value) {
    return (value || '').toLowerCase().trim();
}
//# sourceMappingURL=email-normalizer.js.map