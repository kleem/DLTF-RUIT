import React, {useState} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Slider,
    Typography
} from '@mui/material';
import {Line} from 'react-chartjs-2';
import {CategoryScale, Chart, LinearScale, LineElement, PointElement} from 'chart.js';
import {
    ExponentialDistributionParams,
    ExponentialScaledDistributionParams,
    FixedDistributionParams,
    LognormalDistributionParams,
    LognormalScaledDistributionParams,
    NormalDistributionParams,
    NormalScaledDistributionParams,
    UniformContinuousDistributionParams,
    UniformDistributionParams
} from "../types.ts";

Chart.register(LineElement, PointElement, CategoryScale, LinearScale);

type DistributionType =
    | 'FIXED'
    | 'UNIFORM'
    | 'UNIFORM_CONTINUOUS_SCALED'
    | 'NORMAL'
    | 'NORMAL_SCALED'
    | 'LOGNORMAL'
    | 'LOGNORMAL_SCALED'
    | 'EXPONENTIAL'
    | 'EXPONENTIAL_SCALED';

export type DistributionParamsTypes =
    ExponentialDistributionParams
    | ExponentialScaledDistributionParams
    | UniformDistributionParams
    | UniformContinuousDistributionParams
    | FixedDistributionParams
    | NormalDistributionParams
    | NormalScaledDistributionParams
    | LognormalDistributionParams
    | LognormalScaledDistributionParams;

export interface DistributionParams extends DistributionParamsTypes {
    type: DistributionType;

}

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: (config: DistributionParams) => void;
    initialValue?: DistributionParams;
}

const DistributionModal: React.FC<Props> = ({open, onClose, onConfirm, initialValue}) => {
    const [distribution, setDistribution] = useState<DistributionType>(initialValue?.type || 'NORMAL');
    const [params, setParams] = useState<DistributionParams>({
        type: initialValue?.type || 'NORMAL',
        fixedTime: 100,
        value: 0.01,
        min: 0,
        max: 100,
        mean: 100,
        std: 10,
        scalingFactor: 1,
        amplitude: 1,
        rate: 0.01,
        time: 1,
        ...initialValue
    });

    const handleParamChange = (name: keyof DistributionParams) => (_: Event, value: number | number[]) => {
        setParams(prev => ({...prev, [name]: value as number}));
    };

    const handleConfirm = () => {
        onConfirm({type: distribution, ...params});
    };

    const getProb = (t: number): number => {
        const {
            fixedTime, value, min, max,
            mean, std, scalingFactor = 1, amplitude = 1, rate
        } = params;

        const realTime = t * scalingFactor;

        switch (distribution) {
            case 'FIXED':
                return t >= (fixedTime!) && t <= (fixedTime!) ? 1 : 0;
            case 'UNIFORM':
                return value ?? 0;
            // case 'UNIFORM_CONTINUOUS_SCALED':
            //     return realTime >= (min ?? 0) && realTime <= (max ?? 1) ? 1 / ((max ?? 1) - (min ?? 0)) : 0;
            case 'NORMAL':
                return normal(t, mean!, std!, scalingFactor);
            case 'NORMAL_SCALED':
                return amplitude * normal(realTime, mean!, std!);
            case 'LOGNORMAL':
                return lognormal(t, mean!, std!);
            case 'LOGNORMAL_SCALED':
                return amplitude * lognormal(realTime, mean!, std!);
            case 'EXPONENTIAL':
                return rate! * Math.exp(-rate! * t);
            case 'EXPONENTIAL_SCALED':
                return amplitude * rate! * Math.exp(-rate! * realTime);
            default:
                return 0;
        }
    };

    const normal = (time: number, mean: number, std: number, scalingFactor: number) => {
        const realTime = time * scalingFactor;
        const exp = -1 * (((realTime - mean) * (realTime - mean)) / (2 * std * std));
        const ratio = Math.sqrt(2 * std * std * Math.PI);
        return (1 / ratio) * Math.exp(exp);

        // const coeff = 1 / (std * Math.sqrt(2 * Math.PI));
        // const exp = Math.exp(-Math.pow(x - mean, 2) / (2 * std * std));
        // return coeff * exp;
    };

    const lognormal = (x: number, mean: number, std: number) => {
        if (x <= 0) return 0;
        const coeff = 1 / (x * std * Math.sqrt(2 * Math.PI));
        const exp = Math.exp(-Math.pow(Math.log(x) - mean, 2) / (2 * std * std));
        return coeff * exp;
    };

    const generateData = () => {
        const data: { x: number, y: number }[] = [];
        for (let t = 0; t < 500; t++) {
            data.push({x: t, y: getProb(t)});
        }
        return data;
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Configure Distribution</DialogTitle>
            <DialogContent>
                <Box sx={{mt: 2}}>
                    <FormControl sx={{mb: 2, minWidth: 200}}>
                        <InputLabel>Distribution</InputLabel>
                        <Select
                            value={distribution}
                            label="Distribution"
                            onChange={e => {
                                const type = e.target.value as DistributionType;
                                setDistribution(type);
                                setParams(prev => ({...prev, type}));
                            }}
                        >
                            {['FIXED', 'UNIFORM', 'UNIFORM_CONTINUOUS_SCALED', 'NORMAL', 'NORMAL_SCALED',
                                'LOGNORMAL', 'LOGNORMAL_SCALED', 'EXPONENTIAL', 'EXPONENTIAL_SCALED'].map(d => (
                                <MenuItem key={d} value={d}>{d}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {distribution === 'FIXED' && (
                        <>
                            {/*<Text>{'time: one day(2592000) one month (864000) ten days (604800) seven days  (1209600) two weeks'}</Text>*/}
                            {/*<Typography>Simulation Time: {params.time}</Typography>*/}
                            {/*/!*time - one day//2592000; one month//864000; ten days//604800 seven days  //  1209600 two weeks*!/*/}
                            {/*<Slider min={0} max={time} value={params.time}*/}
                            {/*        onChange={handleParamChange('time')}/>*/}

                            {/*86.400 secondi (1 giorno)
	•	604.800 secondi (7 giorni)
	•	fino a 2.592.000 secondi (30 giorni)*/}

                            <Typography>Fixed Time: {params.fixedTime}</Typography>
                            <Slider min={0} max={500} value={params.fixedTime}
                                    onChange={handleParamChange('fixedTime')}/>

                            {/*<Typography>Tolerance: {params.tolerance}</Typography>*/}
                            {/*<Slider min={0} max={100} value={params.tolerance}*/}
                            {/*        onChange={handleParamChange('tolerance')}/>*/}
                        </>
                    )}

                    {distribution === 'UNIFORM' && (
                        <>
                            <Typography>Value: {params.value}</Typography>
                            <Slider min={0.0001} max={1} step={0.0001} value={params.value}
                                    onChange={handleParamChange('value')}/>
                        </>
                    )}

                    {distribution === 'UNIFORM_CONTINUOUS_SCALED' && (
                        <>
                            <Typography>Min: {params.min}</Typography>
                            <Slider min={0} max={500} value={params.min} onChange={handleParamChange('min')}/>
                            <Typography>Max: {params.max}</Typography>
                            <Slider min={0} max={500} value={params.max} onChange={handleParamChange('max')}/>
                            <Typography>Scaling Factor: {params.scalingFactor}</Typography>
                            <Slider min={0.01} max={5} step={0.01} value={params.scalingFactor}
                                    onChange={handleParamChange('scalingFactor')}/>
                        </>
                    )}

                    {distribution.includes('NORMAL') || distribution.includes('LOGNORMAL') ? (
                        <>
                            <Typography>Mean: {params.mean}</Typography>
                            <Slider min={1} max={200} value={params.mean} onChange={handleParamChange('mean')}/>
                            <Typography>Std Dev: {params.std}</Typography>
                            <Slider min={1} max={100} value={params.std} onChange={handleParamChange('std')}/>
                            <Typography>Scaling Factor: {params.scalingFactor}</Typography>
                            <Slider min={0.01} max={5} step={0.01} value={params.scalingFactor}
                                    onChange={handleParamChange('scalingFactor')}/>                        </>
                    ) : null}

                    {distribution.includes('SCALED') ? (
                        <>
                            <Typography>Scaling Factor: {params.scalingFactor}</Typography>
                            <Slider min={0.01} max={5} step={0.01} value={params.scalingFactor}
                                    onChange={handleParamChange('scalingFactor')}/>
                            <Typography>Amplitude: {params.amplitude}</Typography>
                            <Slider min={0.01} max={5} step={0.01} value={params.amplitude}
                                    onChange={handleParamChange('amplitude')}/>
                        </>
                    ) : null}

                    {distribution.includes('EXPONENTIAL') ? (
                        <>
                            <Typography>Rate (λ): {params.rate}</Typography>
                            <Slider min={0.0001} max={1} step={0.0001} value={params.rate}
                                    onChange={handleParamChange('rate')}/>
                        </>
                    ) : null}

                    <Line
                        data={{
                            datasets: [{
                                label: `${distribution} Probability`,
                                data: generateData(),
                                borderWidth: 2,
                                fill: true,
                                pointRadius: 0,
                            }]
                        }}
                        options={{
                            responsive: true,
                            scales: {
                                x: {type: 'linear', title: {display: true, text: 'Time'}},
                                y: {beginAtZero: true, title: {display: true, text: 'Probability'}, min: 0, max: 1}
                            }
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Annulla</Button>
                <Button onClick={handleConfirm} variant="contained">Conferma</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DistributionModal;
