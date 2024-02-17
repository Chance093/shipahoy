const phoneNumberRegex = new RegExp("^(+d{1,2}s?)?(?d{3})?[s.-]?d{3}[s.-]?d{4}$");
const zipCodeRegex = new RegExp("^d{5}([-]|s*)?(d{4})?$");

export { phoneNumberRegex, zipCodeRegex };
