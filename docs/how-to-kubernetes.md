#######📘 HOW-TO — Kubernetes Local (kubectl + kind + helm)######

🎯 Objetivo

Configurar um ambiente Kubernetes local para labs de SRE / Observability / AIOps, utilizando:

kubectl — CLI do Kubernetes

kind — Kubernetes in Docker (clusters locais)

helm — gerenciador de pacotes Kubernetes

Este setup é ideal para testes locais, labs reproduzíveis e estudos avançados.

🖥️ Ambiente utilizado

Linux / WSL2 (Ubuntu)

Docker instalado e funcional

Acesso à internet

##############################################################################################################

1️⃣ Instalar kubectl

Linux / WSL
sudo snap install kubectl --classic


Verificar instalação:

kubectl version --client


Resultado esperado:

Client Version: v1.xx.x

##############################################################################################################

2️⃣ Instalar kind (Kubernetes in Docker)

Download do binário
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.22.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind


Verificar:

kind version

##############################################################################################################

3️⃣ Criar cluster Kubernetes local

kind create cluster --name aiops-sre


Validar:

kubectl get nodes


Exemplo:

aiops-sre-control-plane   Ready   control-plane

#############################################################################################################

4️⃣ Configuração básica do cluster

Confirmar contexto ativo:

kubectl config current-context


Se necessário:

kubectl config use-context kind-aiops-sre

#############################################################################################################

5️⃣ Instalar Helm

Linux / WSL
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash


Verificar:

helm version

#############################################################################################################

6️⃣ Adicionar repositórios Helm essenciais

helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo add kedacore https://kedacore.github.io/charts

helm repo update

############################################################################################################

7️⃣ Testes rápidos de sanidade

Testar comunicação com cluster
kubectl get pods -A

Criar pod temporário de teste
kubectl run test --rm -it \
  --image=busybox \
  --restart=Never -- sh


Dentro do pod:

echo "kubernetes ok"

###########################################################################################################

8️⃣ Boas práticas para labs locais


Use pods de debug (curl/busybox) para testes internos

Evite port-forward como dependência principal

Versione tudo (YAMLs, Helm values, manifests)

Prefira Prometheus + KEDA para autoscaling avançado

Documente decisões arquiteturais (por quê, não só como)

###########################################################################################################

✅ Resultado final


Kubernetes local funcional

Ferramentas padrão de mercado

Ambiente ideal para:

Observability

Autoscaling

SRE labs

AIOps experiments
