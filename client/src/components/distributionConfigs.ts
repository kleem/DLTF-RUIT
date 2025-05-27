import {DistributionParams, DistributionType} from "../types.ts";

export const defaultParamsByDistribution: Record<DistributionType, DistributionParams> = {
    FIXED: { type: 'FIXED', fixedTime: 100 },
    UNIFORM: { type: 'UNIFORM', value: 0.0001 },
    NORMAL: {
        type: "NORMAL",
        mean: 2000,            // centro della curva
        std: 2475,              // larghezza ampia
        scalingFactor: 1         // nessuna riscalatura
    },
    NORMAL_SCALED: {
        type: "NORMAL_SCALED",
        mean: 2000,
        std: 2475,
        scalingFactorX: 0.1,
        scalingFactorY: 1657
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
    BASS: {
        type: 'BASS',
        // p: 0.01, // p = 0.01 → percentuale di innovatori (adozione spontanea iniziale)
        // q: 0.3,  // q = 0.3 → percentuale di imitatori (adozione influenzata dagli altri)
        // scalingFactor: 0.001  // scalingFactor = 0.001 → scala temporale ridotta (es. 604800s × 0.001 = 604.8 "unità tempo")

        // curva più lenta, picco più lontano
        p: 0.001, // p = 0.01 → percentuale di innovatori (adozione spontanea iniziale)
        q: 0.05,  // q = 0.3 → percentuale di imitatori (adozione influenzata dagli altri)
        scalingFactor: 0.0001  // scalingFactor = 0.001 → scala temporale ridotta (es. 604800s × 0.001 = 604.8 "unità tempo")

    },
    //  frazione di popolazione che ha adottato entro il tempo t

    BASS_CUMULATIVE: {
        type: 'BASS_CUMULATIVE',
        // p: 0.01,  //curva subito,  q/p= 30, ripida cioè imitazione > innovazione → diffusione esplosiva)
        // q: 0.3,
        // scalingFactor: 0.001 // tempo effettivo in secondi (es. 604800s × 0.001 = 604.8 "unità tempo")

        p: 0.001,  //più distesa
        q: 0.05,
        scalingFactor: 0.0001 // tempo effettivo in secondi (es. 604800s × 0.001 = 604.8 "unità tempo")
    }

};