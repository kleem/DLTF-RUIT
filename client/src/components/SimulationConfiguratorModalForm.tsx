import React, {useState} from "react";
import {
    Box,
    Button,
    Chip,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid as MuiGrid,
    IconButton,
    InputAdornment,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import {Add, Close, ContentCopy, Delete, Edit, Refresh, Save, Send, Upload, Visibility,} from "@mui/icons-material";
import axios from "axios";
import DistributionModal from "./DistributionModal.tsx";
import {distributionTypes, Event, EventDependency, ProbabilityDistribution, SimulationConfig} from "../types.ts";
import {defaultParamsByDistribution} from "./distributionConfigs.ts";
import {getProbFromParams,} from "./distributionFormulas.ts";
import {Line} from "react-chartjs-2";

const durationOptions = [
    {value: 86400, label: "1 Day"},
    {value: 604800, label: "7 Days"},
    {value: 864000, label: "10 Days"},
    {value: 1209600, label: "14 Days"},
    {value: 2592000, label: "30 Days"},
];

const aggregationOptions = [
    {value: 1, label: "Seconds"},
    {value: 60, label: "Minutes"},
    {value: 3600, label: "Hours"},
];


const downloadConfig = (config: SimulationConfig) => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(config, null, 2)], {type: "application/json"});
    element.href = URL.createObjectURL(file);
    element.download = `${config.name}_simulation_config.json`;
    document.body.appendChild(element);
    element.click();
};

const getProbabilityDistribution = (event: Event) => {
    if (!event.dependencies || event.dependencies.length === 0) {
        return [];
    }

    return event.dependencies.map(dep => {
        const type = dep.probabilityDistribution.type;
        const dist = dep.probabilityDistribution;

        switch (type) {
            case "FIXED":
                return {
                    type,
                    fixedTime: dist.fixedTime,
                };
            case "UNIFORM":
                return {
                    type,
                    value: dist.value,
                };
            case "NORMAL_SCALED":
            case "LOGNORMAL_SCALED":
                return {
                    type,
                    mean: dist.mean,
                    std: dist.std,
                    scalingFactorX: dist.scalingFactorX,
                    scalingFactorY: dist.scalingFactorY,
                };
            case "NORMAL":
            case "LOGNORMAL":
                return {
                    type,
                    mean: dist.mean,
                    std: dist.std,
                    scalingFactor: dist.scalingFactor,
                };
            case "EXPONENTIAL_SCALED":
                return {
                    type,
                    rate: dist.rate,
                    scalingFactorX: dist.scalingFactorX,
                    scalingFactorY: dist.scalingFactorY,
                };
            case "EXPONENTIAL":
                return {
                    type,
                    rate: dist.rate,
                    scalingFactor: dist.scalingFactor,
                };
            case "BASS":
            case "BASS_CUMULATIVE":
                return {
                    type,
                    p: dist.p,
                    q: dist.q,
                    scalingFactor: dist.scalingFactor,
                };
            case "GARTNER_SASAKI":
                return {
                    type,
                    A: dist.A,
                    B: dist.B,
                    C: dist.C,
                    D: dist.D,
                    E: dist.E,
                    F: dist.F,
                    G: dist.G,
                    H: dist.H,
                    I: dist.I,
                    scalingFactor: dist.scalingFactor,
                };
            default:
                return {};
        }
    });
};

const SimulationConfiguratorModalForm: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [openDistributions, setOpenDistributions] = useState<(boolean | boolean[])[]>([]);
    const [name, setName] = useState("Simulation");
    const [duration, setDuration] = useState<number>(604800);
    const [aggregation, setAggregation] = useState<number>(60);
    const [entityInput, setEntityInput] = useState("");
    const [entities, setEntities] = useState<string[]>([]);
    const [configPreview, setConfigPreview] = useState<SimulationConfig | null>(null);
    const [numRuns, setNumRuns] = useState<number | string>("5");
    const [expandedEvent, setExpandedEvent] = useState<number | null>(null);

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset all fields?")) {
            setName("");
            setDuration(604800);
            setAggregation(60);
            setEntityInput("");
            setEntities([]);
            setEvents([]);
            setNumRuns("5");
            setConfigPreview(null);
        }
    };

    const handleAddEvent = () => {
        const newEvent: Event = {
            eventName: "",
            description: "",
            instanceOf: null,
            dependencies: [],
            gasCost: 0,
            relatedEvents: null
        };
        setEvents([...events, newEvent]);
        setOpenDistributions([...openDistributions, false]);
        setExpandedEvent(events.length);
    };
    const [showAllDistributions, setShowAllDistributions] = useState<boolean>(false);

    const handleImportConfig = (config: SimulationConfig) => {
        setName(config.name);
        setDuration(config.maxTime);
        setAggregation(config.numAggr);
        setNumRuns(config.numRuns);
        setEntities(config.entities);
        setEvents(config.events);
    };

    const handleRemoveEvent = (index: number) => {
        const updated = events.filter((_, i) => i !== index);
        const modals = openDistributions.filter((_, i) => i !== index);
        setEvents(updated);
        setOpenDistributions(modals);
        if (expandedEvent === index) setExpandedEvent(null);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const jsonConfig = JSON.parse(e.target?.result as string) as SimulationConfig;
                    handleImportConfig(jsonConfig);
                } catch (error) {
                    alert("Invalid JSON file");
                }
            };
            reader.readAsText(file);
        }
    };

    const handleEventChange = (index: number, field: string, value: any) => {
        const updated = [...events];
        const updatedEvent = updated[index];

        if (field.startsWith("dependencies[")) {
            const matches = field.match(/dependencies\[(\d+)\]\.(.+)/);
            if (matches) {
                const [_, depIndex, depField] = matches;
                if (!updatedEvent.dependencies) {
                    updatedEvent.dependencies = [];
                }
                while (updatedEvent.dependencies.length <= parseInt(depIndex)) {
                    updatedEvent.dependencies.push({
                        dependOn: null,
                        maxProbabilityMatches: null,
                        probabilityDistribution: { type: "" as const }
                    });
                }
                if (depField.startsWith("probabilityDistribution.")) {
                    const paramName = depField.split(".")[1];
                    (updatedEvent.dependencies[parseInt(depIndex)].probabilityDistribution as any)[paramName] = value;
                } else {
                    (updatedEvent.dependencies[parseInt(depIndex)] as any)[depField] = value;
                }
            }
        } else {
            (updatedEvent as any)[field] = value;
        }

        setEvents(updated);
    };

    const handleAddEntity = () => {
        const trimmed = entityInput.trim();
        if (trimmed && !entities.includes(trimmed)) {
            setEntities([...entities, trimmed]);
            setEntityInput("");
        }
    };

    const handleRemoveEntity = (index: number) => {
        setEntities(prev => prev.filter((_, i) => i !== index));
    };

    const handleOpenModalDistribution = (index: number) => {
        const updated = [...openDistributions];
        updated[index] = true;
        setOpenDistributions(updated);
    };

    const handleCloseModalDistribution = (index: number) => {
        const updated = [...openDistributions];
        updated[index] = false;
        setOpenDistributions(updated);
    };

    const handleAddDependency = (eventIndex: number) => {
        const updated = [...events];
        const event = updated[eventIndex];
        if (!event.dependencies) {
            event.dependencies = [];
        }
        event.dependencies.push({
            dependOn: null,
            maxProbabilityMatches: null,
            probabilityDistribution: { type: "" as const }
        });
        setEvents(updated);
        // Add a new distribution modal state
        const updatedModals = [...openDistributions];
        updatedModals[eventIndex] = Array.isArray(updatedModals[eventIndex]) 
            ? [...updatedModals[eventIndex], false]
            : [false];
        setOpenDistributions(updatedModals);
    };

    const handleRemoveDependency = (eventIndex: number, depIndex: number) => {
        const updated = [...events];
        const event = updated[eventIndex];
        if (event.dependencies) {
            event.dependencies.splice(depIndex, 1);
            if (event.dependencies.length === 0) {
                event.dependencies = null;
            }
        }
        setEvents(updated);
        // Remove the corresponding distribution modal state
        const updatedModals = [...openDistributions];
        if (Array.isArray(updatedModals[eventIndex])) {
            updatedModals[eventIndex].splice(depIndex, 1);
        }
        setOpenDistributions(updatedModals);
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        const config = {
            maxTime: duration,
            numAggr: aggregation,
            numRuns: numRuns,
            name: name,
            entities: entities,
            events: events.map(event => ({
                ...event,
                dependencies: event.dependencies?.map(dep => ({
                    ...dep,
                    probabilityDistribution: getProbabilityDistribution(event)[event.dependencies?.indexOf(dep) || 0]
                }))
            })),
        };

        try {
            const response = await axios.post('http://localhost:8099/newsimulation', config, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Risposta dal server:', response.data);
            setOpen(false);
        } catch (error) {
            console.error('Errore nella simulazione:', error);
        }
    };

    const handlePreview = () => {
        const config: SimulationConfig = {
            entities,
            events,
            name,
            numAggr: aggregation as number,
            maxTime: duration as number,
            numRuns: numRuns as number,
        };
        setConfigPreview(config);
    };

    const handleDurationChange = (value: string) => {
        const num = parseInt(value);
        if (!isNaN(num)) {
            setDuration(num);
        }
    };

    const handleAggregationChange = (value: string) => {
        const num = parseInt(value);
        if (!isNaN(num)) {
            setAggregation(num);
        }
    };

    const renderDistributionFields = (event: Event, index: number) => {
        // This function is no longer needed as we're handling distributions in dependencies
        return null;
    };

    const generateMultiDistributionData = () => {
        const PREVIEW_POINTS = 100;
        const totalDuration = duration || 604800;

        return events
            .filter(e => e.dependencies?.some(d => d.probabilityDistribution?.type))
            .map((event, idx) => {
                // For each event, create a line for each dependency's distribution
                return event.dependencies?.map((dep, depIdx) => {
                    const {type} = dep.probabilityDistribution;
                    const params = dep.probabilityDistribution;

                    const getProb = (t: number): number =>
                        getProbFromParams(type, t, params);

                    const step = totalDuration / PREVIEW_POINTS;
                    const data = Array.from({length: PREVIEW_POINTS + 1}, (_, i) => {
                        const t = i * step;
                        return {x: t, y: Math.max(getProb(t), 1e-6)};
                    });

                    return {
                        label: `${event.eventName || "Event " + (idx + 1)} - Dep ${depIdx + 1}`,
                        data,
                        borderWidth: 1,
                        pointRadius: 0,
                        fill: false,
                    };
                }) || [];
            })
            .flat();
    };

    return (
        <>
            <Button variant="contained" onClick={() => setOpen(true)}>
                Simulation
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
                <DialogTitle>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Simulation Configurator</Typography>
                        <IconButton onClick={() => setOpen(false)}>
                            <Close/>
                        </IconButton>
                    </Stack>
                </DialogTitle>

                <DialogContent dividers>
                    {configPreview ? (
                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Configuration Preview
                            </Typography>
                            <pre style={{whiteSpace: 'pre-wrap'}}>
                                {JSON.stringify(configPreview, null, 2)}
                            </pre>
                            <Button
                                onClick={() => setConfigPreview(null)}
                                color="primary"
                                variant="outlined"
                                sx={{mt: 2}}
                            >
                                Edit
                            </Button>
                            <Button
                                onClick={() => downloadConfig(configPreview)}
                                color="primary"
                                variant="outlined"
                                sx={{mt: 2, ml: 2}}
                                startIcon={<ContentCopy/>}
                            >
                                Download
                            </Button>
                        </Box>
                    ) : (
                        <Stack spacing={2}>
                            <Paper elevation={0} sx={{p: 2}}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Basic Configuration
                                </Typography>
                                <Stack spacing={2}>
                                    <TextField
                                        label="Simulation Name"
                                        required
                                        error={!name}
                                        helperText={!name ? "Name is required" : " "}
                                        size="small"
                                        fullWidth
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    <TextField
                                        label="Duration"
                                        select
                                        required
                                        error={!duration}
                                        helperText={!duration ? "Duration is required" : " "}
                                        size="small"
                                        value={duration.toString()}
                                        onChange={(e) => handleDurationChange(e.target.value)}
                                    >
                                        {durationOptions.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value.toString()}>
                                                {opt.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        label="Aggregation"
                                        select
                                        required
                                        error={!aggregation}
                                        helperText={!aggregation ? "Aggregation is required" : " "}
                                        fullWidth
                                        size="small"
                                        value={aggregation.toString()}
                                        onChange={(e) => handleAggregationChange(e.target.value)}
                                    >
                                        {aggregationOptions.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value.toString()}>
                                                {opt.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        label="Number of Runs"
                                        required
                                        error={!numRuns}
                                        helperText={!numRuns ? "Number of runs is required" : " "}
                                        type="number"
                                        size="small"
                                        fullWidth
                                        value={numRuns}
                                        onChange={(e) => setNumRuns(e.target.value)}
                                    />
                                </Stack>
                            </Paper>

                            <Paper elevation={0} sx={{p: 2}}>
                                <Stack spacing={2}>
                                    <Typography variant="subtitle1">Entities</Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <TextField
                                            label="Entity Name"
                                            size="small"
                                            value={entityInput}
                                            onChange={(e) => setEntityInput(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleAddEntity();
                                                }
                                            }}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={handleAddEntity}
                                                            edge="end"
                                                            size="small"
                                                        >
                                                            <Add/>
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Stack>
                                    <Box sx={{display: "flex", flexWrap: "wrap", gap: 1}}>
                                        {entities.map((entity, index) => (
                                            <Chip
                                                key={index}
                                                label={entity}
                                                onDelete={() => handleRemoveEntity(index)}
                                                size="small"
                                            />
                                        ))}
                                    </Box>
                                </Stack>
                            </Paper>

                            <Paper elevation={0} sx={{p: 2}}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="subtitle1">Events</Typography>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<Add/>}
                                        onClick={handleAddEvent}
                                    >
                                        Add Event
                                    </Button>
                                </Stack>
                                <Divider sx={{my: 2}}/>
                                <Stack spacing={2}>
                                    {events.map((event, index) => (
                                        <Paper key={index} variant="outlined" sx={{p: 1}}>
                                            <Stack spacing={1}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="subtitle2">
                                                        Event {index + 1}{event.eventName && `: ${event.eventName}`}
                                                    </Typography>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleRemoveEvent(index)}
                                                        color="error"
                                                    >
                                                        <Delete fontSize="small"/>
                                                    </IconButton>
                                                </Stack>

                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                    <MuiGrid container spacing={2}>
                                                        <MuiGrid item xs={12}>
                                                            <TextField
                                                                label="Event Name"
                                                                required
                                                                error={!event.eventName}
                                                                helperText={!event.eventName ? "Event name is required" : " "}
                                                                size="small"
                                                                fullWidth
                                                                value={event.eventName}
                                                                onChange={(e) => handleEventChange(index, "eventName", e.target.value)}
                                                            />
                                                        </MuiGrid>
                                                        <MuiGrid item xs={12}>
                                                            <TextField
                                                                label="Description"
                                                                size="small"
                                                                fullWidth
                                                                multiline
                                                                rows={2}
                                                                value={event.description}
                                                                onChange={(e) => handleEventChange(index, "description", e.target.value)}
                                                            />
                                                        </MuiGrid>
                                                        <MuiGrid item xs={12}>
                                                            <TextField
                                                                label="Gas Cost"
                                                                required
                                                                error={!event.gasCost || event.gasCost <= 0}
                                                                helperText={(!event.gasCost || event.gasCost <= 0) ? "Gas Cost is required" : " "}
                                                                type="number"
                                                                size="small"
                                                                fullWidth
                                                                value={event.gasCost}
                                                                onChange={(e) => handleEventChange(index, "gasCost", Number(e.target.value))}
                                                            />
                                                        </MuiGrid>
                                                        <MuiGrid item xs={12}>
                                                            <TextField
                                                                label="Instance Of"
                                                                select
                                                                size="small"
                                                                fullWidth
                                                                value={event.instanceOf || ""}
                                                                onChange={(e) => handleEventChange(index, "instanceOf", e.target.value || null)}
                                                            >
                                                                <MenuItem value="">None</MenuItem>
                                                                {entities.map((entity, idx) => (
                                                                    <MenuItem key={idx} value={entity}>
                                                                        {entity}
                                                                    </MenuItem>
                                                                ))}
                                                            </TextField>
                                                        </MuiGrid>
                                                    </MuiGrid>

                                                    <Paper elevation={0} sx={{ p: 1, bgcolor: 'background.default' }}>
                                                        <Stack spacing={2}>
                                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                                <Typography variant="subtitle2">Dependencies</Typography>
                                                                <Button
                                                                    variant="outlined"
                                                                    size="small"
                                                                    startIcon={<Add />}
                                                                    onClick={() => handleAddDependency(index)}
                                                                >
                                                                    Add Dependency
                                                                </Button>
                                                            </Stack>
                                                            
                                                            {event.dependencies?.map((dep, depIndex) => (
                                                                <Paper key={depIndex} variant="outlined" sx={{ p: 1 }}>
                                                                    <Stack spacing={1}>
                                                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                                            <Typography variant="subtitle2">
                                                                                Dependency {depIndex + 1}
                                                                            </Typography>
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={() => handleRemoveDependency(index, depIndex)}
                                                                                color="error"
                                                                            >
                                                                                <Delete fontSize="small" />
                                                                            </IconButton>
                                                                        </Stack>

                                                                        <TextField
                                                                            label="Depends On"
                                                                            select
                                                                            size="small"
                                                                            fullWidth
                                                                            value={dep.dependOn || ""}
                                                                            onChange={(e) => handleEventChange(index, `dependencies[${depIndex}].dependOn`, e.target.value || null)}
                                                                        >
                                                                            <MenuItem value="">None</MenuItem>
                                                                            {entities.map((entity, idx) => (
                                                                                <MenuItem key={idx} value={entity}>
                                                                                    {entity}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </TextField>

                                                                        <TextField
                                                                            label="Max Probability Matches"
                                                                            size="small"
                                                                            fullWidth
                                                                            value={dep.maxProbabilityMatches || ""}
                                                                            onChange={(e) => handleEventChange(index, `dependencies[${depIndex}].maxProbabilityMatches`, e.target.value)}
                                                                            helperText="Use '#entityName' to reference an entity count"
                                                                        />

                                                                        <TextField
                                                                            label="Distribution Type"
                                                                            select
                                                                            required
                                                                            error={!dep.probabilityDistribution.type}
                                                                            helperText={!dep.probabilityDistribution.type ? "Distribution Type is required" : " "}
                                                                            size="small"
                                                                            fullWidth
                                                                            value={dep.probabilityDistribution.type}
                                                                            onChange={(e) => {
                                                                                const selectedType = e.target.value;
                                                                                handleEventChange(index, `dependencies[${depIndex}].probabilityDistribution.type`, selectedType);
                                                                                // Open the distribution modal for this dependency
                                                                                const updatedModals = [...openDistributions];
                                                                                if (!Array.isArray(updatedModals[index])) {
                                                                                    updatedModals[index] = [];
                                                                                }
                                                                                updatedModals[index][depIndex] = true;
                                                                                setOpenDistributions(updatedModals);
                                                                            }}
                                                                        >
                                                                            {distributionTypes.map((opt) => (
                                                                                <MenuItem key={opt.value} value={opt.value}>
                                                                                    {opt.label}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </TextField>

                                                                        {/* Display current distribution parameters */}
                                                                        {dep.probabilityDistribution.type && (
                                                                            <Box sx={{ mt: 2 }}>
                                                                                <Typography variant="subtitle2" gutterBottom>
                                                                                    Distribution Parameters:
                                                                                </Typography>
                                                                                <Stack spacing={2}>
                                                                                    {Object.entries(dep.probabilityDistribution)
                                                                                        .filter(([key]) => key !== 'type')
                                                                                        .map(([key, value]) => (
                                                                                            <TextField
                                                                                                key={key}
                                                                                                label={key}
                                                                                                size="small"
                                                                                                type="number"
                                                                                                value={value}
                                                                                                onChange={(e) => {
                                                                                                    const newValue = e.target.value;
                                                                                                    const updatedDistribution = {
                                                                                                        ...dep.probabilityDistribution,
                                                                                                        [key]: Number(newValue)
                                                                                                    };
                                                                                                    handleEventChange(
                                                                                                        index,
                                                                                                        `dependencies[${depIndex}].probabilityDistribution`,
                                                                                                        updatedDistribution
                                                                                                    );
                                                                                                }}
                                                                                                InputProps={{
                                                                                                    inputProps: { 
                                                                                                        step: "0.01"
                                                                                                    }
                                                                                                }}
                                                                                            />
                                                                                        ))}
                                                                                </Stack>
                                                                            </Box>
                                                                        )}

                                                                        <DistributionModal
                                                                            open={Array.isArray(openDistributions[index]) && openDistributions[index][depIndex]}
                                                                            duration={duration}
                                                                            initialValue={defaultParamsByDistribution[dep.probabilityDistribution.type]}
                                                                            onClose={() => {
                                                                                const updatedModals = [...openDistributions];
                                                                                if (Array.isArray(updatedModals[index])) {
                                                                                    updatedModals[index][depIndex] = false;
                                                                                }
                                                                                setOpenDistributions(updatedModals);
                                                                            }}
                                                                            onConfirm={(res) => {
                                                                                handleEventChange(index, `dependencies[${depIndex}].probabilityDistribution`, res);
                                                                                const updatedModals = [...openDistributions];
                                                                                if (Array.isArray(updatedModals[index])) {
                                                                                    updatedModals[index][depIndex] = false;
                                                                                }
                                                                                setOpenDistributions(updatedModals);
                                                                            }}
                                                                        />
                                                                    </Stack>
                                                                </Paper>
                                                            ))}
                                                        </Stack>
                                                    </Paper>
                                                </Box>
                                            </Stack>
                                        </Paper>
                                    ))}
                                </Stack>
                            </Paper>
                        </Stack>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button
                        startIcon={<Upload/>}
                        component="label"
                        sx={{mr: "auto"}}
                    >
                        Import Config
                        <input type="file" hidden accept=".json" onChange={handleFileUpload}/>
                    </Button>
                    <Button
                        onClick={handleReset}
                        color="error"
                        startIcon={<Refresh/>}
                    >
                        Reset
                    </Button>
                    {!configPreview && (
                        <Button
                            onClick={handlePreview}
                            color="info"
                            startIcon={<Visibility/>}
                        >
                            Preview
                        </Button>
                    )}
                    <Button
                        onClick={handleSubmit}
                        color="primary"
                        variant="contained"
                        startIcon={<Send/>}
                        disabled={!name || !duration || !aggregation || !numRuns}
                    >
                        Submit simulation
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SimulationConfiguratorModalForm;


