# Portal Dr. Marcio Scartozzoni

Sistema completo de gestão médica com autenticação Supabase e deploy na Vercel.

## Estrutura do Projeto

```
/
├── admin/                 # Área administrativa 
│   ├── dashboard-admin.html
│   └── pages/             # Outras páginas administrativas
├── assets/
│   ├── css/               # Arquivos de estilo
│   └── js/                # Scripts JavaScript
├── auth/                  # Sistema de autenticação
│   ├── cadastro.html
│   ├── login.html
│   └── redefinir-senha.html
├── modules/               # Módulos funcionais do sistema
│   ├── agendamentos.html
│   ├── caderno-digital.html
│   ├── ficha-atendimento.html
│   ├── gestao.html
│   ├── jornada-paciente.html
│   ├── pacientes.html
│   ├── prontuarios.html
│   └── quadro-evolutivo.html
├── pages/                 # Páginas secundárias
│   ├── 404.html
│   ├── 500.html
│   ├── agendamento-detalhes.html
│   ├── agendar.html
│   ├── configuracoes-sistema.html
│   ├── dashboard.html
│   ├── offline.html
│   ├── orcamento.html
│   ├── pre-cadastro.html
│   └── recuperar-senha.html
├── home.html              # Página inicial após login
├── index.html             # Landing page pública
└── vercel.json            # Configuração de deploy Vercel
```

## Tecnologias Utilizadas

- HTML, CSS e JavaScript puro
- Supabase para autenticação e banco de dados
- Vercel para hospedagem

## Configuração de Ambiente

O sistema utiliza variáveis de ambiente para conexão com o Supabase:

Crie um arquivo não versionado `assets/js/env.local.js` copiando o template:

```javascript
// assets/js/env.local.js (NÃO COMMITAR)
window.ENV = {
    SUPABASE_URL: "https://SEU_PROJETO_ID.supabase.co",
    SUPABASE_ANON_KEY: "SUA_CHAVE_PUBLICA_ANON",
    API_URL: "/api",
    DEBUG: true
};
```

Inclua-o depois de `env.js` nas páginas locais. Em produção configure as variáveis no painel Vercel (Project Settings > Environment Variables) com os nomes:

```
SUPABASE_URL
SUPABASE_ANON_KEY
```

As chaves foram removidas do repositório para segurança.

## Deploy na Vercel

O projeto está configurado para deploy automático na Vercel. O arquivo `vercel.json` contém todas as configurações necessárias para:

1. Redirecionamentos de URLs
2. Headers de segurança
3. Variáveis de ambiente

## Instruções para desenvolvimento local

1. Clone o repositório
2. Navegue até a pasta do projeto
3. Use um servidor local como o Live Server do VS Code ou o http-server do Node.js

## Manutenção

Para adicionar novas páginas:
1. Crie o arquivo HTML na pasta apropriada
2. Adicione o redirecionamento no arquivo `vercel.json`
3. Vincule a página ao sistema de navegação

## Contato

Para mais informações, entre em contato com a equipe de desenvolvimento.
