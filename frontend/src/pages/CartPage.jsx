import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalAmount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Your Shopping Cart is Empty</h2>
        <p className="text-slate-500">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="inline-block bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sky-600 transition shadow-md">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-black text-slate-900">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item._id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl border bg-slate-100" />
                <div>
                  <h3 className="font-bold text-slate-900">{item.name}</h3>
                  <p className="text-sky-600 font-bold mt-1">${item.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center border rounded-xl overflow-hidden bg-slate-50">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-3 py-1 font-bold hover:bg-slate-200">-</button>
                  <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-3 py-1 font-bold hover:bg-slate-200">+</button>
                </div>
                <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700 text-sm font-bold p-2">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Checkout Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit space-y-4">
          <h2 className="text-xl font-black text-slate-900">Order Summary</h2>
          <div className="flex justify-between text-slate-600 text-sm py-2 border-b">
            <span>Subtotal</span>
            <span className="font-bold text-slate-900">${totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600 text-sm py-2 border-b">
            <span>Shipping</span>
            <span className="font-bold text-emerald-600">FREE</span>
          </div>
          <div className="flex justify-between text-lg font-black text-slate-900 py-2">
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <button 
            onClick={() => alert('Proceeding to Checkout Gateway simulation!')} 
            className="w-full bg-sky-600 text-white font-bold py-3.5 rounded-xl hover:bg-sky-500 transition shadow-md"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}