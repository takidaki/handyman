
import React from 'react';
import { Wrench } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-brand-green-900 text-white shadow-lg p-4 sticky top-0 z-20">
      <div className="container mx-auto flex items-center justify-center">
        <Wrench className="w-6 h-6 mr-3" />
        <h1 className="text-xl font-bold tracking-wider">DIY Pro Assistant</h1>
      </div>
    </header>
  );
};

export default Header;
