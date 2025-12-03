'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { routes, protectedRoutes } from '@/resources';
import NotFound from '@/app/not-found';

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const pathname = usePathname();
  const [isRouteEnabled, setIsRouteEnabled] = useState(false);
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const performChecks = async () => {
      setLoading(true);
      setIsRouteEnabled(false);
      setIsPasswordRequired(false);
      setIsAuthenticated(false);

      const checkRouteEnabled = () => {
        if (!pathname) return false;

        if (pathname in routes) {
          return routes[pathname as keyof typeof routes];
        }

        const dynamicRoutes = ['/blog', '/work'] as const;
        for (const route of dynamicRoutes) {
          if (pathname?.startsWith(route) && routes[route]) {
            return true;
          }
        }

        return false;
      };

      const routeEnabled = checkRouteEnabled();
      setIsRouteEnabled(routeEnabled);

      if (protectedRoutes[pathname as keyof typeof protectedRoutes]) {
        setIsPasswordRequired(true);

        const response = await fetch('/api/check-auth');
        if (response.ok) {
          setIsAuthenticated(true);
        }
      }

      setLoading(false);
    };

    performChecks();
  }, [pathname]);

  const handlePasswordSubmit = async () => {
    const response = await fetch('/api/authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      setIsAuthenticated(true);
      setError(undefined);
    } else {
      setError('Incorrect password');
    }
  };

  if (loading) {
    return (
      <div className="w-full py-32 flex justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-cyan-600 rounded-full animate-spin dark:border-gray-700 dark:border-t-cyan-400" />
      </div>
    );
  }

  if (!isRouteEnabled) {
    return <NotFound />;
  }

  if (isPasswordRequired && !isAuthenticated) {
    return (
      <div className="py-32 max-w-sm mx-auto flex flex-col gap-6 items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center text-balance">
          This page is password protected
        </h2>
        <div className="w-full flex flex-col gap-2 items-center">
          <div className="w-full">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`
                w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-900
                text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}
              `}
              onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
            />
            {error && <span className="text-sm text-red-500 mt-1">{error}</span>}
          </div>
          <button
            onClick={handlePasswordSubmit}
            className="
              px-4 py-2 rounded-lg font-medium
              bg-cyan-600 hover:bg-cyan-700 text-white
              dark:bg-cyan-500 dark:hover:bg-cyan-600
              transition-colors duration-200
            "
          >
            Submit
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export { RouteGuard };
