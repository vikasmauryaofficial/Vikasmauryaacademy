import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { EmptyState } from '@/components/ui';

export function CartPage() {
  const { cart, removeFromCart, clearCart, enroll, showToast, user, openAuthModal } = useApp();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    cart.forEach((item) => enroll(item.id));
    clearCart();
    showToast('Payment successful! Courses enrolled 🎉', 'success');
    navigate('/dashboard');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          subtitle="Browse courses and add them to your cart"
          action={<Link to="/courses" className="btn-primary">Browse Courses →</Link>}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-display font-extrabold text-text text-2xl mb-6">Your Cart</h1>
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Cart items */}
        <div className="space-y-3">
          {cart.map((item) => (
            <div key={item.id} className="card flex items-center gap-4">
              <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-2xl shrink-0 ${item.channel === 'VMA' ? 'bg-green-light' : 'bg-blue-light'}`}>
                {item.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/courses/${item.id}`} className="font-semibold text-text text-sm hover:text-green transition-colors">
                  {item.title}
                </Link>
                <p className="text-xs text-muted mt-1">{item.channel === 'VMA' ? 'Vikas Maurya Academy' : 'Vikas Coding School'}</p>
              </div>
              <div className="font-bold text-text shrink-0">₹{item.price.toLocaleString()}</div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-sm text-red hover:underline shrink-0"
              >
                Remove
              </button>
            </div>
          ))}
          <button onClick={clearCart} className="text-sm text-muted hover:text-red transition-colors">
            Clear all
          </button>
        </div>

        {/* Order summary */}
        <div className="lg:sticky lg:top-[120px] h-fit">
          <div className="card">
            <h3 className="font-bold text-text mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted truncate pr-2">{item.title}</span>
                  <span className="text-text shrink-0">₹{item.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 mb-4">
              <div className="flex justify-between font-bold">
                <span className="text-text">Total</span>
                <span className="text-green text-lg">₹{total.toLocaleString()}</span>
              </div>
            </div>
            <button onClick={handleCheckout} className="btn-primary w-full">
              Checkout with Razorpay →
            </button>
            <p className="text-xs text-faint text-center mt-3">Secure payment via Razorpay</p>
          </div>
        </div>
      </div>
    </div>
  );
}
