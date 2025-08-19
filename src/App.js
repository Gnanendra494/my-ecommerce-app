import React, { useState, useEffect } from 'react';
// The Amplify and UI library imports below are causing compilation errors in this environment.
// To fix this, we will remove them and simulate the authentication and API calls.
// In a real project, you must uncomment these lines after running 'amplify publish'.
// import { Amplify, API, Auth, Hub } from 'aws-amplify';
// import { withAuthenticator } from '@aws-amplify/ui-react';
// import '@aws-amplify/ui-react/styles.css';

// This is where Amplify would be configured. This mock is for demonstration purposes.
// import awsExports from './aws-exports';
// Amplify.configure(awsExports);

// Placeholder API name for demonstration
const apiName = 'ecommerceApi';

// --- Login Page Component ---
// This component is displayed when the user is not logged in.
const LoginPage = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Placeholder login function - triggers a simulated login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Login form submitted!");
    onLogin(); // Call the login function from the parent App component
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 p-4 sm:p-6 lg:p-8 font-inter">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        
        {/* Left Side: Visuals & Branding (Hidden on mobile) */}
        <div className="relative hidden md:flex md:w-1/2 items-center justify-center p-6 bg-gradient-to-br from-cyan-600 to-blue-700">
          <div className="text-white text-center">
            <h1 className="text-4xl font-bold mb-4">🥇EverScale</h1>
            <h3 className="text-3xl font-bold mb-4">Welcome Back!</h3>
            <p className="text-blue-100">Sign in to explore amazing products and get the best deals.</p>
            <div className="mt-8">
              <svg className="h-24 w-24 mx-auto text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 15v-5H8.5l3.5-7v5h3.5L12 17z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-2">🥇EverScale - Shop Smarter</h1>
          <p className="text-center text-gray-500 mb-8">Welcome back! Please enter your details.</p>
          <div className="flex flex-col space-y-4 mb-6">
            <button className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition duration-300">
              <img className="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/355037/google.svg" alt="Google icon" />
              Sign in with Google
            </button>
            <button className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              Sign in with GitHub
            </button>
          </div>
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <form className="space-y-6" onSubmit={handleLoginSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input id="email" name="email" type="email" autoComplete="email" required className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition duration-300" />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition duration-300" />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.057 10.057 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.92 9.92 0 014.288-4.156M15 12a3 3 0 11-6 0 3 3 0 016 0zM21 12c-1.274 4.057-5.065 7-9.542 7a9.92 9.92 0 01-4.288-1.156" />
                  )}
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition duration-300">Forgot password?</a>
              </div>
            </div>
            <div>
              <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300">
                Log In
              </button>
            </div>
          </form>
          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition duration-300">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Homepage Component ---
// This component will be displayed after a user has successfully logged in.
const HomePage = ({ user, onSignOut }) => {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [productForm, setProductForm] = useState({ name: '', price: '', description: '', imageUrl: '' });
  
  // Mock function to simulate fetching products from the backend API
  const fetchProducts = () => {
    // Hardcoded mock data to make the UI work without Amplify
    const mockProducts = [
      { id: 1, name: 'Wireless Headphones', price: '99.99', description: 'Noise-cancelling over-ear headphones with 24-hour battery life.', imageUrl: 'https://placehold.co/400x300/e5e7eb/6b7280?text=Headphones' },
      { id: 2, name: 'Smartwatch', price: '199.50', description: 'Track your fitness, heart rate, and notifications from your wrist.', imageUrl: 'https://placehold.co/400x300/dbeafe/3b82f6?text=Smartwatch' },
      { id: 3, name: 'Mechanical Keyboard', price: '120.00', description: 'Tactile switches and customizable RGB backlighting for a superior typing experience.', imageUrl: 'https://placehold.co/400x300/f3f4f6/4b5563?text=Keyboard' },
      { id: 4, name: '4K Monitor', price: '349.99', description: '27-inch UHD display with vibrant colors and high refresh rate.', imageUrl: 'https://placehold.co/400x300/d1fae5/10b981?text=Monitor' },
    ];
    setProducts(mockProducts);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = (e) => {
    e.preventDefault();
    const newProduct = { ...productForm, id: products.length + 1 };
    setProducts([...products, newProduct]);
    setProductForm({ name: '', price: '', description: '', imageUrl: '' });
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter text-gray-800">
      <header className="bg-white shadow-md p-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-800">🥇EverScale</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <span className="text-gray-700 text-sm sm:text-base hidden sm:block">Hello, {user.username}</span>
          <button
            onClick={onSignOut}
            className="px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto mt-4 p-4">
        {/* Top Banner/Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 md:p-12 rounded-xl text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Scale with Ease, Shop with Confidence</h2>
          <p className="mt-2 text-lg font-light max-w-2xl mx-auto">Discover a world of quality products at prices you’ll love. Your perfect find is just a click away.</p>
        </div>

        {/* Admin Section: Add a new product form */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h3 className="text-xl font-semibold mb-4">Admin Actions</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full sm:w-auto px-4 py-2 sm:py-3 text-sm sm:text-base font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 transition duration-300"
          >
            {showAddForm ? 'Hide Form' : 'Add New Product'}
          </button>
          
          {showAddForm && (
            <form onSubmit={handleAddProduct} className="mt-4 space-y-4">
              <input
                type="text"
                name="name"
                value={productForm.name}
                onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                placeholder="Product Name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                name="price"
                value={productForm.price}
                onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                placeholder="Price"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                name="description"
                value={productForm.description}
                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                placeholder="Product Description"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition duration-300"
              >
                Submit Product
              </button>
            </form>
          )}
        </div>

        {/* Product Display Section */}
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length > 0 ? (
            products.map((product, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden p-6 hover:shadow-xl transition-shadow duration-300">
                <img src={`https://placehold.co/400x300/e5e7eb/6b7280?text=${product.name}`} alt={product.name} className="w-full h-48 object-cover rounded-xl mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-2xl font-semibold text-blue-600 mb-4">${product.price}</p>
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No products found. Please add some!</p>
          )}
        </div>
      </main>
      <footer className="bg-gray-800 text-white text-center p-4 mt-8">
        <p>© 2024 🥇EverScale. All rights reserved.</p>
      </footer>
    </div>
  );
};


// --- Main App Component ---
// This component handles the conditional rendering of the login and homepage.
function App() {
  const [user, setUser] = useState(null);

  // Simulates a user logging in
  const handleLogin = () => {
    setUser({ username: 'Gnanendra' });
  };

  // Simulates a user signing out
  const handleSignOut = () => {
    setUser(null);
  };

  if (user) {
    return <HomePage user={user} onSignOut={handleSignOut} />;
  } else {
    return <LoginPage onLogin={handleLogin} />;
  }
}

export default App;
