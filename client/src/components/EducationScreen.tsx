import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Search, BookOpen, Clock, ChevronRight, Play, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import BottomNavigation from './BottomNavigation';
import EducationCard from './EducationCard';

interface EducationalContent {
  id: number;
  title: string;
  category: string;
  contentType: string;
  description: string;
  readTime: number;
  difficulty: string;
  tags: string[];
  rating?: number;
  isCompleted?: boolean;
  progress?: number;
}

interface RecentContent {
  id: number;
  title: string;
  lastAccessed: string;
}

export default function EducationScreen() {
  const [location, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('All Topics');

  // Get authenticated user ID from token
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId;
    } catch {
      return null;
    }
  };
  
  const userId = getUserIdFromToken() || 2;

  // Fetch categories dynamically
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/educational-content/categories'],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/educational-content/categories', {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      const cats = await response.json();
      return ['All Topics', ...cats];
    }
  });

  // Fetch educational content with category filtering
  const { data: educationalContent, isLoading: contentLoading } = useQuery({
    queryKey: ['/api/educational-content', activeTab],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const url = activeTab === 'All Topics' 
        ? '/api/educational-content'
        : `/api/educational-content?category=${encodeURIComponent(activeTab)}`;
      const response = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch educational content');
      return response.json();
    }
  });

  // Fetch user progress
  const { data: userProgress } = useQuery({
    queryKey: ['/api/user-progress'],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/user-progress', {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch user progress');
      return response.json();
    }
  });

  // Fetch recently viewed content
  const { data: recentContent } = useQuery({
    queryKey: ['/api/educational-content/recent'],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/educational-content/recent', {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch recent content');
      return response.json();
    }
  });

  // Handle content click and mark as viewed
  const handleContentClick = async (contentId: number) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`/api/educational-content/${contentId}/view`, {
        method: 'POST',
        headers: { "Authorization": `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Failed to mark content as viewed:', error);
    }
  };

  // Format time ago for recently viewed
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  if (contentLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading Education Content...</p>
        </div>
      </div>
    );
  }

  // Show error state if no data available
  if (!educationalContent || educationalContent.length === 0) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-white pb-20">
        <div className="flex items-center justify-between p-4 bg-[#1E293B]">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-lg font-semibold">Education</h1>
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>
        
        <div className="flex flex-col items-center justify-center h-96">
          <BookOpen className="w-16 h-16 text-gray-500 mb-4" />
          <h3 className="text-white text-lg font-semibold mb-2">No Content Available</h3>
          <p className="text-gray-400 text-center px-8">Educational content will appear here when available.</p>
        </div>
        
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#1E293B]">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-white text-lg font-semibold">Education</h1>
        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
          <Search className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="p-4">
        {/* Featured Content Card */}
        <div 
          className="rounded-xl p-4 mb-6 relative transition-all duration-300 hover:shadow-[0_0_8px_rgba(150,100,255,0.3)]"
          style={{
            background: 'linear-gradient(#12141D, #12141D) padding-box, linear-gradient(90deg, #975EFF, #53D4FF) border-box',
            border: '1px solid transparent'
          }}
        >
          <div className="flex items-start gap-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#181A27' }}
            >
              <BookOpen className="w-5 h-5" style={{ color: '#A88CFF' }} />
            </div>
            <div className="flex-1">
              <h3 className="text-white text-base font-semibold mb-1.5 leading-tight">Understanding Migraine Triggers</h3>
              <p className="text-sm leading-snug mb-2" style={{ color: '#AAAAAA' }}>Learn how to identify and manage your personal migraine triggers</p>
              <p className="text-xs" style={{ color: '#888888' }}>10 min read</p>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-3 mb-6 overflow-x-auto pb-1">
          {categories?.map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                activeTab === category
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                  : 'bg-[#1E293B] text-gray-300 hover:bg-[#2A3441] hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Content List */}
        <div className="space-y-4 mb-8">
          {educationalContent?.map((content: EducationalContent) => (
            <EducationCard
              key={content.id}
              id={content.id}
              title={content.title}
              description={content.description}
              readTime={content.readTime}
              category={content.category}
              contentType={content.contentType}
              difficulty={content.difficulty}
              tags={content.tags}
              onClick={() => handleContentClick(content.id)}
            />
          ))}
        </div>

        {/* Recommended Reading Section - Dynamic content only */}
        {educationalContent?.filter(content => content.contentType === 'course' || content.difficulty === 'advanced').length > 0 && (
          <div className="mb-8">
            <h3 className="text-white font-semibold text-lg mb-4">Recommended Reading</h3>
            <div className="space-y-3">
              {educationalContent
                ?.filter(content => content.contentType === 'course' || content.difficulty === 'advanced')
                .slice(0, 2)
                .map((content) => (
                  <div key={content.id} className="bg-[#1A1D29] rounded-2xl p-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-1 text-base">{content.title}</h4>
                        <p className="text-gray-400 text-sm mb-2">{content.description}</p>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-400 text-sm">{content.readTime} min</span>
                          </div>
                          <span className="text-blue-400 text-sm">{content.difficulty}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Quick Tips Section - Dynamic content only */}
        {educationalContent?.filter(content => content.contentType === 'tip').length > 0 && (
          <div className="mb-8">
            <h3 className="text-white font-semibold text-lg mb-4">Quick Tips</h3>
            <div className="space-y-3">
              {educationalContent
                ?.filter(content => content.contentType === 'tip')
                .slice(0, 3)
                .map((tip) => (
                  <div key={tip.id} className="bg-[#1A1D29] rounded-xl p-4 border-l-4 border-purple-500">
                    <h4 className="text-white font-semibold mb-2">{tip.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{tip.description}</p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Section - Dynamic content only */}
        {recentContent && recentContent.length > 0 && (
          <div className="mb-8">
            <h3 className="text-white font-semibold text-lg mb-4">Recently Viewed</h3>
            <div className="space-y-3">
              {recentContent.map((content: any) => (
                <div key={content.id} className="flex items-center justify-between bg-[#1A1D29] rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white text-base font-medium">{content.title}</h4>
                      <p className="text-gray-400 text-sm">{getTimeAgo(content.lastAccessed || content.createdAt)}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}