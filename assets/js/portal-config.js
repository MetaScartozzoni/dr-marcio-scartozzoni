// Configuração Global do Portal Dr. Marcio Scartozzoni
// Este arquivo centraliza todas as configurações do portal

window.PORTAL_CONFIG = {
    // Configurações do sistema
    SYSTEM: {
        NAME: "Portal Dr. Marcio",
        VERSION: "1.0.0",
        DEBUG: window.ENV?.DEBUG || false,
        MOCK_DATA: false,
        THEME: "light",
        LANGUAGE: "pt-BR"
    },
    
    // Configurações da API
    API: {
        BASE_URL: window.ENV?.API_URL || '/api',
        TIMEOUT: 30000,
        RETRY_ATTEMPTS: 3,
        CACHE_DURATION: 5 * 60 * 1000, // 5 minutos em ms
    },
    
    // Configurações de autenticação
    AUTH: {
        TOKEN_KEY: 'portal_medico_token',
        USER_KEY: 'portal_medico_user',
        SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 horas em ms
        REFRESH_TOKEN_KEY: 'portal_medico_refresh_token',
    },
    
    // Configurações dos módulos
    MODULES: {
        AGENDAMENTOS: {
            DEFAULT_VIEW: 'semana',
            HORARIO_INICIO: '08:00',
            HORARIO_FIM: '18:00',
            DURACAO_PADRAO: 30, // minutos
            CORES: {
                CONSULTA: '#4CAF50',
                RETORNO: '#2196F3',
                CIRURGIA: '#F44336',
                AVALIACAO: '#FF9800'
            }
        },
        PACIENTES: {
            ITENS_POR_PAGINA: 20,
            CAMPOS_BUSCA: ['nome', 'email', 'telefone', 'cpf']
        },
        PRONTUARIOS: {
            AUTO_SAVE: true,
            INTERVALO_AUTO_SAVE: 60000, // 1 minuto
        },
        FINANCEIRO: {
            MOEDA: 'BRL',
            FORMATO_DATA: 'DD/MM/YYYY'
        }
    },
    
    // Configurações de UI/UX
    UI: {
        TEMA_COR_PRIMARIA: '#3f51b5',
        TEMA_COR_SECUNDARIA: '#f50057',
        ANIMACOES: true,
        MODO_ESCURO: false,
        FONTE_TAMANHO: 'medium',
        NOTIFICACOES: {
            POSICAO: 'top-right',
            DURACAO: 5000,
            SOM: true
        }
    }
};

// Detector de ambiente (desenvolvimento/produção)
(() => {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
        window.PORTAL_CONFIG.SYSTEM.ENVIRONMENT = 'development';
        window.PORTAL_CONFIG.SYSTEM.DEBUG = true;
        console.log('🛠️ Ambiente de desenvolvimento detectado');
    } else {
        window.PORTAL_CONFIG.SYSTEM.ENVIRONMENT = 'production';
        window.PORTAL_CONFIG.SYSTEM.DEBUG = false;
    }
})();

console.log('⚙️ Configurações do Portal carregadas');
