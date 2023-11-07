import { WINNIG_PROFITS } from '../Constants.js';

class GameUtils {
  static splitComma(input) {
    return input.split(',');
  }
  static sortLottoNumbers(arr) {
    // 각 행을 오름차순으로 정렬
    arr.forEach((row) => row.sort((a, b) => a - b));
    return arr;
  }

  static removeItemsWithNumericKeysLessThanThree(obj) {
    const OBJ = { ...obj };
    for (const KEY in OBJ) {
      if (typeof Number(KEY) === 'number' && KEY < 3) {
        delete OBJ[KEY];
      }
    }
    return OBJ;
  }
  static addMissingElements(obj) {
    const OBJ = { ...obj };
    for (const WINNING_NUMBER in WINNIG_PROFITS) {
      const key = WINNING_NUMBER.toString();
      if (!(key in OBJ)) {
        OBJ[key] = 0;
      }
    }
    return OBJ;
  }
  static processMatchingNumbersToResult(obj) {
    let result = { ...obj };
    result = this.removeItemsWithNumericKeysLessThanThree(result);
    result = this.addMissingElements(result);
    return result;
  }
}
export default GameUtils;
