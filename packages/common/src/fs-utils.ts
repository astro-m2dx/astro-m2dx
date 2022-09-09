import { accessSync, constants, PathLike } from 'fs';
import * as path from 'path';

export function exists(path: PathLike) {
  try {
    accessSync(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Find a file with given `name` in the `dir`ectory or parent directories, optionally stopping in directory `stop`.
 *
 * @param name file to find
 * @param dir directory to start
 * @param stop directory to stop
 * @returns path of file, if found, `undefined` otherwise
 */
export function findUp(name: string, dir: string, stop = ''): string | undefined {
  if (!dir || (stop && !dir.startsWith(stop))) {
    return undefined;
  }
  const file = path.join(dir, name);
  if (exists(file)) {
    return file;
  } else {
    return findUp(name, path.dirname(dir), stop);
  }
}
