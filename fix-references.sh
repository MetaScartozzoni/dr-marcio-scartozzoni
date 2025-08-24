#!/bin/bash
# Script para ajustar referências em arquivos HTML após reorganização

echo "🔄 Iniciando ajuste de referências nos arquivos HTML..."

# Ajustando referências em auth/login.html
sed -i '' 's|href="assets/css/|href="../assets/css/|g' auth/login.html
sed -i '' 's|src="assets/js/|src="../assets/js/|g' auth/login.html
sed -i '' 's|window.location.href = "home.html"|window.location.href = "../home.html"|g' auth/login.html
sed -i '' 's|href="cadastro.html"|href="cadastro.html"|g' auth/login.html

# Ajustando referências em auth/cadastro.html
sed -i '' 's|href="assets/css/|href="../assets/css/|g' auth/cadastro.html
sed -i '' 's|src="assets/js/|src="../assets/js/|g' auth/cadastro.html
sed -i '' 's|href="login.html"|href="login.html"|g' auth/cadastro.html
sed -i '' 's|window.location.href = "login.html"|window.location.href = "login.html"|g' auth/cadastro.html

# Ajustando referências em auth/redefinir-senha.html
sed -i '' 's|href="assets/css/|href="../assets/css/|g' auth/redefinir-senha.html
sed -i '' 's|src="assets/js/|src="../assets/js/|g' auth/redefinir-senha.html
sed -i '' 's|href="login.html"|href="login.html"|g' auth/redefinir-senha.html
sed -i '' 's|window.location.href = "login.html"|window.location.href = "login.html"|g' auth/redefinir-senha.html

# Ajustando referências em admin/dashboard-admin.html
sed -i '' 's|href="assets/css/|href="../assets/css/|g' admin/dashboard-admin.html
sed -i '' 's|src="assets/js/|src="../assets/js/|g' admin/dashboard-admin.html
sed -i '' 's|href="login.html"|href="../auth/login.html"|g' admin/dashboard-admin.html

# Ajustando referências em modules/*.html
for file in modules/*.html; do
  sed -i '' 's|href="assets/css/|href="../assets/css/|g' "$file"
  sed -i '' 's|src="assets/js/|src="../assets/js/|g' "$file"
  sed -i '' 's|href="login.html"|href="../auth/login.html"|g' "$file"
  sed -i '' 's|href="home.html"|href="../home.html"|g' "$file"
  sed -i '' 's|href="dashboard"|href="../home.html"|g' "$file"
done

# Ajustando referências em home.html
sed -i '' 's|href="auth/login.html"|href="auth/login.html"|g' home.html

echo "✅ Referências ajustadas com sucesso!"
