"use client";

import { useEffect } from 'react';

export function ClientWarningSuppress() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const originalError = console.error;
      
      console.error = (...args: any[]) => {
        const message = args[0]?.toString() || '';
        
        // Lista específica de warnings de Once UI que queremos suprimir
        const suppressedWarnings = [
          'React does not recognize the `mobileDirection`',
          'React does not recognize the `tabletDirection`',
          'React does not recognize the `desktopDirection`',
          'React does not recognize the `mobileColumns`',
          'React does not recognize the `tabletColumns`',
          'React does not recognize the `desktopColumns`',
          'React does not recognize the `fillWidth`',
          'React does not recognize the `fillHeight`',
          'React does not recognize the `horizontal`',
          'React does not recognize the `vertical`',
          'React does not recognize the `textVariant`',
          'React does not recognize the `background`',
          'Invalid DOM property'
        ];
        
        const shouldSuppress = suppressedWarnings.some(warning => 
          message.includes(warning)
        );
        
        // Solo mostrar el error si NO es uno de los warnings de Once UI
        if (!shouldSuppress) {
          originalError.apply(console, args);
        }
      };
    }
  }, []);

  return null;
}