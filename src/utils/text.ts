export const toSentenceTitle = (value?: string): string => {
  if (!value) {
    return '';
  }

  const cleanValue = value.trim().replace(/\s+/g, ' ').toLowerCase();

  if (!cleanValue) {
    return '';
  }

  return cleanValue.charAt(0).toUpperCase() + cleanValue.slice(1);
};