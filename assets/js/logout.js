// Logout utilitário centralizado
(function(){
  async function portalLogout(redirect = 'auth/login.html'){
    try { await window.SupabaseAPI?.signOut?.(); } catch(e){ console.warn('Falha signOut supabase', e); }
    localStorage.removeItem('clinica_auth_token');
    localStorage.removeItem('clinica_user_data');
    sessionStorage.removeItem('clinica_auth_token');
    sessionStorage.removeItem('clinica_user_data');
    window.location.href = redirect;
  }
  window.portalLogout = portalLogout;
})();
