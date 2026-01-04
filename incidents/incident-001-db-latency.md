# Incident 001 – Database Latency Causing Cascading Failures

## Summary
Intermittent latency on the database layer caused timeouts and error propagation to the API layer.

## Impact
- API response time increased by 300%
- 15% of requests failed
- User-facing degradation

## Detection
- Anomaly detected by AIOps on latency metrics
- No explicit error logs at application layer

## Root Cause (AIOps)
- Increased DB query latency
- Connection pool saturation

## Contributing Factors
- Lack of query timeout
- Insufficient autoscaling threshold

## Resolution
- Database pod restart
- Horizontal scaling applied automatically

## Prevention
- Adjust SLO-based alerts
- Add circuit breaker
- Improve autoscaling policy

