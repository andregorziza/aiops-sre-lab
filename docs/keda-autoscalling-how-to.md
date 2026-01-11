📘 HOW-TO — Autoscaling com KEDA + Prometheus (p95 Latency)
🎯 Objetivo

Implementar autoscaling baseado em latência (p95) usando Prometheus + KEDA, evitando as limitações do Prometheus Adapter / Custom Metrics API, que não é confiável para histogramas e métricas derivadas.

❌ Por que NÃO usar Prometheus Adapter neste lab

Durante o lab, o Prometheus Adapter foi testado para expor métricas de latência via custom.metrics.k8s.io, porém:

Histogramas (*_bucket) + rate() + sum() são instáveis no Adapter

A API frequentemente retorna resources: [] ou ServiceUnavailable

Esse comportamento é conhecido e pouco documentado

Não é o caminho recomendado para métricas de latência (p95/p99)

👉 Decisão arquitetural: usar KEDA, que executa PromQL diretamente, sem depender da Custom Metrics API.

####################################################################################################################

🧱 Arquitetura Final
Aplicação → Prometheus → KEDA → HPA → Deployment


Prometheus coleta métricas da aplicação

KEDA executa PromQL real

KEDA cria e gerencia o HPA automaticamente

Escala ocorre com base na experiência do usuário (latência)

###################################################################################################################

📦 Pré-requisitos

Kubernetes funcionando (kind, k3s, EKS, AKS, etc)

Prometheus coletando métricas da aplicação

Métrica http_request_duration_seconds_bucket disponível

🚀 Instalação do KEDA
helm repo add kedacore https://kedacore.github.io/charts
helm repo update

helm install keda kedacore/keda \
  --namespace keda \
  --create-namespace


####Validar####

kubectl get pods -n keda

📄 ScaledObject (autoscaling por p95)

Arquivo: k8s/scaledobject.yaml

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


###Aplicar###

kubectl apply -f k8s/scaledobject.yaml

🔍 Verificações iniciais
Verificar ScaledObject
kubectl get scaledobject


Exemplo esperado:

READY: True
TRIGGERS: prometheus

Verificar HPA criado automaticamente
kubectl get hpa


###Exemplo###

keda-hpa-aiops-sre-app


⚠️ O HPA não é criado manualmente — ele é gerenciado pelo KEDA.

🔥 Teste de carga (Load Test)
Criar pod de carga dentro do cluster
kubectl run loadgen --rm -it \
  --image=curlimages/curl \
  --restart=Never -- sh


Dentro do pod:

while true; do
  curl http://aiops-sre-app:3000/db
done


Esse loop:

gera latência artificial

aumenta o p95

força o KEDA a escalar

👀 Observar a escala em tempo real

Em outro terminal:

kubectl get pods -w


E:

kubectl get hpa -w


Resultados esperados:

aumento no número de pods

HPA ajustando replicas

ScaledObject mudando ACTIVE para True

####################################################################################################

📊 Validação no Prometheus (opcional)

Query usada pelo KEDA:

histogram_quantile(
  0.95,
  sum(rate(http_request_duration_seconds_bucket[2m])) by (le)
)


Essa query deve retornar valores acima do threshold durante o teste de carga.

✅ Resultado Final

Autoscaling funcional baseado em latência real

Sem Custom Metrics API

Sem Prometheus Adapter

Arquitetura moderna, estável e adotada em produção

🧠 Nota de experiência (SRE real)

Para métricas simples (QPS, contadores), o Prometheus Adapter pode funcionar.
Para latência, p95/p99 e AIOps, KEDA é a escolha correta.
