📘 HOW-TO — Autoscaling with KEDA + Prometheus (p95 Latency)
🎯 Objective

Implement autoscaling based on latency (p95) using Prometheus + KEDA, avoiding the limitations of the Prometheus Adapter / Custom Metrics API, which is not reliable for histograms and derived metrics.

❌ Why NOT use Prometheus Adapter in this lab

During the lab, the Prometheus Adapter was tested to expose latency metrics via custom.metrics.k8s.io, however:

Histograms (*_bucket) combined with rate() + sum() are unstable in the Adapter

The API frequently returns resources: [] or ServiceUnavailable

This behavior is known and poorly documented

It is not the recommended approach for latency metrics (p95 / p99)

👉 Architectural decision: use KEDA, which executes PromQL directly, without relying on the Custom Metrics API.

####################################################################################################################

🧱 Final Architecture
Application → Prometheus → KEDA → HPA → Deployment

Prometheus collects metrics from the application

KEDA executes real PromQL queries

KEDA automatically creates and manages the HPA

Scaling occurs based on user experience (latency)

###################################################################################################################

📦 Prerequisites

A working Kubernetes cluster (kind, k3s, EKS, AKS, etc.)

Prometheus collecting application metrics

Metric http_request_duration_seconds_bucket available

🚀 KEDA Installation

helm repo add kedacore https://kedacore.github.io/charts
helm repo update

helm install keda kedacore/keda \
  --namespace keda \
  --create-namespace


####Validate####

kubectl get pods -n keda


📄 ScaledObject (autoscaling by p95)

File: k8s/scaledobject.yaml

apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: aiops-sre-app
spec:
  scaleTargetRef:
    name: aiops-sre-app
  minReplicaCount: 1
  maxReplicaCount: 5
  triggers:
    - type: prometheus
      metadata:
        serverAddress: http://prometheus.default.svc:9090
        metricName: http_request_latency_p95
        threshold: "1.5"
        query: |
          histogram_quantile(
            0.95,
            sum(rate(http_request_duration_seconds_bucket[2m])) by (le)
          )


###Apply###

kubectl apply -f k8s/scaledobject.yaml


🔍 Initial checks

Verify ScaledObject

kubectl get scaledobject


Expected example:

READY: True
TRIGGERS: prometheus


Verify the automatically created HPA

kubectl get hpa


###Example###

keda-hpa-aiops-sre-app


⚠️ The HPA is not created manually — it is managed by KEDA.

🔥 Load Test

Create a load generator pod inside the cluster:

kubectl run loadgen --rm -it \
  --image=curlimages/curl \
  --restart=Never -- sh


Inside the pod:

while true; do
  curl http://aiops-sre-app:3000/db
done


This loop:

Generates artificial latency

Increases p95 latency

Forces KEDA to scale

👀 Observe scaling in real time

In another terminal:

kubectl get pods -w


And:

kubectl get hpa -w


Expected results:

Increase in the number of pods

HPA adjusting replicas

ScaledObject changing ACTIVE to True

####################################################################################################

📊 Prometheus validation (optional)

Query used by KEDA:

histogram_quantile(
  0.95,
  sum(rate(http_request_duration_seconds_bucket[2m])) by (le)
)


This query should return values above the threshold during the load test.

✅ Final Result

Functional autoscaling based on real latency

No Custom Metrics API

No Prometheus Adapter

Modern, stable, and production-adopted architecture

🧠 Experience note (real SRE)

For simple metrics (QPS, counters), the Prometheus Adapter may work.
For latency, p95/p99, and AIOps use cases, KEDA is the correct choice.
