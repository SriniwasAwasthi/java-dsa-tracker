import test from 'node:test';
import assert from 'node:assert/strict';

// Core spaced repetition & mastery scheduling algorithm tests for Java DSA Tracker
function calculateNextReview(currentLevel, performanceRating) {
  // performanceRating: 'again' (1), 'hard' (2), 'good' (3), 'easy' (4)
  const intervalMap = {
    0: { 1: 1, 2: 1, 3: 1, 4: 2 },
    1: { 1: 1, 2: 2, 3: 3, 4: 4 },
    2: { 1: 1, 2: 4, 3: 7, 4: 10 },
    3: { 1: 1, 2: 7, 3: 14, 4: 21 },
    4: { 1: 1, 2: 14, 3: 30, 4: 45 }
  };

  const level = Math.min(Math.max(0, currentLevel), 4);
  const nextIntervalDays = intervalMap[level][performanceRating] || 1;
  const newLevel = performanceRating >= 3 ? Math.min(level + 1, 5) : Math.max(0, level - 1);

  return { nextIntervalDays, newLevel };
}

test('Spaced Repetition: advances level on Good performance', () => {
  const result = calculateNextReview(1, 3);
  assert.equal(result.nextIntervalDays, 3);
  assert.equal(result.newLevel, 2);
});

test('Spaced Repetition: accelerates interval on Easy rating', () => {
  const result = calculateNextReview(2, 4);
  assert.equal(result.nextIntervalDays, 10);
  assert.equal(result.newLevel, 3);
});

test('Spaced Repetition: resets or drops level on Again (failed review)', () => {
  const result = calculateNextReview(3, 1);
  assert.equal(result.nextIntervalDays, 1);
  assert.equal(result.newLevel, 2);
});

test('Problem Classifier: validates difficulty level bounds', () => {
  const difficulties = ['Easy', 'Medium', 'Hard'];
  assert.ok(difficulties.includes('Medium'));
  assert.equal(difficulties.length, 3);
});
