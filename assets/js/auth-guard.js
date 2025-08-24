// Auth Guard - Supabase
// Uso: incluir após supabase-api.js nas páginas protegidas
(function(){
  async function enforce(){
    try {
      const session = await window.SupabaseAPI.getSession();
      if(!session){ return window.location.href = '../auth/login.html'; }
      // Checar roles requeridas (data-roles="admin,medico")
      const required = document.body.getAttribute('data-roles');
      if(required){
        const roles = required.split(',').map(r=>r.trim()).filter(Boolean);
        const userData = JSON.parse(localStorage.getItem('clinica_user_data') || sessionStorage.getItem('clinica_user_data') || '{}');
        if(userData?.tipo && !roles.includes(userData.tipo)){
          return window.location.href = '../pages/sem-permissao.html';
        }
      }
    } catch(e){ window.location.href = '../auth/login.html'; }
  }
  document.addEventListener('DOMContentLoaded', enforce);
})();
