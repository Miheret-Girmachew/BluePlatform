import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import CompaniesWeHelped from './components/CompaniesWeHelped';
import CategorySection from './components/CategorySection';
import InternshipSection from './components/InternshipSection';
import Footer from './components/Footer';
import InternshipsPage from './pages/InternshipsPage'; // Import the InternshipsPage
import InternshipDetailsPage from './pages/InternshipDetailsPage'; // Import the InternshipDetailsPage

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <CompaniesWeHelped />
              <CategorySection />
              <InternshipSection />
            </>
          } />
          <Route path="/internships" element={<InternshipsPage />} />
          <Route path="/internships/:id" element={<InternshipDetailsPage />} /> { /* New Route */}
        </Routes>
        <Footer />
        <main>
          {/* We will add the rest of the page content here later */}
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;