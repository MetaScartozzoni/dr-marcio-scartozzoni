// Funções para integração de painéis - Portal Médico Dr. Marcio
// Este arquivo contém funções que ajudam na integração dos painéis com o backend

window.PanelManager = {
    // Cache para dados dos painéis
    cache: {},
    
    // Carrega dados para um painel específico
    loadPanelData: async function(panelName, options = {}) {
        try {
            // Verifica se há configuração para usar Supabase ou API HTTP
            const useSupabase = window.PORTAL_CONFIG?.API?.USE_SUPABASE !== false;
            
            console.log(`📊 Carregando dados para o painel: ${panelName}`);
            
            // Verifica se estamos online
            if (!navigator.onLine) {
                console.warn(`Offline: Usando cache para ${panelName}`);
                return this.cache[panelName] || { error: 'Offline - Dados não disponíveis' };
            }
            
            let result;
            
            // Usa Supabase ou API HTTP dependendo da configuração
            if (useSupabase) {
                switch(panelName) {
                    case 'dashboard':
                        result = await API.supabase.getDashboardData();
                        break;
                    case 'agendamentos':
                        result = await API.supabase.getAgendamentosPanel(options);
                        break;
                    case 'pacientes':
                        result = await API.supabase.getPacientesPanel(options);
                        break;
                    case 'prontuarios':
                        result = await API.prontuarios.list(options);
                        break;
                    case 'financeiro':
                        result = await API.financeiro.resumo(options);
                        break;
                    default:
                        result = { error: `Painel ${panelName} não implementado` };
                }
            } else {
                // Usa API HTTP
                switch(panelName) {
                    case 'dashboard':
                        result = await API.get('/dashboard');
                        break;
                    case 'agendamentos':
                        result = await API.agendamentos.list(options);
                        break;
                    case 'pacientes':
                        result = await API.pacientes.list(options);
                        break;
                    case 'prontuarios':
                        result = await API.prontuarios.list(options);
                        break;
                    case 'financeiro':
                        result = await API.financeiro.resumo(options);
                        break;
                    default:
                        result = { error: `Painel ${panelName} não implementado` };
                }
            }
            
            // Armazena no cache
            this.cache[panelName] = result;
            
            console.log(`✅ Dados carregados para o painel: ${panelName}`);
            return result;
        } catch (error) {
            console.error(`❌ Erro ao carregar dados para o painel ${panelName}:`, error);
            return { 
                error: `Falha ao carregar dados para o painel ${panelName}`,
                details: error.message
            };
        }
    },
    
    // Renderiza um painel
    renderPanel: async function(panelName, containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} não encontrado`);
            return;
        }
        
        try {
            // Mostrar loading
            container.innerHTML = `<div class="loading-container">
                <div class="spinner"></div>
                <p>Carregando dados...</p>
            </div>`;
            
            // Carregar dados
            const data = await this.loadPanelData(panelName, options);
            
            if (data.error) {
                container.innerHTML = `<div class="error-container">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>Erro ao carregar dados</h3>
                    <p>${data.error}</p>
                    <button onclick="PanelManager.renderPanel('${panelName}', '${containerId}', ${JSON.stringify(options)})">
                        Tentar novamente
                    </button>
                </div>`;
                return;
            }
            
            // Chamar função de renderização específica para cada painel
            switch(panelName) {
                case 'dashboard':
                    this.renderDashboard(container, data);
                    break;
                case 'agendamentos':
                    this.renderAgendamentos(container, data);
                    break;
                case 'pacientes':
                    this.renderPacientes(container, data);
                    break;
                case 'prontuarios':
                    this.renderProntuarios(container, data);
                    break;
                case 'financeiro':
                    this.renderFinanceiro(container, data);
                    break;
                default:
                    container.innerHTML = `<p>Renderização para o painel ${panelName} não implementada</p>`;
            }
        } catch (error) {
            console.error(`Erro ao renderizar painel ${panelName}:`, error);
            container.innerHTML = `<div class="error-container">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Erro ao renderizar painel</h3>
                <p>${error.message}</p>
                <button onclick="PanelManager.renderPanel('${panelName}', '${containerId}', ${JSON.stringify(options)})">
                    Tentar novamente
                </button>
            </div>`;
        }
    },
    
    // Funções específicas de renderização para cada painel
    renderDashboard: function(container, data) {
        // Implementar renderização do Dashboard
        const html = `
        <div class="dashboard-grid">
            <!-- Estatísticas Rápidas -->
            <div class="dashboard-stats">
                <div class="stat-card">
                    <i class="fas fa-user-plus"></i>
                    <div class="stat-content">
                        <h3>${data.stats?.pacientesTotal || 0}</h3>
                        <p>Pacientes</p>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-calendar-check"></i>
                    <div class="stat-content">
                        <h3>${data.stats?.agendamentosHoje || 0}</h3>
                        <p>Hoje</p>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-stethoscope"></i>
                    <div class="stat-content">
                        <h3>${data.stats?.consultasRealizadas || 0}</h3>
                        <p>Consultas</p>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-undo"></i>
                    <div class="stat-content">
                        <h3>${data.stats?.taxa_retorno || 0}%</h3>
                        <p>Taxa Retorno</p>
                    </div>
                </div>
            </div>
            
            <!-- Agendamentos Recentes -->
            <div class="dashboard-recent-appointments">
                <h2>Próximos Agendamentos</h2>
                <div class="appointments-list">
                    ${this._renderAgendamentosList(data.agendamentos)}
                </div>
            </div>
            
            <!-- Pacientes Recentes -->
            <div class="dashboard-recent-patients">
                <h2>Pacientes Recentes</h2>
                <div class="patients-list">
                    ${this._renderPacientesList(data.pacientes)}
                </div>
            </div>
        </div>`;
        
        container.innerHTML = html;
    },
    
    renderAgendamentos: function(container, data) {
        // Implementar renderização de Agendamentos
        const html = `
        <div class="appointments-container">
            <div class="appointments-filters">
                <!-- Filtros aqui -->
            </div>
            <div class="appointments-calendar">
                <!-- Calendário aqui -->
            </div>
            <div class="appointments-list">
                ${this._renderAgendamentosList(data.data)}
            </div>
        </div>`;
        
        container.innerHTML = html;
    },
    
    renderPacientes: function(container, data) {
        // Implementar renderização de Pacientes
        const html = `
        <div class="patients-container">
            <div class="patients-filters">
                <!-- Filtros aqui -->
            </div>
            <div class="patients-list">
                ${this._renderPacientesList(data.data)}
            </div>
        </div>`;
        
        container.innerHTML = html;
    },
    
    // Funções auxiliares para renderização de listas
    _renderAgendamentosList: function(agendamentos) {
        if (!agendamentos || agendamentos.length === 0) {
            return `<p class="no-data">Nenhum agendamento encontrado</p>`;
        }
        
        return agendamentos.map(a => `
            <div class="appointment-item" data-id="${a.id}">
                <div class="appointment-time">${new Date(a.data_hora).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</div>
                <div class="appointment-date">${new Date(a.data_hora).toLocaleDateString('pt-BR')}</div>
                <div class="appointment-patient">${a.nome_paciente}</div>
                <div class="appointment-type">${a.tipo || 'Consulta'}</div>
                <div class="appointment-status ${a.status}">${a.status || 'agendado'}</div>
            </div>
        `).join('');
    },
    
    _renderPacientesList: function(pacientes) {
        if (!pacientes || pacientes.length === 0) {
            return `<p class="no-data">Nenhum paciente encontrado</p>`;
        }
        
        return pacientes.map(p => `
            <div class="patient-item" data-id="${p.id}">
                <div class="patient-avatar">
                    ${p.nome?.charAt(0) || '?'}
                </div>
                <div class="patient-info">
                    <div class="patient-name">${p.nome || 'Sem Nome'}</div>
                    <div class="patient-contact">
                        ${p.telefone || p.email || 'Sem contato'}
                    </div>
                </div>
                <div class="patient-actions">
                    <button class="btn btn-sm btn-outline" onclick="window.location.href='../pages/prontuarios.html?id=${p.id}'">
                        <i class="fas fa-clipboard-list"></i>
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="window.location.href='../pages/agendar.html?paciente=${p.id}'">
                        <i class="fas fa-calendar-plus"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
};

console.log('🧩 Gerenciador de Painéis carregado');
