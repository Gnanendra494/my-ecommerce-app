import React, { useState, useEffect } from 'react';
import { Amplify, Auth, Hub } from 'aws-amplify';
import awsExports from './aws-exports';
import '@aws-amplify/ui-react/styles.css';
import { FixedSizeGrid as Grid } from 'react-window';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

Amplify.configure(awsExports);

// ------------------- Login Page -------------------
const LoginPage = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      await Auth.signIn(email, password);
      onLogin({ username: email });
    } catch (err) {
      alert(err.message || 'Error signing in');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await Auth.federatedSignIn({ provider: 'Google' });
    } catch (err) {
      console.log(err);
    }
  };

  const handleGitHubLogin = async () => {
    try {
      await Auth.federatedSignIn({ provider: 'GitHub' });
    } catch (err) {
      console.log(err);
    }
  };

  const openModal = (id) => document.getElementById(id).classList.remove('hidden');
  const closeModal = (id) => document.getElementById(id).classList.add('hidden');

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = e.target.elements;
    try {
      await Auth.signUp({ username: email.value, password: password.value, attributes: { name: name.value } });
      alert('Signup successful! Please confirm via email.');
      closeModal('signup-modal');
    } catch (err) {
      alert(err.message || 'Signup error');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const email = e.target.elements[0].value;
    try {
      await Auth.forgotPassword(email);
      alert('Password reset code sent! Check your email.');
      closeModal('forgot-password-modal');
    } catch (err) {
      alert(err.message || 'Error sending reset code');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 p-4 sm:p-6 lg:p-8 font-inter">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        <div className="relative hidden md:flex md:w-1/2 items-center justify-center p-6 bg-gradient-to-br from-cyan-600 to-blue-700">
          <div className="text-white text-center">
            <h1 className="text-4xl font-bold mb-4">🥇EverScale</h1>
            <h3 className="text-3xl font-bold mb-4">Welcome Back!</h3>
            <p className="text-blue-100">Sign in to explore amazing products and get the best deals.</p>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-2">🥇EverScale - Shop Smarter</h1>
          <p className="text-center text-gray-500 mb-8">Welcome back! Please enter your details.</p>

          <div className="flex flex-col space-y-4 mb-6">
            <button onClick={handleGoogleLogin} className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition duration-300">
              <img className="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/355037/google.svg" alt="Google icon" />
              Sign in with Google
            </button>
            <button onClick={handleGitHubLogin} className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition duration-300">
              <i className="fa-brands fa-github mr-2"></i>
              Sign in with GitHub
            </button>
          </div>

          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <form className="space-y-6" onSubmit={handleLoginSubmit}>
            <input id="email" name="email" type="email" placeholder="Email" required className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500" />
            <div className="relative">
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" required className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500" />
              <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-500 hover:text-gray-700">
                <i className={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}></i>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="remember-me" className="ml-2 text-gray-900">Remember me</label>
              </div>
              <button type="button" onClick={() => openModal('forgot-password-modal')} className="text-blue-600 hover:text-blue-500 text-sm">Forgot password?</button>
            </div>
            <button type="submit" className="w-full py-3 px-4 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition">Log In</button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account? <button onClick={() => openModal('signup-modal')} className="text-blue-600 hover:text-blue-500 font-medium">Sign Up</button>
          </p>

          {/* Signup Modal */}
          <div id="signup-modal" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-11/12 max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Sign Up</h2>
              <form onSubmit={handleSignup} className="space-y-4">
                <input name="name" type="text" placeholder="Full Name" required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
                <input name="email" type="email" placeholder="Email" required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
                <input name="password" type="password" placeholder="Password" required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl">Sign Up</button>
              </form>
            </div>
          </div>

          {/* Forgot Password Modal */}
          <div id="forgot-password-modal" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-11/12 max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Forgot Password</h2>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <input type="email" placeholder="Enter your registered email" required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl">Send Reset Link</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ------------------- Home Page -------------------
const HomePage = ({ user, onSignOut }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const generatedProducts = Array.from({ length: 5000 }, (_, i) => ({
      id: i + 1,
      name: `Product ${i + 1}`,
      price: (Math.random() * 500 + 10).toFixed(2),
      description: `This is a description for Product ${i + 1}.`,
      imageUrl: `https://placehold.co/400x300/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=Product+${i + 1}`
    }));
    setProducts(generatedProducts);
  }, []);

  const ProductCard = ({ columnIndex, rowIndex, style, data }) => {
    const product = data[rowIndex * 3 + columnIndex];
    if (!product) return null;
    return (
      <div style={style} className="bg-white rounded-xl shadow-lg overflow-hidden p-4 m-2 hover:shadow-xl transition-shadow duration-300">
        <img src={product.imageUrl} alt={product.name} className="w-full h-36 object-cover rounded-xl mb-2" />
        <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
        <p className="text-blue-600 font-semibold">${product.price}</p>
        <p className="text-sm text-gray-600">{product.description}</p>
      </div>
    );
  };

  return (
    <main className="p-4">
      <h3 className="text-2xl font-bold mb-4">Our Products</h3>
      <Grid
        columnCount={3}
        columnWidth={350}
        height={700}
        rowCount={Math.ceil(products.length / 3)}
        rowHeight={300}
        width={1120}
        itemData={products}
      >
        {ProductCard}
      </Grid>
    </main>
  );
};

// ------------------- Contact Us Page -------------------
const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://formspree.io/f/mqkvjrrj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      } else alert('Failed to send your message. Please try again.');
    } catch (err) {
      alert('Error sending message: ' + err.message);
    }
  };

  if (submitted) return <p className="text-green-600 text-center mt-8">Thank you! Your message has been sent.</p>;

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Contact Us</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
        <input name="email" type="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
        <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
        <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700">Send Message</button>
      </form>
    </div>
  );
};

// ------------------- Main App -------------------
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((u) => setUser({ username: u.username }))
      .catch(() => setUser(null));

    Hub.listen('auth', (data) => {
      const { payload } = data;
      if (payload.event === 'signIn') setUser({ username: payload.data.username });
      if (payload.event === 'signOut') setUser(null);
    });
  }, []);

  const handleSignOut = async () => {
    await Auth.signOut();
    setUser(null);
  };

  if (user) {
    return (
      <Router>
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-800">🥇EverScale</h1>
          <nav className="flex space-x-4">
            <Link to="/" className="text-blue-600 hover:underline">Home</Link>
            <Link to="/contact" className="text-blue-600 hover:underline">Contact Us</Link>
            <button onClick={handleSignOut} className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Sign Out</button>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<HomePage user={user} onSignOut={handleSignOut} />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
      </Router>
    );
  }

  return <LoginPage onLogin={setUser} />;
}

export default App;
