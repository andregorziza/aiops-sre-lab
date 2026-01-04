# Sample App – Latency Simulation

This application simulates a backend service with intermittent database latency
to demonstrate observability, AIOps and incident response.

## Endpoints

### /health
Simple health check.

### /db
Simulates a database call with:
- Random latency (0–3s)
- 15% failure rate (timeout)

### /metrics
Prometheus-compatible metrics endpoint.

## Usage

```bash
npm install
node index.js

