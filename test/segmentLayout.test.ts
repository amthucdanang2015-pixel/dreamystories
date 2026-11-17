/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { columnsForNeeds, labelWidth, labelWords, longestWordWidth, segmentColumns, segmentNeed } from '../src/utils/segmentLayout.ts';

const base = { fontSize: 13, segmentPadding: 16, gap: 2 };
const SLEEP_VI = ['Tắt', '15 phút', '30 phút', '60 phút'];
const SLEEP_EN = ['Off', '15 min', '30 min', '60 min'];
const SPEED = ['0,7×', '0,9×', '1×', '1,2×'];

// Width under a settings row with the icon indent on a 375 pt phone:
// 375 − 2×20 gutter − 16 − 34 − 12 (indent) − 16 (right) − 6 (control padding).
const SE_BELOW = 251;
// Same row without the indent (used when the screen is tight).
const SE_FULL = 375 - 40 - 32 - 6;

test('default text: all four sleep options stay in one row on an SE', () => {
  assert.equal(segmentColumns({ ...base, labels: SLEEP_VI, width: SE_BELOW, fontScale: 1 }), 4);
  assert.equal(segmentColumns({ ...base, labels: SLEEP_EN, width: SE_BELOW, fontScale: 1 }), 4);
});

test('large text on a narrow phone: sleep timer becomes a 2×2 grid instead of clipping', () => {
  // Display Zoom (320 pt) + larger text, as in the bug report.
  const cols = segmentColumns({ ...base, labels: SLEEP_VI, width: 320 - 40 - 32 - 6, fontScale: 1.65 });
  assert.equal(cols, 2);
});

test('accessibility sizes fall back to one option per row, never zero columns', () => {
  const cols = segmentColumns({ ...base, labels: SLEEP_VI, width: 200, fontScale: 3.1 });
  assert.equal(cols, 1);
});

test('every chosen column is wide enough for the longest word of every label', () => {
  for (const labels of [SLEEP_VI, SLEEP_EN, SPEED, ['Tất cả', 'Đang đọc', 'Đã đọc xong']]) {
    for (const fontScale of [0.82, 1, 1.18, 1.35, 1.65, 2, 2.6, 3.1]) {
      for (const width of [150, 200, SE_BELOW, SE_FULL, 360]) {
        const cols = segmentColumns({ ...base, labels, width, fontScale });
        assert.ok(cols >= 1 && cols <= labels.length);
        if (cols > 1) {
          const each = (width - base.gap * (cols - 1)) / cols;
          for (const l of labels) {
            assert.ok(each >= longestWordWidth(l, 13, fontScale) + base.segmentPadding, `${l} @${fontScale} w${width}`);
            assert.ok(each >= labelWidth(l, 13, fontScale) / 2 + base.segmentPadding);
          }
        }
      }
    }
  }
});

test('three options never split 2 + 1: they go to one per row instead', () => {
  const labels = ['Tất cả', 'Đang đọc', 'Đã đọc xong'];
  const cols = segmentColumns({ ...base, labels, width: 180, fontScale: 1.6 });
  assert.ok(cols === 3 || cols === 1);
});

test('unmeasured control renders one column per option', () => {
  assert.equal(segmentColumns({ ...base, labels: SLEEP_VI, width: 0, fontScale: 2 }), 4);
});

// ─── Measured widths (what the component uses once text is laid out) ──

test('measured: AX3XL sleep timer on a 402 pt phone becomes 2×2, words never split', () => {
  // Widths measured at the largest accessibility size: "Off" 74, "min" 82, "15 min" 150.
  const needs = [segmentNeed(74, 74, 16), ...[0, 1, 2].map(() => segmentNeed(82, 150, 16))];
  assert.equal(columnsForNeeds(needs, 317, 2), 2);
});

test('measured: default size keeps one row', () => {
  const needs = [segmentNeed(22, 22, 16), ...[0, 1, 2].map(() => segmentNeed(26, 48, 16))];
  assert.equal(columnsForNeeds(needs, 251, 2), 4);
});

test('measured: a word wider than half the row goes one per row', () => {
  assert.equal(columnsForNeeds([segmentNeed(200, 200, 16), 40, 40, 40], 300, 2), 1);
});

test('labelWords lists each word once', () => {
  assert.deepEqual(labelWords(['15 phút', '30 phút', 'Tắt']), ['15', 'phút', '30', 'Tắt']);
});
