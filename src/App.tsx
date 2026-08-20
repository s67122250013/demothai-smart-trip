import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { PlaceDetailModal } from './components/PlaceDetailModal';
import { AuthModal } from './components/AuthModal';

import { HomeView } from './views/HomeView';
import { DiscoverView } from './views/DiscoverView';
import { SubmitPlaceView } from './views/SubmitPlaceView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { ProfileView } from './views/ProfileView';

function AppContent() {
  const { 
    currentView, 
    selectedPlaceId, 
    setSelectedPlaceId 
  } = useApp();

  // Check URL query param for direct place sharing e.g. /?placeId=12
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pId = urlParams.get('placeId');
    if (pId) {
      const parsed = parseInt(pId, 10);
      if (!isNaN(parsed) && parsed > 0) {
        setSelectedPlaceId(parsed);
      }
    }
  }, [setSelectedPlaceId]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9] text-[#172033] font-sans selection:bg-emerald-600 selection:text-white">
      
      {/* Global Top Navbar */}
      <Navbar />

      {/* Dynamic View Router */}
      <main className="flex-1">
        {currentView === 'home' && <HomeView />}
        {currentView === 'discover' && <DiscoverView />}
        {currentView === 'submit_place' && <SubmitPlaceView />}
        {currentView === 'admin' && <AdminDashboardView />}
        {currentView === 'profile' && <ProfileView />}
      </main>

      {/* Destination Detail Modal */}
      <PlaceDetailModal
        placeId={selectedPlaceId}
        onClose={() => setSelectedPlaceId(null)}
      />

      {/* Authentication Modal */}
      <AuthModal />

      {/* Global Toast Notifications */}
      <ToastContainer />

      {/* Global Bottom Footer */}
      <Footer />

    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;