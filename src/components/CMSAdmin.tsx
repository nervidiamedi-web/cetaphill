import React, { useState } from 'react';
import { Product, Article } from '../types';
import { Plus, Edit2, Check, RefreshCw, Sparkles, Sliders, Layout, Percent, Search, Eye } from 'lucide-react';

interface CMSAdminProps {
  products: Product[];
  articles: Article[];
  promoBanner: { text: string; visible: boolean };
  onUpdateProducts: (products: Product[]) => void;
  onUpdateArticles: (articles: Article[]) => void;
  onUpdatePromo: (promo: { text: string; visible: boolean }) => void;
}

export default function CMSAdmin({
  products,
  articles,
  promoBanner,
  onUpdateProducts,
  onUpdateArticles,
  onUpdatePromo
}: CMSAdminProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'blogs' | 'promo' | 'seo'>('products');

  // Products state
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [aiGeneratingDesc, setAiGeneratingDesc] = useState(false);

  // Blogs state
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);

  // Promo state
  const [promoText, setPromoText] = useState(promoBanner.text);
  const [promoVisible, setPromoVisible] = useState(promoBanner.visible);
  const [updatingPromo, setUpdatingPromo] = useState(false);

  // Search filter
  const [searchFilter, setSearchFilter] = useState('');

  // AI Description Generator for CMS
  const handleGenerateAIDescription = async () => {
    if (!editingProduct?.name || !editingProduct?.ingredients?.length || !editingProduct?.skinConcern?.length) {
      alert("Please specify the Product Name, at least one Core Ingredient, and one Skin Concern first.");
      return;
    }
    setAiGeneratingDesc(true);
    try {
      const res = await fetch('/api/gemini/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingProduct.name,
          ingredients: editingProduct.ingredients.join(', '),
          concerns: editingProduct.skinConcern.join(', ')
        })
      });
      if (!res.ok) throw new Error("Copywriter engine returned an error.");
      const data = await res.json();
      setEditingProduct(prev => ({ ...prev, description: data.text }));
    } catch (err) {
      alert("Could not trigger AI Copywriter. Using simulated fallback description instead.");
      setEditingProduct(prev => ({
        ...prev,
        description: `### Clinical Description\nThis professional-strength formulation represents an advanced approach to treating ${editingProduct.skinConcern?.join(', ')}. Formulated with pure ${editingProduct.ingredients?.join(', ')}, it rebuilds dermal lipid layers and calms inflammation.`
      }));
    } finally {
      setAiGeneratingDesc(false);
    }
  };

  // Save product CMS changes
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price || !editingProduct?.category) return;

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingProduct,
          price: Number(editingProduct.price),
          stock: Number(editingProduct.stock || 0),
          ingredients: Array.isArray(editingProduct.ingredients)
            ? editingProduct.ingredients
            : typeof editingProduct.ingredients === 'string'
            ? (editingProduct.ingredients as string).split(',').map(i => i.trim())
            : []
        })
      });
      if (!res.ok) throw new Error("Server failed to save product.");
      const data = await res.json();

      // Refresh list
      const updatedProducts = editingProduct.id
        ? products.map(p => p.id === data.product.id ? data.product : p)
        : [...products, data.product];

      onUpdateProducts(updatedProducts);
      setEditingProduct(null);
    } catch (err) {
      alert("Error saving product: " + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  // Save article CMS changes
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle?.title || !editingArticle?.content || !editingArticle?.category) return;

    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingArticle)
      });
      if (!res.ok) throw new Error("Server failed to save article.");
      const data = await res.json();

      // Refresh list
      const updatedArticles = editingArticle.id
        ? articles.map(a => a.id === data.article.id ? data.article : a)
        : [...articles, data.article];

      onUpdateArticles(updatedArticles);
      setEditingArticle(null);
    } catch (err) {
      alert("Error saving article: " + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  // Save promo settings
  const handleSavePromo = async () => {
    setUpdatingPromo(true);
    try {
      const res = await fetch('/api/promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: promoText, visible: promoVisible })
      });
      if (!res.ok) throw new Error("Server failed to update promo.");
      onUpdatePromo({ text: promoText, visible: promoVisible });
      alert("Promotional banner updated successfully!");
    } catch (err) {
      alert("Error updating promo: " + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setUpdatingPromo(false);
    }
  };

  // Update stock level instantly from lists (fast stock manager)
  const handleQuickStockUpdate = async (id: string, newStock: number) => {
    try {
      const res = await fetch(`/api/products/${id}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock })
      });
      if (!res.ok) throw new Error();
      onUpdateProducts(products.map(p => p.id === id ? { ...p, stock: newStock } : p));
    } catch (err) {
      alert("Failed to update stock.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Admin header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#001e40]">Cetaphil Content Management</h1>
          <p className="text-xs text-gray-500 mt-1">
            Publish products, edit biochemical descriptions, manage educative blogs, and adjust inventory stock levels.
          </p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-auto">
          <button
            onClick={() => { setActiveTab('products'); setEditingProduct(null); }}
            className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all ${
              activeTab === 'products' ? 'bg-white text-[#001e40] shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Products &amp; Stock
          </button>
          <button
            onClick={() => { setActiveTab('blogs'); setEditingArticle(null); }}
            className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all ${
              activeTab === 'blogs' ? 'bg-white text-[#001e40] shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Layout className="w-4 h-4" />
            Advice Blog
          </button>
          <button
            onClick={() => setActiveTab('promo')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all ${
              activeTab === 'promo' ? 'bg-white text-[#001e40] shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Percent className="w-4 h-4" />
            Promotions
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all ${
              activeTab === 'seo' ? 'bg-white text-[#001e40] shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Eye className="w-4 h-4" />
            SEO Meta
          </button>
        </div>
      </div>

      {/* SEARCH BOX FOR LISTS */}
      {(activeTab === 'products' || activeTab === 'blogs' || activeTab === 'seo') && !editingProduct && !editingArticle && (
        <div className="relative max-w-sm mb-6">
          <input
            type="text"
            placeholder={`Search ${activeTab === 'products' ? 'products...' : 'blog posts...'}`}
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs"
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        </div>
      )}

      {/* 1. PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {!editingProduct ? (
            <div className="bg-white border border-gray-100 rounded-xl shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-sm font-bold text-[#001e40]">Product Formulation Catalog</h2>
                <button
                  onClick={() => setEditingProduct({
                    name: '', category: 'serum', price: 0, stock: 10,
                    ingredients: [], fullIngredients: '', description: '',
                    benefits: ['', '', ''], usage: '', image: '', skinConcern: []
                  })}
                  className="inline-flex items-center gap-1 text-xs font-bold bg-[#286c00] hover:bg-[#286c00]/90 text-white px-3 py-1.5 rounded-lg shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/30 text-gray-400 font-semibold">
                      <th className="p-4">Product Details</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4 w-40">Stock Level</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products
                      .filter(p => p.name.toLowerCase().includes(searchFilter.toLowerCase()))
                      .map(product => (
                        <tr key={product.id} className="hover:bg-gray-50/50">
                          <td className="p-4 flex items-center gap-3">
                            <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded border border-gray-100" />
                            <div>
                              <p className="font-bold text-[#001e40]">{product.name}</p>
                              <p className="text-[10px] text-gray-400">ID: {product.id} • Concerns: {product.skinConcern.join(', ')}</p>
                            </div>
                          </td>
                          <td className="p-4 capitalize text-gray-600 font-medium">{product.category}</td>
                          <td className="p-4 font-bold text-[#002D62]">Rs. {product.price.toLocaleString()}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={product.stock}
                                onChange={(e) => handleQuickStockUpdate(product.id, Number(e.target.value))}
                                className={`w-16 px-1.5 py-1 bg-white border rounded text-center text-xs font-semibold ${
                                  product.stock === 0
                                    ? 'border-red-300 text-red-600 bg-red-50'
                                    : product.stock <= 10
                                    ? 'border-yellow-300 text-yellow-600'
                                    : 'border-gray-200 text-gray-800'
                                }`}
                              />
                              {product.stock === 0 && <span className="text-[9px] text-red-500 font-bold uppercase">OUT</span>}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setEditingProduct(product)}
                              className="p-1 text-gray-400 hover:text-[#001e40]"
                              title="Edit product formulation"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            // Edit / Add product form
            <form onSubmit={handleSaveProduct} className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
                <h2 className="text-lg font-bold text-[#001e40]">
                  {editingProduct.id ? 'Edit Formulation Details' : 'Register New Formulation'}
                </h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-900 bg-gray-50 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-xs font-bold text-white bg-[#001e40] hover:bg-[#001e40]/90 px-4 py-2 rounded-lg shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Product Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Product Name</label>
                  <input
                    type="text"
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Category Type</label>
                  <select
                    value={editingProduct.category || 'serum'}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  >
                    <option value="cleanser">Cleanser</option>
                    <option value="serum">Serum</option>
                    <option value="cream">Cream / Moisturizer</option>
                    <option value="exfoliant">Exfoliant</option>
                    <option value="mask">Treatment Mask</option>
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                    required
                  />
                </div>

                {/* Stock */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Starting Stock Level</label>
                  <input
                    type="number"
                    value={editingProduct.stock || 0}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, stock: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                    required
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Product Image URL</label>
                  <input
                    type="text"
                    value={editingProduct.image || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                    required
                  />
                </div>

                {/* Tag */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Product Tag (Promo Ribbon)</label>
                  <select
                    value={editingProduct.tag || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, tag: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  >
                    <option value="">None</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="New">New Arrival</option>
                    <option value="Tested">Dermatologically Tested</option>
                  </select>
                </div>

                {/* Skin Concern checks */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-600 block">Targeted Skin Concerns</label>
                  <div className="flex flex-wrap gap-4">
                    {['Dry Skin', 'Oily Skin', 'Acne-Prone', 'Sensitive Skin', 'Anti-Aging'].map(concern => {
                      const concerns = editingProduct.skinConcern || [];
                      const isChecked = concerns.includes(concern);
                      return (
                        <label key={concern} className="inline-flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              const updated = isChecked
                                ? concerns.filter(c => c !== concern)
                                : [...concerns, concern];
                              setEditingProduct(prev => ({ ...prev, skinConcern: updated }));
                            }}
                            className="rounded text-[#003366] focus:ring-[#003366]"
                          />
                          {concern}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Actives ingredients */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-gray-600">Active Ingredients (comma-separated list)</label>
                  <input
                    type="text"
                    value={Array.isArray(editingProduct.ingredients) ? editingProduct.ingredients.join(', ') : ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, ingredients: e.target.value.split(',').map(i => i.trim()) }))}
                    placeholder="Hyaluronic Acid (2%), Niacinamide (5%), Zinc PCA..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  />
                </div>

                {/* Full formulation ingredients list */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-gray-600">Full Biochemical Ingredient Formulation List</label>
                  <textarea
                    value={editingProduct.fullIngredients || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, fullIngredients: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs h-20"
                    placeholder="Water, Glycerin, Caprylic/Capric Triglyceride, Phenoxyethanol..."
                  />
                </div>

                {/* Usage directions */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-gray-600">Dermatological Directions &amp; Usage Steps</label>
                  <input
                    type="text"
                    value={editingProduct.usage || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, usage: e.target.value }))}
                    placeholder="Apply 3-4 drops morning and night on damp skin..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  />
                </div>

                {/* AI COPYWRITER PANEL */}
                <div className="md:col-span-2 bg-[#e5eeff]/40 border border-blue-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#003366] flex items-center gap-1.5">
                      <Sparkles className="w-4.5 h-4.5 text-[#003366]" />
                      Clinical Copywriter Assistant
                    </h4>
                    <button
                      type="button"
                      onClick={handleGenerateAIDescription}
                      disabled={aiGeneratingDesc}
                      className="text-[10px] font-bold text-white bg-[#003366] hover:bg-[#003366]/90 px-3 py-1 rounded-md flex items-center gap-1 transition-all"
                    >
                      {aiGeneratingDesc ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          Generate Clinical Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-normal">
                    Fills the description block automatically with a biochemical breakdown, target details, and dermatologist directions based on your product name, actives, and selected skin concerns.
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-gray-600">Product E-commerce Description (Markdown Supported)</label>
                  <textarea
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs h-40"
                    placeholder="Enter description or generate with AI above..."
                    required
                  />
                </div>

              </div>
            </form>
          )}
        </div>
      )}

      {/* 2. BLOG / ADVICE TAB */}
      {activeTab === 'blogs' && (
        <div className="space-y-6">
          {!editingArticle ? (
            <div className="bg-white border border-gray-100 rounded-xl shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-sm font-bold text-[#001e40]">Clinical Derm-Advice Articles</h2>
                <button
                  onClick={() => setEditingArticle({
                    title: '', excerpt: '', content: '', category: 'Education',
                    image: '', author: 'Dr. Sarah Lin, MD', readTime: '5 min read'
                  })}
                  className="inline-flex items-center gap-1 text-xs font-bold bg-[#286c00] hover:bg-[#286c00]/90 text-white px-3 py-1.5 rounded-lg shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  Write Article
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/30 text-gray-400 font-semibold">
                      <th className="p-4">Article Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Author</th>
                      <th className="p-4">Published Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {articles
                      .filter(a => a.title.toLowerCase().includes(searchFilter.toLowerCase()))
                      .map(art => (
                        <tr key={art.id} className="hover:bg-gray-50/50">
                          <td className="p-4 flex items-center gap-3 max-w-sm">
                            <img src={art.image} alt={art.title} className="w-10 h-10 object-cover rounded border border-gray-100 flex-shrink-0" />
                            <div className="truncate">
                              <p className="font-bold text-[#001e40] truncate">{art.title}</p>
                              <p className="text-[10px] text-gray-400 truncate">{art.excerpt}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-[#003366] bg-[#e5eeff]">
                              {art.category}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600 font-medium">{art.author}</td>
                          <td className="p-4 text-gray-500 font-mono">{art.date}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setEditingArticle(art)}
                              className="p-1 text-gray-400 hover:text-[#001e40]"
                              title="Edit article copy"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            // Form to write/edit blogs
            <form onSubmit={handleSaveArticle} className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
                <h2 className="text-lg font-bold text-[#001e40]">
                  {editingArticle.id ? 'Edit Skincare Article' : 'Draft New Skincare Article'}
                </h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingArticle(null)}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-900 bg-gray-50 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-xs font-bold text-white bg-[#001e40] hover:bg-[#001e40]/90 px-4 py-2 rounded-lg shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Title */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-gray-600">Article Title</label>
                  <input
                    type="text"
                    value={editingArticle.title || ''}
                    onChange={(e) => setEditingArticle(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold text-[#001e40]"
                    required
                  />
                </div>

                {/* Excerpt */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-gray-600">Short Excerpt / Summary</label>
                  <input
                    type="text"
                    value={editingArticle.excerpt || ''}
                    onChange={(e) => setEditingArticle(prev => ({ ...prev, excerpt: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600"
                    placeholder="Short 1-sentence synopsis to capture reader engagement..."
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Category</label>
                  <select
                    value={editingArticle.category || 'Sensitive Skin'}
                    onChange={(e) => setEditingArticle(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  >
                    <option value="Sensitive Skin">Sensitive Skin Care</option>
                    <option value="Skincare Routines">Skincare Routines &amp; Layering</option>
                    <option value="Acne & Oily Skin">Acne &amp; Oily Skin</option>
                    <option value="Dry Skin">Dry &amp; Dehydrated Skin</option>
                    <option value="Sun Protection">Sun Protection (SPF)</option>
                    <option value="Baby & Infant Care">Baby &amp; Infant Care</option>
                    <option value="Ingredients Science">Ingredients Science</option>
                    <option value="Education">General Derm Education</option>
                  </select>
                </div>

                {/* Read time */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Estimated Read Time</label>
                  <input
                    type="text"
                    value={editingArticle.readTime || '5 min read'}
                    onChange={(e) => setEditingArticle(prev => ({ ...prev, readTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                    required
                  />
                </div>

                {/* Author */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Author Name</label>
                  <input
                    type="text"
                    value={editingArticle.author || 'Dr. Sarah Lin, MD'}
                    onChange={(e) => setEditingArticle(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                    required
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Hero Image URL</label>
                  <input
                    type="text"
                    value={editingArticle.image || ''}
                    onChange={(e) => setEditingArticle(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                    placeholder="https://images.unsplash.com/..."
                    required
                  />
                </div>

                {/* Content */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-gray-600">Article Copy (Markdown Supported)</label>
                  <textarea
                    value={editingArticle.content || ''}
                    onChange={(e) => setEditingArticle(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs h-64 font-mono leading-relaxed"
                    placeholder="Use markdown headers (###), bold marks (**), etc..."
                    required
                  />
                </div>

                {/* Key Takeaways */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-gray-600">Key Dermatologist Takeaways (One per line)</label>
                  <textarea
                    value={Array.isArray(editingArticle.keyTakeaways) ? editingArticle.keyTakeaways.join('\n') : (editingArticle.keyTakeaways || '')}
                    onChange={(e) => setEditingArticle(prev => ({ ...prev, keyTakeaways: e.target.value.split('\n').filter(Boolean) }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs h-24"
                    placeholder="Enter key clinical points for the summary box, one per line..."
                  />
                </div>

                {/* Linked Suitable Products */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-600">Link Suitable Cetaphil Products (Recommended for this Tip/Routine)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto">
                    {products.map(prod => {
                      const isLinked = (editingArticle.relatedProductIds || []).includes(prod.id);
                      return (
                        <label key={prod.id} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isLinked}
                            onChange={(e) => {
                              const currentIds = editingArticle.relatedProductIds || [];
                              const updatedIds = e.target.checked
                                ? [...currentIds, prod.id]
                                : currentIds.filter(id => id !== prod.id);
                              setEditingArticle(prev => ({ ...prev, relatedProductIds: updatedIds }));
                            }}
                            className="rounded border-gray-300 text-[#002D62] focus:ring-[#0082C8]"
                          />
                          <img src={prod.image} alt={prod.name} className="w-6 h-6 object-contain rounded border border-gray-100" referrerPolicy="no-referrer" />
                          <span className="truncate font-medium text-gray-700">{prod.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

              </div>
            </form>
          )}
        </div>
      )}

      {/* 3. PROMO SETTINGS TAB */}
      {activeTab === 'promo' && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs max-w-2xl space-y-6">
          <h2 className="text-lg font-bold text-[#001e40] border-b border-gray-100 pb-2">Global Banner Promotions</h2>
          
          <div className="space-y-4">
            {/* Promo text */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600">Promo Banner Text</label>
              <input
                type="text"
                value={promoText}
                onChange={(e) => setPromoText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-[#001e40]"
                placeholder="Free Shipping on orders over $50 | Use code CLINICAL15 for 15% off..."
              />
            </div>

            {/* Visibility toggle */}
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={promoVisible}
                onChange={(e) => setPromoVisible(e.target.checked)}
                className="rounded text-[#286c00] focus:ring-[#286c00] w-4.5 h-4.5"
              />
              Show promotional banner globally at the top of the page
            </label>
          </div>

          <button
            type="button"
            onClick={handleSavePromo}
            disabled={updatingPromo}
            className="text-xs font-bold text-white bg-[#001e40] hover:bg-[#001e40]/90 px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm"
          >
            {updatingPromo ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Publish Promo Update
          </button>
        </div>
      )}

      {/* 4. SEO METADATA TAB */}
      {activeTab === 'seo' && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
            <h2 className="text-sm font-bold text-[#001e40]">Search Engine Optimization (SEO) Configurator</h2>
            <p className="text-[10px] text-gray-500 mt-0.5">
              Customize Meta Titles, Meta Descriptions, and search engine friendly URLs to capture Google search queries.
            </p>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            {products
              .filter(p => p.name.toLowerCase().includes(searchFilter.toLowerCase()))
              .map(p => {
                const urlAlias = p.seoUrl || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                const metaTitle = p.metaTitle || `${p.name} - Professional Clinical Skincare`;
                const metaDesc = p.metaDescription || p.description.substring(0, 150) + '...';

                return (
                  <div key={p.id} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 hover:bg-gray-50/30 transition-colors">
                    <div className="space-y-1">
                      <p className="font-bold text-[#001e40]">{p.name}</p>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#286c00] bg-[#e6f4ea] px-1.5 py-0.5 rounded">
                        Product Formulation
                      </span>
                      <p className="text-[10px] text-gray-400 font-mono pt-1">ID: {p.id}</p>
                    </div>

                    <div className="md:col-span-2 space-y-3">
                      {/* SEO URL */}
                      <div className="grid grid-cols-4 gap-2 items-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">SEO URL Path</span>
                        <div className="col-span-3 flex items-center bg-gray-100 border border-gray-200 rounded-lg px-2 py-1">
                          <span className="text-[10px] text-gray-400 select-none">cetaphil.lk/products/</span>
                          <input
                            type="text"
                            value={p.seoUrl || urlAlias}
                            onChange={(e) => {
                              onUpdateProducts(products.map(prod => prod.id === p.id ? { ...prod, seoUrl: e.target.value } : prod));
                            }}
                            className="bg-transparent border-none p-0 text-[10px] font-bold text-[#001e40] focus:ring-0 ml-1 flex-grow outline-none"
                          />
                        </div>
                      </div>

                      {/* Meta Title */}
                      <div className="grid grid-cols-4 gap-2 items-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Meta Title</span>
                        <input
                          type="text"
                          value={p.metaTitle || metaTitle}
                          onChange={(e) => {
                            onUpdateProducts(products.map(prod => prod.id === p.id ? { ...prod, metaTitle: e.target.value } : prod));
                          }}
                          className="col-span-3 px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-800"
                        />
                      </div>

                      {/* Meta Description */}
                      <div className="grid grid-cols-4 gap-2 items-start">
                        <span className="text-[10px] font-bold text-gray-400 uppercase pt-1">Meta Description</span>
                        <textarea
                          value={p.metaDescription || metaDesc}
                          onChange={(e) => {
                            onUpdateProducts(products.map(prod => prod.id === p.id ? { ...prod, metaDescription: e.target.value } : prod));
                          }}
                          className="col-span-3 px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] text-gray-600 h-16 leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

    </div>
  );
}
