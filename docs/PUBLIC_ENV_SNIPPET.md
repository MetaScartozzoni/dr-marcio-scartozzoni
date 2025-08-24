# Snippet de Injeção de Variáveis Públicas no Vercel

Adicione este bloco antes de `env.js` nas páginas (substituindo o marcador `PUBLIC_ENV_INJECT`):

```html
<script>
  window.__PUBLIC_ENV__ = {
    SUPABASE_URL: "${process.env.SUPABASE_URL}",
    SUPABASE_ANON_KEY: "${process.env.SUPABASE_ANON_KEY}",
    API_URL: "${process.env.API_URL || '/api'}",
    APP_ENV: "${process.env.APP_ENV || 'production'}",
    LOG_LEVEL: "${process.env.LOG_LEVEL || 'info'}",
    SUPPORT_EMAIL: "${process.env.SUPPORT_EMAIL || 'contato@seudominio.com'}",
    FEATURE_FLAGS: (function(){ try { return JSON.parse('${process.env.FEATURE_FLAGS || '{}'}'); } catch(e){ return {}; } })()
  };
</script>
```

## Uso
1. Configure as variáveis no painel Vercel.
2. Em um step de build (ou manualmente), substituir o comentário `PUBLIC_ENV_INJECT` pelo snippet acima.
3. `env.js` fará merge e o restante do código acessará `window.ENV`.

## Observações
- Não inclua segredos privados neste objeto.
- Rotacione chaves se suspeitar de vazamento.
- Para múltiplas páginas, considere automatizar com um script de pós-build.
