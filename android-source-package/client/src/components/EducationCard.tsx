import { Clock, ChevronRight, BookOpen, Play, FileText } from "lucide-react";

interface EducationCardProps {
  id: number;
  title: string;
  description: string;
  readTime: number;
  category: string;
  contentType: string;
  difficulty?: string;
  tags?: string[];
  onClick?: () => void;
}

export default function EducationCard({ 
  id, 
  title, 
  description, 
  readTime, 
  category, 
  contentType,
  difficulty,
  tags,
  onClick 
}: EducationCardProps) {
  
  const getContentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video': return <Play className="w-5 h-5 text-white" />;
      case 'article': return <FileText className="w-5 h-5 text-white" />;
      case 'course': return <BookOpen className="w-5 h-5 text-white" />;
      default: return <BookOpen className="w-5 h-5 text-white" />;
    }
  };

  const getIconBgColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'understanding migraines':
      case 'understanding':
        return 'bg-purple-600';
      case 'triggers':
        return 'bg-blue-600';
      case 'treatment':
      case 'treatment options':
        return 'bg-green-600';
      case 'lifestyle':
      case 'prevention':
        return 'bg-teal-600';
      case 'management':
        return 'bg-indigo-600';
      default: 
        return 'bg-purple-600';
    }
  };

  return (
    <div 
      className="bg-[#1A1D29] rounded-2xl p-4 cursor-pointer hover:bg-[#1F2332] transition-colors"
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 ${getIconBgColor(category)} rounded-xl flex items-center justify-center flex-shrink-0`}>
          {getContentIcon(contentType)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold mb-1 line-clamp-2">{title}</h4>
          <p className="text-gray-400 text-sm mb-2 line-clamp-2">{description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-500 text-xs">
              <Clock className="w-3 h-3 mr-1" />
              <span>{readTime} min read</span>
            </div>
            {difficulty && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                {difficulty}
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
      </div>
    </div>
  );
}