import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStats, recordAnswer, resetStats } from '../StatsManager';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('StatsManager', () => {
  beforeEach(() => {
    AsyncStorage.clear();
  });

  describe('getStats', () => {
    it('should return default stats when no data exists', async () => {
      const stats = await getStats();
      expect(stats.totalQuestionsAnswered).toBe(0);
      expect(stats.correctAnswers).toBe(0);
      expect(stats.wrongAnswers).toBe(0);
    });

    it('should return stored stats when data exists', async () => {
      const testStats = {
        totalQuestionsAnswered: 10,
        correctAnswers: 8,
        wrongAnswers: 2,
      };
      await AsyncStorage.setItem('@math_fun_kids_stats', JSON.stringify(testStats));
      
      const stats = await getStats();
      expect(stats.totalQuestionsAnswered).toBe(10);
      expect(stats.correctAnswers).toBe(8);
    });
  });

  describe('recordAnswer', () => {
    it('should increment total questions and correct answers for correct answer', async () => {
      await recordAnswer('addition', true);
      const stats = await getStats();
      expect(stats.totalQuestionsAnswered).toBe(1);
      expect(stats.correctAnswers).toBe(1);
      expect(stats.wrongAnswers).toBe(0);
      expect(stats.modeStats.addition.correct).toBe(1);
    });

    it('should increment total questions and wrong answers for wrong answer', async () => {
      await recordAnswer('subtraction', false);
      const stats = await getStats();
      expect(stats.totalQuestionsAnswered).toBe(1);
      expect(stats.correctAnswers).toBe(0);
      expect(stats.wrongAnswers).toBe(1);
    });
  });

  describe('resetStats', () => {
    it('should reset all stats to default', async () => {
      await recordAnswer('addition', true);
      await recordAnswer('addition', true);
      
      await resetStats();
      const stats = await getStats();
      expect(stats.totalQuestionsAnswered).toBe(0);
      expect(stats.correctAnswers).toBe(0);
    });
  });
});
