import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { ShieldCheck, ChevronLeft, CheckCircle2, Lock, Sparkles, ShoppingBag, RefreshCw, Banknote, Truck } from 'lucide-react';

interface CheckoutProps {
  cartItems: CartItem[];
  discountMultiplier: number;
  discountCodeUsed: string;
  onOrderPlaced: (order: Order) => void;
  setCurrentView: (view: string) => void;
}

export default function Checkout({
  cartItems,
  discountMultiplier,
  discountCodeUsed,
  onOrderPlaced,
  setCurrentView
}: CheckoutProps) {
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'paypal' | 'apple'>('cod');

  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);

  // Math variables
  const originalSubtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const subtotal = originalSubtotal * discountMultiplier;
  const discountAmount = originalSubtotal - subtotal;
  const shipping = subtotal >= 5000 ? 0 : 450;
  const tax = 0;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const orderPayload = {
      items: cartItems.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image
      })),
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress: shippingDetails,
      paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'paypal' ? 'PayPal' : 'Apple Pay'
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      if (!res.ok) throw new Error("Could not place order.");
      const data = await res.json();
      
      setSuccessOrder(data.order);
      onOrderPlaced(data.order);
    } catch (err) {
      alert("Checkout failed. Please check details and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (successOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-[#EEF5F9] text-[#43B02A] rounded-full flex items-center justify-center mx-auto border border-[#C8E6C9]">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <div className="space-y-2">
          <span className="text-[10px] font-extrabold text-white bg-[#43B02A] px-3 py-1 rounded-full uppercase tracking-wider">
            Order Confirmed
          </span>
          <h1 className="text-3xl font-extrabold text-[#002D62]">Order Placed Successfully!</h1>
          <p className="text-xs text-gray-500">
            Thank you for purchasing your Cetaphil skincare regimen. Your order has been registered under invoice **{successOrder.id}**.
          </p>
        </div>

        <div className="bg-white border border-[#E2EBF1] rounded-2xl p-6 text-left space-y-4 max-w-md mx-auto shadow-xs">
          <p className="text-xs font-bold text-[#002D62] border-b border-[#E2EBF1] pb-2">Delivery Details</p>
          <div className="space-y-2 text-xs text-gray-600">
            <p><span className="font-semibold text-gray-700">Recipient:</span> {successOrder.shippingAddress.fullName}</p>
            <p><span className="font-semibold text-gray-700">Address:</span> {successOrder.shippingAddress.address}, {successOrder.shippingAddress.city}, {successOrder.shippingAddress.zipCode}</p>
            <p><span className="font-semibold text-gray-700">Email confirmation sent to:</span> {successOrder.shippingAddress.email}</p>
            {successOrder.shippingAddress.phone && (
              <p><span className="font-semibold text-gray-700">Phone:</span> {successOrder.shippingAddress.phone}</p>
            )}
            <p className="border-t border-[#E2EBF1] pt-3 font-bold text-[#002D62] flex justify-between text-sm">
              <span>Total Paid:</span>
              <span>Rs. {successOrder.total.toLocaleString()}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setCurrentView('profile')}
            className="px-6 py-2.5 bg-[#002D62] hover:bg-[#0082C8] text-white font-bold text-xs rounded-full shadow-xs transition-colors cursor-pointer"
          >
            Track My Regimen
          </button>
          <button
            onClick={() => setCurrentView('shop')}
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-full transition-colors cursor-pointer"
          >
            Return to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Back to cart link */}
      <button
        onClick={() => setCurrentView('shop')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002D62] hover:text-[#0082C8] transition-colors mb-6 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        Cancel &amp; Continue Shopping
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Checkout Forms (8 cols) */}
        <form onSubmit={handlePlaceOrderSubmit} className="lg:col-span-7 space-y-6">
          
          {/* Shipping Segment */}
          <div className="bg-white border border-[#E2EBF1] rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
            <h2 className="text-base font-extrabold text-[#002D62] border-b border-[#E2EBF1] pb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#EEF5F9] text-[#0082C8] text-xs font-black rounded-full flex items-center justify-center border border-[#D1E5F2]">1</span>
              Shipping &amp; Delivery Address
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1 col-span-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Full Recipient Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingDetails.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-[#E2EBF1] rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0082C8] focus:border-[#0082C8]"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1 col-span-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Email (for updates)</label>
                <input
                  type="email"
                  name="email"
                  value={shippingDetails.email}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-[#E2EBF1] rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0082C8] focus:border-[#0082C8]"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1 col-span-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Contact Phone Number (for delivery coordination)</label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingDetails.phone}
                  onChange={handleInputChange}
                  placeholder="+94 07 000 0000"
                  className="w-full px-3.5 py-2.5 border border-[#E2EBF1] rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0082C8] focus:border-[#0082C8]"
                  required
                />
              </div>

              {/* Address */}
              <div className="space-y-1 col-span-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={shippingDetails.address}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-[#E2EBF1] rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0082C8] focus:border-[#0082C8]"
                  required
                />
              </div>

              {/* City */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">City</label>
                <input
                  type="text"
                  name="city"
                  value={shippingDetails.city}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-[#E2EBF1] rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0082C8] focus:border-[#0082C8]"
                  required
                />
              </div>

              {/* ZIP */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">ZIP / Postal Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={shippingDetails.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-[#E2EBF1] rounded-xl text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-[#0082C8] focus:border-[#0082C8]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white border border-[#E2EBF1] rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
            <h2 className="text-base font-extrabold text-[#002D62] border-b border-[#E2EBF1] pb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#EEF5F9] text-[#0082C8] text-xs font-black rounded-full flex items-center justify-center border border-[#D1E5F2]">2</span>
              Payment Method
            </h2>

            {/* Selector Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3.5 border rounded-2xl flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'cod' ? 'border-[#0082C8] bg-[#EEF5F9] text-[#002D62] shadow-xs' : 'border-[#E2EBF1] text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Banknote className="w-5 h-5 text-[#43B02A]" />
                <span className="text-[11px] font-bold">Cash on Delivery</span>
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`p-3.5 border rounded-2xl flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'paypal' ? 'border-[#0082C8] bg-[#EEF5F9] text-[#002D62] shadow-xs' : 'border-[#E2EBF1] text-gray-500 hover:bg-gray-50'
                }`}
              >
                <ShoppingBag className="w-5 h-5 text-[#0082C8]" />
                <span className="text-[11px] font-bold">PayPal</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple')}
                className={`p-3.5 border rounded-2xl flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'apple' ? 'border-[#0082C8] bg-[#EEF5F9] text-[#002D62] shadow-xs' : 'border-[#E2EBF1] text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Sparkles className="w-5 h-5 text-[#002D62]" />
                <span className="text-[11px] font-bold">Apple Pay</span>
              </button>
            </div>

            {/* Payment Context Fields */}
            {paymentMethod === 'cod' ? (
              <div className="p-4 bg-[#EEF5F9] rounded-2xl border border-[#D1E5F2] text-xs text-[#002D62] leading-relaxed space-y-2">
                <p className="font-extrabold flex items-center gap-1.5 text-[#43B02A]">
                  <Truck className="w-4 h-4 text-[#43B02A]" />
                  Cash on Delivery Selected
                </p>
                <p className="text-gray-600 text-[11px]">
                  You will pay in cash directly to our delivery courier upon delivery at your doorstep. Please make sure to have the exact amount of <strong className="text-[#002D62]">Rs. {total.toLocaleString()}</strong> ready when your package arrives.
                </p>
                <p className="text-gray-400 text-[10px] italic">
                  *Delivery couriers do not carry excess change. No advanced card transaction required.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs text-gray-500 text-center leading-relaxed">
                You will be redirected to complete the secure payment authorization window after clicking "Place Order".
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#002D62] hover:bg-[#0082C8] text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Authorizing Order...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Place Order (Rs. {total.toLocaleString()})
              </>
            )}
          </button>
        </form>

        {/* Cart Summary Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E2EBF1] rounded-3xl p-6 space-y-4 sticky top-24 shadow-xs">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-[#E2EBF1] pb-2">Order Summary</h3>
            
            {/* items row */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cartItems.map(item => (
                <div key={item.product.id} className="flex gap-3 text-xs">
                  <img src={item.product.image} alt={item.product.name} referrerPolicy="no-referrer" className="w-12 h-12 object-contain rounded-xl border border-[#E2EBF1] p-1 bg-white" />
                  <div className="flex-grow min-w-0">
                    <p className="font-bold text-[#002D62] truncate">{item.product.name}</p>
                    <p className="text-[10px] text-gray-400 font-mono">Qty: {item.quantity} x Rs. {item.product.price.toLocaleString()}</p>
                  </div>
                  <span className="font-bold text-[#002D62]">Rs. {(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-[#E2EBF1] pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>Rs. {originalSubtotal.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#43B02A] font-bold">
                  <span>Discount ({discountCodeUsed})</span>
                  <span>-Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-[#43B02A] font-bold">FREE</span> : `Rs. ${shipping.toLocaleString()}`}</span>
              </div>

              <div className="border-t border-[#E2EBF1] pt-3 flex justify-between text-base font-extrabold text-[#002D62]">
                <span>Grand Total Due</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Trust badge */}
            <div className="bg-[#EEF5F9] border border-[#D1E5F2] rounded-2xl p-4 text-[10px] text-gray-600 leading-relaxed space-y-1">
              <p className="font-bold text-[#002D62] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#43B02A]" />
                Cetaphil Authentic &amp; Sealed Guarantee
              </p>
              <p>
                100% authentic dermatological skincare products imported with original safety seals and manufacturer verification.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
