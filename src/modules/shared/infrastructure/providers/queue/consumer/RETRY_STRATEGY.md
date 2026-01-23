# Estratégia de Retry - Sistema de Mensageria

## 🎯 Visão Geral

Implementamos uma estratégia robusta de retry com **exponential backoff**, **jitter** e **Dead Letter Queues** para garantir confiabilidade no processamento de mensagens.

## 🔄 Estratégia de Retry

### **1. Exponential Backoff com Jitter**

```typescript
// Base delay: 1s, 2s, 4s, 8s, 16s... (até 5 minutos max)
const baseDelay = Math.min(1000 * Math.pow(2, retryCount), 300000);

// Jitter: ±10% para evitar thundering herd
const jitter = Math.random() * 0.1 * baseDelay;
const retryDelay = Math.floor(baseDelay + jitter);
```

### **2. Classificação de Erros**

- **Retryable**: Conexão, timeout, serviço indisponível
- **Non-Retryable**: Dados inválidos, autenticação, não encontrado

### **3. Máximo de Tentativas**

- **5 tentativas** por mensagem
- Após esgotar: → **Dead Letter Queue**

## 🏗️ Arquitetura

### **Fluxo Normal:**

```
Producer → Exchange → Queue → Consumer ✅
```

### **Fluxo com Retry:**

```
Producer → Exchange → Queue → Consumer ❌
                      ↓ (retry)
                Queue ← Consumer (com delay)
```

### **Fluxo com DLQ:**

```
Producer → Exchange → Queue → Consumer ❌ (5x)
                      ↓
               Dead Letter Exchange → DLQ → DLQ Consumer
```

## 📊 Componentes

### **1. EmailConsumer**

- **Queue**: `email.notifications`
- **Retry**: 5 tentativas com exponential backoff
- **DLQ**: `email.notifications.dlq`

### **2. DeadLetterConsumer**

- **Queue**: `email.notifications.dlq`
- **Estratégias**:
  - Salvar para reenvio manual
  - Alertar equipe (críticos)
  - Análise de padrões de falha

## 🧪 Como Testar

### **1. Teste de Retry:**

```bash
GET /health/queue-test
```

- Envia mensagem que **sempre falha**
- Consumer tenta **5 vezes** com delays crescentes
- Mensagem vai para **DLQ** após falhar

### **2. Verificar Logs:**

```bash
# Ver retry attempts
grep "Retrying message" logs/app.log

# Ver DLQ processing
grep "Processing failed message from DLQ" logs/app.log
```

### **3. Verificar RabbitMQ:**

```bash
# Ver mensagens nas queues
rabbitmqctl list_queues name messages

# Ver bindings
rabbitmqctl list_bindings
```

## ⚙️ Configuração

### **RabbitMQ Connection:**

```typescript
// Exchanges
- notifications (topic)
- notifications.dlx (topic)

// Queues
- email.notifications (TTL: 24h, DLX: notifications.dlx)
- email.notifications.dlq (TTL: 30 dias)

// Bindings
- notifications.email.* → email.notifications
- notifications.dlx.# → email.notifications.dlq
```

### **Consumer Settings:**

```typescript
{
  prefetchCount: 5,    // Processa até 5 mensagens simultaneamente
  noAck: false,        // Manual acknowledgment
  exclusive: false,    // Múltiplas instâncias
}
```

## 📈 Métricas

### **Consumer Metrics:**

- `totalProcessed`: Mensagens processadas com sucesso
- `totalFailed`: Mensagens que falharam definitivamente
- `totalRetried`: Tentativas de retry realizadas
- `averageProcessingTime`: Tempo médio de processamento

### **Queue Metrics:**

- Mensagens pendentes
- Taxa de processamento
- Taxa de falha
- DLQ growth rate

## 🚨 Monitoramento

### **Alertas Recomendados:**

1. **DLQ crescendo** → Problema sistêmico
2. **Taxa de retry alta** → Problema no consumer
3. **Mensagens expirando** → Consumer lento
4. **Erros de conexão** → Problema de infraestrutura

### **Dashboards:**

- Gráfico de retries por hora
- Taxa de sucesso/falha
- Tamanho das DLQs
- Latência de processamento

## 🔧 Troubleshooting

### **Mensagens não processadas:**

1. Verificar se consumer está rodando
2. Checar conexões RabbitMQ
3. Verificar logs de erro

### **DLQ cheia:**

1. Analisar padrões de erro
2. Corrigir bugs no consumer
3. Reprocessar mensagens manualmente

### **Retries infinitos:**

1. Melhorar classificação de erros
2. Ajustar lógica de `isRetryableError()`
3. Implementar circuit breaker

## 🎯 Benefícios

- ✅ **Resiliência**: Sistema continua funcionando mesmo com falhas
- ✅ **Observabilidade**: Rastreamento completo do ciclo de vida
- ✅ **Recuperação**: Estratégias automáticas e manuais
- ✅ **Performance**: Backoff evita sobrecarga
- ✅ **Confiabilidade**: Nenhuma mensagem perdida
