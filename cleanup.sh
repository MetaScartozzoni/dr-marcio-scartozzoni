#!/bin/bash
# Script para limpar e reorganizar o projeto para deployment

echo "🚀 Iniciando limpeza e reorganização para deployment..."

# Criando pasta temporária para arquivos essenciais
mkdir -p temp_essentials

# Copiando arquivos essenciais para pasta temporária
echo "📦 Copiando arquivos essenciais..."

# Arquivos HTML principais
cp index.html temp_essentials/
cp home.html temp_essentials/
cp login.html temp_essentials/
cp cadastro.html temp_essentials/
cp redefinir-senha.html temp_essentials/
cp dashboard-admin.html temp_essentials/

# Assets importantes
mkdir -p temp_essentials/assets/css
mkdir -p temp_essentials/assets/js
mkdir -p temp_essentials/assets/images
cp -r assets/css/* temp_essentials/assets/css/
cp -r assets/js/* temp_essentials/assets/js/
cp -r assets/images/* temp_essentials/assets/images/ 2>/dev/null || true

# Módulos
mkdir -p temp_essentials/modules
cp -r modules/*.html temp_essentials/modules/

# Configuração Vercel
cp vercel.json temp_essentials/

# Removendo pastas não essenciais
echo "🗑️ Removendo diretórios não essenciais..."
rm -rf app
rm -rf backend
rm -rf database
rm -rf deploy-final
rm -rf docs
rm -rf frontend
rm -rf meu_portal_medico_backend
rm -rf portal-deploy-final-correto
rm -rf portal-medico-frontend
rm -rf public
rm -rf scripts
rm -rf src

# Removendo arquivos não essenciais
echo "🗑️ Removendo arquivos não essenciais..."
find . -maxdepth 1 -name "*.md" -delete
find . -maxdepth 1 -name "*.sql" -delete
find . -maxdepth 1 -name "*.sh" ! -name "cleanup.sh" -delete
find . -maxdepth 1 -name "*.txt" -delete
find . -maxdepth 1 -name "LICENSE" -delete

# Criando nova estrutura
echo "📂 Criando nova estrutura organizada..."
mkdir -p auth
mkdir -p admin

# Movendo arquivos da pasta temporária de volta com a nova organização
echo "📦 Reorganizando arquivos..."
mv temp_essentials/login.html auth/
mv temp_essentials/cadastro.html auth/
mv temp_essentials/redefinir-senha.html auth/
mv temp_essentials/dashboard-admin.html admin/
mv temp_essentials/index.html ./
mv temp_essentials/home.html ./
cp -r temp_essentials/assets ./
cp -r temp_essentials/modules ./
mv temp_essentials/vercel.json ./

# Removendo pasta temporária
rm -rf temp_essentials

# Atualizando referências nos arquivos HTML
echo "🔄 Atualizando referências nos arquivos..."

# Atualizar vercel.json para refletir a nova estrutura
cat > vercel.json << EOF
{
  "version": 2,
  "name": "portal-dr-marcio",
  "buildCommand": "",
  "outputDirectory": ".",
  "installCommand": "",
  "framework": null,
  "public": true,
  "github": {
    "enabled": true,
    "autoAlias": true,
    "silent": false
  },
  "redirects": [
    {
      "source": "/",
      "destination": "/index.html"
    },
    {
      "source": "/login",
      "destination": "/auth/login.html"
    },
    {
      "source": "/cadastro",
      "destination": "/auth/cadastro.html"
    },
    {
      "source": "/recuperar-senha",
      "destination": "/auth/redefinir-senha.html"
    },
    {
      "source": "/dashboard",
      "destination": "/home.html"
    },
    {
      "source": "/admin",
      "destination": "/admin/dashboard-admin.html"
    },
    {
      "source": "/agendamentos",
      "destination": "/modules/agendamentos.html"
    },
    {
      "source": "/pacientes",
      "destination": "/modules/pacientes.html"
    },
    {
      "source": "/prontuarios",
      "destination": "/modules/prontuarios.html"
    },
    {
      "source": "/caderno-digital",
      "destination": "/modules/caderno-digital.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; object-src 'none'; base-uri 'self';"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "origin-when-cross-origin"
        }
      ]
    }
  ],
  "env": {
    "SUPABASE_URL": "https://obohdaxvawmjhxsjgikp.supabase.co",
    "SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ib2hkYXh2YXdtamh4c2pnaWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NDQzMTYsImV4cCI6MjA3MDEyMDMxNn0.Oa4GC17FfUqajBRuEDLroXIg1vBd_x6shE6ke8pKMKU"
  }
}
EOF

# Ajustar referências nos arquivos HTML
echo "🔄 Ajustando referências nos arquivos HTML..."
./fix-references.sh

# Criar arquivo .gitignore básico
echo "📝 Criando arquivo .gitignore básico..."
cat > .gitignore << EOF
# Arquivos do sistema
.DS_Store
Thumbs.db

# Dependências
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Ambiente
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Editor
.vscode/
.idea/
*.swp
*.swo
EOF

echo "✅ Projeto reorganizado e pronto para deploy!"
echo "🚀 Você pode agora iniciar o deploy com o comando: vercel"
