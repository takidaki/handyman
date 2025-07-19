
import React from 'react';
import { Home, Wrench, Star } from 'lucide-react';
import { View } from '../types';

interface FooterProps {
  currentView: View;
  setView: (view: View) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  const activeClasses = 'text-brand-green-800';
  const inactiveClasses = 'text-gray-500 hover:text-brand-green-800';

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

const Footer: React.FC<FooterProps> = ({ currentView, setView }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-20">
      <div className="container mx-auto flex justify-around h-16">
        <NavItem
          icon={<Home className="w-6 h-6 mb-1" />}
          label="Home"
          isActive={currentView === 'HOME'}
          onClick={() => setView('HOME')}
        />
        <NavItem
          icon={<Wrench className="w-6 h-6 mb-1" />}
          label="Guides"
          isActive={currentView === 'GUIDES'}
          onClick={() => setView('GUIDES')}
        />
        <NavItem
          icon={<Star className="w-6 h-6 mb-1" />}
          label="Favorites"
          isActive={currentView === 'FAVORITES'}
          onClick={() => setView('FAVORITES')}
        />
      </div>
    </footer>
  );
};

export default Footer;
