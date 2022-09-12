export type ObjectLike = Record<string, unknown>;

export function isObjectLike(object: unknown): object is ObjectLike {
  return !!object && typeof object === 'object';
}

function _addDefaults(target: ObjectLike, source: ObjectLike) {
  Object.keys(source).forEach((key: string) => {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (!targetValue) {
      target[key] = sourceValue;
    } else if (isObjectLike(targetValue) && isObjectLike(sourceValue)) {
      _addDefaults(targetValue, sourceValue);
    }
  });
}

export function addDefaults(target: ObjectLike, ...objects: ObjectLike[]): void {
  if (!isObjectLike(target)) {
    throw new Error(`target '${JSON.stringify(target)}' is not an object, but ${typeof target}`);
  }
  for (const source of objects) {
    if (!isObjectLike(source)) {
      throw new Error(`source '${JSON.stringify(source)}' is not an object, but ${typeof source}`);
    }
    _addDefaults(target, source);
  }
}
