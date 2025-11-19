'use client';

import { useState } from 'react';
import { useYugiohAuth } from '@/contexts/YugiohAuthContext';
import {
  Button,
  Column,
  Heading,
  PasswordInput,
  Text,
} from '@once-ui-system/core';

interface AdminLoginProps {
  onClose: () => void;
}

export default function AdminLogin({ onClose }: AdminLoginProps) {
  const { login } = useYugiohAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(password);

    if (success) {
      onClose();
    } else {
      setError('Contraseña incorrecta');
    }

    setIsLoading(false);
  };

  return (
    <Column
      fillWidth
      gap="24"
      padding="24"
      background="surface"
      border="neutral-medium"
      borderStyle="solid"
      radius="l"
      maxWidth={24}
    >
      <Heading variant="heading-strong-l">Acceso Administrador</Heading>

      <form onSubmit={handleSubmit}>
        <Column fillWidth gap="16">
          <PasswordInput
            id="yugioh-password"
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            errorMessage={error}
            autoFocus
          />

          <Column fillWidth gap="8">
            <Button
              type="submit"
              variant="primary"
              fillWidth
              disabled={isLoading || !password}
            >
              {isLoading ? 'Verificando...' : 'Ingresar'}
            </Button>
            <Button variant="tertiary" fillWidth onClick={onClose}>
              Cancelar
            </Button>
          </Column>
        </Column>
      </form>

      <Text variant="body-default-s" onBackground="neutral-weak">
        Ingresa la contraseña para poder agregar cartas a tus listas.
      </Text>
    </Column>
  );
}
