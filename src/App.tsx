import React, { useState, useEffect } from 'react';
import { Product, Article, Order, CartItem, DBState } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCatalog from './components/ProductCatalog';
import ProductDetail from './components/ProductDetail';
import BabyProductsPage from './components/BabyProductsPage';
import SkinQuiz from './components/SkinQuiz';
import AIConsult from './components/AIConsult';
import BlogSection from './components/BlogSection';
import SkincareTipsPage from './components/SkincareTipsPage';
import CMSAdmin from './components/CMSAdmin';
import CartSidebar from './components/CartSidebar';
import Checkout from './components/Checkout';
import UserDashboard from './components/UserDashboard';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  // Navigation Router states
  const [currentView, setCurrentView] = useState<string>('shop');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Full-stack DB state
  const [products, setProducts] = useState<Product[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [promoBanner, setPromoBanner] = useState({ text: '', visible: false });
  
  // App infrastructure states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Shopping Cart states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutDiscountMultiplier, setCheckoutDiscountMultiplier] = useState(1);
  const [checkoutDiscountCodeUsed, setCheckoutDiscountCodeUsed] = useState('');

  // Fetch full clinical database state on initial render
  const fetchDB = async () => {
    try {
      const res = await fetch('/api/db');
      if (!res.ok) throw new Error("Could not download clinical database registry.");
      const data: DBState = await res.json();
      setProducts(data.products || []);
      setArticles(data.articles || []);
      setOrders(data.orders || []);
      setPromoBanner(data.promoBanner || { text: '', visible: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown network failure.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDB();
  }, []);

  // CART OPERATIONS
  const handleAddToCart = (product: Product, quantity: number) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.product.id === product.id);
      if (existing) {
        // Respect maximum stock limits
        const targetQty = Math.min(product.stock, existing.quantity + quantity);
        return prevCart.map(item => item.product.id === product.id ? { ...item, quantity: targetQty } : item);
      }
      return [...prevCart, { product, quantity: Math.min(product.stock, quantity) }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    const targetProduct = products.find(p => p.id === productId);
    if (!targetProduct) return;
    const boundedQuantity = Math.max(1, Math.min(targetProduct.stock, quantity));

    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId ? { ...item, quantity: boundedQuantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const handleCheckoutInitiated = (discountMultiplier: number, discountCodeUsed: string) => {
    setCheckoutDiscountMultiplier(discountMultiplier);
    setCheckoutDiscountCodeUsed(discountCodeUsed);
    setIsCartOpen(false);
    setCurrentView('checkout');
  };

  const handleOrderPlaced = (newOrder: Order) => {
    // Append to customer's order history state
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    // Clear shopping cart
    setCart([]);
    // Update local product inventory levels from placing order
    setProducts(prevProducts =>
      prevProducts.map(p => {
        const orderedItem = newOrder.items.find(item => item.productId === p.id);
        if (orderedItem) {
          return { ...p, stock: Math.max(0, p.stock - orderedItem.quantity) };
        }
        return p;
      })
    );
  };

  const handleReorder = async (orderId: string): Promise<void> => {
    const res = await fetch(`/api/orders/reorder/${orderId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error("Could not place reorder.");
    const data = await res.json();
    
    setOrders(prevOrders => [data.order, ...prevOrders]);
    // Re-verify stocks
    setProducts(prevProducts =>
      prevProducts.map(p => {
        const orderedItem = data.order.items.find((item: any) => item.productId === p.id);
        if (orderedItem) {
          return { ...p, stock: Math.max(0, p.stock - orderedItem.quantity) };
        }
        return p;
      })
    );
  };

  // CMS Handlers
  const handleUpdateProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
  };

  const handleUpdateArticles = (updatedArticles: Article[]) => {
    setArticles(updatedArticles);
  };

  const handleUpdatePromo = (updatedPromo: { text: string; visible: boolean }) => {
    setPromoBanner(updatedPromo);
  };

  // Find currently active product (if view is pdp)
  const activeProduct = products.find(p => p.id === selectedProductId);

  // App loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] flex flex-col items-center justify-center p-4">
        <img
          src="https://i.imgur.com/DCJMlkw.png"
          alt="Cetaphil"
          className="h-12 w-auto object-contain mb-4 animate-pulse"
          referrerPolicy="no-referrer"
        />
        <div className="relative w-8 h-8 mb-4">
          <div className="absolute inset-0 rounded-full border-3 border-blue-100 border-t-[#001e40] animate-spin" />
        </div>
        <p className="text-xs font-bold text-[#001e40] uppercase tracking-widest">
          Loading Cetaphil Skincare Catalog...
        </p>
      </div>
    );
  }

  // App error fallback screen
  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto space-y-4">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-[#001e40]">Clinic Systems Delayed</h2>
        <p className="text-xs text-gray-500 leading-relaxed">{error}</p>
        <button
          onClick={() => { setLoading(true); setError(null); fetchDB(); }}
          className="px-4 py-2 bg-[#001e40] text-white text-xs font-bold rounded-lg hover:opacity-90"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans flex flex-col">
      {/* Sticky Top Header */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        setSelectedProductId={setSelectedProductId}
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        products={products}
        promoBanner={promoBanner}
      />

      {/* Main Container Views Switch Router */}
      <main className="flex-grow">
        {currentView === 'shop' && (
          <ProductCatalog
            products={products}
            onAddToCart={handleAddToCart}
            setSelectedProductId={setSelectedProductId}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'baby' && (
          <BabyProductsPage
            products={products}
            onAddToCart={handleAddToCart}
            setSelectedProductId={setSelectedProductId}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'pdp' && activeProduct && (
          <ProductDetail
            product={activeProduct}
            products={products}
            onAddToCart={handleAddToCart}
            setSelectedProductId={setSelectedProductId}
            setCurrentView={setCurrentView}
          />
        )}

        {(currentView === 'blog' || currentView === 'tips') && (
          <SkincareTipsPage
            articles={articles}
            products={products}
            onAddToCart={handleAddToCart}
            setCurrentView={setCurrentView}
            setSelectedProductId={setSelectedProductId}
          />
        )}

        {currentView === 'quiz' && (
          <SkinQuiz
            products={products}
            onAddToCart={handleAddToCart}
            setCurrentView={setCurrentView}
            setSelectedProductId={setSelectedProductId}
          />
        )}

        {currentView === 'consult' && (
          <AIConsult
            products={products}
            setCurrentView={setCurrentView}
            setSelectedProductId={setSelectedProductId}
          />
        )}

        {currentView === 'admin' && (
          <CMSAdmin
            products={products}
            articles={articles}
            promoBanner={promoBanner}
            onUpdateProducts={handleUpdateProducts}
            onUpdateArticles={handleUpdateArticles}
            onUpdatePromo={handleUpdatePromo}
          />
        )}

        {currentView === 'checkout' && (
          <Checkout
            cartItems={cart}
            discountMultiplier={checkoutDiscountMultiplier}
            discountCodeUsed={checkoutDiscountCodeUsed}
            onOrderPlaced={handleOrderPlaced}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'profile' && (
          <UserDashboard
            orders={orders}
            onReorder={handleReorder}
            setCurrentView={setCurrentView}
            setSelectedProductId={setSelectedProductId}
          />
        )}
      </main>

      {/* Slide-out Shopping Cart Drawer */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onCheckout={handleCheckoutInitiated}
      />

      {/* Global Footer */}
      <Footer setCurrentView={setCurrentView} setSelectedProductId={setSelectedProductId} />
    </div>
  );
}
