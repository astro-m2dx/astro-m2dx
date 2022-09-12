import { constants, PathLike } from 'fs';
import { access } from 'fs/promises';
import { dirname, join, normalize } from 'path';

export async function exists(path: PathLike) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Find a file with given `name` in the directory `dir` or parent directories, optionally stopping in directory `stop`.
 *
 * @param name file to find
 * @param dir directory to start
 * @param stop (optional) directory to stop
 * @returns path of file, if found, `undefined` otherwise
 */
export async function findUp(
  name: string,
  dir: string,
  stop: string | undefined = undefined
): Promise<string | undefined> {
  if (stop) {
    stop = normalize(stop);
  }
  if (!name || !dir || (stop && !normalize(dir).startsWith(stop))) {
    return undefined;
  }
  const file = join(dir, name);
  if (await exists(file)) {
    return file;
  } else {
    return await findUp(name, dirname(dir), stop);
  }
}

/**
 * Find all files with given `name` in the directory `dir` or parent
 * directories, stopping in directory `stop`.
 *
 * The order is from dir to stop
 *
 * @param name file to find
 * @param dir directory to start
 * @param stop directory to stop
 * @returns array of files, might be empty
 */
export async function findUpAll(name: string, dir: string, stop: string): Promise<string[]> {
  stop = normalize(stop);
  if (!name || !dir || !normalize(dir).startsWith(stop)) {
    return [];
  }
  const result: string[] = [];
  async function recursive(name: string, dir: string, stop: string) {
    if (normalize(dir).startsWith(stop)) {
      const file = join(dir, name);
      if (await exists(file)) {
        result.push(file);
      }
      await recursive(name, dirname(dir), stop);
    }
  }
  await recursive(name, dir, stop);
  return result;
}
