@echo off
echo ===================================================
echo   MFit Dashboard - Instalador e Inicializador
echo ===================================================
echo.
echo Verificando se o Node.js esta acessivel...
node -v
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado!
    echo Por favor, instale o Node.js em https://nodejs.org
    echo e reinicie este script.
    pause
    exit /b
)
echo.
echo [1/2] Instalando as dependencias do projeto (aguarde)...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao instalar dependencias.
    pause
    exit /b
)
echo.
echo [2/2] Iniciando o servidor de desenvolvimento...
echo Quando abrir, clique no link Local (ex: http://localhost:5173)
echo.
call npm run dev
pause
