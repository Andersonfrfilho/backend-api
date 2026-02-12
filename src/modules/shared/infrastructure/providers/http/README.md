# HTTP Provider

Este módulo fornece uma interface HTTP completa e flexível para fazer requisições HTTP em aplicações NestJS. Suporta tanto APIs Promise quanto Observable (RxJS), oferecendo máxima flexibilidade para diferentes casos de uso.

## Características

- ✅ Suporte completo a todos os métodos HTTP (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS)
- ✅ APIs duplas: Promise e Observable (RxJS)
- ✅ Cache automático com TTL configurável
- ✅ Invalidação de cache
- ✅ Interceptors para tratamento de erros
- ✅ Configuração de timeout, headers globais
- ✅ Instâncias múltiplas com configurações diferentes
- ✅ Tipagem TypeScript completa
- ✅ Baseado em Axios (robusto e bem testado)

## Instalação e Configuração

O provider HTTP já está integrado no sistema de providers do projeto. Para usar, basta injetar o `HTTP_PROVIDER` no seu serviço:

```typescript
import { Inject, Injectable } from '@nestjs/common';
import {
  HTTP_PROVIDER,
  HttpProviderInterface,
} from '@modules/shared/infrastructure/providers/http';

@Injectable()
export class MeuServico {
  constructor(
    @Inject(HTTP_PROVIDER)
    private readonly httpProvider: HttpProviderInterface,
  ) {}
}
```

## Exemplos de Uso

### Requisições Básicas

#### GET Request

```typescript
// Promise API
const response = await this.httpProvider.get<User[]>('/api/users');
console.log(response.data); // Array de usuários
console.log(response.status); // 200

// Observable API
this.httpProvider.get$<User[]>('/api/users').subscribe({
  next: (response) => console.log('Usuários:', response.data),
  error: (error) => console.error('Erro:', error),
  complete: () => console.log('Requisição completa'),
});
```

#### POST Request

```typescript
const newUser = { name: 'João', email: 'joao@example.com' };

// Promise API
const response = await this.httpProvider.post<User>('/api/users', newUser);
console.log('Usuário criado:', response.data);

// Observable API
this.httpProvider.post$<User>('/api/users', newUser).subscribe({
  next: (response) => console.log('Usuário criado:', response.data),
  error: (error) => console.error('Erro ao criar usuário:', error),
});
```

#### PUT/PATCH Request

```typescript
const updatedUser = { name: 'João Silva', email: 'joao.silva@example.com' };

// PUT - substitui completamente o recurso
const putResponse = await this.httpProvider.put<User>('/api/users/1', updatedUser);

// PATCH - atualiza parcialmente o recurso
const patchResponse = await this.httpProvider.patch<User>('/api/users/1', { name: 'João Silva' });
```

#### DELETE Request

```typescript
// Promise API
await this.httpProvider.delete('/api/users/1');
console.log('Usuário deletado');

// Observable API
this.httpProvider.delete$('/api/users/1').subscribe({
  next: () => console.log('Usuário deletado'),
  error: (error) => console.error('Erro ao deletar:', error),
});
```

### Cache

O provider inclui cache automático para requisições GET com limpeza automática de entradas expiradas. Por padrão, as respostas são cacheadas por 5 minutos e o cache é limpo automaticamente a cada 5 minutos.

```typescript
// Requisição com cache (padrão)
const response1 = await this.httpProvider.get('/api/users');
const response2 = await this.httpProvider.get('/api/users'); // Retorna do cache

// Desabilitar cache para uma requisição específica
const response = await this.httpProvider.get('/api/users', { cache: false });

// Cache customizado (30 segundos)
const response = await this.httpProvider.get('/api/users', {
  cache: true,
  cacheTtl: 30000,
});
```

#### Invalidação de Cache

```typescript
// Limpar cache específico
this.httpProvider.clearCache('/api/users');

// Limpar todo o cache
this.httpProvider.clearCache();

// Ver estatísticas do cache
const stats = this.httpProvider.getCacheStats();
console.log(`Cache tem ${stats.size} entradas`);
```

### Configuração de Headers e Autenticação

#### Headers Personalizados

```typescript
// Definir headers para todas as requisições
this.httpProvider.setHeaders({
  'X-API-Key': 'your-api-key',
  'X-Custom-Header': 'custom-value',
});

// Ou definir headers por requisição
const response = await this.httpProvider.get('/api/data', {
  headers: {
    Authorization: 'Bearer token',
    'Content-Type': 'application/json',
  },
});
```

#### Autenticação Bearer Token

```typescript
// Definir token de autenticação (Bearer por padrão)
this.httpProvider.setAuthToken('your-jwt-token');

// Ou especificar tipo de token
this.httpProvider.setAuthToken('your-token', 'Basic');

// Limpar token
this.httpProvider.clearAuthToken();
```

// Definir token de autenticação
this.httpProvider.setAuthToken('your-jwt-token');

// Ou especificar o tipo de token
this.httpProvider.setAuthToken('your-token', 'Basic');

// Remover token
this.httpProvider.clearAuthToken();

````

### Timeout e Base URL

#### Configurar Timeout

```typescript
// Definir timeout global (30 segundos)
this.httpProvider.setTimeout(30000);

// Ou por requisição
const response = await this.httpProvider.get('/api/slow-endpoint', {
  timeout: 5000, // 5 segundos
});
````

#### Base URL

```typescript
// Definir base URL para todas as requisições
this.httpProvider.setBaseURL('https://api.example.com');

// Agora as requisições são relativas
const users = await this.httpProvider.get<User[]>('/users'); // https://api.example.com/users
const posts = await this.httpProvider.get<Post[]>('/posts'); // https://api.example.com/posts
```

### Interceptors

#### Request Interceptor

```typescript
// Adicionar interceptor de request
const requestInterceptorId = this.httpProvider.addRequestInterceptor(
  (config) => {
    // Modificar config antes de enviar
    config.headers['X-Request-ID'] = generateRequestId();
    config.headers['X-Timestamp'] = Date.now().toString();
    return config;
  },
  (error) => {
    // Tratar erro na configuração da requisição
    console.error('Erro no request interceptor:', error);
    return Promise.reject(error);
  },
);

// Remover interceptor
this.httpProvider.removeRequestInterceptor(requestInterceptorId);
```

#### Response Interceptor

```typescript
// Adicionar interceptor de response
const responseInterceptorId = this.httpProvider.addResponseInterceptor(
  (response) => {
    // Processar resposta antes de retornar
    console.log(
      `Request to ${response.config.url} took ${Date.now() - response.config.timestamp}ms`,
    );
    return response;
  },
  (error) => {
    // Tratar erros de resposta
    if (error.response?.status === 401) {
      // Token expirado - redirecionar para login
      this.authService.logout();
    }
    return Promise.reject(error);
  },
);

// Remover interceptor
this.httpProvider.removeResponseInterceptor(responseInterceptorId);
```

### Requisições Customizadas

#### Usando o método `request`

```typescript
// Requisição customizada com Promise
const response = await this.httpProvider.request<User>({
  method: 'GET',
  url: '/api/users',
  params: { page: 1, limit: 10 },
  headers: { 'Custom-Header': 'value' },
});

// Com Observable
this.httpProvider
  .request$<User>({
    method: 'POST',
    url: '/api/users',
    data: { name: 'João', email: 'joao@example.com' },
  })
  .subscribe((response) => console.log(response.data));
```

### Instâncias Múltiplas

#### Criar instância separada

```typescript
// Criar instância com configuração específica
const apiClient = this.httpProvider.createInstance({
  baseURL: 'https://external-api.com',
  timeout: 10000,
  headers: {
    Authorization: 'Bearer external-token',
    'X-API-Version': 'v2',
  },
});

// Usar a instância específica
const externalData = await apiClient.get('/data');
```

### Tratamento de Erros

#### Com Promises

```typescript
try {
  const response = await this.httpProvider.get('/api/users');
  console.log('Dados:', response.data);
} catch (error) {
  if (error.response) {
    // Erro da API (4xx, 5xx)
    console.error('Erro da API:', error.response.status, error.response.data);
  } else if (error.request) {
    // Erro de rede
    console.error('Erro de rede:', error.message);
  } else {
    // Outro erro
    console.error('Erro:', error.message);
  }
}
```

#### Com Observables

```typescript
this.httpProvider.get$<User[]>('/api/users').subscribe({
  next: (response) => {
    console.log('Usuários carregados:', response.data);
  },
  error: (error) => {
    if (error.response) {
      // Erro da API
      this.notificationService.showError(
        `Erro ${error.response.status}: ${error.response.data.message}`,
      );
    } else {
      // Erro de rede
      this.notificationService.showError('Erro de conexão');
    }
  },
  complete: () => {
    console.log('Requisição finalizada');
  },
});
```

### Casos de Uso Avançados

#### Retry com Observable

```typescript
import { retry, delay } from 'rxjs/operators';

this.httpProvider
  .get$<Data>('/api/unstable-endpoint')
  .pipe(
    retry({
      count: 3,
      delay: (error, retryCount) => {
        console.log(`Tentativa ${retryCount} falhou, tentando novamente...`);
        return timer(1000 * retryCount); // Delay crescente
      },
    }),
  )
  .subscribe({
    next: (response) => console.log('Dados:', response.data),
    error: (error) => console.error('Falhou após 3 tentativas:', error),
  });
```

#### Cache com Interceptors

```typescript
// Interceptor para cache simples
const cache = new Map();

this.httpProvider.addResponseInterceptor((response) => {
  // Cache GET requests
  if (response.config.method?.toLowerCase() === 'get') {
    cache.set(response.config.url, {
      data: response.data,
      timestamp: Date.now(),
    });
  }
  return response;
});

this.httpProvider.addRequestInterceptor((config) => {
  // Verificar cache para GET requests
  if (config.method?.toLowerCase() === 'get') {
    const cached = cache.get(config.url);
    if (cached && Date.now() - cached.timestamp < 300000) {
      // 5 minutos
      // Retornar dados do cache (isso cancelará a requisição real)
      return Promise.reject({
        __cached: true,
        data: cached.data,
        config,
      });
    }
  }
  return config;
});
```

#### Upload de Arquivos

```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('metadata', JSON.stringify({ name: 'document.pdf' }));

const response = await this.httpProvider.post<UploadResult>('/api/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  onUploadProgress: (progressEvent) => {
    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    console.log(`Upload: ${percentCompleted}%`);
  },
});
```

## Interface Completa

```typescript
interface HttpProviderInterface {
  // Métodos HTTP Promise-based
  get<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
  post<T>(url: string, data?: any, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
  put<T>(url: string, data?: any, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
  patch<T>(url: string, data?: any, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
  delete<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
  head<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
  options<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
  request<T>(config: HttpRequestConfig): Promise<HttpResponse<T>>;

  // Métodos HTTP Observable-based
  get$<T>(url: string, config?: HttpRequestConfig): Observable<HttpResponse<T>>;
  post$<T>(url: string, data?: any, config?: HttpRequestConfig): Observable<HttpResponse<T>>;
  put$<T>(url: string, data?: any, config?: HttpRequestConfig): Observable<HttpResponse<T>>;
  patch$<T>(url: string, data?: any, config?: HttpRequestConfig): Observable<HttpResponse<T>>;
  delete$<T>(url: string, config?: HttpRequestConfig): Observable<HttpResponse<T>>;
  head$<T>(url: string, config?: HttpRequestConfig): Observable<HttpResponse<T>>;
  options$<T>(url: string, config?: HttpRequestConfig): Observable<HttpResponse<T>>;
  request$<T>(config: HttpRequestConfig): Observable<HttpResponse<T>>;

  // Interceptors
  addRequestInterceptor(onFulfilled?, onRejected?): number;
  addResponseInterceptor(onFulfilled?, onRejected?): number;
  removeRequestInterceptor(interceptorId: number): void;
  removeResponseInterceptor(interceptorId: number): void;

  // Configuração
  createInstance(config?: HttpClientConfig): HttpProviderInterface;
  setBaseURL(baseURL: string): void;
  setTimeout(timeout: number): void;
  setHeaders(headers: Record<string, string>): void;
  setAuthToken(token: string, type?: string): void;
  clearAuthToken(): void;
}
```

## Boas Práticas

1. **Use Observables para operações complexas**: Quando precisar de retry, cancelamento, ou combinação com outras streams.

2. **Configure timeouts apropriados**: Defina timeouts realistas baseados na natureza da API.

3. **Centralize configuração**: Use interceptors para adicionar headers comuns, logging, etc.

4. **Trate erros adequadamente**: Implemente tratamento de erro específico para diferentes tipos de falha.

5. **Use instâncias separadas**: Para APIs externas com configurações diferentes.

6. **Documente suas APIs**: Use JSDoc nos métodos que consomem o HTTP provider.

7. **Considere cache**: Para dados que não mudam frequentemente, implemente cache com interceptors.

Este provider oferece uma base sólida e flexível para todas as suas necessidades de comunicação HTTP!
