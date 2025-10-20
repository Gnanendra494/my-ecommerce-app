import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Amplify } from 'aws-amplify';
import {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  resetPassword,
  signInWithRedirect,
} from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import awsExports from './aws-exports';
import '@aws-amplify/ui-react/styles.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
  Navigate,
  useLocation,
  useSearchParams,
} from 'react-router-dom';

Amplify.configure(awsExports);

const CATEGORIES = [
  'Electronics',
  'Home & Kitchen',
  'Fashion',
  'Beauty',
  'Sports & Outdoors',
  'Books',
  'Toys & Games',
  'Grocery & Gourmet',
  'Health & Personal Care',
  'Automotive',
  'Pet Supplies',
  'Tools & Home Improvement',
];
const ADMIN_EMAILS = ['admin@example.com'];

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const currency = (n) =>
  Number(n || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

const loadLS = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
const saveLS = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

/* Hero Banner component - uses provided image for background */
const HeroBanner = ({ title = 'Gaming store', subtitle = 'Upgrade your gaming gear' }) => {
  const imgSrc = 'https://m.media-amazon.com/images/I/71qcoYgEhzL._SX3000_.jpg';
  return (
    <div className="mx-0 my-6 rounded-3xl overflow-hidden shadow-lg">
      <div
        className="w-full flex items-center justify-center py-20 px-6 text-center"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(99,38,255,0.95), rgba(255,54,84,0.95)), url(${imgSrc})`,
          backgroundBlendMode: 'overlay',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
        }}
      >
        <div className="max-w-full">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{title}</h1>
          <p className="text-lg md:text-xl opacity-90">
            {subtitle ||
              'Discover a world of quality products at prices you’ll love. Your perfect find is just a click away.'}
          </p>
        </div>
      </div>
    </div>
  );
};

/* Stars */
const Stars = ({ value = 0, onChange, size = 'text-lg' }) => {
  const rounded = Math.round(value * 2) / 2;
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className={`inline-flex items-center gap-1 ${size}`}>
      {stars.map((s) => (
        <button
          type="button"
          key={s}
          onClick={() => onChange && onChange(s)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
          aria-label={`Rate ${s}`}
          title={`Rate ${s}`}
        >
          <span>{rounded >= s ? '⭐' : '☆'}</span>
        </button>
      ))}
      {!onChange && <span className="ml-1 text-sm text-gray-500">{value.toFixed(1)}</span>}
    </div>
  );
};

/* Login Page */
const LoginPage = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    try {
      await signIn({ username: email, password });
      onLogin({ username: email });
    } catch (err) {
      alert(err.message || 'Error signing in');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithRedirect({ provider: 'Google' });
    } catch (err) {
      console.log(err);
      alert(err.message || 'Google Sign-In failed');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = e.target.elements;
    try {
      await signUp({
        username: email.value,
        password: password.value,
        options: { userAttributes: { name: name.value } },
      });
      alert('Signup successful! Please confirm via email.');
      document.getElementById('signup-modal')?.classList.add('hidden');
    } catch (err) {
      alert(err.message || 'Signup error');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const email = e.target.elements[0].value.trim();
    try {
      await resetPassword({ username: email });
      alert('Password reset code sent! Check your email.');
      document.getElementById('forgot-password-modal')?.classList.add('hidden');
    } catch (err) {
      alert(err.message || 'Error sending reset code');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#1a2a44] to-[#2e4057] p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        <div className="relative hidden md:flex md:w-1/2 items-center justify-center p-6 bg-gradient-to-br from-[#1a2a44] to-[#2e4057]">
          <div className="text-white text-center">
            <h1 className="text-4xl font-bold mb-4">🥇EverScale</h1>
            <h3 className="text-3xl font-bold mb-4">Welcome Back!</h3>
            <p className="text-blue-100">Sign in to explore amazing products and get the best deals.</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 sm:p-10 lg:p-12">
          <h1 className="text-3xl font-extrabold text-center text-[#1a2a44] mb-2">🥇EverScale - Shop Smarter</h1>
          <p className="text-center text-gray-500 mb-6">Welcome back! Please enter your details.</p>

          <div className="flex flex-col space-y-3 mb-4">
            <button onClick={handleGoogleLogin} className="flex items-center justify-center px-4 py-2 border rounded-xl">
              <img className="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" />
              Sign in with Google
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <input id="email" name="email" type="email" placeholder="Email" required className="w-full px-3 py-2 border rounded-lg" />
            <div className="relative">
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" required className="w-full px-3 py-2 border rounded-lg" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-xl"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2"><input type="checkbox" /> Remember me</label>
              <button type="button" onClick={() => document.getElementById('forgot-password-modal')?.classList.remove('hidden')} className="text-[#1a2a44]">Forgot?</button>
            </div>
            <button type="submit" className="w-full py-2 rounded-lg bg-[#1a2a44] text-white">Sign In</button>
          </form>

          <p className="text-center text-sm mt-4">Don't have an account? <button onClick={() => document.getElementById('signup-modal')?.classList.remove('hidden')} className="text-[#1a2a44]">Sign Up</button></p>

          <div id="signup-modal" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-11/12 max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-center text-[#1a2a44]">Sign Up</h2>
              <form onSubmit={handleSignup} className="space-y-4">
                <input name="name" type="text" placeholder="Full Name" required className="w-full px-4 py-2 border rounded-xl" />
                <input name="email" type="email" placeholder="Email" required className="w-full px-4 py-2 border rounded-xl" />
                <input name="password" type="password" placeholder="Password" required className="w-full px-4 py-2 border rounded-xl" />
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 bg-[#1a2a44] text-white py-2 rounded-xl">Sign Up</button>
                  <button type="button" onClick={() => document.getElementById('signup-modal')?.classList.add('hidden')} className="px-4 rounded-xl border">Cancel</button>
                </div>
              </form>
            </div>
          </div>

          <div id="forgot-password-modal" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-11/12 max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-center text-[#1a2a44]">Forgot Password</h2>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <input type="email" placeholder="Enter your registered email" required className="w-full px-4 py-2 border rounded-xl" />
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 bg-[#1a2a44] text-white py-2 rounded-xl">Send Reset Link</button>
                  <button type="button" onClick={() => document.getElementById('forgot-password-modal')?.classList.add('hidden')} className="px-4 rounded-xl border">Close</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Home Page with hero and premium UI */
const HomePage = ({ products, wishlist, toggleWishlist, addToCart }) => {
  const [searchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const initialCat = searchParams.get('cat') || 'All';

  const [search, setSearch] = useState(initialQ);
  const [category, setCategory] = useState(initialCat);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    setSearch(initialQ);
    setCategory(initialCat);
  }, [initialQ, initialCat]);

  const filtered = useMemo(() => {
    const term = (search || '').trim().toLowerCase();
    let list = products.filter((p) => {
      const matchesTerm = term
        ? p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
        : true;
      const matchesCat = category === 'All' ? true : p.category === category;
      const matchesPriceMin = minPrice !== '' ? p.price >= Number(minPrice) : true;
      const matchesPriceMax = maxPrice !== '' ? p.price <= Number(maxPrice) : true;
      const matchesRating = p.rating >= Number(minRating);
      return matchesTerm && matchesCat && matchesPriceMin && matchesPriceMax && matchesRating;
    });

    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list.sort((a, b) => b.rating - a.rating || a.price - b.price);
    }
    return list;
  }, [products, search, category, minPrice, maxPrice, minRating, sortBy]);

  const visible = filtered;

  return (
    <main className="p-0 bg-gradient-to-r from-[#1a2a44] to-[#2e4057] min-h-screen w-full">
      <HeroBanner />
      <div className="w-full">
        <div className="bg-white rounded-xl shadow p-4 mb-4 flex flex-wrap gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Search</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option>All</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Min</label>
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-24 px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Max</label>
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-24 px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Rating</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="px-3 py-2 border rounded-lg"
            >
              <option value={0}>All</option>
              <option value={3}>3★+</option>
              <option value={4}>4★+</option>
              <option value={4.5}>4.5★+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="relevance">Relevance</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating-desc">Rating</option>
              <option value="name-asc">Name (A–Z)</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSearch('');
              setCategory('All');
              setMinPrice('');
              setMaxPrice('');
              setMinRating(0);
              setSortBy('relevance');
            }}
            className="ml-auto px-4 py-2 border rounded-lg"
          >
            Clear
          </button>
        </div>

        <div className="text-sm text-gray-600 mb-2 px-4">{filtered.length} results</div>

        {visible.length === 0 ? (
          <div className="p-8 text-center text-gray-600 bg-white rounded-xl shadow">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-0">
            {visible.map((p) => {
              const isWishlisted = Boolean(wishlist[p.id]);
              return (
                <div key={p.id} className="bg-white rounded-xl shadow p-4 hover:shadow-xl">
                  <Link to={`/product/${p.id}`}>
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-48 object-cover rounded mb-3"
                    />
                  </Link>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold line-clamp-1">{p.name}</h3>
                    <span className="text-sm text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      ⭐ {p.rating}
                    </span>
                  </div>
                  <p className="text-[#1a2a44] font-semibold mt-1">{currency(p.price)}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
                  <div className="mt-3 flex gap-2 items-center">
                    <AddToCartButton product={p} addToCart={addToCart} />
                    <button
                      onClick={() => toggleWishlist(p)}
                      className={`px-3 py-2 rounded-lg border-2 border-red-500`}
                      title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                      {isWishlisted ? (
                        <span className="text-red-500">♥</span>
                      ) : (
                        <span className="text-gray-500">♡</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

/* Product Details */
const ProductDetails = ({ products, wishlist, toggleWishlist, addToCart }) => {
  const { id } = useParams();
  const product = products.find((p) => String(p.id) === String(id));
  const [reviews, setReviews] = useState(() => loadLS(`reviews_${id}`, []));
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');

  useEffect(() => {
    saveLS(`reviews_${id}`, reviews);
  }, [id, reviews]);

  if (!product) return <div className="p-6">Product not found.</div>;

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : product.rating;
  const isWishlisted = Boolean(wishlist[product.id]);

  const submitReview = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setReviews((prev) => [{ id: Date.now(), rating, text: text.trim() }, ...prev]);
    setText('');
    setRating(5);
  };

  const ratingDistribution = [88, 6, 2, 1, 3];
  const tags = ['Quality', 'Fun to play', 'Value for money', 'Gift value', 'Ease of setup', 'Functionality', 'Battery life', 'Connectivity'];

  return (
    <div className="p-0 w-full bg-gradient-to-r from-[#1a2a44] to-[#2e4057] min-h-screen">
      <div className="bg-white rounded-xl shadow p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <img src={product.imageUrl} alt={product.name} className="w-full h-80 object-cover rounded" />
        <div>
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <div className="text-sm text-gray-500">{product.category}</div>
          <div className="flex items-center gap-2 my-2">
            <Stars value={avgRating} />
            <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
          </div>
          <div className="text-2xl font-semibold text-[#1a2a44] mb-2">{currency(product.price)}</div>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <div className="flex gap-2">
            <AddToCartButton product={product} addToCart={addToCart} />
            <button
              onClick={() => toggleWishlist(product)}
              className={`px-4 py-2 rounded-lg border-2 border-red-500`}
            >
              {isWishlisted ? (
                <span className="text-red-500">♥ Wishlisted</span>
              ) : (
                <span className="text-gray-500">♡ Save for later</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-xl font-bold">Customer reviews</h3>
            <Stars value={avgRating} size="text-2xl" />
            <p className="text-sm text-gray-500">9,340 global ratings</p>
            {[5, 4, 3, 2, 1].map((s, i) => (
              <div key={s} className="flex items-center gap-2 text-sm">
                <span>{s} star</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${ratingDistribution[i]}%` }}
                  ></div>
                </div>
                <span>{ratingDistribution[i]}%</span>
              </div>
            ))}
          </div>
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold">Customers say</h3>
            <p className="text-gray-700">
              Customers find the Nintendo Switch to be an amazing game console that's perfect for family fun, particularly suitable for kids and 6-year-olds. The device is easy to set up and use, and customers say everything works great and can connect to the TV. Others report issues with controllers stopping working and defective docks. Battery life is also mixed, with some saying it lasts a good amount of time while others report it only lasts a few hours.
            </p>
            <p className="text-sm text-gray-500">AI-generated from the text of customer reviews</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-3">Reviews with images</h3>
          <div className="flex overflow-x-auto gap-2 pb-2">
            {[
              'https://placehold.co/150?text=Img1',
              'https://placehold.co/150?text=Img2',
              'https://placehold.co/150?text=Img3',
              'https://placehold.co/150?text=Img4',
            ].map((img, i) => (
              <img key={i} src={img} alt={`Review ${i + 1}`} className="w-32 h-32 object-cover rounded" />
            ))}
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-3">Top reviews from the United States</h3>
          {reviews.length === 0 ? (
            <div className="text-gray-600">No reviews yet.</div>
          ) : (
            <ul className="space-y-3">
              {reviews.map((r) => (
                <li key={r.id} className="border rounded-lg p-3">
                  <Stars value={r.rating} />
                  <p className="text-gray-800 mt-1">{r.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <form onSubmit={submitReview} className="flex flex-col md:flex-row gap-3 mt-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Your rating:</span>
            <Stars value={rating} onChange={setRating} />
          </div>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts…"
            className="flex-1 px-3 py-2 border rounded-lg"
          />
          <button type="submit" className="px-4 py-2 rounded-lg bg-[#1a2a44] text-white">
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

const AddToCartButton = ({ product, addToCart }) => {
  const [added, setAdded] = useState(false);
  const timerRef = useRef(null);

  const handleClick = () => {
    addToCart(product);
    setAdded(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleClick}
      className={`flex-1 py-2 rounded-lg text-white font-semibold transition-colors duration-300 ${
        added ? 'bg-green-600' : 'bg-[#1a2a44]'
      }`}
    >
      {added ? (
        <span className="flex items-center justify-center gap-2">
          Added to Cart <span className="text-lg">✓</span>
        </span>
      ) : (
        'Add to Cart'
      )}
    </button>
  );
};

/* Cart */
const CartPage = ({ cart, updateQty, removeItem, clearCart }) => {
  const items = Object.values(cart);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = items.length ? 49 : 0;
  const tax = +(subtotal * 0.04).toFixed(2);
  const total = subtotal + shipping + tax;
  const navigate = useNavigate();

  return (
    <div className="p-0 w-full bg-gradient-to-r from-[#1a2a44] to-[#2e4057] min-h-screen">
      <h2 className="text-2xl font-bold mb-4 px-4 text-white">Your Cart</h2>
      {items.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6 text-gray-600">Your cart is empty.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow p-4 flex gap-4 items-center">
                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <div className="text-sm text-gray-500">
                    {item.category} • ⭐ {item.rating}
                  </div>
                  <div className="mt-1 font-semibold">{currency(item.price)}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <label className="text-sm text-gray-600">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => updateQty(item.id, clamp(parseInt(e.target.value || '1', 10), 1, 999))}
                      className="w-16 px-2 py-1 border rounded"
                    />
                    <button onClick={() => removeItem(item.id)} className="ml-2 px-3 py-1 border rounded">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={clearCart} className="px-4 py-2 border rounded">
              Clear Cart
            </button>
          </div>

          <aside className="bg-white rounded-xl shadow p-4 h-fit">
            <h4 className="text-lg font-semibold mb-3">Order Summary</h4>
            <div className="flex justify-between text-sm mb-1">
              <span>Subtotal</span>
              <span>{currency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Shipping</span>
              <span>{currency(shipping)}</span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span>Estimated GST</span>
              <span>{currency(tax)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg mb-4">
              <span>Total</span>
              <span>{currency(total)}</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-2 rounded-lg bg-[#6326ff] text-white"
            >
              Proceed to Checkout
            </button>
            <p className="text-xs text-gray-500 mt-2">
              This is a demo checkout. Integrate a payment provider (Stripe) for real payments.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
};

/* Wishlist */
const WishlistPage = ({ wishlist, moveToCart, removeFromWishlist }) => {
  const items = Object.values(wishlist);
  return (
    <div className="p-0 w-full bg-gradient-to-r from-[#6326ff] to-[#ff3654] min-h-screen">
      <h2 className="text-2xl font-bold mb-4 px-4 text-white">Your Wishlist</h2>
      {items.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6 text-gray-600">No items saved for later.</div>
      ) : (
        <div className="space-y-3 px-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow p-4 flex gap-4 items-center">
              <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <div className="text-sm text-gray-500">
                  {item.category} • ⭐ {item.rating}
                </div>
                <div className="mt-1 font-semibold">{currency(item.price)}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => moveToCart(item.id)}
                  className="px-3 py-1 rounded-lg bg-[#6326ff] text-white"
                >
                  Move to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="px-3 py-1 rounded-lg border"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* Checkout Page (Mock + Stripe-ready + order saving) */
const CheckoutPage = ({ cart, clearCart }) => {
  const items = Object.values(cart);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = items.length ? 99 : 0;
  const tax = +(subtotal * 0.18).toFixed(2);
  const total = subtotal + shipping + tax;
  const navigate = useNavigate();

  const saveOrder = (cartSnapshot, totalAmount) => {
    const orders = loadLS('orders_v1', []);
    const newOrder = { id: Date.now(), items: cartSnapshot, total: totalAmount, date: new Date().toLocaleString() };
    saveLS('orders_v1', [newOrder, ...orders]);
  };

  const handleMockPay = async () => {
    if (total === 0)
    return alert('Cart is empty');
    alert('Payment successful (mock)!');
    saveOrder(items, total);
    clearCart();
    navigate('/orders');
  };

  const handleStripePay = async () => {
    if (total === 0) return alert('Cart is empty');
    try {
      saveLS('pending_checkout', { items, total });
      const res = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) throw new Error('Stripe init failed');
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No URL from Stripe');
      }
    } catch (e) {
      console.error(e);
      alert('Stripe checkout not available. (Ensure backend /create-checkout-session exists.)');
    }
  };

  return (
    <div className="p-0 w-full bg-gradient-to-r from-[#6326ff] to-[#ff3654] min-h-screen">
      <h2 className="text-2xl font-bold mb-4 px-4 text-white">Checkout</h2>
      {items.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6 text-gray-600">Your cart is empty.</div>
      ) : (
        <div className="bg-white rounded-xl shadow p-4">
          <ul className="divide-y">
            {items.map((i) => (
              <li key={i.id} className="py-3 flex justify-between">
                <span>
                  {i.name} × {i.qty}
                </span>
                <span>{currency(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{currency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{currency(shipping)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Estimated GST</span>
            <span>{currency(tax)}</span>
          </div>
          <div className="mt-2 flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>{currency(total)}</span>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleMockPay}
              className="px-4 py-2 rounded-lg bg-green-600 text-white"
            >
              Mock Pay
            </button>
            <button
              onClick={handleStripePay}
              className="px-4 py-2 rounded-lg bg-[#6326ff] text-white"
            >
              Pay with Stripe
            </button>
            <button onClick={() => navigate('/cart')} className="px-4 py-2 rounded-lg border">
              Back to Cart
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            For live Stripe, implement /create-checkout-session on your server and a webhook for
            verification. After Stripe redirect to /success, pending checkout will be saved.
          </p>
        </div>
      )}
    </div>
  );
};

/* Admin */
const AdminPage = ({ user, products, setProducts }) => {
  const isAdmin = user && ADMIN_EMAILS.includes(user.username);
  const [draft, setDraft] = useState({
    id: null,
    name: '',
    price: '',
    category: CATEGORIES[0],
    rating: 4.5,
    description: '',
    imageUrl: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState('');

  if (!isAdmin) return <div className="p-6 text-red-600">Access denied. Admins only.</div>;

  const resetDraft = () =>
    setDraft({
      id: null,
      name: '',
      price: '',
      category: CATEGORIES[0],
      rating: 4.5,
      description: '',
      imageUrl: '',
    });

  const onSubmit = (e) => {
    e.preventDefault();
    const price = Number(draft.price);
    const rating = Number(draft.rating);
    if (!draft.name.trim() || isNaN(price) || isNaN(rating)) {
      alert('Please fill out name, price, and rating correctly.');
      return;
    }
    if (editingId) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...draft, id: editingId, price, rating } : p))
      );
      setEditingId(null);
    } else {
      const id = Date.now();
      setProducts((prev) => [
        {
          id,
          ...draft,
          price,
          rating,
          imageUrl: draft.imageUrl || `https://placehold.co/400x300?text=${encodeURIComponent(draft.name)}`,
        },
        ...prev,
      ]);
    }
    resetDraft();
  };

  const onEdit = (p) => {
    setEditingId(p.id);
    setDraft({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category,
      rating: p.rating,
      description: p.description,
      imageUrl: p.imageUrl,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDelete = (id) => {
    if (confirm('Delete this product?'))
      setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const results = useMemo(() => {
    const t = query.trim().toLowerCase();
    return t ? products.filter((p) => p.name.toLowerCase().includes(t) || p.description.toLowerCase().includes(t)) : products;
  }, [products, query]);

  return (
    <div className="p-0 w-full bg-gradient-to-r from-[#6326ff] to-[#ff3654] min-h-screen">
      <h2 className="text-2xl font-bold mb-4 px-4 text-white">Admin: Products</h2>
      <form onSubmit={onSubmit} className="bg-white rounded-xl shadow p-4 grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Name</label>
          <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Price</label>
          <input type="number" step="0.01" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Category</label>
          <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
            {CATEGORIES.map((c) => (<option key={c}>{c}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Rating</label>
          <input type="number" step="0.1" min="1" max="5" value={draft.rating} onChange={(e) => setDraft({ ...draft, rating: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Image URL</label>
          <input value={draft.imageUrl} onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="https://..." />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Description</label>
          <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div className="md:col-span-2 flex gap-3">
          <button type="submit" className="px-4 py-2 rounded-lg bg-[#6326ff] text-white">
            {editingId ? 'Update' : 'Create'} Product
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); resetDraft(); }} className="px-4 py-2 rounded-lg border">
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="mb-3 px-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div className="bg-white rounded-xl shadow divide-y">
        {results.map((p) => (
          <div key={p.id} className="p-3 flex gap-3 items-center">
            <img src={p.imageUrl} alt={p.name} className="w-16 h-16 object-cover rounded" />
            <div className="flex-1">
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-gray-500">
                {p.category} • ⭐ {p.rating}
              </div>
              <div className="font-semibold">{currency(p.price)}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onEdit(p)} className="px-3 py-1 rounded-lg border">
                Edit
              </button>
              <button
                onClick={() => onDelete(p.id)}
                className="px-3 py-1 rounded-lg bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {results.length === 0 && <div className="p-4 text-gray-600">No products found.</div>}
      </div>
    </div>
  );
};

/* Profile and Orders */
const ProfilePage = ({ user }) => {
  if (!user) return <div className="p-4">Loading...</div>;
  return (
    <div className="p-0 w-full bg-gradient-to-r from-[#6326ff] to-[#ff3654] min-h-screen">
      <h2 className="text-2xl font-bold mb-4 px-4 text-white">Your Profile</h2>
      <div className="bg-white rounded-xl shadow p-4">
        <div>
          <strong>Username:</strong> {user.username}
        </div>
        <div>
          <strong>Name:</strong> {user.attributes?.name || '—'}
        </div>
        <div>
          <strong>Email:</strong> {user.attributes?.email || user.username}
        </div>
      </div>
    </div>
  );
};

const OrdersPage = () => {
  const [orders, setOrders] = useState(() => loadLS('orders_v1', []));
  return (
    <div className="p-0 w-full bg-gradient-to-r from-[#6326ff] to-[#ff3654] min-h-screen">
      <h2 className="text-2xl font-bold mb-4 px-4 text-white">My Orders</h2>
      <div className="space-y-4 px-4">
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-gray-600">No past orders yet.</div>
        ) : (
          orders.map((o) => (
            <div key={o.id} className="bg-white rounded-xl shadow p-4">
              <div className="flex justify-between items-center">
                <div>
                  <strong>Order</strong> #{o.id}
                </div>
                <div className="text-sm text-gray-500">{o.date}</div>
              </div>
              <div className="mt-2">
                <ul className="divide-y">
                  {o.items.map((i) => (
                    <li key={i.id} className="py-2 flex justify-between">
                      <span>
                        {i.name} × {i.qty}
                      </span>
                      <span>{currency(i.price * i.qty)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-3 text-right font-semibold">Total: {currency(o.total)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/* Success route (used after Stripe redirect) */
const SuccessPage = ({ clearCart }) => {
  const loc = useLocation();
  useEffect(() => {
    const pending = loadLS('pending_checkout', null);
    if (pending) {
      const orders = loadLS('orders_v1', []);
      const newOrder = {
        id: Date.now(),
        items: pending.items,
        total: pending.total,
        date: new Date().toLocaleString(),
      };
      saveLS('orders_v1', [newOrder, ...orders]);
      localStorage.removeItem('pending_checkout');
      clearCart();
    }
  }, [loc, clearCart]);
  return (
    <div className="p-8 text-center bg-gradient-to-r from-[#6326ff] to-[#ff3654] min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-white">Payment successful</h2>
      <p className="text-gray-200">
        Thank you! Your order has been placed. Check{' '}
        <Link to="/orders" className="text-white underline">
          My Orders
        </Link>{' '}
        for details.
      </p>
    </div>
  );
};

const NOTIFICATION_DURATION = 2000;
function App() {
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const notificationTimeoutRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Header controlled search input state
  const [headerSearch, setHeaderSearch] = useState('');
  const [headerCategory, setHeaderCategory] = useState('All');

  useEffect(() => {
    // If URL contains q or cat (user navigated), populate header inputs
    const sp = new URLSearchParams(window.location.search);
    const q = sp.get('q') || '';
    const cat = sp.get('cat') || 'All';
    setHeaderSearch(q);
    setHeaderCategory(cat);
  }, [location.pathname, location.search]);

  const showNotification = (message) => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    setNotification(message);
    notificationTimeoutRef.current = setTimeout(() => {
      setNotification(null);
    }, NOTIFICATION_DURATION);
  };

  const getRandomProductData = (i) => {
    const productNames = [
      'Wireless Noise-Cancelling Headphones',
      'Smart LED Desk Lamp',
      'Portable Bluetooth Speaker',
      'Ultra-Thin Laptop',
      '4K Smart TV',
      'Digital Coffee Maker',
      'Ergonomic Office Chair',
      'Vintage Leather Wallet',
      'Solar-Powered Outdoor Light',
      'Non-Stick Frying Pan',
      'Insulated Water Bottle',
      'High-Performance Running Shoes',
      'Stylish Backpack',
      'Waterproof Smartwatch',
      'Professional Camera Lens',
    ];
    const productDescriptions = [
      'Experience immersive audio with crystal-clear sound and deep bass. Features a comfortable, over-ear design perfect for long listening sessions.',
      'Control your lighting with your smartphone. Dimmable and color-adjustable to create the perfect ambiance for any mood.',
      'Compact and powerful, this speaker delivers rich, 360-degree sound. Ideal for travel and outdoor adventures.',
      'Sleek and lightweight with a stunning display and lightning-fast processor. Perfect for professionals on the go.',
      'Enjoy breathtaking visuals with lifelike colors and incredible detail. Integrated with smart features for all your streaming needs.',
      'Wake up to a fresh cup of coffee every morning with this programmable coffee maker. Features a reusable filter and automatic shut-off.',
      'Designed for maximum comfort and support, this chair helps improve posture and reduce strain during long hours of work.',
      'Handcrafted from genuine leather, this wallet combines classic style with modern functionality, featuring multiple card slots and a coin pocket.',
      'Eco-friendly and durable, this light automatically charges during the day and illuminates your garden or pathway at night.',
      'Cook like a professional with this durable, scratch-resistant pan. Its non-stick surface ensures easy food release and quick cleanup.',
      'Keeps drinks hot for 12 hours and cold for 24 hours. Made from high-quality stainless steel with a leak-proof lid.',
      'Designed for peak performance, these shoes provide superior comfort and support. Features a breathable mesh upper and a responsive sole.',
      'A blend of style and practicality. This bag features multiple compartments and a padded laptop sleeve, making it perfect for daily use.',
      'Track your fitness goals and stay connected with a long-lasting battery and heart rate monitoring. Built to withstand water and dust.',
      'Capture stunning photos with incredible clarity and depth. This lens is a must-have for any photography enthusiast.',
    ];
    const category = CATEGORIES[i % CATEGORIES.length];
    const name = productNames[i % productNames.length];
    const description = productDescriptions[i % productDescriptions.length];
    const price = +(Math.random() * 10000 + 500).toFixed(2);
    const rating = +(Math.random() * 1 + 4).toFixed(1);
    const imageUrl = `https://picsum.photos/seed/${name.replace(/\s/g, '')}${i}/600/400`;

    return {
      id: i + 1,
      name,
      category,
      rating,
      price,
      description,
      imageUrl,
    };
  };

  const [products, setProducts] = useState(() => {
    const generated = Array.from({ length: 5000 }, (_, i) => getRandomProductData(i));
    return generated;
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('https://fakestoreapi.com/products?limit=50');
        if (res.ok) {
          const list = await res.json();
          const mapped = list.map((p, idx) => ({
            id: `api-${p.id}`,
            name: p.title,
            category: CATEGORIES[idx % CATEGORIES.length],
            rating: p.rating?.rate ? +(p.rating.rate).toFixed(1) : +(Math.random() * 1 + 4).toFixed(1),
            price: p.price * 80 || +(Math.random() * 10000 + 500).toFixed(2), // Convert to rough INR
            description: p.description || '',
            imageUrl: p.image || `https://picsum.photos/seed/api${idx}/600/400`,
          }));
          setProducts((prev) => [...mapped, ...prev]);
        }
      } catch (e) {
        console.warn('API products not available', e);
      }
    })();
  }, []);

  const [cart, setCart] = useState(() => loadLS('cart_v1', {}));
  useEffect(() => {
    saveLS('cart_v1', cart);
  }, [cart]);

  const [wishlist, setWishlist] = useState(() => loadLS('wishlist_v1', {}));
  useEffect(() => {
    saveLS('wishlist_v1', wishlist);
  }, [wishlist]);

  useEffect(() => {
    getCurrentUser()
      .then((u) => {
        setUser({ username: u.username, attributes: u.attributes || {} });
      })
      .catch(() => setUser(null));
    const unsub = Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signIn') {
        setUser({ username: payload.data.username, attributes: payload.data.attributes || {} });
      }
      if (payload.event === 'signOut') {
        setUser(null);
      }
    });
    return () => unsub();
  }, []);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev[product.id];
      const nextQty = clamp((existing?.qty || 0) + qty, 1, 999);
      return { ...prev, [product.id]: { ...product, qty: nextQty } };
    });
  };
  const updateQty = (id, qty) =>
    setCart((prev) => ({ ...prev, [id]: { ...prev[id], qty: clamp(qty, 1, 999) } }));
  const removeItem = (id) =>
    setCart((prev) => {
      const c = { ...prev };
      delete c[id];
      return c;
    });
  const clearCart = () => setCart({});

  const addToWishlist = (product) => {
    setWishlist((prev) => ({ ...prev, [product.id]: product }));
    showNotification(`${product.name} added to wishlist!`);
  };
  const removeFromWishlist = (id) =>
    setWishlist((prev) => {
      const w = { ...prev };
      delete w[id];
      return w;
    });
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const next = { ...prev };
      if (next[product.id]) {
        delete next[product.id];
        showNotification(`${product.name} removed from wishlist.`);
      } else {
        next[product.id] = product;
        showNotification(`${product.name} added to wishlist!`);
      }
      return next;
    });
  };
  const moveToCart = (id) => {
    const p = wishlist[id];
    if (p) {
      addToCart(p, 1);
      removeFromWishlist(id);
      navigate('/cart');
    }
  };

  const cartCount = useMemo(() => Object.values(cart).reduce((sum, i) => sum + i.qty, 0), [cart]);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    navigate('/');
  };

  // header search actions: pressing Enter or clicking search triggers navigation with query params
  const onHeaderSearchSubmit = (e) => {
    e?.preventDefault?.();
    const q = (headerSearch || '').trim();
    const cat = headerCategory && headerCategory !== 'All' ? headerCategory : null;
    const sp = new URLSearchParams();
    if (q) sp.set('q', q);
    if (cat) sp.set('cat', cat);
    navigate(`/?${sp.toString()}`);
    // location change will cause HomePage to pick up params and filter
  };

  return (
    <>
      {/* Hide header on /login */}
      {location.pathname !== '/login' && (
        <header className="bg-[#131921] text-white py-2 shadow-md w-full fixed top-0 left-0 z-40">
          <div className="w-full px-4 flex items-center gap-4">
            <Link to="/" className="text-2xl font-bold text-white whitespace-nowrap mr-4">
              🥇EverScale
            </Link>
            <div className="text-sm flex items-center gap-1 mr-4">
              <span className="font-bold">K.Gnanendra Reddy</span>
            </div>

            {/* Amazon-style search bar */}
            <form onSubmit={onHeaderSearchSubmit} className="flex-1 max-w-full hidden md:flex items-center">
              <select
                value={headerCategory}
                onChange={(e) => setHeaderCategory(e.target.value)}
                className="px-3 py-2 rounded-l-md bg-gray-200 text-black border-r"
                aria-label="Category"
              >
                <option>All</option>
                {CATEGORIES.map((c) => (
                  <option key={`hcat-${c}`}>{c}</option>
                ))}
              </select>
              <input
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                type="text"
                placeholder="Search 🥇EverScale"
                aria-label="Search"
                className="flex-1 px-3 py-2 border-y border-transparent focus:border-orange-400 focus:ring-0 text-black"
              />
              <button
                type="submit"
                className="bg-orange-400 hover:bg-orange-500 text-black px-4 rounded-r-md py-2.5"
                title="Search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </form>

            <nav className="flex items-center gap-4 text-white ml-auto">
              <Link to="/wishlist" className="hover:text-orange-400 text-sm">
                Wishlist
              </Link>
              <Link to="/contact" className="hover:text-orange-400 text-sm">
                Customer Service
              </Link>
              <Link to="/cart" className="relative px-3 py-1 text-sm font-medium border rounded-lg hover:bg-gray-700">
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-1.5 py-0.5">
                    {cartCount}
                  </span>
                )}
              </Link>
              {user ? (
                <>
                  <div className="group relative">
                    <span className="text-sm cursor-pointer hover:text-orange-400">
                      Hello, {user.attributes?.name || user.username}
                    </span>
                    <div className="hidden group-hover:block absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-50">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Your Profile
                      </Link>
                      <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Your Orders
                      </Link>
                      {ADMIN_EMAILS.includes(user.username) && (
                        <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Admin Dashboard
                        </Link>
                      )}
                      <button onClick={handleSignOut} className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <Link to="/login" className="px-3 py-1 text-sm text-white bg-[#6326ff] rounded-lg hover:bg-[#ff3654]">
                  Sign In
                </Link>
              )}
            </nav>
          </div>

          {/* Mobile search bar */}
          <div className="w-full px-4 mt-2 md:hidden">
            <form onSubmit={onHeaderSearchSubmit} className="flex items-center gap-2">
              <input
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                type="text"
                placeholder="Search products..."
                className="w-full px-3 py-2 rounded-md border-y border-l border-transparent focus:border-orange-400 focus:ring-0 text-black"
              />
              <button type="submit" className="bg-orange-400 px-3 py-2 rounded-md text-black">Search</button>
            </form>
          </div>
        </header>
      )}

      {/* push page content down so header doesn't overlap */}
      <div className="h-16 md:h-16" />

      {notification && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-xl z-[100] transition-opacity duration-500">
          {notification}
        </div>
      )}

      <Routes>
        <Route path="/login" element={<LoginPage onLogin={(u) => setUser(u)} />} />
        <Route
          path="/"
          element={
            <HomePage
              products={products}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              addToCart={addToCart}
            />
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProductDetails
              products={products}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              addToCart={addToCart}
            />
          }
        />
        <Route path="/cart" element={<CartPage cart={cart} updateQty={updateQty} removeItem={removeItem} clearCart={clearCart} />} />
        <Route path="/checkout" element={<CheckoutPage cart={cart} clearCart={clearCart} />} />
        <Route path="/wishlist" element={<WishlistPage wishlist={wishlist} moveToCart={moveToCart} removeFromWishlist={removeFromWishlist} />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin" element={<AdminPage user={user} products={products} setProducts={setProducts} />} />
        <Route path="/profile" element={user ? <ProfilePage user={user} /> : <Navigate to="/login" />} />
        <Route path="/orders" element={user ? <OrdersPage /> : <Navigate to="/login" />} />
        <Route path="/success" element={<SuccessPage clearCart={clearCart} />} />
      </Routes>
    </>
  );
}

/* ContactPage posts to your Formspree endpoint */
const ContactPage = () => {
  return (
    <div className="p-8 bg-gradient-to-r from-[#6326ff] to-[#ff3654] min-h-screen w-full">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Customer Service</h2>
        <p className="text-gray-600 mb-4">
          Need help or have feedback? Fill out the form and we'll get back to you.
        </p>
        <form action="https://formspree.io/f/mpwjzapq" method="POST" className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input name="name" required className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input name="email" type="email" required className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Message</label>
            <textarea name="message" required className="w-full px-3 py-2 border rounded-lg h-40" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="submit" className="px-4 py-2 rounded-lg bg-[#6326ff] text-white">Send Message</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
