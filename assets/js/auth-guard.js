// Auth Guard - Supabase
// Uso: incluir após supabase-api.js nas páginas protegidas
(function(){
  async function enforce(){
    try {
      const session = await window.SupabaseAPI.getSession();
      if(!session){ window.location.href = '../auth/login.html'; }
    } catch(e){ window.location.href = '../auth/login.html'; }
  }
  document.addEventListener('DOMContentLoaded', enforce);
})();
