import { addDefaults, ObjectLike } from './object-utils';

test('addDefaults adds simple values', function () {
  const a: ObjectLike = {
    a: 'A String',
  };
  const b = {
    b: 42,
  };
  addDefaults(a, b);
  expect(a.a).toBe('A String');
  expect(a.b).toBe(42);
});

test('addDefaults does not overwrite', function () {
  const a: ObjectLike = {
    a: 'A String',
    b: 'Beware',
  };
  const b = {
    b: 42,
  };
  addDefaults(a, b);
  expect(a.a).toBe('A String');
  expect(a.b).toBe('Beware');
});

test('addDefaults adds deep', function () {
  const a: ObjectLike = {
    a: 'A String',
    b: {
      a: 'A deep string',
    },
  };
  const b = {
    b: {
      b: 42,
    },
  };
  addDefaults(a, b);
  expect(a.a).toBe('A String');
  const ab = a.b as ObjectLike;
  expect(ab.a).toBe('A deep string');
  expect(ab.b).toBe(42);
});

test('addDefaults handles Dates', function () {
  const aDate = new Date('2022-01-01');
  const bDate = new Date('2022-02-01');
  const a: ObjectLike = {
    a: aDate,
  };
  const b = {
    a: bDate,
  };
  addDefaults(a, b);
  expect(a.a).toBe(aDate);
});
