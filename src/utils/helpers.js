export const shortenAddress = (address) => {
  const addressShortened =
    address.substring(0, 6) +
        '...' +
    address.substring(address.length - 4, address.length);
  return addressShortened;
};

export const sanitizeInput = (value) => {
  const sanitized = value.replace(/[^0-9(\.)]/g, '');
  return sanitized;
}

export const blockInvalidChar = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();