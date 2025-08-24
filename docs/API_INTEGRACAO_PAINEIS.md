# Integração API e Painéis Frontend - Portal Dr. Marcio

Este documento descreve a integração entre o backend (Supabase) e os painéis frontend do portal médico.

## Arquitetura de Integração

O portal agora possui uma arquitetura otimizada de integração entre o backend e o frontend, com as seguintes camadas:

1. **Camada de Configuração**
   - `env.js`: Variáveis de ambiente (SUPABASE_URL, SUPABASE_ANON_KEY)
   - `portal-config.js`: Configurações globais do portal

2. **Camada de API**
   - `supabase-api.js`: Interface direta com o Supabase
   - `api.js`: Interface unificada para comunicação (API FastAPI ou Supabase)
   - `panel-manager.js`: Gerenciador de painéis e renderização de dados

3. **Camada de Apresentação**
   - HTML/CSS dos painéis
   - Scripts de interação do usuário

## Fluxo de Dados

```
Usuário -> Interface (HTML/CSS) -> PanelManager -> API -> Supabase -> Banco de Dados
```

## Melhores Práticas Implementadas

### 1. Segurança

- **Autenticação**: Uso do sistema de autenticação seguro do Supabase
- **Validação de Dados**: Validação tanto no cliente quanto no servidor
- **Proteção contra XSS**: Sanitização de entradas do usuário
- **Tokens Seguros**: Gerenciamento adequado de tokens de autenticação

### 2. Desempenho

- **Cache de Dados**: Sistema de cache para reduzir requisições ao servidor
- **Carregamento Assíncrono**: Operações de API não bloqueiam a interface
- **Paginação**: Carregamento de dados em lotes para melhor performance

### 3. UX/UI

- **Loading States**: Feedback visual durante operações assíncronas
- **Tratamento de Erros**: Mensagens amigáveis em caso de falhas
- **Offline Support**: Funcionalidade básica em modo offline

## Como Usar o Sistema de Painéis

### Carregar Dados em um Painel

```javascript
// Exemplo de como carregar dados em um painel
PanelManager.loadPanelData('dashboard').then(data => {
    console.log('Dados carregados:', data);
}).catch(error => {
    console.error('Erro ao carregar dados:', error);
});
```

### Renderizar um Painel Completo

```javascript
// Renderiza um painel completo em um elemento HTML
PanelManager.renderPanel('agendamentos', 'agendamentos-container', {
    dataInicio: '2025-08-01',
    dataFim: '2025-08-31'
});
```

## Extensão do Sistema

Para adicionar um novo painel:

1. Adicione um novo método no objeto API.supabase para buscar os dados necessários
2. Implemente uma função de renderização no PanelManager
3. Adicione o caso no switch do método renderPanel

## Problemas Conhecidos e Soluções

- **Latência de Rede**: Implementado sistema de cache e estados de loading
- **Autenticação Expirada**: Refresh automático de token
- **Incompatibilidade entre Navegadores**: CSS e JS compatíveis com principais navegadores
