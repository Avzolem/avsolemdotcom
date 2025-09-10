#!/usr/bin/env python3
"""
Script para capturar screenshots de proyectos desde Windows
Requiere: pip install selenium webdriver-manager pillow
"""

import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Configuración de proyectos
PROJECTS = [
    {
        'name': 'ezticket',
        'url': 'https://ezticket.vercel.app/',
        'wait_time': 3
    },
    {
        'name': 'comimake',
        'url': 'https://comimake.vercel.app/',
        'wait_time': 3
    },
    {
        'name': 'rentygo',
        'url': 'https://rentygo.vercel.app/',
        'wait_time': 3
    },
    {
        'name': 'coinchashop',
        'url': 'https://coinchashop.vercel.app/',
        'wait_time': 3
    },
    {
        'name': 'aucoin',
        'url': 'https://aucoin.vercel.app/',
        'wait_time': 3
    },
    {
        'name': 'menonitapp',
        'url': 'https://menonitapp.com/',
        'wait_time': 3
    }
]

def setup_driver():
    """Configura el driver de Chrome con opciones optimizadas"""
    chrome_options = Options()
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('--disable-blink-features=AutomationControlled')
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    return driver

def capture_screenshots(project, driver):
    """Captura 5 screenshots diferentes de un proyecto"""
    name = project['name']
    url = project['url']
    wait_time = project['wait_time']
    
    print(f"📸 Capturando screenshots de {name}...")
    
    # Crear directorio si no existe
    output_dir = f'public/images/projects/{name}'
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        # Navegar a la URL
        driver.get(url)
        time.sleep(wait_time)
        
        # Screenshot 1: Vista completa de la página principal
        driver.save_screenshot(f'{output_dir}/{name}-screenshot-1.png')
        print(f"  ✅ {name}-screenshot-1.png - Homepage completa")
        
        # Screenshot 2: Scroll down para capturar más contenido
        driver.execute_script("window.scrollTo(0, 500);")
        time.sleep(1)
        driver.save_screenshot(f'{output_dir}/{name}-screenshot-2.png')
        print(f"  ✅ {name}-screenshot-2.png - Sección media")
        
        # Screenshot 3: Más scroll para features
        driver.execute_script("window.scrollTo(0, 1000);")
        time.sleep(1)
        driver.save_screenshot(f'{output_dir}/{name}-screenshot-3.png')
        print(f"  ✅ {name}-screenshot-3.png - Features/Características")
        
        # Screenshot 4: Vista móvil
        driver.set_window_size(390, 844)  # iPhone 12 size
        driver.get(url)  # Recargar para vista móvil
        time.sleep(wait_time)
        driver.save_screenshot(f'{output_dir}/{name}-screenshot-4.png')
        print(f"  ✅ {name}-screenshot-4.png - Vista móvil")
        
        # Screenshot 5: Tablet view
        driver.set_window_size(768, 1024)  # iPad size
        driver.get(url)
        time.sleep(wait_time)
        driver.save_screenshot(f'{output_dir}/{name}-screenshot-5.png')
        print(f"  ✅ {name}-screenshot-5.png - Vista tablet")
        
        # Restaurar tamaño desktop
        driver.set_window_size(1920, 1080)
        
    except Exception as e:
        print(f"  ❌ Error capturando {name}: {str(e)}")

def main():
    """Función principal"""
    print("🚀 Iniciando captura de screenshots...")
    print("=" * 50)
    
    # Configurar driver
    driver = setup_driver()
    
    try:
        # Capturar screenshots de cada proyecto
        for project in PROJECTS:
            capture_screenshots(project, driver)
            print()
        
        print("=" * 50)
        print("✨ ¡Captura completada exitosamente!")
        print("\nPróximos pasos:")
        print("1. Verifica los screenshots en public/images/projects/")
        print("2. Ejecuta el script de actualización MDX")
        
    finally:
        driver.quit()

if __name__ == "__main__":
    main()