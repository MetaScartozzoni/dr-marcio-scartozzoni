#!/usr/bin/env node
// Injeta bloco window.__PUBLIC_ENV__ nas páginas com marcador PUBLIC_ENV_INJECT
const fs = require('fs');
const path = require('path');

const files = [
  'index.html',
  'home.html',
  'auth/login.html'
];

function jsonEscape(str){
  return str.replace(/"/g,'\\"');
}

const FEATURE_FLAGS_RAW = process.env.FEATURE_FLAGS || '{}';
let featureFlags = '{}';
try { JSON.parse(FEATURE_FLAGS_RAW); featureFlags = FEATURE_FLAGS_RAW; } catch(e){ featureFlags = '{}'; }

const snippet = `<!-- PUBLIC_ENV_INJECT -->\n<script>\n  window.__PUBLIC_ENV__ = {\n    SUPABASE_URL: "${process.env.SUPABASE_URL || ''}",\n    SUPABASE_ANON_KEY: "${process.env.SUPABASE_ANON_KEY || ''}",\n    API_URL: "${process.env.API_URL || '/api'}",\n    APP_ENV: "${process.env.APP_ENV || 'production'}",\n    LOG_LEVEL: "${process.env.LOG_LEVEL || 'info'}",\n    SUPPORT_EMAIL: "${process.env.SUPPORT_EMAIL || 'contato@seudominio.com'}",\n    FEATURE_FLAGS: (function(){ try { return ${featureFlags}; } catch(e){ return {}; } })()\n  };\n</script>`;

let changed = 0;
for(const rel of files){
  const filePath = path.join(process.cwd(), rel);
  if(!fs.existsSync(filePath)) continue;
  let html = fs.readFileSync(filePath,'utf8');
  if(html.includes('<!-- PUBLIC_ENV_INJECT -->')){
    html = html.replace(/<!-- PUBLIC_ENV_INJECT -->[\s\S]*?<script src="(\.\.\/)?assets\/js\/env\.js"><\/script>/, match=> snippet + '\n<script src="' + (rel.startsWith('auth/') ? '../' : '') + 'assets/js/env.js"></script>');
    fs.writeFileSync(filePath, html, 'utf8');
    changed++;
  }
}

console.log(`✅ Injeção concluída. Arquivos modificados: ${changed}`);