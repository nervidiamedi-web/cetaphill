import React, { useState } from 'react';
import { Order } from '../types';
import { ShoppingBag, ChevronRight, RefreshCw, CheckCircle2, ShieldCheck, Mail, Clock } from 'lucide-react';

interface UserDashboardProps {
  orders: Order[];
  onReorder: (id: string) => Promise<void>;
  setCurrentView: (view: string) => void;
  setSelectedProductId: (id: string | null) => void;
}

export default function UserDashboard({
  orders,
  onReorder,
  setCurrentView,
  setSelectedProductId
}: UserDashboardProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  // Clinical profile variables
  const patientEmail = "nervidiamedi@gmail.com";
  const patientName = "Nervidia Medi";
  const mainConcern = "Sensitive Skin & Dryness";

  const handleReorderClick = async (id: string) => {
    setReorderingId(id);
    try {
      await onReorder(id);
      alert("Past regimen reordered successfully! A new clinical invoice is active.");
    } catch (err) {
      alert("Failed to process reorder. One or more items might be out of stock.");
    } finally {
      setReorderingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* 1. HEALTH PROFILE HEADER CARD */}
      <div className="bg-white border border-[#E2EBF1] rounded-3xl p-6 sm:p-8 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="space-y-2 md:col-span-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold text-[#0082C8] bg-[#EEF5F9] border border-[#D1E5F2] uppercase tracking-wider">
            Verified Customer Profile
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002D62] leading-tight">
            Customer Portal: {patientName}
          </h1>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500 pt-1">
            <span className="flex items-center gap-1">
              <Mail className="w-4 h-4 text-gray-400" />
              {patientEmail}
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#43B02A]" />
              Skin Focus: <strong className="text-[#002D62] font-bold">{mainConcern}</strong>
            </span>
          </div>
        </div>

        <div className="bg-[#F4F8FA] border border-[#E2EBF1] p-5 rounded-2xl space-y-2">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Orders &amp; Regimens</p>
          <div className="flex justify-between items-center text-xs text-gray-600 font-medium">
            <span>Total Orders Placed:</span>
            <span className="font-extrabold text-[#002D62]">{orders.length}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-600 font-medium">
            <span>In Transit:</span>
            <span className="font-extrabold text-[#0082C8]">{orders.filter(o => o.status === 'Pending' || o.status === 'Shipped').length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. ORDER LISTING (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-extrabold text-[#002D62] border-b border-[#E2EBF1] pb-2">Order History</h2>
          
          {orders.length === 0 ? (
            <div className="bg-white border border-[#E2EBF1] rounded-3xl p-12 text-center space-y-4 shadow-xs">
              <div className="w-14 h-14 bg-[#EEF5F9] text-[#0082C8] rounded-full flex items-center justify-center mx-auto border border-[#D1E5F2]">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="text-base font-extrabold text-[#002D62]">No orders placed yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Explore our dermatologist-recommended Cetaphil products to start your healthy skin regimen today!
              </p>
              <button
                onClick={() => setCurrentView('shop')}
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#002D62] hover:bg-[#0082C8] text-white px-6 py-2.5 rounded-full transition-colors cursor-pointer"
              >
                Go to Shop
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`bg-white border rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer transition-all ${
                    selectedOrderId === order.id
                      ? 'border-[#0082C8] ring-2 ring-[#0082C8]/20 shadow-xs'
                      : 'border-[#E2EBF1] hover:border-[#0082C8]/50 hover:bg-[#EEF5F9]/30'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-[#002D62]">Order {order.id}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-mono">
                      {new Date(order.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-xs text-gray-600 font-medium">
                      {order.items.length} Products ({order.items.map(i => i.name.split(' ')[0]).join(', ')})
                    </p>
                  </div>

                  <div className="flex items-center gap-4 justify-between w-full sm:w-auto">
                    <span className="text-sm font-extrabold text-[#002D62]">Rs. {order.total.toLocaleString()}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 hidden sm:block" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. ORDER DETAILED INFO PANEL (1 col) */}
        <div className="space-y-4">
          <h2 className="text-base font-extrabold text-[#002D62] border-b border-[#E2EBF1] pb-2">Order Details</h2>
          
          {!selectedOrder ? (
            <div className="bg-white border border-[#E2EBF1] rounded-2xl p-6 text-center text-xs text-gray-400">
              Select an order from the list to view tracking, items list, and re-order.
            </div>
          ) : (
            <div className="bg-white border border-[#E2EBF1] rounded-3xl p-6 space-y-5 shadow-xs">
              
              {/* Heading */}
              <div className="border-b border-[#E2EBF1] pb-3 flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Cetaphil Order</p>
                  <p className="text-sm font-extrabold text-[#002D62]">{selectedOrder.id}</p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>

              {/* Steps status indicator tracker */}
              <div className="space-y-3 bg-[#F4F8FA] p-4 rounded-2xl border border-[#E2EBF1]">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#0082C8]" />
                  Delivery Status
                </p>
                
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className={selectedOrder.status === 'Pending' || selectedOrder.status === 'Shipped' || selectedOrder.status === 'Delivered' ? 'text-[#43B02A]' : 'text-gray-300'}>
                    ✓ Confirmed
                  </span>
                  <span className={selectedOrder.status === 'Shipped' || selectedOrder.status === 'Delivered' ? 'text-[#43B02A]' : 'text-gray-300'}>
                    {selectedOrder.status === 'Shipped' || selectedOrder.status === 'Delivered' ? '✓ Shipped' : '• Shipped'}
                  </span>
                  <span className={selectedOrder.status === 'Delivered' ? 'text-[#43B02A]' : 'text-gray-300'}>
                    {selectedOrder.status === 'Delivered' ? '✓ Delivered' : '• Delivered'}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-[#E2EBF1] pb-1">Items in this Order</p>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex gap-2 text-xs items-center justify-between">
                    <div className="flex gap-2 items-center min-w-0">
                      <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="w-10 h-10 object-contain rounded-xl border border-[#E2EBF1] p-1 flex-shrink-0 bg-white" />
                      <button
                        onClick={() => {
                          setSelectedProductId(item.productId);
                          setCurrentView('pdp');
                        }}
                        className="font-bold text-gray-700 truncate hover:text-[#0082C8] transition-colors cursor-pointer text-left"
                      >
                        {item.name}
                      </button>
                    </div>
                    <span className="text-[#002D62] font-bold text-xs flex-shrink-0">Rs. {item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Cost break downs */}
              <div className="space-y-1.5 text-xs border-t border-[#E2EBF1] pt-3 text-gray-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{selectedOrder.shipping === 0 ? <span className="text-[#43B02A] font-bold">FREE</span> : `Rs. ${selectedOrder.shipping.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between font-extrabold text-[#002D62] border-t border-[#E2EBF1] pt-2 text-sm mt-1">
                  <span>Total Paid</span>
                  <span>Rs. {selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Re-order Action */}
              <button
                onClick={() => handleReorderClick(selectedOrder.id)}
                disabled={reorderingId === selectedOrder.id}
                className="w-full py-3 bg-[#002D62] hover:bg-[#0082C8] text-white font-extrabold text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                {reorderingId === selectedOrder.id ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Processing Reorder...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reorder Entire Regimen
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 leading-none">
                <CheckCircle2 className="w-4 h-4 text-[#43B02A]" />
                100% Genuine Cetaphil. Dispatched promptly.
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
