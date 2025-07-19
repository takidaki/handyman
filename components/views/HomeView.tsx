
import React, { useState, useRef, useEffect } from 'react';
import { Camera, ImageUp, Send, Star, Trash2 } from 'lucide-react';
import { getAdviceForText, getAdviceForImage } from '../../services/geminiService';
import Card from '../common/Card';
import Spinner from '../common/Spinner';
import FormattedResponse from '../FormattedResponse';
import { Tip } from '../../types';
import PwaInstallBanner from '../common/PwaInstallBanner';

interface HomeViewProps {
  addFavorite: (tip: Tip) => void;
  removeFavorite: (tipId: string) => void;
  isFavorite: (tipId: string) => boolean;
}

const HomeView: React.FC<HomeViewProps> = ({ addFavorite, removeFavorite, isFavorite }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [response, setResponse] = useState<Tip | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if running in a browser tab and if the user hasn't dismissed the banner
    try {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        const installBannerDismissed = localStorage.getItem('installBannerDismissed') === 'true';

        if (!isStandalone && !installBannerDismissed) {
            setShowInstallBanner(true);
        }
    } catch (error) {
        console.error("Could not check for PWA installation status.", error);
    }
  }, []);


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResponse(null);
      setError('');
    }
  };
  
  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
    if(cameraInputRef.current) cameraInputRef.current.value = "";
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Please enter a question.');
      return;
    }

    setIsLoading(true);
    setResponse(null);
    setError('');

    try {
      let advice = '';
      if (imageFile) {
        advice = await getAdviceForImage(prompt, imageFile);
      } else {
        advice = await getAdviceForText(prompt);
      }
      setResponse({
        id: `tip_${Date.now()}`,
        title: prompt,
        content: advice,
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoriteClick = () => {
    if (!response) return;
    if (isFavorite(response.id)) {
      removeFavorite(response.id);
    } else {
      addFavorite(response);
    }
  };

  return (
    <div className="p-4 animate-fade-in">
      {showInstallBanner && <PwaInstallBanner onClose={() => setShowInstallBanner(false)} />}
      <Card className="p-4 mb-4">
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-800 focus:border-brand-green-800 resize-none"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask anything... e.g., 'How do I fix a running toilet?'"
          />
          <div className="flex justify-between items-center mt-2">
             <div className="flex items-center gap-2">
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={handleImageChange} className="hidden" />
                <button type="button" onClick={() => cameraInputRef.current?.click()} className="flex items-center gap-2 p-2 rounded-lg text-brand-green-900 hover:bg-brand-green-100 transition-colors">
                    <Camera className="w-5 h-5" /> <span className="text-sm font-medium">Take Photo</span>
                </button>
                 <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 p-2 rounded-lg text-brand-green-900 hover:bg-brand-green-100 transition-colors">
                    <ImageUp className="w-5 h-5" /> <span className="text-sm font-medium">Upload</span>
                </button>
            </div>
            <button type="submit" disabled={isLoading} className="bg-brand-green-800 text-white px-4 py-2 rounded-lg font-semibold flex items-center hover:bg-brand-green-900 transition-colors disabled:bg-gray-400">
              <Send className="w-4 h-4 mr-2" />
              Ask
            </button>
          </div>
        </form>
         {imagePreview && (
            <div className="mt-4 relative w-32 h-32">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                <button onClick={clearImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        )}
      </Card>
      
      {error && <p className="text-red-500 text-center my-2">{error}</p>}

      {isLoading && (
        <div className="flex flex-col items-center justify-center h-48">
          <Spinner />
          <p className="mt-2 text-gray-600">Getting advice from the pro...</p>
        </div>
      )}

      {response && (
        <Card className="p-4 animate-fade-in">
          <FormattedResponse content={response.content} />
          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleFavoriteClick}
              className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-colors ${
                isFavorite(response.id)
                ? 'bg-brand-brown-100 text-brand-brown-700 hover:bg-red-100' 
                : 'bg-brand-green-100 text-brand-green-900 hover:bg-brand-green-800 hover:text-white'
              }`}
            >
              {isFavorite(response.id) ? <Trash2 className="w-4 h-4 mr-2" /> : <Star className="w-4 h-4 mr-2" />}
              {isFavorite(response.id) ? 'Remove from Favorites' : 'Save to Favorites'}
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default HomeView;
