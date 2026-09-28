import React from 'react';

interface FooterProps {
  setCurrentView: (view: string) => void;
  setSelectedProductId: (id: string | null) => void;
}

export default function Footer({ setCurrentView, setSelectedProductId }: FooterProps) {
  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setSelectedProductId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#002D62] text-gray-200 mt-auto border-t border-[#001F44]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <button
              onClick={() => handleNavClick('shop')}
              className="flex items-center gap-2 hover:opacity-90 transition-opacity text-left cursor-pointer"
            >
              <div className="bg-white px-3 py-1.5 rounded-xl inline-flex items-center shadow-xs">
                <img
                  src="https://i.imgur.com/DCJMlkw.png"
                  alt="Cetaphil"
                  className="h-8 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </button>
            <p className="text-xs text-blue-100/80 leading-relaxed">
              #1 Doctor Recommended Sensitive Skincare Brand. Defends against the 5 signs of skin sensitivity with clinically proven formulations.
            </p>
            <p className="text-xs text-blue-200/60">
              © {new Date().getFullYear()} Galderma Laboratories, L.P. / Cetaphil Sri Lanka.
            </p>
          </div>

          {/* Clinical Systems */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Cetaphil Care</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => handleNavClick('shop')} className="hover:text-white hover:underline transition-all text-blue-100">
                  Shop All Products
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('baby')} className="hover:text-white hover:underline transition-all text-[#70D6FF] font-medium">
                  Cetaphil Baby™ Care
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('quiz')} className="hover:text-white hover:underline transition-all text-[#5CBA47] font-medium">
                  Take the Skin Quiz
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('consult')} className="hover:text-white hover:underline transition-all text-blue-100">
                  AI Skincare Consultant
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('tips')} className="hover:text-white hover:underline transition-all text-blue-100">
                  Skincare Tips &amp; Routines
                </button>
              </li>
            </ul>
          </div>

          {/* Safety & Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">5 Signs Defense</h4>
            <ul className="space-y-2 text-xs text-blue-100/90">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#43B02A]" />
                <span>Weakened Skin Barrier</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#43B02A]" />
                <span>Dryness &amp; Dehydration</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#43B02A]" />
                <span>Irritation &amp; Redness</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#43B02A]" />
                <span>Roughness &amp; Uneven Texture</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#43B02A]" />
                <span>Tightness &amp; Discomfort</span>
              </li>
            </ul>
          </div>

          {/* Clinic Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Clinical Trust</h4>
            <p className="text-[10px] text-blue-200/70 leading-relaxed">
              Formulated with dermatologist-backed ingredients like Niacinamide (Vitamin B3), Panthenol (Pro-Vitamin B5), and Hydrating Glycerin to preserve the skin's essential moisture barrier.
            </p>
            <div className="flex gap-4 pt-2">
              <span className="text-xs font-semibold text-white">SSL 256-Bit Secure</span>
              <span className="text-xs font-semibold text-[#5CBA47]">Islandwide Delivery</span>
            </div>
          </div>

        </div>

        {/* Bottom policies */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-blue-200/70">
          <div className="flex flex-wrap justify-center gap-4">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Shipping &amp; Returns</span>
            <span className="hover:text-white cursor-pointer">Accessibility</span>
          </div>
          <p className="text-[10px] text-blue-200/50">
            Cetaphil® is a registered trademark of Galderma S.A.
          </p>
        </div>

      </div>
    </footer>
  );
}
