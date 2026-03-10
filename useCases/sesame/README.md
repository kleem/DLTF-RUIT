# SESAME

<p align="left">
  <img src="Sesame-ico.png" alt="SESAME logo" width="140" />
</p>

SESAME is a simulation workspace for configuring, running, and analyzing blockchain-oriented scenarios.

The project is organized as a two-part application:

- a Spring Boot backend that runs simulations, stores generated CSV metadata, and exposes result and chart endpoints
- a React + TypeScript frontend used to configure simulations, inspect outputs, and visualize results

The default backend port is `8099`.

## Quick Start

### Prerequisites

- Java 17+
- Node.js 20+
- npm

### Run the full application

From the project root:

```bash
npm install
npm start
```

This starts:

- the Spring Boot backend from `api/springBoot-simulator`
- the Vite development server for the frontend from `client`

### Run services separately

Backend:

```bash
cd api/springBoot-simulator
./mvnw spring-boot:run
```

Frontend:

```bash
cd client
npm install
npm run dev
```

## Project Structure

- [api/springBoot-simulator](api/springBoot-simulator): active backend service
- [client](client): frontend application
- [examples/simulations](examples/simulations): sample simulation configurations
- [artifacts/final-results](artifacts/final-results): curated outputs and reference assets
- [artifacts/final-results/output-archive](artifacts/final-results/output-archive): historical archived outputs

## Typical Workflow

1. Start backend and frontend.
2. Open the frontend UI.
3. Create a simulation configuration or import one from `examples/simulations`.
4. Submit the configuration to the backend.
5. Inspect generated charts and CSV-based results.
6. Export or reuse outputs for analysis.

## Example Input

A good starting example is:

- `examples/simulations/dao/4.DAO-2PeakUsers-and-Proposal.json`

This example can be loaded, adapted, and submitted through the frontend workflow.

## Backend Notes

- Main entry point: [BCSimulatorApplication.java](api/springBoot-simulator/src/main/java/com/bcsimulator/BCSimulatorApplication.java)
- Main simulation endpoint: `POST /newsimulation`
- Chart endpoints are exposed under `/results/charts`
- CSV result endpoints are exposed under `/results/csv`
- Archive plotting helper: [dao-archive-plot.sh](api/springBoot-simulator/dao-archive-plot.sh)

## Frontend Notes

- The frontend currently calls the backend on `http://localhost:8099`
- Production validation for the frontend is done with:

```bash
cd client
npm run build
```

## Development

### Backend validation

```bash
cd api/springBoot-simulator
./mvnw test
./mvnw -DskipTests package
```

### Frontend validation

```bash
cd client
npm run build
```

## Repository Notes


- Store only curated or publication-relevant outputs under `artifacts/final-results`
