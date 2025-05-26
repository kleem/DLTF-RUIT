import {DistributionParams, DistributionType} from "../types.ts";

export const defaultParamsByDistribution: Record<DistributionType, DistributionParams> = {
    FIXED: { type: 'FIXED', fixedTime: 100 },
    UNIFORM: { type: 'UNIFORM', value: 0.0001 },
    NORMAL: {
        type: "NORMAL",
        mean: 302400,            // centro della curva
        std: 70000,              // larghezza ampia
        scalingFactor: 1         // nessuna riscalatura
    },
    NORMAL_SCALED: {
        type: "NORMAL_SCALED",
        mean: 300,
        std: 200,
        scalingFactorX: 2000,
        scalingFactorY: 80
    },
    LOGNORMAL: {
        type: "LOGNORMAL",
        mean: 6.2,               // stesso log-picco
        std: 0.04,
        scalingFactor: 0.000815  // picco verso metà settimana (≈ e^6.2 ≈ 493)
    },
    LOGNORMAL_SCALED: {
        type: "LOGNORMAL_SCALED",
        mean: 6.2,              // leggermente spostato
        std: 0.4,
        scalingFactorX: 0.001,
        scalingFactorY: 100
    },
    EXPONENTIAL: { type: 'EXPONENTIAL', rate: 0.1, scalingFactor: 0.0001 },
    EXPONENTIAL_SCALED: { type: 'EXPONENTIAL_SCALED', rate: 1, scalingFactorX: 0.001, scalingFactorY: 0.4 },
};