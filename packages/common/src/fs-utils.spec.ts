import { join, relative as r } from 'path';
import { findUp, findUpAll } from './fs-utils';

const fixtures = join(process.cwd(), 'fixtures');
const name = '_frontmatter.yaml';

function relative(absolute: string | string[] | undefined) {
  if (Array.isArray(absolute)) {
    return absolute.map((a) => r(fixtures, a));
  }
  return absolute === undefined ? undefined : r(fixtures, absolute);
}

test('findUp finds an immediate file', async function () {
  const dir = join(fixtures, 'd1', 'd11', 'd111');
  const actual = await findUp(name, dir);
  const expected = 'd1/d11/d111/_frontmatter.yaml';
  expect(relative(actual)).toBe(expected);
});

test('findUp finds one up', async function () {
  const dir = join(fixtures, 'd1', 'd11', 'd112');
  const actual = await findUp(name, dir);
  const expected = 'd1/d11/_frontmatter.yaml';
  expect(relative(actual)).toBe(expected);
});

test('findUp finds two up', async function () {
  const dir = join(fixtures, 'd1', 'd12', 'd121');
  const actual = await findUp(name, dir);
  const expected = 'd1/_frontmatter.yaml';
  expect(relative(actual)).toBe(expected);
});

test('findUp stops', async function () {
  const dir = join(fixtures, 'd1', 'd12', 'd121');
  const stop = join(fixtures, 'd1', 'd12');
  const actual = await findUp(name, dir, stop);
  const expected = undefined;
  expect(relative(actual)).toBe(expected);
});

test('findUp goes only up', async function () {
  const dir = join(fixtures, 'd1', 'd11');
  const stop = join(fixtures, 'd1', 'd12');
  const actual = await findUp(name, dir, stop);
  const expected = undefined;
  expect(relative(actual)).toBe(expected);
});

test('findUpAll finds all files', async function () {
  const dir = join(fixtures, 'd1', 'd11', 'd111');
  const stop = join(fixtures, 'd1');
  const actual = await findUpAll(name, dir, stop);
  const expected = [
    'd1/d11/d111/_frontmatter.yaml',
    'd1/d11/_frontmatter.yaml',
    'd1/_frontmatter.yaml',
  ];
  expect(relative(actual)).toEqual(expected);
});
