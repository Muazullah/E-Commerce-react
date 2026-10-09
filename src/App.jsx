import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import About from './pages/About';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Products from './pages/products';
import Cart from './pages/Cart';
import Navbar from './components/Navbar';
import axios from 'axios';
import Footer from './components/Footer';
import SingleProduct from './pages/SingleProduct';
import CategoryProduct from './pages/CategoryProduct';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [location, setLocation] = useState(null);

  const getLocation = async () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const url =
          'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' +
          latitude +
          '&lon=' +
          longitude;

        try {
          const location = await axios.get(url);
          const exactLocation = location.data.address;

          setLocation(exactLocation);
          setOpenDropdown(false);

        } catch (error) {
          console.log("Error fetching location data:", error);
        }
      },
      (error) => {
        console.log("Geolocation error:", error);
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <BrowserRouter>
      <Navbar
        location={location}
        getLocation={getLocation}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
      />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/products/:id' element={<SingleProduct />} />
        <Route path='/category/:category' element={<CategoryProduct />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/cart' element={<ProtectedRoute><Cart location={location} getLocation={getLocation} /></ProtectedRoute>} />
        <Route path='/about' element={<About />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}