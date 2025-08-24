// API Client - Portal Médico Dr. Marcio Scartozzoni
// Cliente unificado para comunicação com APIs (Supabase/FastAPI)

window.API = {
    baseURL: window.ENV?.API_URL || '/api',
    timeout: window.ENV?.API_TIMEOUT || 30000,
    useSupabase: true, // Definir como true para usar Supabase, false para API FastAPI

    // Headers padrão
    getHeaders: function() {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        // Adicionar token de autenticação se disponível
        const token = Utils.storage.get(window.PORTAL_CONFIG?.AUTH?.TOKEN_KEY || 'portal_medico_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    },

    // Método genérico para fazer requisições
    request: async function(method, endpoint, data = null) {
        const url = `${this.baseURL}${endpoint}`;
        
        const config = {
            method: method.toUpperCase(),
            headers: this.getHeaders(),
            signal: AbortSignal.timeout(this.timeout)
        };

        if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
            config.body = JSON.stringify(data);
        }

        try {
            console.log(`🔄 ${method.toUpperCase()} ${url}`);
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log(`✅ ${method.toUpperCase()} ${url} - Success`);
            return result;

        } catch (error) {
            console.error(`❌ ${method.toUpperCase()} ${url} - Error:`, error);
            
            // Tratamento de erros específicos
            if (error.name === 'AbortError') {
                Utils.notify.error('Requisição expirou. Tente novamente.');
            } else if (error.message.includes('401')) {
                Utils.notify.error('Sessão expirada. Faça login novamente.');
                // Redirecionar para login se necessário
            } else if (error.message.includes('403')) {
                Utils.notify.error('Acesso negado.');
            } else if (error.message.includes('404')) {
                Utils.notify.error('Recurso não encontrado.');
            } else if (error.message.includes('500')) {
                Utils.notify.error('Erro interno do servidor. Tente novamente.');
            } else {
                Utils.notify.error(error.message || 'Erro na comunicação com o servidor.');
            }
            
            throw error;
        }
    },

    // Métodos HTTP específicos
    get: function(endpoint) {
        return this.request('GET', endpoint);
    },

    post: function(endpoint, data) {
        return this.request('POST', endpoint, data);
    },

    put: function(endpoint, data) {
        return this.request('PUT', endpoint, data);
    },

    patch: function(endpoint, data) {
        return this.request('PATCH', endpoint, data);
    },

    delete: function(endpoint) {
        return this.request('DELETE', endpoint);
    },

    // APIs específicas do sistema
    
    // Health Check
    health: function() {
        return this.get('/health');
    },

    // Info da API
    info: function() {
        return this.get('/info');
    },

    // === PACIENTES ===
    pacientes: {
        // Listar todos os pacientes
        list: function(page = 1, limit = 20) {
            return API.get(`/pacientes?page=${page}&limit=${limit}`);
        },

        // Buscar paciente por ID
        get: function(id) {
            return API.get(`/pacientes/${id}`);
        },

        // Criar novo paciente
        create: function(data) {
            return API.post('/pacientes/', data);
        },

        // Atualizar paciente
        update: function(id, data) {
            return API.put(`/pacientes/${id}`, data);
        },

        // Deletar paciente
        delete: function(id) {
            return API.delete(`/pacientes/${id}`);
        },

        // Buscar pacientes por nome
        search: function(query) {
            return API.get(`/pacientes/search?q=${encodeURIComponent(query)}`);
        }
    },

    // === AGENDAMENTOS ===
    agendamentos: {
        // Listar agendamentos
        list: function(page = 1, limit = 20, data = null) {
            let url = `/agendamentos?page=${page}&limit=${limit}`;
            if (data) {
                url += `&data=${data}`;
            }
            return API.get(url);
        },

        // Buscar agendamento por ID
        get: function(id) {
            return API.get(`/agendamentos/${id}`);
        },

        // Criar agendamento
        create: function(data) {
            return API.post('/agendamentos/', data);
        },

        // Atualizar agendamento
        update: function(id, data) {
            return API.put(`/agendamentos/${id}`, data);
        },

        // Deletar agendamento
        delete: function(id) {
            return API.delete(`/agendamentos/${id}`);
        },

        // Agendamentos por paciente
        byPaciente: function(pacienteId) {
            return API.get(`/pacientes/${pacienteId}/agendamentos`);
        },

        // Agendamentos do dia
        hoje: function() {
            const hoje = new Date().toISOString().split('T')[0];
            return this.list(1, 100, hoje);
        }
    },

    // === PRONTUÁRIOS ===
    prontuarios: {
        // Listar prontuários
        list: function(page = 1, limit = 20) {
            return API.get(`/prontuarios?page=${page}&limit=${limit}`);
        },

        // Buscar prontuário por ID
        get: function(id) {
            return API.get(`/prontuarios/${id}`);
        },

        // Criar prontuário
        create: function(data) {
            return API.post('/prontuarios/', data);
        },

        // Atualizar prontuário
        update: function(id, data) {
            return API.put(`/prontuarios/${id}`, data);
        },

        // Prontuários por paciente
        byPaciente: function(pacienteId) {
            return API.get(`/pacientes/${pacienteId}/prontuarios`);
        }
    },

    // === RELATÓRIOS ===
    relatorios: {
        // Relatório de agendamentos
        agendamentos: function(dataInicio, dataFim) {
            return API.get(`/relatorios/agendamentos?inicio=${dataInicio}&fim=${dataFim}`);
        },

        // Relatório financeiro
        financeiro: function(mes, ano) {
            return API.get(`/relatorios/financeiro?mes=${mes}&ano=${ano}`);
        },

        // Relatório de pacientes
        pacientes: function() {
            return API.get('/relatorios/pacientes');
        }
    },

    // Utilitários para desenvolvimento
    dev: {
        // Testar conexão
        ping: async function() {
            try {
                const result = await API.health();
                Utils.notify.success('Conexão com API estabelecida!');
                return result;
            } catch (error) {
                Utils.notify.error('Falha na conexão com API');
                return null;
            }
        },

        // Obter informações da API
        info: async function() {
            try {
                const result = await API.info();
                console.table(result);
                return result;
            } catch (error) {
                console.error('Erro ao obter informações da API:', error);
                return null;
            }
        }
    },
    
    // === INTEGRAÇÃO SUPABASE ===
    supabase: {
        // Obter instância do cliente Supabase
        getClient: function() {
            if (!window.supabaseAPI) {
                window.supabaseAPI = new SupabaseAPI();
            }
            return window.supabaseAPI;
        },
        
        // Métodos para integração direta com painéis
        
        // Dashboard principal - Dados para cards e gráficos
        getDashboardData: async function() {
            try {
                const client = this.getClient();
                const [
                    pacientes, 
                    agendamentos, 
                    consultas,
                    financeiro
                ] = await Promise.all([
                    client.getPacientes(10),
                    client.getAgendamentos({ limit: 5, futuros: true }),
                    client.getConsultasRecentes(30), // últimos 30 dias
                    client.getResumoFinanceiro()
                ]);
                
                return {
                    pacientes,
                    agendamentos,
                    consultas,
                    financeiro,
                    stats: {
                        pacientesTotal: pacientes?.length || 0,
                        agendamentosHoje: agendamentos?.filter(a => 
                            new Date(a.data_hora).toLocaleDateString() === new Date().toLocaleDateString()
                        ).length || 0,
                        consultasRealizadas: consultas?.filter(c => c.status === 'realizada').length || 0,
                        taxa_retorno: Math.round((consultas?.filter(c => c.retorno)?.length || 0) / 
                            (consultas?.length || 1) * 100)
                    }
                };
            } catch (error) {
                console.error('Erro ao carregar dados do dashboard:', error);
                return { error: 'Falha ao carregar dados do dashboard' };
            }
        },
        
        // Painel de agendamentos
        getAgendamentosPanel: async function(filtros = {}) {
            try {
                const client = this.getClient();
                const agendamentos = await client.getAgendamentos(filtros);
                return { success: true, data: agendamentos };
            } catch (error) {
                console.error('Erro ao carregar painel de agendamentos:', error);
                return { success: false, error: 'Falha ao carregar agendamentos' };
            }
        },
        
        // Painel de pacientes
        getPacientesPanel: async function(filtros = {}) {
            try {
                const client = this.getClient();
                const pacientes = await client.getPacientes(filtros.limit || 50);
                return { success: true, data: pacientes };
            } catch (error) {
                console.error('Erro ao carregar painel de pacientes:', error);
                return { success: false, error: 'Falha ao carregar pacientes' };
            }
        }
    }
};

// Auto-teste da API em desenvolvimento
if (window.ENV?.DEBUG) {
    // Testar conexão após 2 segundos
    setTimeout(() => {
        API.dev.ping();
    }, 2000);
}

console.log('🔌 API Client carregado com integração Supabase');
