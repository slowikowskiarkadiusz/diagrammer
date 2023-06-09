export function processLabel(label: string): string {
    let result = [...label];

    for (let i = 0; i < result.length; i++) {
        if (isLetterAndCase(result[i], false)) {
            let nextAreLowercase = true;
            for (let ii = 1; ii < 4; ii++) {
                if (!isLetterAndCase(result[i + ii], true)) {
                    nextAreLowercase = false;
                    break;
                }
            }

            if (nextAreLowercase && i > 0) {
                for (let ii = i + 1; ii < result.length; ii++) {
                    if (isLetterAndCase(result[ii], true)) {
                        if (isLetterAndCase(result[ii - 2], true) || isLetterAndCase(result[ii - 2], false))
                            result.splice(ii - 1, 0, ' ');
                        i++;
                        break;
                    }
                }
            }
        }
    }

    return result.join('').replaceAll('  ', ' ').replaceAll(' ', '\n');
}

function isLetterAndCase(letter: string, isLower: boolean): boolean {
    return !!letter && !!letter.match(/[a-z]/i) && letter === (isLower ? letter.toLowerCase() : letter.toUpperCase());
}

export function proportion(min: number, max: number, percent: number, clamp: boolean = false): number {
    let result = min * (1 - percent) + (max * percent);

    if (clamp) {
        let smaller = [min, max].reduce((p, c) => p < c ? p : c);
        let bigger = [min, max].reduce((p, c) => p > c ? p : c);

        if (result < smaller)
            return smaller;
        if (result > bigger)
            return bigger;
    }
    return result;
}
