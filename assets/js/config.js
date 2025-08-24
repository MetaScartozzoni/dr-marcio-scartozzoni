// 🔐 Configuração de Ambiente - Portal Médico Dr. Marcio Scartozzoni
// Configure suas variáveis reais do Supabase aqui

window.PORTAL_CONFIG = {
    // ========================================
    // 🗄️ SUPABASE - CONFIGURAÇÃO PRINCIPAL
    // ========================================
    
    // ⚠️ SUBSTITUA PELOS SEUS DADOS REAIS DO SUPABASE:
    // 1. Vá para https://supabase.com/dashboard
    // 2. Selecione seu projeto  
    // 3. Vá em Settings > API
    // 4. Copie a URL e as chaves
    
    SUPABASE_URL: undefined, // Definido via env.js (local) ou variáveis de ambiente (produção)
    SUPABASE_ANON_KEY: undefined, // Nunca commit a chave real aqui
    
    // Configurações da API
    API: {
        BASE_URL: window.location.hostname === 'localhost' 
            ? 'http://localhost:8000/api'
            : 'https://SEU_DOMINIO_PRODUCAO/api', // Ajuste no deploy
        TIMEOUT: 30000,
        RETRY_ATTEMPTS: 3
    },

    // Configurações do domínio
    DOMAIN: {
        PRODUCTION: 'SEU_DOMINIO_PRODUCAO',
        DEVELOPMENT: 'localhost:8000',
        STAGING: 'SEU_DOMINIO_STAGING'
    },

    // Configurações do sistema
    SYSTEM: {
        NAME: 'Portal Médico Dr. Marcio Scartozzoni',
        VERSION: '1.0.0',
        ENVIRONMENT: window.location.hostname === 'localhost' ? 'development' : 'production',
        DEBUG: window.location.hostname === 'localhost',
        AUTO_SAVE: true,
        AUTO_SAVE_INTERVAL: 30000 // 30 segundos
    },

    // Configurações de autenticação
    AUTH: {
        TOKEN_KEY: 'portal_medico_token',
        USER_KEY: 'portal_medico_user',
        SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 horas
        REMEMBER_ME_TIMEOUT: 30 * 24 * 60 * 60 * 1000 // 30 dias
    },

    // Configurações de UI
    UI: {
        THEME: 'light',
        LANGUAGE: 'pt-BR',
        DATE_FORMAT: 'DD/MM/YYYY',
        TIME_FORMAT: 'HH:mm',
        CURRENCY: 'BRL',
        PAGINATION_SIZE: 20,
        ANIMATION_DURATION: 300
    },

    // Configurações de notificação
    NOTIFICATIONS: {
        ENABLED: true,
        POSITION: 'top-right',
        AUTO_CLOSE: 5000,
        SOUND: false
    },

    // Módulos disponíveis
    MODULES: {
        PACIENTES: {
            enabled: true,
            permissions: ['create', 'read', 'update', 'delete']
        },
        AGENDAMENTOS: {
            enabled: true,
            permissions: ['create', 'read', 'update', 'delete']
        },
        PRONTUARIOS: {
            enabled: true,
            permissions: ['create', 'read', 'update']
        },
        FINANCEIRO: {
            enabled: true,
            permissions: ['read', 'update']
        },
        RELATORIOS: {
            enabled: true,
            permissions: ['read']
        }
    },

    // Configurações de backup
    BACKUP: {
        ENABLED: true,
        FREQUENCY: 'daily',
        RETENTION_DAYS: 30,
        AUTO_BACKUP: true
    },

    // URLs importantes
    URLS: {
    HELP: '#',
    SUPPORT: 'mailto:contato@seudominio.com',
    PRIVACY: '#',
    TERMS: '#'
    }
};

// Detectar ambiente e ajustar configurações
(function() {
    const hostname = window.location.hostname;
    
    // Configurações específicas para desenvolvimento
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        window.PORTAL_CONFIG.SYSTEM.DEBUG = true;
        window.PORTAL_CONFIG.NOTIFICATIONS.AUTO_CLOSE = 10000;
        console.log('🔧 Modo desenvolvimento ativado');
    }
    
    // Configurações específicas para staging
    if (hostname.includes('staging')) {
        window.PORTAL_CONFIG.SYSTEM.ENVIRONMENT = 'staging';
        console.log('🧪 Modo staging ativado');
    }

    console.log('⚙️ Configurações carregadas:', window.PORTAL_CONFIG.SYSTEM.NAME);
})();
