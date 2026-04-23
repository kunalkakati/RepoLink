import React from 'react';
import { Plus, Link as LinkIcon, ExternalLink, MousePointerClick } from 'lucide-react';
import { redirect } from 'next/navigation';

const NoLink = () => {
  // Mock function for the primary action
  const handleCreateFirstLink = () => {
    //   console.log("Opening 'Create Link' modal or navigation...");
    redirect('/form');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 my-4 rounded-2xl">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center transition-all hover:shadow-md">
        
        {/* Icon Illustration Container */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 bg-indigo-100 rounded-full animate-pulse opacity-50"></div>
          <div className="relative flex items-center justify-center w-full h-full bg-white rounded-full border-2 border-dashed border-indigo-200">
            <LinkIcon className="w-10 h-10 text-indigo-500" />
            
            {/* Floating small icons for visual interest */}
            <div className="absolute -top-1 -right-1 bg-white p-1.5 rounded-lg shadow-sm border border-slate-100 transform rotate-12">
              <Plus className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="absolute -bottom-1 -left-2 bg-white p-1.5 rounded-lg shadow-sm border border-slate-100 transform -rotate-12">
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          No links available yet
        </h3>
        <p className="text-slate-500 mb-8 leading-relaxed">
          It looks like you have not added any URLs to your collection. 
          Start by creating your first link to organize your resources.
        </p>

        {/* Action Button */}
        <button
          onClick={handleCreateFirstLink}
          className="group relative inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-200 active:scale-[0.98]"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span>Create your First Link</span>
        </button>

        {/* Optional Secondary Tip */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>Pro tip: Use shortcuts to add links faster</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoLink;