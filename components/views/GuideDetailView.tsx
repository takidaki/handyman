
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Trash2 } from 'lucide-react';
import { GuideCategory, Tip } from '../../types';
import { getAdviceForText } from '../../services/geminiService';
import Card from '../common/Card';
import Spinner from '../common/Spinner';
import FormattedResponse from '../FormattedResponse';

interface GuideDetailViewProps {
  guide: GuideCategory;
  onBack: () => void;
  addFavorite: (tip: Tip) => void;
  removeFavorite: (tipId: string) => void;
  isFavorite: (tipId: string) => boolean;
}

const GuideDetailView: React.FC<GuideDetailViewProps> = ({ guide, onBack, addFavorite, removeFavorite, isFavorite }) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const tip: Tip = { id: guide.id, title: guide.title, content, isGuide: true };
  const favorite = isFavorite(tip.id);

  useEffect(() => {
    const fetchGuideContent = async () => {
      setIsLoading(true);
      const guideContent = await getAdviceForText(guide.prompt);
      setContent(guideContent);
      setIsLoading(false);
    };
    fetchGuideContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guide]);
  
  const handleFavoriteClick = () => {
    if (favorite) {
      removeFavorite(tip.id);
    } else {
      addFavorite({ ...tip, content }); // Ensure content is up-to-date
    }
  };

  return (
    <div className="p-4 animate-fade-in">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-brand-brown-100 transition-colors">
          <ArrowLeft className="w-6 h-6 text-brand-green-900" />
        </button>
        <h2 className="text-2xl font-bold text-brand-green-900">{guide.title}</h2>
      </div>
      <Card className="p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-48">
            <Spinner />
            <p className="mt-2 text-gray-600">Loading guide...</p>
          </div>
        ) : (
          <>
            <FormattedResponse content={content} />
            <div className="mt-6 flex justify-end">
               <button 
                  onClick={handleFavoriteClick}
                  className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-colors ${
                    favorite 
                    ? 'bg-brand-brown-100 text-brand-brown-700 hover:bg-red-100' 
                    : 'bg-brand-green-100 text-brand-green-900 hover:bg-brand-green-800 hover:text-white'
                  }`}
                >
                  {favorite ? <Trash2 className="w-4 h-4 mr-2" /> : <Star className="w-4 h-4 mr-2" />}
                  {favorite ? 'Remove from Favorites' : 'Save to Favorites'}
                </button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default GuideDetailView;
