# Variáveis de Ambiente - Vercel

Configure no painel da Vercel (Project Settings > Environment Variables):

Obrigatórias:
- SUPABASE_URL (public)  
- SUPABASE_ANON_KEY (public)  

Recomendadas:
- API_URL (ex: https://api.seudominio.com ou /api se usar rewrite interno)
- APP_ENV (production | staging | development)
- LOG_LEVEL (info | debug | warn | error)
- SUPPORT_EMAIL (exibida em página de erro / footer)

Opcionais:
- FEATURE_FLAGS (JSON compacto, ex: {"novoDashboard":true})
- SENTRY_DSN (monitoramento)
- ANALYTICS_ID (GA ou outro)

Backend (NÃO expor no frontend):
- SUPABASE_SERVICE_ROLE (apenas lado servidor)
- JWT_SECRET (se gerar tokens próprios)

## Carregamento no Frontend
O frontend lê variáveis públicas via `window.ENV` (definidas em `env.local.js` localmente) ou pode receber um bloco inline injetado no `index.html`:

```html
<script>
  window.__PUBLIC_ENV__ = {
    SUPABASE_URL: "${process.env.SUPABASE_URL}",
    SUPABASE_ANON_KEY: "${process.env.SUPABASE_ANON_KEY}",
    API_URL: "${process.env.API_URL}" // opcional
  };
</script>
```

Depois disso, `env.js` faz o merge e `supabase-api.js` usa `window.ENV`.

## Ambiente Local
Crie `assets/js/env.local.js` com suas chaves (gitignored) baseado em `env.template.js`.

## Boas Práticas
1. Nunca expor service role ou secrets privados no frontend.  
2. Rotacionar a chave anon se ela vazar.  
3. Usar RLS no Supabase para proteger tabelas.  
4. Manter `APP_ENV` para habilitar logs condicionais.  
