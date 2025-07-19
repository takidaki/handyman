
import React from 'react';
import { Wrench, Zap, PaintRoller, Axe } from 'lucide-react';
import { GuideCategory } from './types';

export const GUIDE_CATEGORIES: GuideCategory[] = [
  {
    id: 'plumbing',
    title: 'Plumbing Basics',
    description: 'Fix leaks, clogs, and more.',
    icon: <Wrench className="w-8 h-8 text-brand-brown-700" />,
    prompt: 'Provide a step-by-step beginner\'s guide to fixing a leaky faucet under a sink. Include a list of necessary tools.',
  },
  {
    id: 'electrical',
    title: 'Simple Electrical',
    description: 'Change outlets and light fixtures.',
    icon: <Zap className="w-8 h-8 text-brand-brown-700" />,
    prompt: 'Explain how to safely replace a standard light switch. Emphasize all safety precautions, especially turning off the power at the circuit breaker.',
  },
  {
    id: 'painting',
    title: 'Painting Techniques',
    description: 'Tips for a perfect paint job.',
    icon: <PaintRoller className="w-8 h-8 text-brand-brown-700" />,
    prompt: 'Give a comprehensive guide for painting an interior room. Cover surface preparation, priming, cutting in, and rolling techniques for a professional finish.',
  },
  {
    id: 'woodworking',
    title: 'Beginner Woodworking',
    description: 'Build simple and useful projects.',
    icon: <Axe className="w-8 h-8 text-brand-brown-700" />,
    prompt: 'Provide instructions for building a simple wooden floating shelf. Include a materials list, tool list, and step-by-step building and mounting instructions.',
  },
];
