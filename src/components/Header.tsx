import React, { useState } from 'react';
import { Product } from '../types';
import { Search, ShoppingCart, User, Menu, X, Sparkles, HelpCircle, ShieldCheck, Heart } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  setSelectedProductId: (id: string | null) => void;
  cartCount: number;
  onCartToggle: () => void;
  products: Product[];
  promoBanner: { text: string; visible: boolean };
}

export default function Header({
  currentView,
  setCurrentView,
  setSelectedProductId,
  cartCount,
  onCartToggle,
  products,
  promoBanner,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredSuggestions = searchQuery.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const handleSuggestionClick = (product: Product) => {
    setSelectedProductId(product.id);
    setCurrentView('pdp');
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView('shop');
      setShowSuggestions(false);
    }
  };

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setSelectedProductId(null);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-xs">
      {/* Dynamic Promo Banner managed via CMS */}
      {promoBanner.visible && (
        <div className="bg-[#002D62] text-white text-xs font-medium py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2">
          <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-[#43B02A]" />
          <span>{promoBanner.text}</span>
        </div>
      )}

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          
          {/* Logo / Brand */}
          <button
            onClick={() => handleNavClick('shop')}
            className="flex-shrink-0 flex items-center gap-2.5 hover:opacity-90 transition-opacity text-left cursor-pointer"
          >
            <img
              src="https://i.imgur.com/DCJMlkw.png"
              alt="Cetaphil"
              className="h-9 sm:h-10 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <span className="sr-only">Cetaphil</span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 text-[9px] font-bold text-[#0082C8] bg-[#EEF5F9] rounded-full border border-[#D1E5F2] tracking-wider uppercase">
              Official Sri Lanka
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-7">
            <button
              onClick={() => handleNavClick('shop')}
              className={`text-sm font-semibold transition-all duration-200 py-1 border-b-2 ${
                currentView === 'shop' || currentView === 'pdp'
                  ? 'border-[#0082C8] text-[#0082C8] font-bold'
                  : 'border-transparent text-[#0A1C2A] hover:text-[#0082C8]'
              }`}
            >
              Shop All
            </button>
            <button
              onClick={() => handleNavClick('baby')}
              className={`text-sm font-semibold transition-all duration-200 py-1 border-b-2 flex items-center gap-1.5 ${
                currentView === 'baby'
                  ? 'border-[#0082C8] text-[#0082C8] font-bold'
                  : 'border-transparent text-[#0A1C2A] hover:text-[#0082C8]'
              }`}
            >
              <Heart className="w-4 h-4 text-[#0082C8]" />
              Baby Care
            </button>
            <button
              onClick={() => handleNavClick('tips')}
              className={`text-sm font-semibold transition-all duration-200 py-1 border-b-2 ${
                currentView === 'tips' || currentView === 'blog'
                  ? 'border-[#0082C8] text-[#0082C8] font-bold'
                  : 'border-transparent text-[#0A1C2A] hover:text-[#0082C8]'
              }`}
            >
              Skincare Tips
            </button>
            <button
              onClick={() => handleNavClick('quiz')}
              className={`text-sm font-semibold transition-all duration-200 py-1 border-b-2 flex items-center gap-1 ${
                currentView === 'quiz'
                  ? 'border-[#43B02A] text-[#43B02A] font-bold'
                  : 'border-transparent text-[#0A1C2A] hover:text-[#43B02A]'
              }`}
            >
              <Sparkles className="w-4.5 h-4.5 text-[#43B02A]" />
              Skin Quiz
            </button>
            <button
              onClick={() => handleNavClick('consult')}
              className={`text-sm font-semibold transition-all duration-200 py-1 border-b-2 flex items-center gap-1 ${
                currentView === 'consult'
                  ? 'border-[#0082C8] text-[#0082C8] font-bold'
                  : 'border-transparent text-[#0A1C2A] hover:text-[#0082C8]'
              }`}
            >
              <HelpCircle className="w-4.5 h-4.5 text-[#0082C8]" />
              AI Consult
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className={`text-sm font-semibold transition-all duration-200 py-1 border-b-2 flex items-center gap-1 ${
                currentView === 'admin'
                  ? 'border-[#002D62] text-[#002D62] font-bold'
                  : 'border-transparent text-gray-400 hover:text-gray-900'
              }`}
            >
              <ShieldCheck className="w-4.5 h-4.5" />
              CMS Admin
            </button>
          </nav>

          {/* Search, Account, Cart and Mobile Toggle */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Search Input Box with Suggestions */}
            <div className="relative hidden lg:block w-64">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search Cetaphil formulas..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full pl-9 pr-4 py-2 bg-[#F4F8FA] border border-[#E2EBF1] rounded-full text-xs text-[#0A1C2A] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0082C8] transition-all"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </form>

              {/* Suggestions dropdown */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-11 left-0 right-0 bg-white border border-[#E2EBF1] rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="px-3.5 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                    Recommended Cetaphil Solutions
                  </div>
                  {filteredSuggestions.map(product => (
                    <button
                      key={product.id}
                      onClick={() => handleSuggestionClick(product)}
                      className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-[#F4F8FA] flex items-center gap-2.5 border-b border-gray-50 last:border-0"
                    >
                      <img src={product.image} alt={product.name} className="w-7 h-7 object-contain rounded" referrerPolicy="no-referrer" />
                      <div className="truncate">
                        <p className="font-bold text-[#0A1C2A] truncate">{product.name}</p>
                        <p className="text-[10px] text-[#0082C8] font-semibold capitalize">{product.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Action */}
            <button
              onClick={() => handleNavClick('profile')}
              className={`p-2 rounded-full hover:bg-[#EEF5F9] text-[#002D62] transition-colors cursor-pointer ${
                currentView === 'profile' ? 'bg-[#EEF5F9] text-[#0082C8]' : ''
              }`}
              title="My Account"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Cart Icon Badge */}
            <button
              onClick={onCartToggle}
              className="p-2 rounded-full hover:bg-[#EEF5F9] text-[#002D62] relative transition-colors cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#0082C8] text-white text-[10px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-[#002D62] hover:bg-gray-50"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-3 shadow-md">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search Cetaphil products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          </form>

          <div className="flex flex-col space-y-2 font-medium">
            <button
              onClick={() => handleNavClick('shop')}
              className={`text-left text-sm py-2 px-3 rounded-lg ${
                currentView === 'shop' ? 'bg-[#EEF5F9] text-[#0082C8] font-bold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Shop All
            </button>
            <button
              onClick={() => handleNavClick('baby')}
              className={`text-left text-sm py-2 px-3 rounded-lg flex items-center gap-2 ${
                currentView === 'baby' ? 'bg-[#EEF5F9] text-[#0082C8] font-bold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Heart className="w-4 h-4 text-[#0082C8]" />
              Baby Care Collection
            </button>
            <button
              onClick={() => handleNavClick('tips')}
              className={`text-left text-sm py-2 px-3 rounded-lg ${
                currentView === 'tips' || currentView === 'blog' ? 'bg-[#EEF5F9] text-[#0082C8] font-bold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Skincare Tips
            </button>
            <button
              onClick={() => handleNavClick('quiz')}
              className={`text-left text-sm py-2 px-3 rounded-lg flex items-center gap-2 ${
                currentView === 'quiz' ? 'bg-[#E6F4EA] text-[#43B02A] font-bold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#43B02A]" />
              Take Skin Quiz
            </button>
            <button
              onClick={() => handleNavClick('consult')}
              className={`text-left text-sm py-2 px-3 rounded-lg flex items-center gap-2 ${
                currentView === 'consult' ? 'bg-[#EEF5F9] text-[#0082C8] font-bold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-[#0082C8]" />
              AI Consultant
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className={`text-left text-sm py-2 px-3 rounded-lg flex items-center gap-2 ${
                currentView === 'admin' ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              CMS Admin Panel
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
