# AIOps + SRE Lab

Hands-on lab simulating real-world SRE scenarios with observability-first design, latency-driven autoscaling, and a clear path to Kubernetes, KEDA, and Infrastructure as Code.

---

## 🎯 Goals
- Build a **realistic Node.js service** with controlled latency failures
- Instrument with **Prometheus metrics** (histograms)
- Visualize **p95 / p99** in **Grafana** (provisioned via Git)
- Implement **autoscaling based on latency** using **KEDA + Prometheus**
- Keep everything **reproducible and interview-ready**

---

## 🧱 Repository Structure
```
aiops-sre-lab/
├── app/                 # Node.js app with latency injection
├── docker-compose.yml   # Local stack (app + Prometheus + Grafana)
├── observability/       # Prometheus & Grafana provisioning
├── k8s/                 # Kubernetes manifests + KEDA
├── incidents/           # Documented incident simulations
├── runbooks/            # Operational runbooks
├── docs/                # Step-by-step documentation
├── terraform/           # (Future) IaC for clusters & observability
└── README.md
```

---

## 🚀 Quick Start (Local)
```bash
docker-compose up --build
```

- App: http://localhost:3000
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (admin / admin)

---

## 📊 Observability
- Metrics exposed at `/metrics`
- Latency measured with `http_request_duration_seconds` histogram
- p95 / p99 calculated via PromQL:
```promql
histogram_quantile(
  0.95,
  sum(rate(http_request_duration_seconds_bucket[5m])) by (le)
)
```

Grafana dashboards are **provisioned from Git**.

---

## ⚖️ Autoscaling (Latency-Based)
- Uses **KEDA** with direct **PromQL execution**
- Avoids Custom Metrics API limitations
- Scales based on **user experience (latency)**, not CPU

---

## 🧪 Load Test
```bash
kubectl run loadgen --rm -it \
  --image=curlimages/curl \
  --restart=Never -- sh

while true; do
  curl http://aiops-sre-app:3000/db
done
```

Observe scaling with:
```bash
kubectl get pods -w
kubectl get hpa -w
```

---

## 📚 Documentation
- Step-by-step lab: `docs/how-to-lab.md`
- Kubernetes setup: `docs/how-to-kubernetes.md`
- KEDA autoscaling: `docs/how-to-keda.md`
- Incidents: `incidents/`
- Runbooks: `runbooks/`

---

## 🧠 Interview Notes
> "This is a controlled lab to simulate real failures, observability, RCA, and SRE automation. We instrumented histograms, calculated p95/p99 via PromQL, visualized in Grafana, and scaled using KEDA based on latency."

---

## 🛣️ Roadmap
- Terraform provisioning for Kubernetes & observability
- Alerting (SLO-based)
- AIOps anomaly detection
- Auto-remediation workflows
- ChatOps integrations

---

## ✅ Status
- Application: ✅
- Metrics: ✅
- Prometheus: ✅
- Grafana dashboards: ✅
- KEDA autoscaling: ✅

---

**Built for learning, realism, and interviews.**

