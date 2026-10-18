import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading product info...</div>;
  if (!product) return <div className="text-center py-20 font-bold text-red-500">Product not found.</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="rounded-2xl overflow-hidden bg-slate-100 border h-80 md:h-96">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
          {product.category}
        </span>
        <h1 className="text-3xl font-black text-slate-900">{product.name}</h1>
        <p className="text-2xl font-black text-slate-800">${product.price.toFixed(2)}</p>
        <p className="text-slate-600 leading-relaxed text-sm">{product.description}</p>
        
        <div className="pt-2">
          <p className="text-sm font-medium text-slate-500 mb-4">
            Availability: <span className={product.stock > 0 ? "text-emerald-600 font-bold" : "text-red-500 font-bold"}>
              {product.stock > 0 ? `In Stock (${product.stock} left)` : "Out of Stock"}
            </span>
          </p>
          <div className="flex space-x-4">
            <button 
              disabled={product.stock <= 0}
              onClick={() => { addToCart(product); navigate('/cart'); }}
              className="flex-1 bg-sky-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-sky-500 transition shadow-md disabled:bg-slate-300"
            >
              Buy Now
            </button>
            <button 
              disabled={product.stock <= 0}
              onClick={() => addToCart(product)}
              className="flex-1 bg-slate-900 text-white font-bold py-3 px-6 rounded-xl hover:bg-slate-800 transition shadow-md disabled:bg-slate-300"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}