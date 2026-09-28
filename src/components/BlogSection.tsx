import React from 'react';
import { Article, Product } from '../types';
import SkincareTipsPage from './SkincareTipsPage';

interface BlogSectionProps {
  articles: Article[];
  products: Product[];
  onAddToCart?: (product: Product, quantity: number) => void;
  setCurrentView: (view: string) => void;
  setSelectedProductId: (id: string | null) => void;
}

export default function BlogSection(props: BlogSectionProps) {
  return <SkincareTipsPage {...props} />;
}
