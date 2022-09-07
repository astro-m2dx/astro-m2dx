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

export function findClosest(name: string, dir: string, stop = ''): string | undefined {
    if (!dir || (stop && !dir.startsWith(stop))) {
        return undefined;
    }
    const file = path.join(dir, name);
    if (exists(file)) {
        return file;
    } else {
        return findClosest(name, path.dirname(dir), stop);
    }
}
