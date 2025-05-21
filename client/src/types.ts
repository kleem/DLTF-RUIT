export interface TimeDependingDistribution{
    time?: number
}
export interface UniformDistributionParams extends  TimeDependingDistribution{
    value: number
}

export interface FixedDistributionParams extends  TimeDependingDistribution{
    fixedTime: number
}


export interface UniformContinuousDistributionParams extends  TimeDependingDistribution{
    min: number
    max: number
    scalingFactor: number
}


export interface NormalDistributionParams extends  TimeDependingDistribution{
    mean: number
    std: number
    scalingFactor: number
}

export interface NormalScaledDistributionParams extends  TimeDependingDistribution{
    mean: number
    std: number
    scalingFactorX: number
    scalingFactorY: number
}

export interface LognormalDistributionParams extends  TimeDependingDistribution{
    mean: number
    std: number
    scalingFactor: number
}

export interface LognormalScaledDistributionParams extends  TimeDependingDistribution{
    mean: number
    std: number
    scalingFactorX: number
    scalingFactorY: number
}

export interface ExponentialDistributionParams extends  TimeDependingDistribution{
    rate: number
    scalingFactor: number
}

export interface ExponentialScaledDistributionParams extends  TimeDependingDistribution{
    rate: number
    scalingFactorX: number
    scalingFactorY: number
}