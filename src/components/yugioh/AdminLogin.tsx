'use client';

import { useState } from 'react';
import { useYugiohAuth } from '@/contexts/YugiohAuthContext';
import { useYugiohLanguage } from '@/contexts/YugiohLanguageContext';
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
  const { t } = useYugiohLanguage();
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
      setError(t('admin.error'));
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
      <Heading variant="heading-strong-l">{t('admin.title')}</Heading>

      <form onSubmit={handleSubmit}>
        <Column fillWidth gap="16">
          <PasswordInput
            id="yugioh-password"
            label={t('admin.password')}
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
              {isLoading ? t('admin.loading') : t('admin.login')}
            </Button>
            <Button variant="tertiary" fillWidth onClick={onClose}>
              {t('admin.cancel')}
            </Button>
          </Column>
        </Column>
      </form>

      <Text variant="body-default-s" onBackground="neutral-weak">
        {t('admin.helpText')}
      </Text>
    </Column>
  );
}
