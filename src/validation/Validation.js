import ValidationUtils from './ValidationUtils.js';

class Validation {
    static validatepurchaseInput(input) {
        ValidationUtils.isemptyInput(input);
        ValidationUtils.isNotPositiveInteger(input);
        ValidationUtils.isNotDivisible(input);
    }
    static validateBonusNumber(input) {
        ValidationUtils.isemptyInput(input);
        ValidationUtils.isNotPositiveInteger(input);
        ValidationUtils.inLottoNumberRange(input);
    }
    static validateLottoNumbers(arr) {
        ValidationUtils.isLottoLength(arr.length);
        ValidationUtils.isUniqueElements(arr);
        for(let i=0; i<6; i++) {
            const LOTTO_NUMBER = Number(arr[i]);
            ValidationUtils.isNotPositiveInteger(LOTTO_NUMBER);
            ValidationUtils.inLottoNumberRange(LOTTO_NUMBER); 
        }
    }
}
export default Validation;