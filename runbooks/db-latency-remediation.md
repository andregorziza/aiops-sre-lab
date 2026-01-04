# Runbook – Database Latency Remediation

## Detection Signals
- P95 latency > 500ms
- DB connection saturation

## Automated Actions
- Scale database pods
- Restart unhealthy pod

## Manual Actions (if needed)
- Investigate slow queries
- Check resource limits

## Guardrails
- Max 1 restart per 10 minutes
- Manual approval if error rate > 30%

