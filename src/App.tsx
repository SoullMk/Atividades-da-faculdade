/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  ShoppingBasket, 
  CreditCard, 
  Truck, 
  Store, 
  ChevronRight, 
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Fruit {
  id: string;
  name: string;
  icon: string;
  color: string;
  prices: {
    low: number; // <= 5kg
    mid: number; // 5-10kg
    high: number; // >= 10kg
  };
}

const FRUITS: Fruit[] = [
  { 
    id: 'morango', 
    name: 'Morango', 
    icon: '🍓', 
    color: 'bg-red-50',
    prices: { low: 5, mid: 3.5, high: 2 } 
  },
  { 
    id: 'abacaxi', 
    name: 'Abacaxi', 
    icon: '🍍', 
    color: 'bg-yellow-50',
    prices: { low: 10, mid: 7.5, high: 6.8 } 
  },
  { 
    id: 'pera', 
    name: 'Pera', 
    icon: '🍐', 
    color: 'bg-green-50',
    prices: { low: 8.5, mid: 7, high: 5.5 } 
  },
  { 
    id: 'maca', 
    name: 'Maçã', 
    icon: '🍎', 
    color: 'bg-rose-50',
    prices: { low: 6.5, mid: 5, high: 3.75 } 
  },
];

const PAYMENT_METHODS = [
  { id: 1, name: 'Dinheiro', description: '10% de desconto', discount: 0.10 },
  { id: 2, name: 'Débito', description: '5% de desconto', discount: 0.05 },
  { id: 3, name: 'Crédito', description: '2x sem juros', discount: 0 },
];

const DELIVERY_OPTIONS = [
  { id: 1, name: 'Entrega', description: 'Taxa de R$ 10,00', fee: 10 },
  { id: 2, name: 'Retirar no local', description: 'Grátis', fee: 0 },
];

export default function App() {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    morango: 0,
    abacaxi: 0,
    pera: 0,
    maca: 0,
  });
  const [paymentMethod, setPaymentMethod] = useState(1);
  const [deliveryOption, setDeliveryOption] = useState(2);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleQuantityChange = (id: string, value: string) => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) {
      setQuantities(prev => ({ ...prev, [id]: 0 }));
    } else {
      setQuantities(prev => ({ ...prev, [id]: num }));
    }
  };

  const totals = useMemo(() => {
    const fruitTotals = FRUITS.map(fruit => {
      const kg = quantities[fruit.id] || 0;
      let price = 0;
      if (kg <= 5) price = fruit.prices.low;
      else if (kg < 10) price = fruit.prices.mid;
      else price = fruit.prices.high;
      
      return {
        id: fruit.id,
        name: fruit.name,
        kg,
        price,
        total: kg * price
      };
    });

    const subtotal = fruitTotals.reduce((acc, curr) => acc + curr.total, 0);
    const selectedPayment = PAYMENT_METHODS.find(p => p.id === paymentMethod);
    const selectedDelivery = DELIVERY_OPTIONS.find(d => d.id === deliveryOption);
    
    const discountAmount = subtotal * (selectedPayment?.discount || 0);
    const deliveryFee = selectedDelivery?.fee || 0;
    const finalTotal = subtotal - discountAmount + deliveryFee;

    return {
      fruitTotals,
      subtotal,
      discountAmount,
      deliveryFee,
      finalTotal,
      installments: paymentMethod === 3 ? finalTotal / 2 : null
    };
  }, [quantities, paymentMethod, deliveryOption]);

  const resetOrder = () => {
    setQuantities({ morango: 0, abacaxi: 0, pera: 0, maca: 0 });
    setPaymentMethod(1);
    setDeliveryOption(2);
    setShowSuccess(false);
  };

  return (
    <div className="min-h-screen bg-[#fdfcf8] text-stone-800 font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white">
              <ShoppingBasket size={22} />
            </div>
            <h1 className="text-xl font-serif italic font-bold text-emerald-900 tracking-tight">
              Quitanda que Anda
            </h1>
          </div>
          <div className="text-xs uppercase tracking-widest font-semibold text-stone-400">
            Frutas Frescas • Entrega Rápida
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Fruit Selection */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-serif italic text-stone-900 mb-1">Nossas Frutas</h2>
                <p className="text-stone-500 text-sm">Selecione a quantidade desejada em quilos (kg).</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FRUITS.map((fruit) => (
                  <motion.div 
                    key={fruit.id}
                    whileHover={{ y: -2 }}
                    className={`${fruit.color} border border-stone-100 rounded-3xl p-6 transition-shadow hover:shadow-sm`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-4xl">{fruit.icon}</span>
                      <div className="text-right">
                        <span className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Preço/kg</span>
                        <div className="flex flex-col text-[10px] font-mono text-stone-500">
                          <span>≤ 5kg: R$ {fruit.prices.low.toFixed(2)}</span>
                          <span>5-10kg: R$ {fruit.prices.mid.toFixed(2)}</span>
                          <span>≥ 10kg: R$ {fruit.prices.high.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-stone-800 mb-4">{fruit.name}</h3>
                    
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={quantities[fruit.id] || ''}
                        onChange={(e) => handleQuantityChange(fruit.id, e.target.value)}
                        placeholder="0.0"
                        className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-lg font-mono"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 font-medium">kg</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Payment & Delivery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section>
                <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-4 flex items-center gap-2">
                  <CreditCard size={16} /> Pagamento
                </h3>
                <div className="space-y-2">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        paymentMethod === method.id 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm' 
                          : 'border-stone-100 bg-white text-stone-600 hover:border-stone-200'
                      }`}
                    >
                      <div className="text-left">
                        <div className="font-semibold">{method.name}</div>
                        <div className="text-xs opacity-70">{method.description}</div>
                      </div>
                      {paymentMethod === method.id && <CheckCircle2 size={18} className="text-emerald-600" />}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-4 flex items-center gap-2">
                  <Truck size={16} /> Entrega
                </h3>
                <div className="space-y-2">
                  {DELIVERY_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setDeliveryOption(option.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        deliveryOption === option.id 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm' 
                          : 'border-stone-100 bg-white text-stone-600 hover:border-stone-200'
                      }`}
                    >
                      <div className="text-left">
                        <div className="font-semibold">{option.name}</div>
                        <div className="text-xs opacity-70">{option.description}</div>
                      </div>
                      {deliveryOption === option.id ? <Truck size={18} className="text-emerald-600" /> : <Store size={18} className="text-stone-300" />}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Order Summary */}
          <aside className="lg:sticky lg:top-24">
            <div className="bg-stone-900 text-white rounded-[2rem] p-8 shadow-2xl shadow-stone-200 overflow-hidden relative">
              {/* Decorative circle */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />
              
              <h2 className="text-xl font-serif italic mb-6 relative z-10">Resumo do Pedido</h2>
              
              <div className="space-y-4 mb-8 relative z-10">
                {totals.fruitTotals.filter(f => f.kg > 0).map(fruit => (
                  <div key={fruit.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-stone-400 font-mono">{fruit.kg.toFixed(1)}kg</span>
                      <span>{fruit.name}</span>
                    </div>
                    <span className="font-mono">R$ {fruit.total.toFixed(2)}</span>
                  </div>
                ))}
                
                {totals.subtotal === 0 && (
                  <div className="py-8 text-center text-stone-500 italic text-sm">
                    Nenhuma fruta selecionada
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-6 space-y-3 relative z-10">
                <div className="flex justify-between text-sm text-stone-400">
                  <span>Subtotal</span>
                  <span className="font-mono">R$ {totals.subtotal.toFixed(2)}</span>
                </div>
                
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-400">
                    <span>Desconto</span>
                    <span className="font-mono">- R$ {totals.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                {totals.deliveryFee > 0 && (
                  <div className="flex justify-between text-sm text-stone-400">
                    <span>Taxa de Entrega</span>
                    <span className="font-mono">+ R$ {totals.deliveryFee.toFixed(2)}</span>
                  </div>
                )}

                <div className="pt-4 flex justify-between items-end">
                  <span className="text-stone-400 text-xs font-bold uppercase tracking-widest">Total Final</span>
                  <span className="text-3xl font-serif italic text-emerald-400">
                    R$ {totals.finalTotal.toFixed(2)}
                  </span>
                </div>

                {totals.installments && (
                  <div className="text-right text-xs text-stone-500 mt-1">
                    Ou 2x de <span className="text-white font-mono">R$ {totals.installments.toFixed(2)}</span> sem juros
                  </div>
                )}
              </div>

              <button
                disabled={totals.subtotal === 0}
                onClick={() => setShowSuccess(true)}
                className="w-full mt-8 bg-emerald-500 hover:bg-emerald-400 disabled:bg-stone-800 disabled:text-stone-600 text-stone-900 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group relative z-10"
              >
                Finalizar Compra
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="mt-6 flex items-start gap-2 text-[10px] text-stone-500 uppercase tracking-wider leading-relaxed">
                <Info size={12} className="shrink-0 mt-0.5" />
                <span>Os preços variam conforme a quantidade para garantir o melhor custo-benefício.</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-md w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-serif italic text-stone-900 mb-4">Pedido Realizado!</h2>
              <p className="text-stone-500 mb-8">
                Obrigado por comprar na <span className="font-semibold text-emerald-700">Quitanda que Anda</span>. 
                Seu pedido de <span className="font-mono text-stone-800">R$ {totals.finalTotal.toFixed(2)}</span> está sendo processado.
              </p>
              <button
                onClick={resetOrder}
                className="w-full bg-stone-900 text-white font-bold py-4 rounded-2xl hover:bg-stone-800 transition-colors"
              >
                Fazer Novo Pedido
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-12 border-t border-stone-100 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <ShoppingBasket size={18} />
            <span className="text-sm font-serif italic font-bold">Quitanda que Anda</span>
          </div>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-stone-400">
            <span>Sobre Nós</span>
            <span>Localização</span>
            <span>Contato</span>
            <span>Privacidade</span>
          </div>
          <div className="text-[10px] text-stone-400 font-mono">
            © 2026 QUITANDA QUE ANDA. TODOS OS DIREITOS RESERVADOS.
          </div>
        </div>
      </footer>
    </div>
  );
}
