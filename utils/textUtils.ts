/**
 * Extract numeric value from text
 * @param text - Text containing numeric value
 * @returns Extracted numeric value
 */
export function extractNumber(text: string | null): number {
    return parseInt(text?.replace(/[^0-9]/g, '') || '0');
}