import LottoGame from '../src/lotto/LottoGame.js';
import {
  ERROR_MESSAGE,
  LOTTO_PRICE,
  WINNIG_PROFITS,
} from '../src/Constants.js';
import { MissionUtils } from '@woowacourse/mission-utils';

const mockRandoms = (numbers) => {
  MissionUtils.Random.pickUniqueNumbersInRange = jest.fn();
  numbers.reduce((acc, number) => {
    return acc.mockReturnValueOnce(number);
  }, MissionUtils.Random.pickUniqueNumbersInRange);
};

describe('LottoGame 클래스', () => {
  describe('생성자', () => {
    test('새로운 LottoGame 인스턴스 생성', () => {
      const lottoGame = new LottoGame(1000);
      expect(lottoGame).toBeInstanceOf(LottoGame);
    });
    test('구매 금액이 양의 정수가 아니면 예외 발생', () => {
      expect(() => new LottoGame('1000원')).toThrow(
        ERROR_MESSAGE.notPositiveInteger
      );
    });
    test('구매 금액이 로또 가격에 나누어 떨어지지 않는다면 예외 발생', () => {
      expect(() => new LottoGame(3500)).toThrow(ERROR_MESSAGE.notDivisible);
    });
  });

  describe('#issueLotto 메소드', () => {
    it('구매 금액을 기반으로 로또가 생성되야 함.', () => {
      const lottoGame = new LottoGame(LOTTO_PRICE * 5);
      expect(lottoGame.getLottoNumbers().length).toBe(5);
    });
  });

  describe('getWinningStatus 메소드', () => {
    test('당첨 번호가 로또 번호의 길이에 맞지 않을 때 예외 발생', () => {
      const lottoGame = new LottoGame(LOTTO_PRICE * 5);
      const winningNumbers = [1, 2, 3, 4, 5];
      const bonusNumber = 7;
      expect(() =>
        lottoGame.getWinningStatus(winningNumbers, bonusNumber)
      ).toThrow(ERROR_MESSAGE.notLottoLength);
    });
    
    test('당첨 번호중 중복되는 번호가 있을 떄 예외 발생', () => {
      const lottoGame = new LottoGame(LOTTO_PRICE * 5);
      const winningNumbers = [1, 2, 3, 4, 5, 5];
      const bonusNumber = 7;
      expect(() =>
        lottoGame.getWinningStatus(winningNumbers, bonusNumber)
      ).toThrow(ERROR_MESSAGE.notUniqueElements);
    });

    test('당첨 번호가 로또 번호의 범위에 맞지 않을 때 예외 발생', () => {
      const lottoGame = new LottoGame(LOTTO_PRICE);
      const winningNumbers = [1, 2, 3, 4, 5, 46];
      const bonusNumber = 7;
      expect(() =>
        lottoGame.getWinningStatus(winningNumbers, bonusNumber)
      ).toThrow(ERROR_MESSAGE.notLottoRange);
    });

    test('보너스 번호가 양의 정수가 아닐 때 예외 발생', () => {
      const lottoGame = new LottoGame(LOTTO_PRICE);
      const winningNumbers = [1, 2, 3, 4, 5, 6];
      const bonusNumber = 'a';
      expect(() =>
        lottoGame.getWinningStatus(winningNumbers, bonusNumber)
      ).toThrow(ERROR_MESSAGE.notPositiveInteger);
    });

    test('보너스 번호가 1~45의 숫자가 아닐 때 예외 발생', () => {
      const lottoGame = new LottoGame(LOTTO_PRICE * 5);
      const winningNumbers = [1, 2, 3, 4, 5, 6];
      const bonusNumber = 46;
      expect(() =>
        lottoGame.getWinningStatus(winningNumbers, bonusNumber)
      ).toThrow(ERROR_MESSAGE.notLottoRange);
    });

    test('당첨 번호 및 보너스 번호를 로또 번호와 대조해보고 당첨 상태를 객체로 반환', () => {
      mockRandoms([
        [1, 2, 3, 4, 5, 7],
        [1, 2, 3, 5, 30, 20],
      ]);
      const lottoGame = new LottoGame(LOTTO_PRICE * 2);
      const winningNumbers = [1, 2, 3, 4, 5, 6];
      const bonusNumber = 7;
      const winningStatus = lottoGame.getWinningStatus(
        winningNumbers,
        bonusNumber
      );
      expect(winningStatus).toEqual({ 3: 0, 4: 1, 5: 0, bonus: 1, 6: 0 });
    });
  });

  describe('#calculateRateOfReturn 메소드', () => {
    test('당첨 상태(winningStatus)와 구매금액를 기반으로 수익률을 계산 및 반환.', () => {
      const PURCHASE_AMOUNT = LOTTO_PRICE * 2;
      mockRandoms([[1, 2, 3, 4, 5, 6],[3, 4, 5, 6, 7, 8],]);
      const lottoGame = new LottoGame(PURCHASE_AMOUNT);
      const winningStatus = { 3: 2, 4: 1, 5: 0, 6: 0,};
      const SUM_OF_PROFIT = WINNIG_PROFITS[3] * 2 + WINNIG_PROFITS[4];
      const RATE_OF_RETURN = ((SUM_OF_PROFIT / PURCHASE_AMOUNT) * 100).toFixed(1);
      expect(lottoGame.calculateRateOfReturn(winningStatus)).toBe(RATE_OF_RETURN);
    });
  });
});