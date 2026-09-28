import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { Heart, Sparkles, ShieldCheck, CheckCircle2, ShoppingCart, Star, Droplets, Baby, Award, ArrowRight } from 'lucide-react';

interface BabyProductsPageProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
  setSelectedProductId: (id: string | null) => void;
  setCurrentView: (view: string) => void;
}

export default function BabyProductsPage({
  products,
  onAddToCart,
  setSelectedProductId,
  setCurrentView
}: BabyProductsPageProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Filter products for baby care category
  const babyProducts = useMemo(() => {
    return products.filter(p => 
      p.category === 'baby' || 
      p.name.toLowerCase().includes('baby') || 
      p.skinConcern.some(c => c.toLowerCase().includes('baby'))
    );
  }, [products]);

  const filteredBabyProducts = useMemo(() => {
    if (selectedSubcategory === 'lotion') {
      return babyProducts.filter(p => p.name.toLowerCase().includes('lotion'));
    }
    if (selectedSubcategory === 'shampoo') {
      return babyProducts.filter(p => p.name.toLowerCase().includes('shampoo') || p.name.toLowerCase().includes('wash'));
    }
    if (selectedSubcategory === 'calendula') {
      return babyProducts.filter(p => p.name.toLowerCase().includes('calendula'));
    }
    return babyProducts;
  }, [babyProducts, selectedSubcategory]);

  const handleCardClick = (id: string) => {
    setSelectedProductId(id);
    setCurrentView('pdp');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickAdd = (product: Product) => {
    onAddToCart(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 2000);
  };

  return (
    <div className="bg-[#fbfcfe] pb-20">
      
      {/* 1. CLINICAL BABY CARE HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EEF5F9] via-[#F4F8FA] to-white border-b border-[#E2EBF1] py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Clinical Title & Badges */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-[#0082C8] bg-[#EEF5F9] border border-[#D1E5F2]">
                <ShieldCheck className="w-4 h-4 text-[#0082C8]" />
                Pediatrician &amp; Dermatologist Recommended
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#002D62] tracking-tight leading-tight">
                Gentle Clinical Care for <br />
                <span className="text-[#0082C8]">Delicate Baby Skin</span>
              </h1>
              
              <p className="text-gray-600 text-sm sm:text-base max-w-xl leading-relaxed">
                A baby’s skin barrier is up to 30% thinner than adult skin and loses hydration twice as quickly. Cetaphil Baby™ combines soothing organic calendula flower extract, sweet almond oil, and tear-free cleansing to nourish and protect from Day 1.
              </p>

              {/* Trust Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl border border-[#E2EBF1] shadow-xs text-center">
                  <Droplets className="w-5 h-5 mx-auto text-[#0082C8] mb-1.5" />
                  <p className="text-[11px] font-extrabold text-[#002D62]">24H Moisture</p>
                  <p className="text-[10px] text-gray-500">Continuous barrier lock</p>
                </div>
                <div className="bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl border border-[#E2EBF1] shadow-xs text-center">
                  <Sparkles className="w-5 h-5 mx-auto text-[#43B02A] mb-1.5" />
                  <p className="text-[11px] font-extrabold text-[#002D62]">Organic Calendula</p>
                  <p className="text-[10px] text-gray-500">Soothes irritation</p>
                </div>
                <div className="bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl border border-[#E2EBF1] shadow-xs text-center">
                  <Heart className="w-5 h-5 mx-auto text-rose-500 mb-1.5" />
                  <p className="text-[11px] font-extrabold text-[#002D62]">100% Tear-Free</p>
                  <p className="text-[10px] text-gray-500">Gentle on infant eyes</p>
                </div>
                <div className="bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl border border-[#E2EBF1] shadow-xs text-center">
                  <Baby className="w-5 h-5 mx-auto text-amber-600 mb-1.5" />
                  <p className="text-[11px] font-extrabold text-[#002D62]">Safe from Day 1</p>
                  <p className="text-[10px] text-gray-500">Newborn approved</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('baby-products-grid');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 bg-[#002D62] hover:bg-[#0082C8] text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  Browse Baby Formulations
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('pediatric-routine');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 bg-white hover:bg-[#EEF5F9] text-[#002D62] border border-[#002D62] font-extrabold text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer"
                >
                  View Baby Skin Routine
                </button>
              </div>
            </div>

            {/* Right Column: Hero Visual Feature */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-[4/3] bg-gradient-to-tr from-[#EEF5F9] to-amber-50">
                <img
                  src="https://i.imgur.com/5not0r2.png"
                  alt="Cetaphil Baby Daily Care"
                  className="w-full h-full object-contain p-6 transform hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-blue-100 shadow-xs flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span className="text-[10px] font-extrabold text-[#002D62] uppercase tracking-wide">
                    #1 Pediatrician Choice
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-blue-50 shadow-xs text-left">
                  <p className="text-xs font-bold text-[#002D62]">0% Parabens · 0% Mineral Oils · 0% Colorants</p>
                  <p className="text-[10px] text-gray-500">Clinically tested hypoallergenic formula for newborn &amp; infant safety.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CATEGORY TABS & FILTER BAR WITH IMAGES */}
      <section id="baby-products-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#0082C8]">
              Certified Clinical Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002D62] tracking-tight">
              Cetaphil Baby™ Range in Sri Lanka
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              Guaranteed 100% authentic dermatological infant care imported with temperature control.
            </p>
          </div>

          <div className="text-xs font-bold text-gray-500 bg-white border border-[#E2EBF1] px-4 py-2 rounded-full">
            Showing <span className="text-[#002D62] font-black">{filteredBabyProducts.length}</span> Baby Formulations
          </div>
        </div>

        {/* Visual Filter Tabs with Icons & Images */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          
          <button
            onClick={() => setSelectedSubcategory('all')}
            className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
              selectedSubcategory === 'all'
                ? 'bg-white border-[#0082C8] ring-2 ring-[#0082C8]/15 shadow-sm'
                : 'bg-white/80 border-[#E2EBF1] hover:border-gray-300 hover:bg-white'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-[#EEF5F9] flex items-center justify-center shrink-0 border border-[#D1E5F2] overflow-hidden">
              <Baby className="w-6 h-6 text-[#0082C8]" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-[#002D62]">All Baby Care</p>
              <p className="text-[10px] text-gray-500">{babyProducts.length} Formulations</p>
            </div>
          </button>

          <button
            onClick={() => setSelectedSubcategory('lotion')}
            className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
              selectedSubcategory === 'lotion'
                ? 'bg-white border-[#0082C8] ring-2 ring-[#0082C8]/15 shadow-sm'
                : 'bg-white/80 border-[#E2EBF1] hover:border-gray-300 hover:bg-white'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden">
              <img
                src="https://i.imgur.com/5not0r2.png"
                alt="Lotions"
                className="w-full h-full object-contain p-1"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <p className="text-xs font-extrabold text-[#002D62]">Baby Lotions</p>
              <p className="text-[10px] text-gray-500">24H Deep Moisture</p>
            </div>
          </button>

          <button
            onClick={() => setSelectedSubcategory('calendula')}
            className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
              selectedSubcategory === 'calendula'
                ? 'bg-white border-[#0082C8] ring-2 ring-[#0082C8]/15 shadow-sm'
                : 'bg-white/80 border-[#E2EBF1] hover:border-gray-300 hover:bg-white'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-200 overflow-hidden">
              <img
                src="https://i.imgur.com/HPN0BfO.png"
                alt="Calendula"
                className="w-full h-full object-contain p-1"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <p className="text-xs font-extrabold text-[#002D62]">Organic Calendula</p>
              <p className="text-[10px] text-gray-500">Calming Botanical</p>
            </div>
          </button>

          <button
            onClick={() => setSelectedSubcategory('shampoo')}
            className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
              selectedSubcategory === 'shampoo'
                ? 'bg-white border-[#0082C8] ring-2 ring-[#0082C8]/15 shadow-sm'
                : 'bg-white/80 border-[#E2EBF1] hover:border-gray-300 hover:bg-white'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden">
              <img
                src="https://i.imgur.com/Wm9vTlr.png"
                alt="Shampoo"
                className="w-full h-full object-contain p-1"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <p className="text-xs font-extrabold text-[#002D62]">Tear-Free Shampoo</p>
              <p className="text-[10px] text-gray-500">Chamomile Scalp Care</p>
            </div>
          </button>

        </div>

        {/* 3. PRODUCT CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBabyProducts.map(product => {
            const isAdded = addedProductId === product.id;
            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-[#E2EBF1] hover:border-[#0082C8] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group overflow-hidden"
              >
                {/* Product Image Header with Tag */}
                <div className="relative aspect-square bg-[#F4F8FA] p-6 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-500 cursor-pointer"
                    onClick={() => handleCardClick(product.id)}
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Floating badge */}
                  {product.tag && (
                    <span className="absolute top-4 left-4 px-3 py-1 text-[10px] font-extrabold text-white bg-[#0082C8] rounded-full shadow-xs uppercase tracking-wider">
                      {product.tag}
                    </span>
                  )}

                  <span className="absolute top-4 right-4 px-2.5 py-0.5 text-[9px] font-extrabold text-[#43B02A] bg-[#E6F4EA] border border-[#C8E6C9] rounded-full uppercase">
                    Safe from Day 1
                  </span>

                  {/* Quick Action Overlay */}
                  <button
                    onClick={() => handleCardClick(product.id)}
                    className="absolute bottom-4 left-6 right-6 bg-white/95 backdrop-blur-md text-[#002D62] hover:bg-white text-xs font-extrabold py-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider text-center cursor-pointer"
                  >
                    View Clinical Formula
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                  
                  <div className="space-y-2">
                    {/* Ratings */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-gray-700">5.0</span>
                      <span className="text-xs text-gray-400">({product.reviewsCount || 160}+ reviews)</span>
                    </div>

                    {/* Product Name */}
                    <h3
                      onClick={() => handleCardClick(product.id)}
                      className="text-base font-extrabold text-[#002D62] hover:text-[#0082C8] transition-colors line-clamp-2 cursor-pointer leading-snug"
                    >
                      {product.name}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Ingredient tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {product.ingredients.slice(0, 3).map((ing, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 text-[10px] font-semibold bg-[#EEF5F9] text-[#0082C8] rounded-full border border-[#D1E5F2]">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Add to Cart button */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Price in Sri Lanka</span>
                      <span className="text-xl font-black text-[#002D62]">
                        Rs. {product.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleQuickAdd(product)}
                      disabled={isAdded}
                      className={`px-5 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                        isAdded
                          ? 'bg-[#43B02A] text-white'
                          : 'bg-[#002D62] hover:bg-[#0082C8] text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Added to Bag
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. PEDIATRICIAN RECOMMENDED 3-STEP INFANT SKIN ROUTINE */}
      <section id="pediatric-routine" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white rounded-3xl border border-[#E2EBF1] shadow-xs p-8 sm:p-12">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="px-4 py-1 text-[10px] font-black uppercase tracking-widest text-[#43B02A] bg-[#E6F4EA] rounded-full border border-[#C8E6C9]">
              Clinical Guidelines
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002D62]">
              The 3-Step Daily Baby Skincare Protocol
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Dermatologists and pediatricians advise avoiding perfumed soaps and harsh scrubs. Follow this gentle physiological ritual daily:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#EEF5F9]/60 border border-[#D1E5F2] flex flex-col items-start space-y-3">
              <span className="w-8 h-8 rounded-full bg-[#002D62] text-white font-black text-sm flex items-center justify-center">
                1
              </span>
              <h3 className="text-base font-bold text-[#002D62]">Tear-Free Gentle Bath</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Use <strong>Cetaphil Baby Shampoo</strong> with natural chamomile. Cleanse scalp and hair in lukewarm water without stinging the eyes or stripping natural scalp sebum.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-100 flex flex-col items-start space-y-3">
              <span className="w-8 h-8 rounded-full bg-[#002D62] text-white font-black text-sm flex items-center justify-center">
                2
              </span>
              <h3 className="text-base font-bold text-[#002D62]">3-Minute Hydration Lock</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Gently pat baby dry with a soft cotton towel. Within 3 minutes while skin is still slightly damp, apply <strong>Cetaphil Baby Organic Calendula Lotion</strong> to seal in moisture.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#E6F4EA]/60 border border-[#C8E6C9] flex flex-col items-start space-y-3">
              <span className="w-8 h-8 rounded-full bg-[#002D62] text-white font-black text-sm flex items-center justify-center">
                3
              </span>
              <h3 className="text-base font-bold text-[#002D62]">All-Day Barrier Defense</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Apply <strong>Cetaphil Baby Daily Lotion with Shea Butter &amp; Olive Oil</strong> to trouble areas (elbows, knees, cheeks) to defend against chafing and dry air conditioned environments.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. SRI LANKAN PARENT REVIEWS & TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-[#002D62] to-[#0082C8] rounded-3xl text-white p-8 sm:p-12 shadow-xl">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#86efac]">
              Trusted by Sri Lankan Families
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              What Sri Lankan Parents Say
            </h2>
            <p className="text-xs text-blue-100">
              Verified feedback from mothers and fathers across Colombo, Kandy, Galle, and islandwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-6 rounded-2xl space-y-4">
              <div className="flex text-amber-300">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-white/90 leading-relaxed italic">
                "බබා ඉපදුන දවස්වල ඉඳන්ම පාවිච්චි කරන්න පුළුවන් සුපිරි lotion එකක්... බබාගෙ හමේ තියෙන වියළි ගතිය සම්පූර්ණයෙන්ම නැතිවෙලා හම ගොඩක් soft වුණා."
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span className="font-bold text-white">Dilrukshi Gamage</span>
                <span className="text-green-300 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Mother
                </span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-6 rounded-2xl space-y-4">
              <div className="flex text-amber-300">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-white/90 leading-relaxed italic">
                "Hands down the best lotion for babies with dry or sensitive skin. It absorbs almost instantly without leaving any greasy film, and it keeps my baby's skin smooth and well-moisturized all day long."
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span className="font-bold text-white">Amanda Ratnayake</span>
                <span className="text-green-300 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Buyer
                </span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-6 rounded-2xl space-y-4">
              <div className="flex text-amber-300">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-white/90 leading-relaxed italic">
                "මගෙ බබාට ගොඩක් හොදට ගැළපුණා. සුවඳත් හරිම සූදින්, කොණ්ඩෙ හරිම සිනිඳු වෙනවා. ඇස් වලට ගියත් රිදෙන්නෙ නැති නිසා බබා බය නැතුව නානවා."
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span className="font-bold text-white">Nadeeka Priyadarshani</span>
                <span className="text-green-300 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Mother
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. PEDIATRIC SAFETY ASSURANCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center">
        <div className="bg-white rounded-3xl border border-[#E2EBF1] p-8 sm:p-10 shadow-xs">
          <h3 className="text-lg font-extrabold text-[#002D62] mb-2">The Cetaphil Baby™ Safety Guarantee</h3>
          <p className="text-xs text-gray-500 max-w-xl mx-auto mb-6">
            Tested under strict pediatric, dermatological, and ophthalmological controls to guarantee safety on infant barriers.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-xs font-bold text-gray-700">
            <span className="flex items-center gap-1.5 bg-[#EEF5F9] px-4 py-2 rounded-full border border-[#D1E5F2]">
              <CheckCircle2 className="w-4 h-4 text-[#43B02A]" /> 0% Parabens
            </span>
            <span className="flex items-center gap-1.5 bg-[#EEF5F9] px-4 py-2 rounded-full border border-[#D1E5F2]">
              <CheckCircle2 className="w-4 h-4 text-[#43B02A]" /> 0% Mineral Oils
            </span>
            <span className="flex items-center gap-1.5 bg-[#EEF5F9] px-4 py-2 rounded-full border border-[#D1E5F2]">
              <CheckCircle2 className="w-4 h-4 text-[#43B02A]" /> 0% Synthetic Colorants
            </span>
            <span className="flex items-center gap-1.5 bg-[#EEF5F9] px-4 py-2 rounded-full border border-[#D1E5F2]">
              <CheckCircle2 className="w-4 h-4 text-[#43B02A]" /> 100% Tear-Free
            </span>
            <span className="flex items-center gap-1.5 bg-[#EEF5F9] px-4 py-2 rounded-full border border-[#D1E5F2]">
              <CheckCircle2 className="w-4 h-4 text-[#43B02A]" /> Hypoallergenic pH Balanced
            </span>
          </div>
        </div>
      </section>

    </div>
  );
}
