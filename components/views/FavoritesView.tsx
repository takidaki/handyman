
import React from 'react';
import { Trash2, Star } from 'lucide-react';
import { Tip } from '../../types';
import Card from '../common/Card';
import FormattedResponse from '../FormattedResponse';

interface FavoritesViewProps {
  favorites: Tip[];
  removeFavorite: (tipId: string) => void;
}

const FavoritesView: React.FC<FavoritesViewProps> = ({ favorites, removeFavorite }) => {
  return (
    <div className="p-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-brand-green-900 mb-4">Favorite Tips</h2>
      {favorites.length === 0 ? (
        <Card className="p-8 text-center text-gray-500">
          <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>You haven't saved any tips yet.</p>
          <p className="text-sm">Tips you save from the Home screen or Guides will appear here.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {favorites.map((tip) => (
            <Card key={tip.id} className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-brand-green-900 mb-2">{tip.title}</h3>
                <button
                  onClick={() => removeFavorite(tip.id)}
                  className="p-2 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors"
                  aria-label="Remove from favorites"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <FormattedResponse content={tip.content} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesView;
