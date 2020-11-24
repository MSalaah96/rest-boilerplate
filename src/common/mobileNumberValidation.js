const { ValidationError } = require('./errors');
const { parsePhoneNumberFromString, isValidNumber } = require('libphonenumber-js');

class MobileNumberValidation {
    getMobileNumber(mobile) {
        const data = parsePhoneNumberFromString(mobile);
        if (data) {
            if (!isValidNumber(data.number)) {
                throw new ValidationError('Invalid mobile number');
            }
            return {
                number: data.number,
                countryCode: data.countryCallingCode,
            };
        }
        throw new ValidationError('Invalid mobile number');
    }
}

module.exports = new MobileNumberValidation();
