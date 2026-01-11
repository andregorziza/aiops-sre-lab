📘 HOW-TO — Local Kubernetes (kubectl + kind + helm)
🎯 Objective

Set up a local Kubernetes environment for SRE / Observability / AIOps labs, using:

kubectl — Kubernetes CLI

kind — Kubernetes in Docker (local clusters)

helm — Kubernetes package manager

This setup is ideal for local testing, reproducible labs, and advanced studies.

🖥️ Environment Used

Linux / WSL2 (Ubuntu)

Docker installed and working

Internet access

1️⃣ Install kubectl
Linux / WSL
sudo snap install kubectl --classic


Verify installation:

kubectl version --client


Expected output:

Client Version: v1.xx.x

2️⃣ Install kind (Kubernetes in Docker)
Download the binary
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.22.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind


Verify:

kind version

3️⃣ Create a local Kubernetes cluster
kind create cluster --name aiops-sre


Validate:

kubectl get nodes


Example:

aiops-sre-control-plane   Ready   control-plane

4️⃣ Basic cluster configuration

Confirm active context:

kubectl config current-context


If needed:

kubectl config use-context kind-aiops-sre

5️⃣ Install Helm
Linux / WSL
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash


Verify:

helm version

6️⃣ Add essential Helm repositories
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo add kedacore https://kedacore.github.io/charts

helm repo update

7️⃣ Quick sanity checks
Test cluster communication
kubectl get pods -A

Create a temporary test pod
kubectl run test --rm -it \
  --image=busybox \
  --restart=Never -- sh


Inside the pod:

echo "kubernetes ok"

8️⃣ Best practices for local labs

Use debug pods (curl / busybox) for internal testing

Avoid relying on port-forward as a primary mechanism

Version everything (YAMLs, Helm values, manifests)

Prefer Prometheus + KEDA for advanced autoscaling

Document architectural decisions (why, not only how)

✅ Final Result

Fully functional local Kubernetes environment

Industry-standard tooling

Ideal environment for:

Observability

Autoscaling

SRE labs

AIOps experiments
