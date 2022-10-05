export const shortenAddress = (address) => {
  const addressShortened =
    address.substring(0, 6) +
        '...' +
    address.substring(address.length - 4, address.length);
  return addressShortened;
};