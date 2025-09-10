@echo off
echo ========================================
echo    Captura de Screenshots - Proyectos
echo ========================================
echo.

REM Verificar si Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python no está instalado o no está en el PATH
    echo Por favor instala Python desde https://www.python.org/
    pause
    exit /b 1
)

echo [1/3] Instalando dependencias...
pip install selenium webdriver-manager pillow --quiet

echo [2/3] Ejecutando captura de screenshots...
python capture_screenshots_windows.py

echo.
echo [3/3] Proceso completado!
echo.
echo Los screenshots se han guardado en: public\images\projects\
echo.
pause