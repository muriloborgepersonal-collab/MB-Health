@echo off
echo ===================================================
echo   MFit Dashboard - Reparador de Instalacao
echo ===================================================
echo.
echo [1/3] Limpando arquivos antigos...
echo Se voce receber 'Acesso negado', feche todos os outros terminais e o VS Code.
if exist node_modules (
    rmdir /s /q node_modules || (
        echo.
        echo [AVISO] Nao foi possivel remover a pasta node_modules inteira.
        echo Certifique-se de que NAO ha nenhum servidor rodando (npm run dev).
        echo Tente fechar o VS Code e rodar este arquivo novamente.
        pause
    )
    echo Folder node_modules removida.
)
echo.
echo [2/3] Limpando cache do NPM...
call npm cache clean --force
echo.
echo [3/3] Tentando instalar novamente...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo.
    echo [ERRO] A instalacao falhou novamente.
    echo Por favor, tire uma foto ou copie o ERRO acima e me mande.
    pause
    exit /b
)
echo.
echo [SUCESSO] Instalacao concluida!
echo Agora voce pode rodar o 'start_app.bat' novamente.
pause
