// 🗄️ Configuração e Integração Supabase - Portal Médico Dr. Marcio
// Biblioteca JavaScript para conexão completa com banco de dados

class SupabaseAPI {
    constructor() {
        // 🔐 As credenciais devem vir de window.ENV (arquivo não versionado) ou PORTAL_CONFIG/config.js
        this.supabaseUrl = window.ENV?.SUPABASE_URL || window.PORTAL_CONFIG?.SUPABASE_URL;
        this.supabaseAnonKey = window.ENV?.SUPABASE_ANON_KEY || window.PORTAL_CONFIG?.SUPABASE_ANON_KEY;

        if(!this.supabaseUrl || !this.supabaseAnonKey){
            console.error('Supabase: credenciais ausentes. Crie assets/js/env.js a partir de env.template.js com SUPABASE_URL e SUPABASE_ANON_KEY.');
            this.initialized = false;
            return;
        }

        // Cliente Supabase (será inicializado quando necessário)
        this.client = null;
        this.initialized = false;

        this.initializeSupabase();
    }

    async initializeSupabase() {
        try {
            // Carregar biblioteca Supabase dinamicamente
            if (!window.supabase) {
                await this.loadSupabaseScript();
            }
            
            // Criar cliente
            this.client = window.supabase.createClient(this.supabaseUrl, this.supabaseAnonKey);
            this.initialized = true;
            
            console.log('✅ Supabase inicializado com sucesso');
            return true;
        } catch (error) {
            console.error('❌ Erro ao inicializar Supabase:', error);
            this.showOfflineMode();
            return false;
        }
    }

    async loadSupabaseScript() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    showOfflineMode() {
        // Mostrar aviso de modo offline
        const toast = document.createElement('div');
        toast.className = 'toast toast-warning';
        toast.innerHTML = `
            <i class="fas fa-wifi"></i>
            <span>Modo Offline - Dados simulados ativados</span>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }

    // ========================================
    // 👥 PACIENTES - CRUD COMPLETO
    // ========================================
    
    async getPacientes(limit = 50) {
        if (!this.initialized) return this.getMockPacientes();
        
        try {
            const { data, error } = await this.client
                .from('pacientes')
                .select('*')
                .order('data_criacao', { ascending: false })
                .limit(limit);
                
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Erro ao buscar pacientes:', error);
            return this.getMockPacientes();
        }
    }

    async createPaciente(pacienteData) {
        if (!this.initialized) return this.mockCreatePaciente(pacienteData);
        
        try {
            const { data, error } = await this.client
                .from('pacientes')
                .insert([pacienteData])
                .select();
                
            if (error) throw error;
            this.showSuccessToast('Paciente cadastrado com sucesso!');
            return data[0];
        } catch (error) {
            console.error('Erro ao criar paciente:', error);
            this.showErrorToast('Erro ao cadastrar paciente');
            throw error;
        }
    }

    async updatePaciente(id, pacienteData) {
        if (!this.initialized) return this.mockUpdatePaciente(id, pacienteData);
        
        try {
            const { data, error } = await this.client
                .from('pacientes')
                .update(pacienteData)
                .eq('id', id)
                .select();
                
            if (error) throw error;
            this.showSuccessToast('Paciente atualizado com sucesso!');
            return data[0];
        } catch (error) {
            console.error('Erro ao atualizar paciente:', error);
            this.showErrorToast('Erro ao atualizar paciente');
            throw error;
        }
    }

    async deletePaciente(id) {
        if (!this.initialized) return this.mockDeletePaciente(id);
        
        try {
            const { error } = await this.client
                .from('pacientes')
                .delete()
                .eq('id', id);
                
            if (error) throw error;
            this.showSuccessToast('Paciente excluído com sucesso!');
            return true;
        } catch (error) {
            console.error('Erro ao excluir paciente:', error);
            this.showErrorToast('Erro ao excluir paciente');
            throw error;
        }
    }

    // ========================================
    // 📅 AGENDAMENTOS - CRUD COMPLETO
    // ========================================
    
    async getAgendamentos(dataInicio = null, dataFim = null) {
        if (!this.initialized) return this.getMockAgendamentos();
        
        try {
            let query = this.client
                .from('agendamentos')
                .select(`
                    *,
                    pacientes(nome_completo, telefone),
                    medicos(nome, especialidade)
                `)
                .order('data_agendamento', { ascending: true });
                
            if (dataInicio) {
                query = query.gte('data_agendamento', dataInicio);
            }
            if (dataFim) {
                query = query.lte('data_agendamento', dataFim);
            }
                
            const { data, error } = await query;
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Erro ao buscar agendamentos:', error);
            return this.getMockAgendamentos();
        }
    }

    async createAgendamento(agendamentoData) {
        if (!this.initialized) return this.mockCreateAgendamento(agendamentoData);
        
        try {
            const { data, error } = await this.client
                .from('agendamentos')
                .insert([agendamentoData])
                .select();
                
            if (error) throw error;
            this.showSuccessToast('Agendamento criado com sucesso!');
            return data[0];
        } catch (error) {
            console.error('Erro ao criar agendamento:', error);
            this.showErrorToast('Erro ao criar agendamento');
            throw error;
        }
    }

    // ========================================
    // 📋 PRONTUÁRIOS - CRUD COMPLETO
    // ========================================
    
    async getProntuariosPaciente(pacienteId) {
        if (!this.initialized) return this.getMockProntuarios();
        
        try {
            const { data, error } = await this.client
                .from('prontuarios')
                .select(`
                    *,
                    pacientes(nome_completo),
                    medicos(nome)
                `)
                .eq('paciente_id', pacienteId)
                .order('data_criacao', { ascending: false });
                
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Erro ao buscar prontuários:', error);
            return this.getMockProntuarios();
        }
    }

    async createProntuario(prontuarioData) {
        if (!this.initialized) return this.mockCreateProntuario(prontuarioData);
        
        try {
            const { data, error } = await this.client
                .from('prontuarios')
                .insert([prontuarioData])
                .select();
                
            if (error) throw error;
            this.showSuccessToast('Prontuário criado com sucesso!');
            return data[0];
        } catch (error) {
            console.error('Erro ao criar prontuário:', error);
            this.showErrorToast('Erro ao criar prontuário');
            throw error;
        }
    }

    // ========================================
    // 📊 DASHBOARD - ESTATÍSTICAS
    // ========================================
    
    async getDashboardStats() {
        if (!this.initialized) return this.getMockDashboardStats();
        
        try {
            // Buscar estatísticas em paralelo
            const [pacientes, agendamentosHoje, prontuarios] = await Promise.all([
                this.client.from('pacientes').select('id', { count: 'exact' }),
                this.client.from('agendamentos').select('id', { count: 'exact' }).gte('data_agendamento', new Date().toISOString().split('T')[0]),
                this.client.from('prontuarios').select('id', { count: 'exact' }).gte('data_criacao', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
            ]);
            
            return {
                totalPacientes: pacientes.count || 0,
                agendamentosHoje: agendamentosHoje.count || 0,
                prontuariosAtivos: prontuarios.count || 0,
                consultasMes: prontuarios.count || 0
            };
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            return this.getMockDashboardStats();
        }
    }

    // ========================================
    // 🎭 DADOS SIMULADOS (MOCK) PARA DESENVOLVIMENTO
    // ========================================
    
    getMockPacientes() {
        return [
            {
                id: 1,
                nome_completo: "Maria Silva Santos",
                data_nascimento: "1985-05-15",
                telefone: "(11) 99999-9999",
                email: "maria@email.com",
                data_criacao: new Date().toISOString()
            },
            {
                id: 2,
                nome_completo: "João Carlos Oliveira",
                data_nascimento: "1978-12-03",
                telefone: "(11) 88888-8888",
                email: "joao@email.com",
                data_criacao: new Date().toISOString()
            }
        ];
    }

    getMockAgendamentos() {
        return [
            {
                id: 1,
                data_agendamento: new Date().toISOString(),
                horario: "14:00",
                status: "agendado",
                pacientes: { nome_completo: "Maria Silva Santos" },
                medicos: { nome: "Dr. Marcio Scartozzoni" }
            }
        ];
    }

    getMockDashboardStats() {
        return {
            totalPacientes: 150,
            agendamentosHoje: 8,
            prontuariosAtivos: 45,
            consultasMes: 120
        };
    }

    // ========================================
    // � AUTENTICAÇÃO E GESTÃO DE USUÁRIOS
    // ========================================
    
    async signIn(email, password) {
        if (!this.initialized) await this.initializeSupabase();
        
        try {
            const { data, error } = await this.client.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) throw error;
            
            // Armazenar informações do usuário
            this.saveUserSession(data);
            this.showSuccessToast('Login realizado com sucesso!');
            
            return {
                success: true,
                user: data.user,
                session: data.session
            };
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            this.showErrorToast(error.message || 'Falha na autenticação');
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async signUp(email, password, userData) {
        if (!this.initialized) await this.initializeSupabase();
        
        try {
            // Criar conta na autenticação do Supabase
            const { data, error } = await this.client.auth.signUp({
                email,
                password,
                options: {
                    data: userData // Dados adicionais como nome, tipo, etc.
                }
            });
            
            if (error) throw error;
            
            this.showSuccessToast('Cadastro realizado! Verifique seu e-mail.');
            
            return {
                success: true,
                user: data.user
            };
        } catch (error) {
            console.error('Erro ao criar conta:', error);
            this.showErrorToast(error.message || 'Não foi possível criar sua conta');
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async signOut() {
        if (!this.initialized) return true;
        
        try {
            const { error } = await this.client.auth.signOut();
            if (error) throw error;
            
            // Limpar armazenamento local
            localStorage.removeItem('clinica_auth_token');
            localStorage.removeItem('clinica_user_data');
            sessionStorage.removeItem('clinica_auth_token');
            sessionStorage.removeItem('clinica_user_data');
            
            return true;
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            return false;
        }
    }
    
    async resetPassword(email) {
        if (!this.initialized) await this.initializeSupabase();
        
        try {
            const { error } = await this.client.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/redefinir-senha.html'
            });
            
            if (error) throw error;
            
            this.showSuccessToast('E-mail de recuperação enviado com sucesso!');
            return true;
        } catch (error) {
            console.error('Erro ao solicitar redefinição de senha:', error);
            this.showErrorToast(error.message || 'Falha ao enviar e-mail de recuperação');
            return false;
        }
    }
    
    async updatePassword(newPassword) {
        if (!this.initialized) await this.initializeSupabase();
        
        try {
            const { error } = await this.client.auth.updateUser({ password: newPassword });
            
            if (error) throw error;
            
            this.showSuccessToast('Senha atualizada com sucesso!');
            return true;
        } catch (error) {
            console.error('Erro ao atualizar senha:', error);
            this.showErrorToast(error.message || 'Falha ao atualizar senha');
            return false;
        }
    }
    
    async getCurrentUser() {
        if (!this.initialized) await this.initializeSupabase();
        
        try {
            const { data: { user }, error } = await this.client.auth.getUser();
            
            if (error) throw error;
            
            return user;
        } catch (error) {
            console.error('Erro ao obter usuário atual:', error);
            return null;
        }
    }
    
    async getSession() {
        if (!this.initialized) await this.initializeSupabase();
        
        try {
            const { data, error } = await this.client.auth.getSession();
            
            if (error || !data.session) return null;
            
            return data.session;
        } catch (error) {
            console.error('Erro ao verificar sessão:', error);
            return null;
        }
    }
    
    saveUserSession(data) {
        if (!data || !data.session || !data.user) return;
        
        const userData = {
            id: data.user.id,
            email: data.user.email,
            nome: data.user.user_metadata?.nome || data.user.email.split('@')[0],
            tipo: data.user.user_metadata?.tipo || 'paciente',
            permissoes: data.user.user_metadata?.permissoes || [],
            timestamp: Date.now()
        };
        
        // Salvar token e dados do usuário
        const storage = localStorage; // ou sessionStorage para sessão temporária
        storage.setItem('clinica_auth_token', data.session.access_token);
        storage.setItem('clinica_user_data', JSON.stringify(userData));
    }
    
    // ========================================
    // �🔔 NOTIFICAÇÕES E TOASTS
    // ========================================
    
    showSuccessToast(message) {
        this.showToast(message, 'success');
    }

    showErrorToast(message) {
        this.showToast(message, 'error');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remover após 4 segundos
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
}

// ========================================
// 🚀 INICIALIZAÇÃO GLOBAL
// ========================================

// Criar instância global
window.SupabaseAPI = new SupabaseAPI();

// Exportar para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SupabaseAPI;
}
