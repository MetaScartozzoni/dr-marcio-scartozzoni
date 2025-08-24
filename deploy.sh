#!/bin/bash

# Script para preparar e fazer o deploy do portal Dr. Marcio

echo "🔧 Preparando deploy do Portal Dr. Marcio..."

# Verificar se o Git está instalado
if ! command -v git &> /dev/null
then
    echo "❌ Git não encontrado. Por favor instale o Git e tente novamente."
    exit 1
fi

# Verificar se a Vercel CLI está instalada
if ! command -v vercel &> /dev/null
then
    echo "⚠️ Vercel CLI não encontrada. Deseja instalá-la? (s/n)"
    read resposta
    if [[ "$resposta" == "s" || "$resposta" == "S" ]]; then
        echo "📦 Instalando Vercel CLI..."
        npm install -g vercel
    else
        echo "❌ Vercel CLI é necessária para o deploy. Abortando."
        exit 1
    fi
fi

# Verificar se estamos em um repositório Git
if [ ! -d .git ]; then
    echo "⚠️ Diretório não é um repositório Git. Deseja inicializá-lo? (s/n)"
    read resposta
    if [[ "$resposta" == "s" || "$resposta" == "S" ]]; then
        echo "🔧 Inicializando repositório Git..."
        git init
        git add .
        git commit -m "Inicialização do repositório"
    else
        echo "❌ Repositório Git é necessário para o deploy. Abortando."
        exit 1
    fi
else
    # Verificar se há mudanças para commitar
    if [[ -n $(git status -s) ]]; then
        echo "⚠️ Há mudanças não commitadas. Deseja adicioná-las? (s/n)"
        read resposta
        if [[ "$resposta" == "s" || "$resposta" == "S" ]]; then
            echo "🔧 Adicionando mudanças..."
            git add .
            echo "✏️ Digite a mensagem do commit:"
            read mensagem
            git commit -m "$mensagem"
        else
            echo "⚠️ Continuando sem commitar as mudanças."
        fi
    fi
fi

# Verificar se o repositório remoto está configurado
remote_url=$(git config --get remote.origin.url)
if [ -z "$remote_url" ]; then
    echo "⚠️ Repositório remoto não configurado. Por favor, adicione um repositório remoto:"
    echo "✏️ Digite a URL do repositório (ex: https://github.com/usuario/repo.git):"
    read remote_url
    git remote add origin "$remote_url"
fi

# Push para o repositório remoto
echo "🚀 Enviando código para o repositório remoto..."
git push -u origin main || git push -u origin master

# Deploy na Vercel
echo "🚀 Iniciando deploy na Vercel..."
vercel --prod

echo "✅ Deploy concluído! O projeto deve estar disponível em breve."
echo "🌐 Verifique o status no dashboard da Vercel."
