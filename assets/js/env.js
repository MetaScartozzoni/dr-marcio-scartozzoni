// Carrega variáveis de ambiente para desenvolvimento local
// Em produção no Vercel, estas variáveis serão substituídas pelas definidas no vercel.json

// NÃO COMMITAR credenciais reais. Copie este arquivo para env.local.js (gitignored) e preencha.
window.ENV = window.ENV || {
    SUPABASE_URL: window.__PUBLIC_ENV__?.SUPABASE_URL || "https://demo.supabase.co",
    SUPABASE_ANON_KEY: window.__PUBLIC_ENV__?.SUPABASE_ANON_KEY || "demo-anon-key-for-development",
    API_URL: window.__PUBLIC_ENV__?.API_URL || "/api",
    DEBUG: true,
    VERSION: "1.0.0"
};

console.log("🔑 Variáveis de ambiente carregadas");
