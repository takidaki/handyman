
import { ReactNode } from 'react';

export type View = 'HOME' | 'GUIDES' | 'FAVORITES';

export interface Tip {
  id: string;
  title: string;
  content: string;
  isGuide?: boolean;
}

export interface GuideCategory {
  id: string;
  title:string;
  description: string;
  icon: ReactNode;
  prompt: string;
}
