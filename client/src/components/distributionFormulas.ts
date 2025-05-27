import {DistributionParams} from "../types.ts";

export const normal = (time: number, mean: number, std: number, scalingFactor: number) => {
    const realTime = time * scalingFactor;
    const exp = -1 * (((realTime - mean) * (realTime - mean)) / (2 * std * std));
    const ratio = Math.sqrt(2 * std * std * Math.PI);
    return (1 / ratio) * Math.exp(exp);
};

export const normalDistribution = (
    t: number,
    mean: number,
    std: number,
    scalingFactor: number = 1,
    amplitude: number = 1
): number => {
    const realTime = t * scalingFactor;
    const exponent = -((realTime - mean) ** 2) / (2 * std ** 2);
    const denominator = Math.sqrt(2 * Math.PI * std ** 2);
    return amplitude * (1 / denominator) * Math.exp(exponent);
}

export const normalScaled = (time: number, mean: number, std: number, scalingFactorX: number, scalingFactorY: number) => {
    const realTime = time * scalingFactorX;
    const exp = -1 * (((realTime - mean) * (realTime - mean)) / (2 * std * std));
    const ratio = Math.sqrt(2 * std * std * Math.PI);
    return (scalingFactorY / ratio) * Math.exp(exp);
};

export const lognormal = (time: number, mean: number, std: number, scalingFactor: number) => {
    const realTime = time * scalingFactor;
    if (realTime == 0)
        return 0;
    const exp = -1 * (Math.log(realTime) - mean) * (Math.log(realTime) - mean) / (2 * std * std);
    const ratio = realTime * std * Math.sqrt(2 * Math.PI);
    return 1 / ratio * Math.exp(exp);
};
export const lognormalScaled = (time: number, mean: number, std: number, scalingFactorX: number, scalingFactorY: number) => {
    const realTime = time * scalingFactorX;
    if (realTime == 0)
        return 0;
    const exp = -1 * (Math.log(realTime) - mean) * (Math.log(realTime) - mean) / (2 * std * std);
    const ratio = realTime * std * Math.sqrt(2 * Math.PI);
    return scalingFactorY / ratio * Math.exp(exp);
};

export const exponential = (time: number, rate: number, scalingFactor: number) => {
    const realTime = time * scalingFactor;
    return rate * Math.exp(-rate * realTime);
};

export const exponentialScaled = (time: number, rate: number, scalingFactorX: number, scalingFactorY: number) => {
    const realTime = time * scalingFactorX;
    return scalingFactorY * rate * Math.exp(-1 * rate * realTime);
};

// export const bassModel = (time: number, p: number, q: number, scalingFactor: number = 1): number => {
//     const realTime = time * scalingFactor;
//
//     const expTerm = Math.exp(-(p + q) * realTime);
//     const numerator = (p + q) ** 2 * expTerm;
//     const denominator = p + q * expTerm;
//     return numerator / (denominator ** 2);
// };
export const bassModel = (
    time: number,
    p: number,
    q: number,
    scalingFactor: number = 1
): number => {
    const F = bassCumulative(time, p, q, scalingFactor);
    return (p + q * F) * (1 - F);
};


export const bassCumulative = (
    time: number,
    p: number,
    q: number,
    scalingFactor: number = 1
): number => {
    const realTime = time * scalingFactor;
    const exp = Math.exp(-(p + q) * realTime);
    return (1 - exp) / (1 + (q / p) * exp);
};


export const getProbFromParams = (
    type: string,
    t: number,
    params: DistributionParams
): number => {
    const realTime = t * (params.scalingFactor ?? params.scalingFactorX ?? 1);
    switch (type) {
        case 'FIXED':
            return t === params.fixedTime ? 1 : 0;
        case 'UNIFORM':
            return params.value ?? 0;
        case 'NORMAL': {
            // if (params.scalingFactor == null) {
            //     throw new Error("scalingFactor is required for NORMAL distribution");
            // }
            return normal(t, params.mean ?? 0, params.std ?? 1, params.scalingFactor??1);
        }
        case 'NORMAL_SCALED':
            return normalScaled(t, params.mean ?? 0, params.std ?? 1, params.scalingFactorX ?? 1, params.scalingFactorY ?? 1);
        case 'LOGNORMAL': {
            // if (params.scalingFactor == null) {
            //     throw new Error("scalingFactor is required for LOGNORMAL distribution");
            // }
            return lognormal(t, params.mean ?? 0, params.std ?? 1, params.scalingFactor??1);
        }
        case 'LOGNORMAL_SCALED':
            return lognormalScaled(realTime, params.mean ?? 0, params.std ?? 1, params.scalingFactorX ?? 1, params.scalingFactorY ?? 1);
        case 'EXPONENTIAL': {
            // if (params.scalingFactor == null) {
            //     throw new Error("scalingFactor is required for EXPONENTIAL distribution");
            // }
            return exponential(t, params.rate ?? 1, params.scalingFactor??1);
        }
        case 'EXPONENTIAL_SCALED':
            return exponentialScaled(realTime, params.rate ?? 1, params.scalingFactorX ?? 1, params.scalingFactorY ?? 1);
        case 'BASS':
            return bassModel(t, params.p ?? 0.01, params.q ?? 0.3, params.scalingFactor ?? 1);
        case 'BASS_CUMULATIVE':
            return bassCumulative(t, params.p ?? 0.01, params.q ?? 0.3, params.scalingFactor ?? 1);
        default:
            return 0;
    }
};