import { useState, useEffect } from 'react';
import Navbar from "./components/Navbar";
import { Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage";
import Loading from "./components/Loading";
import Footer from './components/Footer';
import Scanner from './pages/Upload';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay (e.g., fetching data)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulated 2 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white">
      
      {loading ? (
        <Loading />
      ) : (
       <> 
        <Navbar />
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/upload" element={<Scanner/>}/>
        </Routes>
        <Footer/>
      </>
      )}
    </div>
  );
}

export default App;
