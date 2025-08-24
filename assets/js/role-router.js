// Mapeamento de roles para páginas de destino pós-login
(function(){
  const MAP = {
    admin: '../admin/dashboard-admin.html',
    medico: '../home.html',
    secretaria: '../modules/agendamentos.html',
    paciente: '../home.html'
  };
  function resolve(user){
    return MAP[user?.tipo] || '../home.html';
  }
  window.RoleRouter = { resolve };
})();
