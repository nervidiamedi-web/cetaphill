import React, { useState, useMemo } from 'react';
import { Article, Product } from '../types';
import { 
  ChevronLeft, 
  Clock, 
  Calendar, 
  User, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Droplets, 
  Check, 
  Sun, 
  Moon, 
  Heart, 
  Search,
  ShoppingCart,
  ExternalLink,
  Info,
  Layers,
  ChevronRight
} from 'lucide-react';

interface SkincareTipsPageProps {
  articles: Article[];
  products: Product[];
  onAddToCart?: (product: Product, quantity: number) => void;
  setCurrentView: (view: string) => void;
  setSelectedProductId: (id: string | null) => void;
}

export default function SkincareTipsPage({
  articles,
  products,
  onAddToCart,
  setCurrentView,
  setSelectedProductId
}: SkincareTipsPageProps) {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFiveSign, setActiveFiveSign] = useState<number>(0);
  const [activeRoutineMode, setActiveRoutineMode] = useState<'morning' | 'evening'>('morning');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const categories = [
    'All',
    'Sensitive Skin',
    'Skincare Routines',
    'Acne & Oily Skin',
    'Dry Skin',
    'Sun Protection',
    'Baby & Infant Care',
    'Ingredients Science'
  ];

  // 5 Signs of Skin Sensitivity definition data (from Cetaphil official clinical science)
  const fiveSignsData = [
    {
      id: 'weakened-barrier',
      name: 'Weakened Skin Barrier',
      shortDesc: 'Compromised intercellular lipid matrix allowing irritants in and water out.',
      symptoms: 'Stinging, heightened reactivity to temperature or skincare products, visible sensitivity.',
      science: 'A damaged epidermal barrier suffers from diminished ceramide and natural moisturizing factor (NMF) synthesis, increasing transepidermal water loss (TEWL).',
      recommendation: 'Replenish intercellular lipids with physiological fatty acids, Niacinamide (Vitamin B3), and Pro-Vitamin B5.',
      recommendedProductIds: ['cet-moisturizing-cream-85', 'cet-dam-lotion-100']
    },
    {
      id: 'dryness',
      name: 'Dryness & Dehydration',
      shortDesc: 'A persistent lack of essential moisture and moisture-binding capacity.',
      symptoms: 'Tightness after washing, dull ashy look, flaking patches, uncomfortable tautness.',
      science: 'Without adequate humectants like Glycerin and occlusive emollient oils, the stratum corneum dries out and becomes micro-cracked.',
      recommendation: 'Cleanse with soap-free micellar cleansers and seal with 48-hour continuous hydration emollient creams.',
      recommendedProductIds: ['cet-gentle-skin-cleanser-125', 'cet-moisturizing-cream-453']
    },
    {
      id: 'irritation',
      name: 'Irritation & Redness',
      shortDesc: 'Neuro-sensory and inflammatory flare-ups triggered by harsh additives.',
      symptoms: 'Blotchy redness, stinging upon product application, prickling warmth, itchiness.',
      science: 'Penetration of synthetic fragrances, parabens, or aggressive sulfates triggers mast-cell histamine release.',
      recommendation: 'Use hypoallergenic, dermatologist-tested, fragrance-free formulations with organic Calendula and Panthenol.',
      recommendedProductIds: ['cet-gentle-skin-cleanser-125', 'cet-baby-calendula-lotion-400']
    },
    {
      id: 'roughness',
      name: 'Roughness & Flaking',
      shortDesc: 'Uneven, sandpaper-like texture caused by impaired desquamation.',
      symptoms: 'Flaking skin, uneven foundation application, coarse tactile feeling on cheeks and forehead.',
      science: 'Impaired moisture levels inhibit natural proteolytic enzymes responsible for shedding dead skin cells smoothly.',
      recommendation: 'Avoid harsh physical scrubs. Nourish the stratum corneum with gentle daily hydration to restore natural cellular turnover.',
      recommendedProductIds: ['cet-moisturizing-cream-85', 'cet-daily-facial-cleanser-591']
    },
    {
      id: 'tightness',
      name: 'Tightness & Discomfort',
      shortDesc: 'Uncomfortable, taut pulling sensation that makes facial expression feel strained.',
      symptoms: 'Skin feels stretched and stiff immediately after washing, requiring instant lotion application.',
      science: 'Caused by high-pH alkaline soaps stripping natural sebum and acidic mantle (pH 5.5).',
      recommendation: 'Switch strictly to pH-balanced, soap-free cleansing formulas that respect the acid mantle.',
      recommendedProductIds: ['cet-gentle-skin-cleanser-125', 'cet-oily-skin-cleanser-125']
    }
  ];

  // Routines data (Morning & Evening orders)
  const routineData = {
    morning: [
      {
        step: 1,
        title: 'Step 1: Gentle Cleansing',
        action: 'Cleanse',
        desc: 'Wash away overnight sebum and perspiration with a gentle, non-stripping cleanser using lukewarm water.',
        productId: 'cet-gentle-skin-cleanser-125'
      },
      {
        step: 2,
        title: 'Step 2: Deep Hydration Replenishment',
        action: 'Hydrate',
        desc: 'Apply lightweight hydration immediately to damp skin to lock in vital water reserves and prep the barrier.',
        productId: 'cet-dam-lotion-100'
      },
      {
        step: 3,
        title: 'Step 3: Moisture Barrier Sealing',
        action: 'Nourish',
        desc: 'Seal with a dermatologist-backed cream containing sweet almond oil, Vitamin E, and Niacinamide.',
        productId: 'cet-moisturizing-cream-85'
      },
      {
        step: 4,
        title: 'Step 4: Broad-Spectrum UV Defense',
        action: 'Protect',
        desc: 'Finish with Cetaphil Sun SPF 50+ Light Gel 15-20 minutes before stepping outdoors. High UVA, UVB & Infrared protection.',
        productId: 'cet-sun-spf50-light-gel-50'
      }
    ],
    evening: [
      {
        step: 1,
        title: 'Step 1: Thorough Impurity Removal',
        action: 'Deep Cleanse',
        desc: 'Dissolve daily pollution, excess sebum, and makeup residue without disrupting your natural moisture barrier.',
        productId: 'cet-oily-skin-cleanser-125'
      },
      {
        step: 2,
        title: 'Step 2: Intensive Overnight Barrier Repair',
        action: 'Restore',
        desc: 'Apply a generous layer of 48-hour continuous hydration cream to support nighttime cellular renewal.',
        productId: 'cet-moisturizing-cream-453'
      },
      {
        step: 3,
        title: 'Step 3: Targeted Sensitive Area Care',
        action: 'Condition',
        desc: 'Apply soothing emollient care to high-friction zones such as neck, elbows, and dry patches.',
        productId: 'cet-moisturizing-cream-85'
      }
    ]
  };

  // Filter articles based on category and search query
  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      const matchesCategory = activeCategory === 'All' || art.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        art.title.toLowerCase().includes(q) ||
        art.excerpt.toLowerCase().includes(q) ||
        art.content.toLowerCase().includes(q) ||
        (art.subtitle && art.subtitle.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [articles, activeCategory, searchQuery]);

  const currentArticle = useMemo(() => {
    return articles.find(a => a.id === selectedArticleId);
  }, [articles, selectedArticleId]);

  // Resolve related products for the current selected article
  const articleRelatedProducts = useMemo(() => {
    if (!currentArticle) return [];
    if (currentArticle.relatedProductIds && currentArticle.relatedProductIds.length > 0) {
      return currentArticle.relatedProductIds
        .map(id => products.find(p => p.id === id))
        .filter((p): p is Product => p !== undefined);
    }
    // Fallback: match by category keywords
    if (currentArticle.category.includes('Acne') || currentArticle.category.includes('Oily')) {
      return products.filter(p => p.skinConcern.includes('Oily Skin') || p.skinConcern.includes('Acne-Prone')).slice(0, 3);
    }
    if (currentArticle.category.includes('Baby')) {
      return products.filter(p => p.category === 'baby').slice(0, 3);
    }
    return products.slice(0, 3);
  }, [currentArticle, products]);

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('pdp');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product, 1);
      setAddedProductId(product.id);
      setTimeout(() => setAddedProductId(null), 2500);
    } else {
      handleProductClick(product.id);
    }
  };

  // Convert markdown to clean semantic HTML
  const renderMarkdownContent = (content: string) => {
    return content.split('\n\n').map((block, idx) => {
      if (block.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-lg sm:text-xl font-bold text-[#002D62] pt-6 pb-2 border-b border-[#E2EBF1] mb-3">
            {block.replace('### ', '')}
          </h3>
        );
      }
      if (block.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-xl sm:text-2xl font-extrabold text-[#002D62] pt-8 pb-3 mb-2">
            {block.replace('## ', '')}
          </h2>
        );
      }
      if (block.startsWith('* ') || block.startsWith('- ') || /^\d+\.\s/.test(block)) {
        const items = block.split('\n').map(item => item.replace(/^([-*]|\d+\.)\s+/, ''));
        return (
          <ul key={idx} className="list-disc pl-6 space-y-2 text-sm text-gray-700 my-4 leading-relaxed">
            {items.map((item, iIdx) => {
              const parts = [];
              const boldRegex = /\*\*(.*?)\*\*/g;
              let match;
              let lastIdx = 0;
              let keyCount = 0;
              while ((match = boldRegex.exec(item)) !== null) {
                if (match.index > lastIdx) {
                  parts.push(item.substring(lastIdx, match.index));
                }
                parts.push(<strong key={keyCount++} className="font-bold text-[#002D62]">{match[1]}</strong>);
                lastIdx = boldRegex.lastIndex;
              }
              if (lastIdx < item.length) {
                parts.push(item.substring(lastIdx));
              }
              return <li key={iIdx}>{parts.length > 0 ? parts : item}</li>;
            })}
          </ul>
        );
      }
      // Paragraph
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let match;
      let lastIdx = 0;
      let keyCount = 0;
      while ((match = boldRegex.exec(block)) !== null) {
        if (match.index > lastIdx) {
          parts.push(block.substring(lastIdx, match.index));
        }
        parts.push(<strong key={keyCount++} className="font-bold text-[#002D62]">{match[1]}</strong>);
        lastIdx = boldRegex.lastIndex;
      }
      if (lastIdx < block.length) {
        parts.push(block.substring(lastIdx));
      }
      return (
        <p key={idx} className="text-sm leading-relaxed text-gray-700 my-4">
          {parts.length > 0 ? parts : block}
        </p>
      );
    });
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen text-[#0A1C2A] pb-16">
      
      {/* 1. ARTICLE DETAIL VIEW (When an article is open) */}
      {currentArticle ? (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-8 animate-fade-in">
          
          {/* Breadcrumb & Back navigation */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <button
              onClick={() => { setSelectedArticleId(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="inline-flex items-center gap-1.5 text-[#0082C8] hover:text-[#002D62] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Skincare Tips Hub
            </button>
            <span>/</span>
            <span className="text-gray-400">{currentArticle.category}</span>
          </div>

          {/* Article Header & Editorial Title */}
          <div className="space-y-4 border-b border-[#E2EBF1] pb-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0082C8]">
              <span>{currentArticle.category}</span>
              <span aria-hidden="true">·</span>
              <span>Dermatologist Approved</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#002D62] leading-tight">
              {currentArticle.title}
            </h1>

            {currentArticle.subtitle && (
              <p className="text-base text-gray-600 leading-relaxed font-normal">
                {currentArticle.subtitle}
              </p>
            )}

            {/* Author, Date, Read Time */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2">
              <span className="flex items-center gap-1.5 font-medium text-gray-700">
                <User className="w-4 h-4 text-[#0082C8]" />
                {currentArticle.author}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#0082C8]" />
                {currentArticle.date}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#0082C8]" />
                {currentArticle.readTime}
              </span>
            </div>
          </div>

          {/* Hero Banner Image */}
          <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-gray-100 border border-[#E2EBF1] shadow-xs">
            <img
              src={currentArticle.image}
              alt={currentArticle.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Key Clinical Takeaways Box */}
          {currentArticle.keyTakeaways && currentArticle.keyTakeaways.length > 0 && (
            <div className="bg-[#EEF5F9] border-l-4 border-[#0082C8] rounded-r-xl p-6 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#002D62] uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#0082C8]" />
                <span>Key Dermatological Takeaways</span>
              </div>
              <ul className="space-y-2">
                {currentArticle.keyTakeaways.map((takeaway, tIdx) => (
                  <li key={tIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0082C8] mt-2 flex-shrink-0" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Main Article Body Text */}
          <article className="prose prose-blue max-w-none text-gray-700">
            {renderMarkdownContent(currentArticle.content)}
          </article>

          {/* MANDATORY: Suitable Products Matching This Tip/Routine */}
          <div className="bg-white border border-[#E2EBF1] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs mt-12">
            <div className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0082C8] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#43B02A]" />
                <span>Targeted Solutions</span>
              </div>
              <h2 className="text-xl font-extrabold text-[#002D62] mt-1">
                Suitable Cetaphil Products for This Routine
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Clinically formulated to defend against the 5 signs of skin sensitivity and support this dermatologist regimen.
              </p>
            </div>

            {/* List of matched products */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {articleRelatedProducts.map(product => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="bg-[#FAFBFD] border border-[#E2EBF1] rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="space-y-3">
                    <div className="w-full h-36 bg-white rounded-lg p-2 flex items-center justify-center overflow-hidden border border-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-[#0082C8] capitalize">
                        {product.category}
                      </p>
                      <h4 className="text-xs font-bold text-[#002D62] line-clamp-2 mt-0.5 group-hover:text-[#0082C8] transition-colors">
                        {product.name}
                      </h4>
                    </div>
                    {product.ingredients && product.ingredients.length > 0 && (
                      <p className="text-[10px] text-gray-500 line-clamp-1">
                        Active: {product.ingredients[0]}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#002D62]">
                        Rs. {product.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-[#43B02A] font-semibold">
                        In Stock ({product.stock})
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleQuickAdd(product, e)}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          addedProductId === product.id
                            ? 'bg-[#43B02A] text-white'
                            : 'bg-[#002D62] hover:bg-[#0082C8] text-white'
                        }`}
                      >
                        {addedProductId === product.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Added
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Add to Cart
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleProductClick(product.id)}
                        className="p-1.5 border border-[#D1E5F2] text-[#0082C8] hover:bg-[#EEF5F9] rounded-lg transition-colors cursor-pointer"
                        title="View details"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next / Related Guides */}
          <div className="border-t border-[#E2EBF1] pt-8 space-y-4">
            <h3 className="text-base font-extrabold text-[#002D62]">
              More Dermatologist Guides You May Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {articles
                .filter(a => a.id !== currentArticle.id)
                .slice(0, 2)
                .map(guide => (
                  <div
                    key={guide.id}
                    onClick={() => { setSelectedArticleId(guide.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="p-4 bg-white border border-[#E2EBF1] rounded-xl hover:border-[#0082C8] transition-all cursor-pointer flex gap-3 group shadow-xs"
                  >
                    <img
                      src={guide.image}
                      alt={guide.title}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1 overflow-hidden">
                      <p className="text-[10px] text-[#0082C8] font-bold uppercase tracking-wider">{guide.category}</p>
                      <h4 className="text-xs font-bold text-[#002D62] group-hover:text-[#0082C8] transition-colors truncate">
                        {guide.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 line-clamp-1">{guide.excerpt}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

        </div>
      ) : (
        // 2. MAIN SKINCARE TIPS HUB OVERVIEW (Like https://www.cetaphil.com/us/skincare-tips)
        <div className="space-y-12 animate-fade-in">
          
          {/* Hero Banner Section */}
          <section className="bg-gradient-to-b from-[#EEF5F9] via-[#FAFBFD] to-white border-b border-[#E2EBF1] py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-[#0082C8] bg-white border border-[#D1E5F2] shadow-xs uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#0082C8]" />
                  <span>Dermatologist Advice &amp; Skin Health</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold text-[#002D62] tracking-tight leading-tight">
                  Skincare Tips &amp; Science-Backed Advice
                </h1>

                <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">
                  Discover dermatologist-developed guides, daily routine orders, and gentle solutions tailored to protect against the 5 signs of skin sensitivity.
                </p>

                {/* Search Bar for Tips */}
                <div className="pt-2 max-w-xl">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search tips by concern (e.g., acne, barrier, baby, SPF, hydration)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-[#D1E5F2] rounded-full text-xs sm:text-sm text-[#002D62] placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#0082C8] shadow-xs"
                    />
                    <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3.5 top-3 text-xs text-gray-400 hover:text-gray-700"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Feature 1: The 5 Signs of Skin Sensitivity Explorer */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white border border-[#E2EBF1] rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-6">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#43B02A] uppercase tracking-wider mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Cetaphil Science</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002D62]">
                    The 5 Signs of Skin Sensitivity
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
                    70% of people experience sensitivity. Cetaphil formulas are clinically proven to defend against all five signs. Select a sign to explore dermatological care and suitable products.
                  </p>
                </div>

                <div className="text-xs font-bold text-[#0082C8] flex items-center gap-1">
                  <span>Sign {activeFiveSign + 1} of 5</span>
                </div>
              </div>

              {/* 5 Signs Buttons Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
                {fiveSignsData.map((sign, idx) => (
                  <button
                    key={sign.id}
                    onClick={() => setActiveFiveSign(idx)}
                    className={`p-3 sm:p-4 rounded-xl text-left transition-all border cursor-pointer flex flex-col justify-between ${
                      activeFiveSign === idx
                        ? 'bg-[#002D62] text-white border-[#002D62] shadow-sm'
                        : 'bg-[#F4F8FA] hover:bg-[#EEF5F9] text-[#002D62] border-[#E2EBF1]'
                    }`}
                  >
                    <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                      activeFiveSign === idx ? 'text-[#70D6FF]' : 'text-gray-400'
                    }`}>
                      0{idx + 1}
                    </span>
                    <span className="text-xs font-bold leading-tight line-clamp-2">
                      {sign.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Active Sign Detailed Breakdown with Linked Suitable Products */}
              <div className="bg-[#F8FAFC] border border-[#E2EBF1] rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left 2 Cols: Clinical Insights */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#0082C8] uppercase tracking-wider">
                        Clinical Analysis
                      </span>
                      <h3 className="text-xl font-bold text-[#002D62]">
                        {fiveSignsData[activeFiveSign].name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                        {fiveSignsData[activeFiveSign].shortDesc}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="bg-white p-3.5 rounded-xl border border-gray-100 space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Visible Symptoms
                        </span>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          {fiveSignsData[activeFiveSign].symptoms}
                        </p>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-gray-100 space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Epidermal Mechanism
                        </span>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          {fiveSignsData[activeFiveSign].science}
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#EEF5F9] p-3.5 rounded-xl border border-[#D1E5F2] flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-[#0082C8] mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-[11px] font-bold text-[#002D62]">
                          Dermatologist Action Plan:
                        </span>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {fiveSignsData[activeFiveSign].recommendation}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Col: Suitable Products for this Sign */}
                  <div className="space-y-3">
                    <span className="text-[11px] font-bold text-[#002D62] uppercase tracking-wider block">
                      Suitable Cetaphil Products
                    </span>
                    
                    <div className="space-y-3">
                      {fiveSignsData[activeFiveSign].recommendedProductIds.map(prodId => {
                        const matchedProduct = products.find(p => p.id === prodId);
                        if (!matchedProduct) return null;
                        return (
                          <div
                            key={matchedProduct.id}
                            onClick={() => handleProductClick(matchedProduct.id)}
                            className="bg-white p-3.5 rounded-xl border border-[#E2EBF1] hover:border-[#0082C8] transition-all cursor-pointer flex gap-3 items-center group shadow-2xs"
                          >
                            <img
                              src={matchedProduct.image}
                              alt={matchedProduct.name}
                              className="w-14 h-14 object-contain rounded-lg p-1 bg-white border border-gray-100 flex-shrink-0 group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-bold text-[#002D62] truncate group-hover:text-[#0082C8] transition-colors">
                                {matchedProduct.name}
                              </p>
                              <p className="text-[10px] text-gray-500 font-semibold mt-0.5">
                                Rs. {matchedProduct.price.toLocaleString()}
                              </p>
                              <div className="mt-1 flex items-center gap-2">
                                <button
                                  onClick={(e) => handleQuickAdd(matchedProduct, e)}
                                  className="text-[10px] font-bold text-[#0082C8] hover:underline inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <ShoppingCart className="w-3 h-3" />
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </section>

          {/* Interactive Feature 2: Daily Skincare Routine Builder (Morning & Evening) */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white border border-[#E2EBF1] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0082C8] uppercase tracking-wider mb-1">
                    <Layers className="w-4 h-4" />
                    <span>Dermatologist Application Order</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#002D62]">
                    How to Layer Your Daily Skincare Routine
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Layering in the correct order maximizes hydration retention and ensures active ingredients penetrate effectively.
                  </p>
                </div>

                {/* Morning vs Evening Tab Toggle */}
                <div className="flex bg-[#F4F8FA] p-1 rounded-xl border border-[#E2EBF1] self-start sm:self-auto">
                  <button
                    onClick={() => setActiveRoutineMode('morning')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeRoutineMode === 'morning'
                        ? 'bg-white text-[#002D62] shadow-xs'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    Morning Routine
                  </button>
                  <button
                    onClick={() => setActiveRoutineMode('evening')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeRoutineMode === 'evening'
                        ? 'bg-white text-[#002D62] shadow-xs'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-indigo-500" />
                    Evening Routine
                  </button>
                </div>
              </div>

              {/* Routine Steps Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {routineData[activeRoutineMode].map((stepItem) => {
                  const stepProduct = products.find(p => p.id === stepItem.productId);
                  return (
                    <div
                      key={stepItem.step}
                      className="bg-[#F8FAFC] border border-[#E2EBF1] rounded-2xl p-5 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-white bg-[#002D62] w-6 h-6 rounded-full flex items-center justify-center">
                            {stepItem.step}
                          </span>
                          <span className="text-[10px] font-bold text-[#0082C8] uppercase tracking-wider">
                            {stepItem.action}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-[#002D62]">
                            {stepItem.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                            {stepItem.desc}
                          </p>
                        </div>
                      </div>

                      {/* Matched Product */}
                      {stepProduct && (
                        <div className="pt-3 border-t border-gray-200/60 bg-white p-3 rounded-xl border border-gray-100 space-y-2">
                          <div
                            onClick={() => handleProductClick(stepProduct.id)}
                            className="flex items-center gap-2 cursor-pointer group"
                          >
                            <img
                              src={stepProduct.image}
                              alt={stepProduct.name}
                              className="w-10 h-10 object-contain rounded flex-shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold text-[#002D62] truncate group-hover:text-[#0082C8]">
                                {stepProduct.name}
                              </p>
                              <p className="text-[10px] text-gray-500 font-semibold">
                                Rs. {stepProduct.price.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={(e) => handleQuickAdd(stepProduct, e)}
                            className="w-full py-1.5 px-3 bg-[#EEF5F9] hover:bg-[#0082C8] text-[#0082C8] hover:text-white rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            Add Routine Step
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          </section>

          {/* Section 3: Skincare Tips Library (Category Filter + Editorial Cards) */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#002D62]">
                  Explore All Skincare Tips &amp; Guides
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Showing {filteredArticles.length} dermatologist-backed articles
                </p>
              </div>

              {/* Category Segmented Tabs */}
              <div className="flex overflow-x-auto pb-2 scrollbar-none gap-1.5 bg-[#F4F8FA] p-1.5 rounded-2xl border border-[#E2EBF1]">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-[#002D62] text-white shadow-xs'
                        : 'text-gray-600 hover:text-[#002D62] hover:bg-white/60'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            {filteredArticles.length === 0 ? (
              <div className="bg-white border border-[#E2EBF1] rounded-3xl p-12 text-center space-y-3">
                <p className="text-sm font-bold text-[#002D62]">No skincare guides match your search.</p>
                <p className="text-xs text-gray-500">Try searching for keywords like "barrier", "SPF", "baby", "acne", or reset your category filter.</p>
                <button
                  onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                  className="px-4 py-2 bg-[#002D62] text-white text-xs font-bold rounded-lg hover:bg-[#0082C8] cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map(article => {
                  // Resolve suitable products for this card preview
                  const cardProducts = (article.relatedProductIds || [])
                    .map(id => products.find(p => p.id === id))
                    .filter((p): p is Product => p !== undefined)
                    .slice(0, 2);

                  return (
                    <article
                      key={article.id}
                      onClick={() => { setSelectedArticleId(article.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="bg-white border border-[#E2EBF1] rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-xs"
                    >
                      <div>
                        {/* Article Visual Thumbnail */}
                        <div className="relative w-full h-52 overflow-hidden bg-gray-50">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#002D62] text-[10px] font-bold px-3 py-1 rounded-full border border-gray-100 shadow-xs">
                            {article.category}
                          </div>
                        </div>

                        {/* Article Text Content */}
                        <div className="p-6 space-y-3">
                          <div className="flex items-center gap-2 text-[11px] text-gray-500">
                            <span>{article.readTime}</span>
                            <span aria-hidden="true">·</span>
                            <span>{article.date}</span>
                          </div>

                          <h3 className="text-base font-bold text-[#002D62] group-hover:text-[#0082C8] transition-colors leading-snug line-clamp-2">
                            {article.title}
                          </h3>

                          <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                            {article.excerpt}
                          </p>
                        </div>
                      </div>

                      {/* Suitable Products Preview Strip & Read Action */}
                      <div className="px-6 pb-6 pt-2 border-t border-gray-50 space-y-3">
                        {cardProducts.length > 0 && (
                          <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-gray-100 space-y-1">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">
                              Recommended Suitable Products:
                            </span>
                            <div className="flex items-center gap-2">
                              {cardProducts.map(p => (
                                <div key={p.id} className="flex items-center gap-1.5 flex-1 min-w-0" title={p.name}>
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-6 h-6 object-contain rounded bg-white p-0.5 border border-gray-100"
                                    referrerPolicy="no-referrer"
                                  />
                                  <span className="text-[10px] font-bold text-[#002D62] truncate">
                                    {p.name.replace(/Cetaphil\s*/i, '')}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs font-bold text-[#0082C8] group-hover:text-[#002D62] transition-colors">
                          <span>Read Full Tip &amp; Routine</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

          </section>

          {/* Bottom Consultation CTA */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-[#002D62] to-[#004B87] text-white rounded-3xl p-8 sm:p-12 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl text-center md:text-left">
                <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-[#70D6FF] tracking-wider uppercase">
                  Personalized Recommendations
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Still Wondering Which Cetaphil Formula is Best For You?
                </h3>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                  Take our 2-minute clinical Skin Quiz or consult our AI Skincare Specialist for instant routine recommendations.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={() => { setCurrentView('quiz'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="px-6 py-3 bg-[#43B02A] hover:bg-[#3ba024] text-white text-xs font-bold rounded-full transition-all text-center cursor-pointer shadow-xs"
                >
                  Take Skin Quiz
                </button>
                <button
                  onClick={() => { setCurrentView('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="px-6 py-3 bg-white text-[#002D62] hover:bg-gray-100 text-xs font-bold rounded-full transition-all text-center cursor-pointer shadow-xs"
                >
                  Shop All Products
                </button>
              </div>
            </div>
          </section>

        </div>
      )}

    </div>
  );
}
