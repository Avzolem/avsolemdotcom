'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useYugiohAuth } from '@/contexts/YugiohAuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useYugiohLanguage } from '@/contexts/YugiohLanguageContext';
import styles from './admin.module.scss';

interface UserData {
  _id: string;
  email: string;
  name: string;
  provider: string;
  newsletterSubscribed: boolean;
  language: string;
  createdAt: string;
}

interface AdminStats {
  totalUsers: number;
  googleUsers: number;
  credentialsUsers: number;
  newsletterSubscribers: number;
  usersThisMonth: number;
  usersThisWeek: number;
}

interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  currency: 'MXN' | 'USD';
  images: string[];
  category: 'cards' | 'accessories' | 'decks' | 'other';
  condition: 'mint' | 'near-mint' | 'excellent' | 'good' | 'played';
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
}

interface NewsArticle {
  _id?: string;
  title: string;
  summary: string;
  content: string;
  coverImage: string;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt?: string;
  createdAt?: string;
}

type TabType = 'stats' | 'users' | 'email' | 'products' | 'news';

const EMPTY_PRODUCT: Omit<Product, '_id'> = {
  name: '',
  description: '',
  price: 0,
  currency: 'MXN',
  images: [],
  category: 'cards',
  condition: 'near-mint',
  stock: 1,
  isActive: true,
  isFeatured: false,
  tags: [],
};

const EMPTY_NEWS: Omit<NewsArticle, '_id'> = {
  title: '',
  summary: '',
  content: '',
  coverImage: '',
  tags: [],
  isPublished: false,
  isFeatured: false,
};

export default function AdminPage() {
  const { user, isAuthenticated, isLoading } = useYugiohAuth();
  const { showToast } = useToast();
  const { language, t } = useYugiohLanguage();
  const router = useRouter();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [isAdmin, setIsAdmin] = useState(false);

  // Email state
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailTarget, setEmailTarget] = useState<'all' | 'newsletter'>('newsletter');
  const [previewMode, setPreviewMode] = useState(false);

  // Product form state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Omit<Product, '_id'>>(EMPTY_PRODUCT);
  const [savingProduct, setSavingProduct] = useState(false);

  // News form state
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [newsForm, setNewsForm] = useState<Omit<NewsArticle, '_id'>>(EMPTY_NEWS);
  const [savingNews, setSavingNews] = useState(false);
  const [newsPreviewMode, setNewsPreviewMode] = useState(false);

  const fetchAdminData = useCallback(async () => {
    try {
      const response = await fetch('/api/yugioh/admin');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setUsers(data.users);
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        router.push('/yugioh');
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      showToast(t('admin.error.load'), 'error');
    } finally {
      setLoading(false);
    }
  }, [router, showToast, t]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/yugioh/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, []);

  const fetchNews = useCallback(async () => {
    try {
      const res = await fetch('/api/yugioh/admin/news');
      if (res.ok) {
        const data = await res.json();
        setNews(data.news || []);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/yugioh');
        return;
      }
      fetchAdminData();
    }
  }, [isLoading, isAuthenticated, router, fetchAdminData]);

  useEffect(() => {
    if (isAdmin && activeTab === 'products') fetchProducts();
    if (isAdmin && activeTab === 'news') fetchNews();
  }, [isAdmin, activeTab, fetchProducts, fetchNews]);

  const handleSendEmail = async () => {
    if (!emailSubject.trim() || !emailContent.trim()) {
      showToast(t('admin.error.subjectContentRequired'), 'error');
      return;
    }
    setSendingEmail(true);
    try {
      const res = await fetch('/api/yugioh/admin/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: emailSubject, content: emailContent, target: emailTarget }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(t('admin.email.sent').replace('{count}', data.sentCount), 'success');
        setEmailSubject('');
        setEmailContent('');
      } else {
        showToast(data.error || t('common.error'), 'error');
      }
    } catch {
      showToast(t('admin.error.send'), 'error');
    } finally {
      setSendingEmail(false);
    }
  };

  // Product handlers
  const handleSaveProduct = async () => {
    if (!productForm.name.trim()) {
      showToast(t('admin.error.nameRequired'), 'error');
      return;
    }
    setSavingProduct(true);
    try {
      const method = editingProduct?._id ? 'PATCH' : 'POST';
      const body = editingProduct?._id ? { id: editingProduct._id, ...productForm } : productForm;
      const res = await fetch('/api/yugioh/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        showToast(editingProduct?._id ? t('admin.product.updated') : t('admin.product.created'), 'success');
        setEditingProduct(null);
        setProductForm(EMPTY_PRODUCT);
        fetchProducts();
      } else {
        showToast(t('admin.error.save'), 'error');
      }
    } catch {
      showToast(t('common.error'), 'error');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm(t('admin.product.confirmDelete'))) return;
    try {
      const res = await fetch(`/api/yugioh/admin/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(t('admin.product.deleted'), 'success');
        fetchProducts();
      }
    } catch {
      showToast(t('common.error'), 'error');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      currency: product.currency,
      images: product.images,
      category: product.category,
      condition: product.condition,
      stock: product.stock,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      tags: product.tags,
    });
  };

  // News handlers
  const handleSaveNews = async () => {
    if (!newsForm.title.trim()) {
      showToast(t('admin.error.titleRequired'), 'error');
      return;
    }
    setSavingNews(true);
    try {
      const method = editingNews?._id ? 'PATCH' : 'POST';
      const body = editingNews?._id ? { id: editingNews._id, ...newsForm } : newsForm;
      const res = await fetch('/api/yugioh/admin/news', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        showToast(editingNews?._id ? t('admin.news.updated') : t('admin.news.created'), 'success');
        setEditingNews(null);
        setNewsForm(EMPTY_NEWS);
        fetchNews();
      } else {
        showToast(t('admin.error.save'), 'error');
      }
    } catch {
      showToast(t('common.error'), 'error');
    } finally {
      setSavingNews(false);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm(t('admin.news.confirmDelete'))) return;
    try {
      const res = await fetch(`/api/yugioh/admin/news?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(t('admin.news.deleted'), 'success');
        fetchNews();
      }
    } catch {
      showToast(t('common.error'), 'error');
    }
  };

  const handleEditNews = (article: NewsArticle) => {
    setEditingNews(article);
    setNewsForm({
      title: article.title,
      summary: article.summary,
      content: article.content,
      coverImage: article.coverImage,
      tags: article.tags,
      isPublished: article.isPublished,
      isFeatured: article.isFeatured,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const renderMarkdownPreview = (content: string) => {
    return content
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank">$1</a>')
      .replace(/\n/gim, '<br />');
  };

  if (isLoading || loading) {
    return (
      <div className={styles.loading}>
        <span className={styles.spinner}></span>
        <p>{t('admin.panel.loading')}</p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>{t('admin.panel.title')}</h1>
        <span className={styles.adminBadge}>Admin</span>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === 'stats' ? styles.tabActive : ''}`} onClick={() => setActiveTab('stats')}>
          {t('admin.tabs.stats')}
        </button>
        <button className={`${styles.tab} ${activeTab === 'users' ? styles.tabActive : ''}`} onClick={() => setActiveTab('users')}>
          {t('admin.tabs.users')} ({users.length})
        </button>
        <button className={`${styles.tab} ${activeTab === 'email' ? styles.tabActive : ''}`} onClick={() => setActiveTab('email')}>
          {t('admin.tabs.email')}
        </button>
        <button className={`${styles.tab} ${activeTab === 'products' ? styles.tabActive : ''}`} onClick={() => setActiveTab('products')}>
          🛒 {t('admin.tabs.products')}
        </button>
        <button className={`${styles.tab} ${activeTab === 'news' ? styles.tabActive : ''}`} onClick={() => setActiveTab('news')}>
          📰 {t('admin.tabs.news')}
        </button>
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && stats && (
        <div className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}><span className={styles.statIcon}>👥</span><span className={styles.statValue}>{stats.totalUsers}</span><span className={styles.statLabel}>{t('admin.stats.totalUsers')}</span></div>
            <div className={styles.statCard}><span className={styles.statIcon}>📧</span><span className={styles.statValue}>{stats.newsletterSubscribers}</span><span className={styles.statLabel}>{t('admin.stats.newsletter')}</span></div>
            <div className={styles.statCard}><span className={styles.statIcon}>🔷</span><span className={styles.statValue}>{stats.googleUsers}</span><span className={styles.statLabel}>{t('admin.stats.google')}</span></div>
            <div className={styles.statCard}><span className={styles.statIcon}>🔑</span><span className={styles.statValue}>{stats.credentialsUsers}</span><span className={styles.statLabel}>{t('admin.stats.emailPass')}</span></div>
            <div className={styles.statCard}><span className={styles.statIcon}>📅</span><span className={styles.statValue}>{stats.usersThisMonth}</span><span className={styles.statLabel}>{t('admin.stats.thisMonth')}</span></div>
            <div className={styles.statCard}><span className={styles.statIcon}>🗓️</span><span className={styles.statValue}>{stats.usersThisWeek}</span><span className={styles.statLabel}>{t('admin.stats.thisWeek')}</span></div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className={styles.usersSection}>
          <div className={styles.tableWrapper}>
            <table className={styles.usersTable}>
              <thead><tr><th>{t('admin.users.email')}</th><th>{t('admin.users.name')}</th><th>{t('admin.users.provider')}</th><th>{t('admin.users.newsletter')}</th><th>{t('admin.users.language')}</th><th>{t('admin.users.registered')}</th></tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className={styles.emailCell} data-label={t('admin.users.email')}>{u.email}</td>
                    <td data-label={t('admin.users.name')}>{u.name}</td>
                    <td data-label={t('admin.users.provider')}><span className={`${styles.providerBadge} ${styles[u.provider]}`}>{u.provider === 'google' ? 'Google' : 'Email'}</span></td>
                    <td data-label={t('admin.users.newsletter')}><span className={u.newsletterSubscribed ? styles.subscribed : styles.notSubscribed}>{u.newsletterSubscribed ? `✓ ${t('admin.users.yes')}` : `✗ ${t('admin.users.no')}`}</span></td>
                    <td data-label={t('admin.users.language')}>{u.language?.toUpperCase() || 'ES'}</td>
                    <td className={styles.dateCell} data-label={t('admin.users.registered')}>{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Email Tab */}
      {activeTab === 'email' && (
        <div className={styles.emailSection}>
          <div className={styles.emailCard}>
            <h3 className={styles.cardTitle}>{t('admin.email.compose')}</h3>
            <div className={styles.targetSelector}>
              <label className={styles.label}>{t('admin.email.recipients')}</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}><input type="radio" name="target" checked={emailTarget === 'newsletter'} onChange={() => setEmailTarget('newsletter')} /><span>{t('admin.stats.newsletter')} ({stats?.newsletterSubscribers || 0})</span></label>
                <label className={styles.radioLabel}><input type="radio" name="target" checked={emailTarget === 'all'} onChange={() => setEmailTarget('all')} /><span>{language === 'es' ? 'Todos' : 'All'} ({stats?.totalUsers || 0})</span></label>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t('admin.email.subject')}</label>
              <input type="text" className={styles.input} value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder={t('admin.email.subjectPlaceholder')} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t('admin.email.content')}<button type="button" className={styles.previewToggle} onClick={() => setPreviewMode(!previewMode)}>{previewMode ? t('admin.email.edit') : t('admin.email.preview')}</button></label>
              {!previewMode ? (
                <textarea className={styles.textarea} value={emailContent} onChange={(e) => setEmailContent(e.target.value)} placeholder="# Title..." rows={12} />
              ) : (
                <div className={styles.preview}><div className={styles.previewContent} dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(emailContent) }} /></div>
              )}
            </div>
            <button className={styles.sendButton} onClick={handleSendEmail} disabled={sendingEmail || !emailSubject.trim() || !emailContent.trim()}>
              {sendingEmail ? <><span className={styles.buttonSpinner}></span>{t('admin.email.sending')}</> : <>{t('admin.email.send')}</>}
            </button>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className={styles.cmsSection}>
          <div className={styles.cmsHeader}>
            <h3 className={styles.cardTitle}>{t('admin.products.manage')}</h3>
            {!editingProduct && (
              <button className={styles.addButton} onClick={() => { setEditingProduct({} as Product); setProductForm(EMPTY_PRODUCT); }}>
                {t('admin.products.new')}
              </button>
            )}
          </div>

          {editingProduct !== null ? (
            <div className={styles.cmsForm}>
              <h4>{editingProduct._id ? t('admin.products.edit') : t('admin.products.newForm')}</h4>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('admin.products.name')}</label>
                  <input type="text" className={styles.input} value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('admin.products.price')}</label>
                  <input type="number" className={styles.input} value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('admin.products.currency')}</label>
                  <select className={styles.input} value={productForm.currency} onChange={(e) => setProductForm({ ...productForm, currency: e.target.value as 'MXN' | 'USD' })}>
                    <option value="MXN">MXN</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('admin.products.stock')}</label>
                  <input type="number" className={styles.input} value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('admin.products.category')}</label>
                  <select className={styles.input} value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value as Product['category'] })}>
                    <option value="cards">{t('admin.products.category.cards')}</option>
                    <option value="decks">{t('admin.products.category.decks')}</option>
                    <option value="accessories">{t('admin.products.category.accessories')}</option>
                    <option value="other">{t('admin.products.category.other')}</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('admin.products.condition')}</label>
                  <select className={styles.input} value={productForm.condition} onChange={(e) => setProductForm({ ...productForm, condition: e.target.value as Product['condition'] })}>
                    <option value="mint">{t('admin.products.condition.mint')}</option>
                    <option value="near-mint">{t('admin.products.condition.nearMint')}</option>
                    <option value="excellent">{t('admin.products.condition.excellent')}</option>
                    <option value="good">{t('admin.products.condition.good')}</option>
                    <option value="played">{t('admin.products.condition.played')}</option>
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>{t('admin.products.description')}</label>
                <textarea className={styles.textarea} value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} rows={4} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>{t('admin.products.imageUrl')}</label>
                <input type="text" className={styles.input} value={productForm.images[0] || ''} onChange={(e) => setProductForm({ ...productForm, images: e.target.value ? [e.target.value] : [] })} placeholder="https://..." />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>{t('admin.products.tags')}</label>
                <input type="text" className={styles.input} value={productForm.tags.join(', ')} onChange={(e) => setProductForm({ ...productForm, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) })} />
              </div>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}><input type="checkbox" checked={productForm.isActive} onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })} /> {t('admin.products.active')}</label>
                <label className={styles.checkboxLabel}><input type="checkbox" checked={productForm.isFeatured} onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })} /> {t('admin.products.featured')}</label>
              </div>
              <div className={styles.formActions}>
                <button className={styles.cancelButton} onClick={() => { setEditingProduct(null); setProductForm(EMPTY_PRODUCT); }}>{t('admin.products.cancel')}</button>
                <button className={styles.saveButton} onClick={handleSaveProduct} disabled={savingProduct}>{savingProduct ? t('admin.products.saving') : t('admin.products.save')}</button>
              </div>
            </div>
          ) : (
            <div className={styles.cmsList}>
              {products.length === 0 ? (
                <p className={styles.emptyText}>{t('admin.products.empty')}</p>
              ) : (
                products.map((p) => (
                  <div key={p._id} className={`${styles.cmsItem} ${!p.isActive ? styles.inactive : ''}`}>
                    <div className={styles.cmsItemInfo}>
                      <strong>{p.name}</strong>
                      <span className={styles.cmsItemMeta}>${p.price} {p.currency} · {p.stock} {t('admin.products.inStock')}</span>
                      <div className={styles.cmsItemBadges}>
                        {p.isFeatured && <span className={styles.badgeFeatured}>{t('admin.products.featured')}</span>}
                        {!p.isActive && <span className={styles.badgeInactive}>{t('admin.products.inactive')}</span>}
                      </div>
                    </div>
                    <div className={styles.cmsItemActions}>
                      <button className={styles.editBtn} onClick={() => handleEditProduct(p)}>{t('admin.products.editBtn')}</button>
                      <button className={styles.deleteBtn} onClick={() => handleDeleteProduct(p._id!)}>{t('admin.products.deleteBtn')}</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* News Tab */}
      {activeTab === 'news' && (
        <div className={styles.cmsSection}>
          <div className={styles.cmsHeader}>
            <h3 className={styles.cardTitle}>{t('admin.news.manage')}</h3>
            {!editingNews && (
              <button className={styles.addButton} onClick={() => { setEditingNews({} as NewsArticle); setNewsForm(EMPTY_NEWS); }}>
                {t('admin.news.new')}
              </button>
            )}
          </div>

          {editingNews !== null ? (
            <div className={styles.cmsForm}>
              <h4>{editingNews._id ? t('admin.news.edit') : t('admin.news.newForm')}</h4>
              <div className={styles.formGroup}>
                <label className={styles.label}>{t('admin.news.title')}</label>
                <input type="text" className={styles.input} value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>{t('admin.news.summary')}</label>
                <input type="text" className={styles.input} value={newsForm.summary} onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })} placeholder={t('admin.news.summaryPlaceholder')} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  {t('admin.news.content')}
                  <button type="button" className={styles.previewToggle} onClick={() => setNewsPreviewMode(!newsPreviewMode)}>{newsPreviewMode ? t('admin.email.edit') : t('admin.email.preview')}</button>
                </label>
                {!newsPreviewMode ? (
                  <textarea className={styles.textarea} value={newsForm.content} onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })} rows={12} placeholder="# Title..." />
                ) : (
                  <div className={styles.preview}><div className={styles.previewContent} dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(newsForm.content) }} /></div>
                )}
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>{t('admin.news.coverImage')}</label>
                <input type="text" className={styles.input} value={newsForm.coverImage} onChange={(e) => setNewsForm({ ...newsForm, coverImage: e.target.value })} placeholder="https://..." />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>{t('admin.news.tags')}</label>
                <input type="text" className={styles.input} value={newsForm.tags.join(', ')} onChange={(e) => setNewsForm({ ...newsForm, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) })} />
              </div>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}><input type="checkbox" checked={newsForm.isPublished} onChange={(e) => setNewsForm({ ...newsForm, isPublished: e.target.checked })} /> {t('admin.news.published')}</label>
                <label className={styles.checkboxLabel}><input type="checkbox" checked={newsForm.isFeatured} onChange={(e) => setNewsForm({ ...newsForm, isFeatured: e.target.checked })} /> {t('admin.news.featured')}</label>
              </div>
              <div className={styles.formActions}>
                <button className={styles.cancelButton} onClick={() => { setEditingNews(null); setNewsForm(EMPTY_NEWS); }}>{t('admin.news.cancel')}</button>
                <button className={styles.saveButton} onClick={handleSaveNews} disabled={savingNews}>{savingNews ? t('admin.news.saving') : t('admin.news.save')}</button>
              </div>
            </div>
          ) : (
            <div className={styles.cmsList}>
              {news.length === 0 ? (
                <p className={styles.emptyText}>{t('admin.news.empty')}</p>
              ) : (
                news.map((n) => (
                  <div key={n._id} className={`${styles.cmsItem} ${!n.isPublished ? styles.inactive : ''}`}>
                    <div className={styles.cmsItemInfo}>
                      <strong>{n.title}</strong>
                      <span className={styles.cmsItemMeta}>{n.summary}</span>
                      <div className={styles.cmsItemBadges}>
                        {n.isFeatured && <span className={styles.badgeFeatured}>{t('admin.news.featured')}</span>}
                        {!n.isPublished && <span className={styles.badgeInactive}>{t('admin.news.draft')}</span>}
                      </div>
                    </div>
                    <div className={styles.cmsItemActions}>
                      <button className={styles.editBtn} onClick={() => handleEditNews(n)}>{t('admin.news.editBtn')}</button>
                      <button className={styles.deleteBtn} onClick={() => handleDeleteNews(n._id!)}>{t('admin.news.deleteBtn')}</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
