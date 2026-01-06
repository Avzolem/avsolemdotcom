'use client';

import { useEffect, useState } from 'react';
import { HardDrive } from 'lucide-react';

interface StorageData {
  used: number;
  limit: number;
  fileCount: number;
  percentage: number;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function StorageQuota() {
  const [storage, setStorage] = useState<StorageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStorage();
  }, []);

  const fetchStorage = async () => {
    try {
      const response = await fetch('/api/cloud/storage');
      if (response.ok) {
        const data = await response.json();
        setStorage(data);
      }
    } catch (error) {
      console.error('Failed to fetch storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="cloud-quota">
        <HardDrive size={16} className="cloud-quota__icon" />
        <div className="cloud-quota__bar">
          <div className="cloud-quota__fill" style={{ width: '0%' }} />
        </div>
        <span className="cloud-quota__text">...</span>
      </div>
    );
  }

  if (!storage) return null;

  const getBarClass = () => {
    if (storage.percentage >= 90) return 'cloud-quota__fill cloud-quota__fill--danger';
    if (storage.percentage >= 75) return 'cloud-quota__fill cloud-quota__fill--warning';
    return 'cloud-quota__fill';
  };

  return (
    <div className="cloud-quota">
      <HardDrive size={16} className="cloud-quota__icon" />
      <div className="cloud-quota__bar">
        <div
          className={getBarClass()}
          style={{ width: `${Math.min(storage.percentage, 100)}%` }}
        />
      </div>
      <span className="cloud-quota__text">
        {formatBytes(storage.used)} / {formatBytes(storage.limit)}
      </span>
    </div>
  );
}
