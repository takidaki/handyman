
import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/views/HomeView';
import GuidesView from './components/views/GuidesView';
import FavoritesView from './components/views/FavoritesView';
import GuideDetailView from './components/views/GuideDetailView';
import { View, GuideCategory } from './types';
import { useFavorites } from './hooks/useFavorites';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('HOME');
  const [selectedGuide, setSelectedGuide] = useState<GuideCategory | null>(null);
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  const handleSelectGuide = (guide: GuideCategory) => {
    setSelectedGuide(guide);
  };

  const handleBackToGuides = () => {
    setSelectedGuide(null);
  };
  
  const handleViewChange = (view: View) => {
    setSelectedGuide(null);
    setCurrentView(view);
  };

  const renderContent = () => {
    if (selectedGuide) {
      return (
        <GuideDetailView 
          guide={selectedGuide} 
          onBack={handleBackToGuides} 
          addFavorite={addFavorite} 
          removeFavorite={removeFavorite} 
          isFavorite={isFavorite}
        />
      );
    }

    switch (currentView) {
      case 'HOME':
        return <HomeView addFavorite={addFavorite} removeFavorite={removeFavorite} isFavorite={isFavorite} />;
      case 'GUIDES':
        return <GuidesView onSelectGuide={handleSelectGuide} />;
      case 'FAVORITES':
        return <FavoritesView favorites={favorites} removeFavorite={removeFavorite} />;
      default:
        return <HomeView addFavorite={addFavorite} removeFavorite={removeFavorite} isFavorite={isFavorite} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-brown-100 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto pb-20">
        {renderContent()}
      </main>
      <Footer currentView={currentView} setView={handleViewChange} />
    </div>
  );
};

export default App;
