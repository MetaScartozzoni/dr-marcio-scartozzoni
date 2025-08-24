// Carrega variáveis de ambiente para desenvolvimento local
// Em produção no Vercel, estas variáveis serão substituídas pelas definidas no vercel.json

// NÃO COMMITAR credenciais reais. Copie este arquivo para env.local.js (gitignored) e preencha.
window.ENV = window.ENV || {
    SUPABASE_URL: undefined, // definir em env.local.js ou variáveis de ambiente Vercel
    SUPABASE_ANON_KEY: undefined,
    API_URL: "/api",
    DEBUG: false,
    VERSION: "1.0.0"
};

console.log("🔑 Variáveis de ambiente carregadas");
