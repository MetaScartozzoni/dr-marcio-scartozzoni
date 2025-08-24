#!/usr/bin/env python3

import uvicorn
from app.main import app
from app.database import create_tables

if __name__ == "__main__":
    print("🚀 Iniciando Portal Médico Dr. Marcio")
    print("📋 Criando tabelas do banco de dados...")
    
    try:
        create_tables()
        print("✅ Tabelas criadas com sucesso!")
    except Exception as e:
        print(f"⚠️  Aviso: {e}")
    
    print("🌐 Servidor rodando em: http://127.0.0.1:8000")
    print("📚 Documentação API: http://127.0.0.1:8000/docs")
    print("🔄 Para parar: Ctrl+C")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
