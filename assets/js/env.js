// Carrega variáveis de ambiente para desenvolvimento local
// Em produção no Vercel, estas variáveis serão substituídas pelas definidas no vercel.json

window.ENV = {
    SUPABASE_URL: "https://obohdaxvawmjhxsjgikp.supabase.co",
    SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ib2hkYXh2YXdtamh4c2pnaWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NDQzMTYsImV4cCI6MjA3MDEyMDMxNn0.Oa4GC17FfUqajBRuEDLroXIg1vBd_x6shE6ke8pKMKU",
    API_URL: "/api",
    DEBUG: false,
    VERSION: "1.0.0"
};

console.log("🔑 Variáveis de ambiente carregadas");
