import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Plus, Minus, Trash2, ArrowRight, Percent, ShieldCheck } from 'lucide-react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onCheckout: (discountMultiplier: number, discountCodeUsed: string) => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveFromCart,
  onCheckout
}: CartSidebarProps) {
  const [promoCode, setPromoCode] = useState('');
  const [discountMultiplier, setDiscountMultiplier] = useState(1);
  const [appliedCode, setAppliedCode] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  // Real-time calculations
  const originalSubtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const subtotal = originalSubtotal * discountMultiplier;
  const discountAmount = originalSubtotal - subtotal;
  const shipping = subtotal === 0 ? 0 : subtotal >= 5000 ? 0 : 450;
  const tax = 0;
  const total = subtotal + shipping + tax;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (promoCode.trim().toUpperCase() === 'CLINICAL15') {
      setDiscountMultiplier(0.85); // 15% Off
      setAppliedCode('CLINICAL15');
      setPromoCode('');
    } else {
      setPromoError('Invalid clinic voucher code.');
    }
  };

  const handleRemovePromo = () => {
    setDiscountMultiplier(1);
    setAppliedCode('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E2EBF1] flex items-center justify-between bg-[#F4F8FA]">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#002D62] text-sm uppercase tracking-wider">Shopping Cart</span>
              <span className="bg-[#0082C8] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items
              </span>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 text-gray-500 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart items list scroll */}
          <div className="flex-grow p-6 overflow-y-auto space-y-6">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-16 h-16 bg-[#EEF5F9] rounded-full flex items-center justify-center text-[#0082C8] border border-[#D1E5F2]">
                  <Trash2 className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-[#002D62]">Your cart is empty</h3>
                <p className="text-xs text-gray-500 max-w-[240px]">
                  Explore our clinical shop or baby care range to select recommended formulas.
                </p>
                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#002D62] hover:bg-[#0082C8] text-white px-5 py-2.5 rounded-full cursor-pointer transition-colors"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.product.id} className="flex gap-4 border-b border-[#E2EBF1] pb-4 last:border-0 last:pb-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-contain rounded-xl border border-gray-100 flex-shrink-0 bg-white"
                  />
                  
                  <div className="flex-grow space-y-1">
                    <p className="text-xs font-bold text-[#002D62] line-clamp-2">{item.product.name}</p>
                    <p className="text-[10px] text-[#0082C8] font-bold capitalize">{item.product.category}</p>
                    
                    <div className="flex justify-between items-center pt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded-full bg-white p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full cursor-pointer"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-[#002D62]">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full cursor-pointer"
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-[#002D62]">Rs. {(item.product.price * item.quantity).toLocaleString()}</span>
                        <button
                          onClick={() => onRemoveFromCart(item.product.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {item.product.stock <= 5 && (
                      <p className="text-[9px] text-amber-700 font-bold uppercase">Only {item.product.stock} left in clinical inventory</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout calculations summary block */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-[#F4F8FA] border-t border-[#E2EBF1] space-y-4">
              
              {/* Promo code form */}
              {appliedCode ? (
                <div className="bg-[#E6F4EA] border border-[#C8E6C9] text-[#286c00] text-xs font-bold px-3 py-2 rounded-xl flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Percent className="w-4 h-4" />
                    CLINICAL15 Applied (15% Off)
                  </span>
                  <button onClick={handleRemovePromo} className="text-red-500 hover:underline cursor-pointer">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Clinic Voucher Code..."
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-grow px-3.5 py-2 border border-[#E2EBF1] bg-white rounded-full text-xs focus:ring-2 focus:ring-[#0082C8] focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#002D62] hover:bg-[#0082C8] text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="text-[10px] text-red-500 font-bold">{promoError}</p>}
                </form>
              )}

              {/* Cost break down */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Cart Subtotal</span>
                  <span>Rs. {originalSubtotal.toLocaleString()}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#43B02A] font-bold">
                    <span>Clinical Voucher Discount (15%)</span>
                    <span>-Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-500">
                  <span>Packaging &amp; Delivery</span>
                  <span className="font-bold">{shipping === 0 ? 'FREE' : `Rs. ${shipping.toLocaleString()}`}</span>
                </div>

                {shipping > 0 && (
                  <p className="text-[10px] text-[#0082C8] font-medium">
                    *Add Rs. {(5000 - subtotal).toLocaleString()} more to qualify for FREE delivery!
                  </p>
                )}

                <div className="border-t border-[#E2EBF1] my-2 pt-2 flex justify-between text-sm font-black text-[#002D62]">
                  <span>Total Due</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => onCheckout(discountMultiplier, appliedCode)}
                className="w-full py-3.5 bg-[#002D62] hover:bg-[#0082C8] text-white font-bold text-xs rounded-full flex items-center justify-center gap-2 shadow-md transition-all uppercase tracking-wider cursor-pointer"
              >
                Proceed to Checkout
                <ArrowRight className="w-4.5 h-4.5" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#43B02A]" />
                FDA compliant formulations. SSL Secure checkout.
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
