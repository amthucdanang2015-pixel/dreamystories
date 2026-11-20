/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  Layout,
  balancedColumns,
  contentFrame,
  gridColumns,
  gridItemWidth,
  gutterFor,
  paywallArrangement,
  readerColumn,
  shelfItemWidth,
  sizeClassFor,
} from '../src/utils/responsiveLayout.ts';

test('size classes follow the window, not the device', () => {
  assert.equal(sizeClassFor(375), 'compact'); // iPhone
  assert.equal(sizeClassFor(430), 'compact'); // iPhone Pro Max
  assert.equal(sizeClassFor(507), 'compact'); // iPad half split view
  assert.equal(sizeClassFor(744), 'medium'); // iPad mini portrait
  assert.equal(sizeClassFor(834), 'medium'); // iPad 11" portrait
  assert.equal(sizeClassFor(1032), 'expanded'); // iPad 13" portrait
  assert.equal(sizeClassFor(1376), 'expanded'); // iPad 13" landscape
});

test('phones keep the 20 pt gutter', () => {
  assert.equal(gutterFor(390), 20);
  assert.equal(gutterFor(1032), 32);
});

test('content frame centres a column and never exceeds the window', () => {
  // Phone: the column is the window minus its gutters.
  assert.deepEqual(contentFrame(390, Layout.maxWidth.browse, 20), { contentWidth: 350, inset: 20 });
  // iPad 13" portrait: narrower than the max, so gutters only.
  assert.deepEqual(contentFrame(1032, Layout.maxWidth.browse, 32), { contentWidth: 968, inset: 32 });
  // iPad 13" landscape: the column is centred.
  const wide = contentFrame(1376, Layout.maxWidth.browse, 32);
  assert.equal(wide.contentWidth, 1056);
  assert.equal(wide.inset, 160);
  assert.equal(wide.inset * 2 + wide.contentWidth, 1376);
});

test('grid columns keep covers readable on every width', () => {
  const gap = 16;
  const cols = (w: number) => gridColumns(w, Layout.minCoverWidth, gap, { min: 2 });
  assert.equal(cols(335), 2); // small phone keeps two columns
  assert.equal(cols(680), 3);
  assert.equal(cols(968), 5);
  for (const w of [335, 350, 680, 770, 968, 1056]) {
    const c = cols(w);
    assert.ok(gridItemWidth(w, c, gap) * c + gap * (c - 1) <= w, `fits at ${w}`);
    if (w > 400) assert.ok(gridItemWidth(w, c, gap) >= Layout.minCoverWidth, `readable at ${w}`);
  }
});

test('shelf cards leave a peek of the next card', () => {
  const w = shelfItemWidth(968, 5, 16);
  assert.ok(w * 5 + 16 * 5 < 968, 'five whole cards and a sliver');
  assert.ok(w >= 150);
});

test('page previews avoid a lonely last row', () => {
  assert.equal(balancedColumns(6, 5, 3), 3); // 3 + 3, not 5 + 1
  assert.equal(balancedColumns(8, 5, 3), 4); // 4 + 4
  assert.equal(balancedColumns(10, 5, 3), 5); // 5 + 5
  assert.equal(balancedColumns(7, 5, 3), 4); // 4 + 3
  assert.equal(balancedColumns(4, 5, 3), 4); // one row
  assert.equal(balancedColumns(9, 4, 3), 3); // 3 + 3 + 3
});

test('reader column keeps phones as they were and gives tablets a book page', () => {
  // Phones: full width minus 16 pt margins, in both layouts.
  assert.deepEqual(readerColumn(390, 844, 'horizontal'), { margin: 16, maxWidth: 980, width: 358 });
  assert.equal(readerColumn(390, 844, 'vertical').width, 358);
  // iPad half split view is still a phone layout.
  assert.equal(readerColumn(507, 1032, 'horizontal').margin, 16);
  // iPad 11" portrait: a portrait page with tablet margins.
  assert.deepEqual(readerColumn(834, 1194, 'horizontal'), { margin: 32, maxWidth: 860, width: 770 });
  // iPad 13" portrait: capped at a book-sized page, centred.
  assert.equal(readerColumn(1032, 1376, 'horizontal').width, 860);
  // iPad 13" landscape: a wider two-page spread.
  assert.equal(readerColumn(1376, 1032, 'horizontal').width, 1200);
  // Scroll layout: one comfortable reading column.
  assert.equal(readerColumn(1376, 1032, 'vertical').width, 760);
});

test('paywall arrangement follows the window shape', () => {
  assert.equal(paywallArrangement(390, 844), 'phone');
  assert.equal(paywallArrangement(507, 1032), 'phone'); // split view
  assert.equal(paywallArrangement(744, 1133), 'stacked'); // iPad mini portrait
  assert.equal(paywallArrangement(1032, 1376), 'stacked'); // iPad 13" portrait
  assert.equal(paywallArrangement(694, 1032), 'stacked'); // 13" landscape half split
  assert.equal(paywallArrangement(1194, 834), 'split'); // iPad 11" landscape
  assert.equal(paywallArrangement(1376, 1032), 'split'); // iPad 13" landscape
});
