'use client';

import { useState, useEffect } from 'react';
import { useYugiohLanguage } from '@/contexts/YugiohLanguageContext';
import Image from 'next/image';
import styles from './catalogo.module.scss';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: 'MXN' | 'USD';
  images: string[];
  category: 'cards' | 'accessories' | 'decks' | 'other';
  condition: 'mint' | 'near-mint' | 'excellent' | 'good' | 'played';
  stock: number;
  isFeatured: boolean;
  tags: string[];
}

const CONDITION_LABELS: Record<string, { es: string; en: string }> = {
  'mint': { es: 'Mint', en: 'Mint' },
  'near-mint': { es: 'Near Mint', en: 'Near Mint' },
  'excellent': { es: 'Excelente', en: 'Excellent' },
  'good': { es: 'Bueno', en: 'Good' },
  'played': { es: 'Jugado', en: 'Played' },
};

const CATEGORY_LABELS: Record<string, { es: string; en: string }> = {
  'cards': { es: 'Cartas', en: 'Cards' },
  'accessories': { es: 'Accesorios', en: 'Accessories' },
  'decks': { es: 'Decks', en: 'Decks' },
  'other': { es: 'Otros', en: 'Other' },
};

export default function CatalogoPage() {
  const { language } = useYugiohLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/yugioh/catalog');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat(language === 'es' ? 'es-MX' : 'en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <span className={styles.spinner}></span>
        <p>{language === 'es' ? 'Cargando catálogo...' : 'Loading catalog...'}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          🛒 {language === 'es' ? 'Catálogo' : 'Catalog'}
        </h1>
        <p className={styles.subtitle}>
          {language === 'es'
            ? 'Productos disponibles para la venta'
            : 'Products available for sale'}
        </p>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder={language === 'es' ? 'Buscar productos...' : 'Search products...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {searchTerm && (
            <button
              className={styles.clearButton}
              onClick={() => setSearchTerm('')}
            >
              ✕
            </button>
          )}
        </div>

        <div className={styles.categoryFilter}>
          <button
            className={`${styles.categoryBtn} ${selectedCategory === 'all' ? styles.active : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            {language === 'es' ? 'Todos' : 'All'}
          </button>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              className={`${styles.categoryBtn} ${selectedCategory === key ? styles.active : ''}`}
              onClick={() => setSelectedCategory(key)}
            >
              {language === 'es' ? label.es : label.en}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🛒</span>
          <p>
            {searchTerm
              ? (language === 'es' ? 'No se encontraron productos' : 'No products found')
              : (language === 'es' ? 'No hay productos disponibles' : 'No products available')}
          </p>
        </div>
      ) : (
        <div className={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <div key={product._id} className={`${styles.productCard} ${product.isFeatured ? styles.featured : ''}`}>
              {product.isFeatured && (
                <span className={styles.featuredBadge}>
                  ⭐ {language === 'es' ? 'Destacado' : 'Featured'}
                </span>
              )}

              <div className={styles.productImage}>
                {product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={200}
                    height={200}
                    className={styles.image}
                  />
                ) : (
                  <div className={styles.noImage}>🃏</div>
                )}
              </div>

              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>

                <div className={styles.productMeta}>
                  <span className={styles.category}>
                    {CATEGORY_LABELS[product.category]?.[language] || product.category}
                  </span>
                  <span className={styles.condition}>
                    {CONDITION_LABELS[product.condition]?.[language] || product.condition}
                  </span>
                </div>

                {product.description && (
                  <p className={styles.productDescription}>{product.description}</p>
                )}

                <div className={styles.productFooter}>
                  <span className={styles.price}>{formatPrice(product.price, product.currency)}</span>
                  <span className={styles.stock}>
                    {product.stock > 0
                      ? `${product.stock} ${language === 'es' ? 'disponible(s)' : 'available'}`
                      : (language === 'es' ? 'Agotado' : 'Sold out')}
                  </span>
                </div>

                {product.tags.length > 0 && (
                  <div className={styles.tags}>
                    {product.tags.map((tag, i) => (
                      <span key={i} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredProducts.length > 0 && (
        <div className={styles.resultsCount}>
          {language === 'es'
            ? `Mostrando ${filteredProducts.length} producto(s)`
            : `Showing ${filteredProducts.length} product(s)`}
        </div>
      )}
    </div>
  );
}
