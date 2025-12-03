'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useYugiohAuth } from '@/contexts/YugiohAuthContext';
import { useToast } from '@/contexts/ToastContext';
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
      showToast('Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  }, [router, showToast]);

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
      showToast('Completa asunto y contenido', 'error');
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
        showToast(`Email enviado a ${data.sentCount} usuarios`, 'success');
        setEmailSubject('');
        setEmailContent('');
      } else {
        showToast(data.error || 'Error', 'error');
      }
    } catch {
      showToast('Error al enviar', 'error');
    } finally {
      setSendingEmail(false);
    }
  };

  // Product handlers
  const handleSaveProduct = async () => {
    if (!productForm.name.trim()) {
      showToast('Nombre es requerido', 'error');
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
        showToast(editingProduct?._id ? 'Producto actualizado' : 'Producto creado', 'success');
        setEditingProduct(null);
        setProductForm(EMPTY_PRODUCT);
        fetchProducts();
      } else {
        showToast('Error al guardar', 'error');
      }
    } catch {
      showToast('Error', 'error');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
      const res = await fetch(`/api/yugioh/admin/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Producto eliminado', 'success');
        fetchProducts();
      }
    } catch {
      showToast('Error', 'error');
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
      showToast('Título es requerido', 'error');
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
        showToast(editingNews?._id ? 'Noticia actualizada' : 'Noticia creada', 'success');
        setEditingNews(null);
        setNewsForm(EMPTY_NEWS);
        fetchNews();
      } else {
        showToast('Error al guardar', 'error');
      }
    } catch {
      showToast('Error', 'error');
    } finally {
      setSavingNews(false);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm('¿Eliminar esta noticia?')) return;
    try {
      const res = await fetch(`/api/yugioh/admin/news?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Noticia eliminada', 'success');
        fetchNews();
      }
    } catch {
      showToast('Error', 'error');
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
    return new Date(dateString).toLocaleDateString('es-ES', {
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
        <p>Cargando panel de administrador...</p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Panel de Administrador</h1>
        <span className={styles.adminBadge}>Admin</span>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === 'stats' ? styles.tabActive : ''}`} onClick={() => setActiveTab('stats')}>
          Estadísticas
        </button>
        <button className={`${styles.tab} ${activeTab === 'users' ? styles.tabActive : ''}`} onClick={() => setActiveTab('users')}>
          Usuarios ({users.length})
        </button>
        <button className={`${styles.tab} ${activeTab === 'email' ? styles.tabActive : ''}`} onClick={() => setActiveTab('email')}>
          Email
        </button>
        <button className={`${styles.tab} ${activeTab === 'products' ? styles.tabActive : ''}`} onClick={() => setActiveTab('products')}>
          🛒 Catálogo
        </button>
        <button className={`${styles.tab} ${activeTab === 'news' ? styles.tabActive : ''}`} onClick={() => setActiveTab('news')}>
          📰 Noticias
        </button>
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && stats && (
        <div className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}><span className={styles.statIcon}>👥</span><span className={styles.statValue}>{stats.totalUsers}</span><span className={styles.statLabel}>Total Usuarios</span></div>
            <div className={styles.statCard}><span className={styles.statIcon}>📧</span><span className={styles.statValue}>{stats.newsletterSubscribers}</span><span className={styles.statLabel}>Newsletter</span></div>
            <div className={styles.statCard}><span className={styles.statIcon}>🔷</span><span className={styles.statValue}>{stats.googleUsers}</span><span className={styles.statLabel}>Google</span></div>
            <div className={styles.statCard}><span className={styles.statIcon}>🔑</span><span className={styles.statValue}>{stats.credentialsUsers}</span><span className={styles.statLabel}>Email/Pass</span></div>
            <div className={styles.statCard}><span className={styles.statIcon}>📅</span><span className={styles.statValue}>{stats.usersThisMonth}</span><span className={styles.statLabel}>Este Mes</span></div>
            <div className={styles.statCard}><span className={styles.statIcon}>🗓️</span><span className={styles.statValue}>{stats.usersThisWeek}</span><span className={styles.statLabel}>Esta Semana</span></div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className={styles.usersSection}>
          <div className={styles.tableWrapper}>
            <table className={styles.usersTable}>
              <thead><tr><th>Email</th><th>Nombre</th><th>Proveedor</th><th>Newsletter</th><th>Idioma</th><th>Registro</th></tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className={styles.emailCell} data-label="Email">{u.email}</td>
                    <td data-label="Nombre">{u.name}</td>
                    <td data-label="Proveedor"><span className={`${styles.providerBadge} ${styles[u.provider]}`}>{u.provider === 'google' ? 'Google' : 'Email'}</span></td>
                    <td data-label="Newsletter"><span className={u.newsletterSubscribed ? styles.subscribed : styles.notSubscribed}>{u.newsletterSubscribed ? '✓ Sí' : '✗ No'}</span></td>
                    <td data-label="Idioma">{u.language?.toUpperCase() || 'ES'}</td>
                    <td className={styles.dateCell} data-label="Registro">{formatDate(u.createdAt)}</td>
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
            <h3 className={styles.cardTitle}>Componer Email</h3>
            <div className={styles.targetSelector}>
              <label className={styles.label}>Destinatarios:</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}><input type="radio" name="target" checked={emailTarget === 'newsletter'} onChange={() => setEmailTarget('newsletter')} /><span>Newsletter ({stats?.newsletterSubscribers || 0})</span></label>
                <label className={styles.radioLabel}><input type="radio" name="target" checked={emailTarget === 'all'} onChange={() => setEmailTarget('all')} /><span>Todos ({stats?.totalUsers || 0})</span></label>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Asunto:</label>
              <input type="text" className={styles.input} value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="Asunto..." />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Contenido (Markdown):<button type="button" className={styles.previewToggle} onClick={() => setPreviewMode(!previewMode)}>{previewMode ? 'Editar' : 'Preview'}</button></label>
              {!previewMode ? (
                <textarea className={styles.textarea} value={emailContent} onChange={(e) => setEmailContent(e.target.value)} placeholder="# Título..." rows={12} />
              ) : (
                <div className={styles.preview}><div className={styles.previewContent} dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(emailContent) }} /></div>
              )}
            </div>
            <button className={styles.sendButton} onClick={handleSendEmail} disabled={sendingEmail || !emailSubject.trim() || !emailContent.trim()}>
              {sendingEmail ? <><span className={styles.buttonSpinner}></span>Enviando...</> : <>Enviar Email</>}
            </button>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className={styles.cmsSection}>
          <div className={styles.cmsHeader}>
            <h3 className={styles.cardTitle}>Gestionar Catálogo</h3>
            {!editingProduct && (
              <button className={styles.addButton} onClick={() => { setEditingProduct({} as Product); setProductForm(EMPTY_PRODUCT); }}>
                + Nuevo Producto
              </button>
            )}
          </div>

          {editingProduct !== null ? (
            <div className={styles.cmsForm}>
              <h4>{editingProduct._id ? 'Editar Producto' : 'Nuevo Producto'}</h4>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nombre *</label>
                  <input type="text" className={styles.input} value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Precio *</label>
                  <input type="number" className={styles.input} value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Moneda</label>
                  <select className={styles.input} value={productForm.currency} onChange={(e) => setProductForm({ ...productForm, currency: e.target.value as 'MXN' | 'USD' })}>
                    <option value="MXN">MXN</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Stock</label>
                  <input type="number" className={styles.input} value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Categoría</label>
                  <select className={styles.input} value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value as Product['category'] })}>
                    <option value="cards">Cartas</option>
                    <option value="decks">Decks</option>
                    <option value="accessories">Accesorios</option>
                    <option value="other">Otros</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Condición</label>
                  <select className={styles.input} value={productForm.condition} onChange={(e) => setProductForm({ ...productForm, condition: e.target.value as Product['condition'] })}>
                    <option value="mint">Mint</option>
                    <option value="near-mint">Near Mint</option>
                    <option value="excellent">Excelente</option>
                    <option value="good">Bueno</option>
                    <option value="played">Jugado</option>
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Descripción</label>
                <textarea className={styles.textarea} value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} rows={4} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Imagen URL</label>
                <input type="text" className={styles.input} value={productForm.images[0] || ''} onChange={(e) => setProductForm({ ...productForm, images: e.target.value ? [e.target.value] : [] })} placeholder="https://..." />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Tags (separados por coma)</label>
                <input type="text" className={styles.input} value={productForm.tags.join(', ')} onChange={(e) => setProductForm({ ...productForm, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} />
              </div>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}><input type="checkbox" checked={productForm.isActive} onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })} /> Activo</label>
                <label className={styles.checkboxLabel}><input type="checkbox" checked={productForm.isFeatured} onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })} /> Destacado</label>
              </div>
              <div className={styles.formActions}>
                <button className={styles.cancelButton} onClick={() => { setEditingProduct(null); setProductForm(EMPTY_PRODUCT); }}>Cancelar</button>
                <button className={styles.saveButton} onClick={handleSaveProduct} disabled={savingProduct}>{savingProduct ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </div>
          ) : (
            <div className={styles.cmsList}>
              {products.length === 0 ? (
                <p className={styles.emptyText}>No hay productos. Crea el primero.</p>
              ) : (
                products.map((p) => (
                  <div key={p._id} className={`${styles.cmsItem} ${!p.isActive ? styles.inactive : ''}`}>
                    <div className={styles.cmsItemInfo}>
                      <strong>{p.name}</strong>
                      <span className={styles.cmsItemMeta}>${p.price} {p.currency} · {p.stock} en stock</span>
                      <div className={styles.cmsItemBadges}>
                        {p.isFeatured && <span className={styles.badgeFeatured}>Destacado</span>}
                        {!p.isActive && <span className={styles.badgeInactive}>Inactivo</span>}
                      </div>
                    </div>
                    <div className={styles.cmsItemActions}>
                      <button className={styles.editBtn} onClick={() => handleEditProduct(p)}>Editar</button>
                      <button className={styles.deleteBtn} onClick={() => handleDeleteProduct(p._id!)}>Eliminar</button>
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
            <h3 className={styles.cardTitle}>Gestionar Noticias</h3>
            {!editingNews && (
              <button className={styles.addButton} onClick={() => { setEditingNews({} as NewsArticle); setNewsForm(EMPTY_NEWS); }}>
                + Nueva Noticia
              </button>
            )}
          </div>

          {editingNews !== null ? (
            <div className={styles.cmsForm}>
              <h4>{editingNews._id ? 'Editar Noticia' : 'Nueva Noticia'}</h4>
              <div className={styles.formGroup}>
                <label className={styles.label}>Título *</label>
                <input type="text" className={styles.input} value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Resumen</label>
                <input type="text" className={styles.input} value={newsForm.summary} onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })} placeholder="Breve descripción..." />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Contenido (Markdown):
                  <button type="button" className={styles.previewToggle} onClick={() => setNewsPreviewMode(!newsPreviewMode)}>{newsPreviewMode ? 'Editar' : 'Preview'}</button>
                </label>
                {!newsPreviewMode ? (
                  <textarea className={styles.textarea} value={newsForm.content} onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })} rows={12} placeholder="# Título..." />
                ) : (
                  <div className={styles.preview}><div className={styles.previewContent} dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(newsForm.content) }} /></div>
                )}
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Imagen de portada URL</label>
                <input type="text" className={styles.input} value={newsForm.coverImage} onChange={(e) => setNewsForm({ ...newsForm, coverImage: e.target.value })} placeholder="https://..." />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Tags (separados por coma)</label>
                <input type="text" className={styles.input} value={newsForm.tags.join(', ')} onChange={(e) => setNewsForm({ ...newsForm, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} />
              </div>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}><input type="checkbox" checked={newsForm.isPublished} onChange={(e) => setNewsForm({ ...newsForm, isPublished: e.target.checked })} /> Publicado</label>
                <label className={styles.checkboxLabel}><input type="checkbox" checked={newsForm.isFeatured} onChange={(e) => setNewsForm({ ...newsForm, isFeatured: e.target.checked })} /> Destacado</label>
              </div>
              <div className={styles.formActions}>
                <button className={styles.cancelButton} onClick={() => { setEditingNews(null); setNewsForm(EMPTY_NEWS); }}>Cancelar</button>
                <button className={styles.saveButton} onClick={handleSaveNews} disabled={savingNews}>{savingNews ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </div>
          ) : (
            <div className={styles.cmsList}>
              {news.length === 0 ? (
                <p className={styles.emptyText}>No hay noticias. Crea la primera.</p>
              ) : (
                news.map((n) => (
                  <div key={n._id} className={`${styles.cmsItem} ${!n.isPublished ? styles.inactive : ''}`}>
                    <div className={styles.cmsItemInfo}>
                      <strong>{n.title}</strong>
                      <span className={styles.cmsItemMeta}>{n.summary}</span>
                      <div className={styles.cmsItemBadges}>
                        {n.isFeatured && <span className={styles.badgeFeatured}>Destacado</span>}
                        {!n.isPublished && <span className={styles.badgeInactive}>Borrador</span>}
                      </div>
                    </div>
                    <div className={styles.cmsItemActions}>
                      <button className={styles.editBtn} onClick={() => handleEditNews(n)}>Editar</button>
                      <button className={styles.deleteBtn} onClick={() => handleDeleteNews(n._id!)}>Eliminar</button>
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
