
import React from 'react';
import { GUIDE_CATEGORIES } from '../../constants';
import { GuideCategory } from '../../types';
import Card from '../common/Card';

interface GuidesViewProps {
  onSelectGuide: (guide: GuideCategory) => void;
}

const GuidesView: React.FC<GuidesViewProps> = ({ onSelectGuide }) => {
  return (
    <div className="p-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-brand-green-900 mb-4">DIY Guides</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GUIDE_CATEGORIES.map((guide) => (
          <Card key={guide.id} onClick={() => onSelectGuide(guide)} className="p-4">
            <div className="flex items-center">
              <div className="p-3 bg-brand-brown-100 rounded-full mr-4">
                {guide.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-brand-green-900">{guide.title}</h3>
                <p className="text-gray-600">{guide.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GuidesView;
