// Zivora Logo SVG Component
export default function ZivoraLogo({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <div className={`${className} bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl`}>
      <svg 
        width="60%" 
        height="60%" 
        viewBox="0 0 100 100" 
        className="text-white"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Brain outline */}
        <path
          d="M50 20 C 35 20, 25 30, 25 45 C 25 55, 28 62, 33 67 C 36 72, 42 75, 50 75 C 58 75, 64 72, 67 67 C 72 62, 75 55, 75 45 C 75 30, 65 20, 50 20 Z"
          fill="currentColor"
          stroke="white"
          strokeWidth="2"
        />
        
        {/* Brain details */}
        <path
          d="M 35 40 Q 45 35 55 40 Q 60 45 55 50 Q 45 55 35 50 Q 30 45 35 40"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
        />
        
        <path
          d="M 40 50 Q 50 45 60 50"
          fill="none"
          stroke="white"
          strokeWidth="1"
        />
        
        {/* Central highlight */}
        <circle
          cx="50"
          cy="47"
          r="3"
          fill="rgba(255,255,255,0.8)"
        />
      </svg>
    </div>
  );
}