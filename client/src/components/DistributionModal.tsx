import React, {useState} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Slider,
    Typography
} from '@mui/material';
import {Line} from 'react-chartjs-2';
import {CategoryScale, Chart, LinearScale, LineElement, LogarithmicScale, PointElement} from 'chart.js';

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, LogarithmicScale);

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
        scalingFactorX: 0.1,
        scalingFactorY: 0.1,
        scalingFactor: 1,
        amplitude: 1,
        rate: 0.01,
        time: 1,
        ...initialValue
    });
    const [previewWindow, setPreviewWindow] = useState<number>(1000);
    const [yRange, setYRange] = useState<number>(1);
    const [yScaleType, setYScaleType] = useState<'linear' | 'logarithmic'>('linear');

    const handleParamChange = (name: keyof DistributionParams) => (_: Event, value: number | number[]) => {
        setParams(prev => ({...prev, [name]: value as number}));
    };

    const handleConfirm = () => {
        onConfirm({type: distribution, ...params});
    };

    const getProb = (t: number): number => {
        const {
            fixedTime, value, min, max,
            mean, std, scalingFactor = 1, amplitude = 1, rate, scalingFactorX, scalingFactorY
        } = params;

        const realTime = t * scalingFactor;

        switch (distribution) {
            case 'FIXED':
                return t >= (fixedTime!) && t <= (fixedTime!) ? 1 : 0;
            case 'UNIFORM':
                return value ?? 0;
            case 'NORMAL':
                return normal(t, mean!, std!, scalingFactor);
            case 'NORMAL_SCALED':
                return normalScaled(t, mean!, std!, scalingFactorX, scalingFactorY);
            case 'LOGNORMAL':
                return lognormal(t, mean!, std!, scalingFactor);
            case 'LOGNORMAL_SCALED':
                return lognormalScaled(realTime, mean!, std!, scalingFactorX, scalingFactorY);
            case 'EXPONENTIAL':
                return exponential(t, rate!, scalingFactor);
            case 'EXPONENTIAL_SCALED':
                return exponentialScaled(realTime, rate!, scalingFactorX, scalingFactorY);
            default:
                return 0;
        }
    };

    const normal = (time: number, mean: number, std: number, scalingFactor: number) => {
        const realTime = time * scalingFactor;
        const exp = -1 * (((realTime - mean) * (realTime - mean)) / (2 * std * std));
        const ratio = Math.sqrt(2 * std * std * Math.PI);
        return (1 / ratio) * Math.exp(exp);
    };

    const normalScaled = (time: number, mean: number, std: number, scalingFactorX: number, scalingFactorY: number) => {
        const realTime = time * scalingFactorX;
        const exp = -1 * (((realTime - mean) * (realTime - mean)) / (2 * std * std));
        const ratio = Math.sqrt(2 * std * std * Math.PI);
        return (scalingFactorY / ratio) * Math.exp(exp);
    };

    const lognormal = (time: number, mean: number, std: number, scalingFactor: number) => {
        const realTime = time * scalingFactor;
        if (realTime == 0)
            return 0;
        const exp = -1 * (Math.log(realTime) - mean) * (Math.log(realTime) - mean) / (2 * std * std);
        const ratio = realTime * std * Math.sqrt(2 * Math.PI);
        return 1 / ratio * Math.exp(exp);
    };
    const lognormalScaled = (time: number, mean: number, std: number, scalingFactorX: number, scalingFactorY: number) => {
        const realTime = time * scalingFactorX;
        if (realTime == 0)
            return 0;
        const exp = -1 * (Math.log(realTime) - mean) * (Math.log(realTime) - mean) / (2 * std * std);
        const ratio = realTime * std * Math.sqrt(2 * Math.PI);
        return scalingFactorY / ratio * Math.exp(exp);
    };

    const exponential = (time: number, rate: number, scalingFactor: number) => {
        const realTime = time * scalingFactor;
        return rate * Math.exp(-rate * realTime);
    };

    const exponentialScaled = (time: number, rate: number, scalingFactorX: number, scalingFactorY: number) => {
        const realTime = time * scalingFactorX;
        return scalingFactorY * rate * Math.exp(-1 * rate * realTime);
    };

    const generateData = () => {
        const data: { x: number, y: number }[] = [];
        for (let t = 0; t < previewWindow; t++) {
            data.push({x: t, y: getProb(t)});
        }
        return data;
    };

    const maxY = Math.max(...generateData().map(d => d.y));

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

                    <Divider textAlign={'left'}>Graphs controls preview</Divider>
                    <Typography>Time (seconds): {previewWindow}</Typography>
                    <Slider min={100} max={20000} step={100} value={previewWindow}
                            onChange={(_, v) => setPreviewWindow(v as number)} sx={{mb: 2}}/>
                    <Typography>Probability: {yRange}</Typography>
                    <Slider min={0} max={1.1} step={0.01} value={yRange}
                            onChange={(_, v) => setYRange(v as number)} sx={{mb: 2}}/>
                    <Divider textAlign={'left'}>Distribution Parameters</Divider>
                    {/*<FormControl sx={{mb: 2, minWidth: 200}}>*/}
                    {/*    <InputLabel>Y Axis Scale</InputLabel>*/}
                    {/*    <Select*/}
                    {/*        value={yScaleType}*/}
                    {/*        label="Y Axis Scale"*/}
                    {/*        onChange={e => setYScaleType(e.target.value as 'linear' | 'logarithmic')}*/}
                    {/*    >*/}
                    {/*        <MenuItem value="linear">Linear</MenuItem>*/}
                    {/*        <MenuItem value="logarithmic">Log</MenuItem>*/}
                    {/*    </Select>*/}
                    {/*</FormControl>*/}

                    {distribution === 'FIXED' && (
                        <>
                            <Typography>Fixed Time: {params.fixedTime}</Typography>
                            <Slider min={0} max={previewWindow} value={params.fixedTime}
                                    onChange={handleParamChange('fixedTime')}/>
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
                            <Slider min={0} max={previewWindow} value={params.min} onChange={handleParamChange('min')}/>
                            <Typography>Max: {params.max}</Typography>
                            <Slider min={0} max={previewWindow} value={params.max} onChange={handleParamChange('max')}/>
                            <Typography>Scaling Factor: {params.scalingFactor}</Typography>
                            <Slider min={0.01} max={5} step={0.01} value={params.scalingFactor}
                                    onChange={handleParamChange('scalingFactor')}/>
                        </>
                    )}

                    {(distribution === 'NORMAL' || distribution === 'LOGNORMAL') && (
                        <>
                            <Typography>Mean: {params.mean}</Typography>
                            <Slider min={1} max={previewWindow} value={params.mean}
                                    onChange={handleParamChange('mean')}/>
                            <Typography>Std Dev: {params.std}</Typography>
                            <Slider min={1} max={100} value={params.std} onChange={handleParamChange('std')}/>
                            <Typography>Scaling Factor: {params.scalingFactor}</Typography>
                            <Slider min={0.0001} max={5} step={0.0001} value={params.scalingFactor}
                                    onChange={handleParamChange('scalingFactor')}/>
                        </>
                    )}

                    {(distribution === 'NORMAL_SCALED' || distribution === 'LOGNORMAL_SCALED') && (
                        <>
                            <Typography>Mean: {params.mean}</Typography>
                            <Slider min={1} max={previewWindow} value={params.mean}
                                    onChange={handleParamChange('mean')}/>
                            <Typography>Std Dev: {params.std}</Typography>
                            <Slider min={1} max={100} value={params.std} onChange={handleParamChange('std')}/>
                            <Typography>Scaling FactorX: {params.scalingFactorX}</Typography>
                            <Slider min={0.01} max={5} step={0.01} value={params.scalingFactorX}
                                    onChange={handleParamChange('scalingFactorX')}/>
                            <Typography>Scaling FactorY: {params.scalingFactorY}</Typography>
                            <Slider min={0.01} max={25} step={0.01} value={params.scalingFactorY}
                                    onChange={handleParamChange('scalingFactorY')}/>
                        </>
                    )}

                    {/*{distribution.includes('SCALED') && (*/}
                    {/*    <>*/}
                    {/*        <Typography>Scaling Factor: {params.scalingFactor}</Typography>*/}
                    {/*        <Slider min={0.01} max={5} step={0.01} value={params.scalingFactor}*/}
                    {/*                onChange={handleParamChange('scalingFactor')}/>*/}
                    {/*        <Typography>Amplitude: {params.amplitude}</Typography>*/}
                    {/*        <Slider min={0.01} max={5} step={0.01} value={params.amplitude}*/}
                    {/*                onChange={handleParamChange('amplitude')}/>*/}
                    {/*    </>*/}
                    {/*)}*/}

                    {distribution.includes('EXPONENTIAL') && (
                        <>
                            <Typography>Rate (λ): {params.rate}</Typography>
                            <Slider min={0.0001} max={1} step={0.0001} value={params.rate}
                                    onChange={handleParamChange('rate')}/>
                            <Typography>Scaling Factor: {params.scalingFactor}</Typography>
                            <Slider min={0.0001} max={5} step={0.0001} value={params.scalingFactor}
                                    onChange={handleParamChange('scalingFactor')}/>

                        </>
                    )}

                    {distribution.includes('EXPONENTIAL_SCALED') && (
                        <>
                            <Typography>Rate (λ): {params.rate}</Typography>
                            <Slider min={0.0001} max={1} step={0.0001} value={params.rate}
                                    onChange={handleParamChange('rate')}/>
                            <Typography>Scaling FactorX: {params.scalingFactorX}</Typography>
                            <Slider min={0.01} max={5} step={0.01} value={params.scalingFactorX}
                                    onChange={handleParamChange('scalingFactorX')}/>
                            <Typography>Scaling FactorY: {params.scalingFactorY}</Typography>
                            <Slider min={0.01} max={25} step={0.01} value={params.scalingFactorY}
                                    onChange={handleParamChange('scalingFactorY')}/>
                        </>
                    )}

                    <Typography variant="body2" sx={{mb: 1}}>Max Y ≈ {maxY.toExponential(2)}</Typography>

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
                                y: {
                                    max: yRange,
                                    // type: yScaleType,
                                    title: {display: true, text: 'Probability'},
                                    beginAtZero: true,
                                }
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
