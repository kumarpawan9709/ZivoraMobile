import { useLocation } from "wouter";

export default function GetStartedScreen() {
  const [location, navigate] = useLocation();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="h-screen flex flex-col relative overflow-hidden" style={{ background: '#1a1a2e' }}>
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Brain Emoji Illustration */}
        <div className="mb-12 flex items-center justify-center">
          <div className="w-64 h-48 flex items-center justify-center bg-slate-800 rounded-lg border border-slate-700">
            {/* Happy brain with sparkles SVG */}
            <svg 
              width="200" 
              height="150" 
              viewBox="0 0 200 150" 
              className="object-contain"
              style={{ maxWidth: '100%', height: 'auto' }}
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Detailed Brain Character with emojis around it */}
              <g>
                {/* Main brain body */}
                <ellipse cx="100" cy="85" rx="45" ry="40" fill="#FF69B4"/>
                
                {/* Brain texture - cerebral cortex details */}
                <path d="M 70 70 Q 85 65 100 70 Q 115 65 130 70" stroke="#E91E63" strokeWidth="2" fill="none"/>
                <path d="M 75 80 Q 90 75 100 80 Q 110 75 125 80" stroke="#E91E63" strokeWidth="2" fill="none"/>
                <path d="M 72 90 Q 87 85 100 90 Q 113 85 128 90" stroke="#E91E63" strokeWidth="2" fill="none"/>
                <path d="M 75 100 Q 90 95 100 100 Q 110 95 125 100" stroke="#E91E63" strokeWidth="2" fill="none"/>
                <path d="M 80 110 Q 90 105 100 110 Q 110 105 120 110" stroke="#E91E63" strokeWidth="2" fill="none"/>
                
                {/* Hemisphere division */}
                <path d="M 100 50 L 100 120" stroke="#E91E63" strokeWidth="2" opacity="0.7"/>
                
                {/* Cute facial features */}
                <circle cx="90" cy="78" r="3" fill="#000"/>
                <circle cx="110" cy="78" r="3" fill="#000"/>
                <path d="M 88 95 Q 100 105 112 95" stroke="#000" strokeWidth="3" fill="none"/>
                
                {/* Rosy cheeks */}
                <circle cx="75" cy="88" r="4" fill="#FF8A95" opacity="0.6"/>
                <circle cx="125" cy="88" r="4" fill="#FF8A95" opacity="0.6"/>
              </g>
              
              {/* Surrounding emoji-style elements */}
              {/* Happy faces */}
              <g>
                <circle cx="50" cy="40" r="8" fill="#FFD54F"/>
                <circle cx="47" cy="37" r="1.5" fill="#000"/>
                <circle cx="53" cy="37" r="1.5" fill="#000"/>
                <path d="M 45 42 Q 50 47 55 42" stroke="#000" strokeWidth="1.5" fill="none"/>
              </g>
              
              <g>
                <circle cx="150" cy="35" r="8" fill="#FFD54F"/>
                <circle cx="147" cy="32" r="1.5" fill="#000"/>
                <circle cx="153" cy="32" r="1.5" fill="#000"/>
                <path d="M 145 37 Q 150 42 155 37" stroke="#000" strokeWidth="1.5" fill="none"/>
              </g>
              
              <g>
                <circle cx="35" cy="100" r="8" fill="#81C784"/>
                <circle cx="32" cy="97" r="1.5" fill="#000"/>
                <circle cx="38" cy="97" r="1.5" fill="#000"/>
                <path d="M 30 102 Q 35 107 40 102" stroke="#000" strokeWidth="1.5" fill="none"/>
              </g>
              
              <g>
                <circle cx="170" cy="110" r="8" fill="#64B5F6"/>
                <circle cx="167" cy="107" r="1.5" fill="#000"/>
                <circle cx="173" cy="107" r="1.5" fill="#000"/>
                <path d="M 165 112 Q 170 117 175 112" stroke="#000" strokeWidth="1.5" fill="none"/>
              </g>
              
              {/* Musical notes */}
              <g fill="#9C27B0">
                <circle cx="60" cy="60" r="3"/>
                <rect x="63" y="50" width="1.5" height="15"/>
                <path d="M 63 50 Q 68 48 70 52" stroke="#9C27B0" strokeWidth="1.5" fill="none"/>
              </g>
              
              <g fill="#FF5722">
                <circle cx="140" cy="50" r="3"/>
                <rect x="143" y="40" width="1.5" height="15"/>
                <path d="M 143 40 Q 148 38 150 42" stroke="#FF5722" strokeWidth="1.5" fill="none"/>
              </g>
              
              {/* Hearts */}
              <g fill="#E91E63">
                <path d="M 25 75 C 25 72, 27 70, 30 70 C 33 70, 35 72, 35 75 C 35 78, 30 83, 30 83 C 30 83, 25 78, 25 75 Z"/>
                <path d="M 175 75 C 175 72, 177 70, 180 70 C 183 70, 185 72, 185 75 C 185 78, 180 83, 180 83 C 180 83, 175 78, 175 75 Z"/>
              </g>
              
              {/* Stars */}
              <g fill="#FFC107">
                <path d="M 45 120 L 47 125 L 52 125 L 48 128 L 50 133 L 45 130 L 40 133 L 42 128 L 38 125 L 43 125 Z"/>
                <path d="M 155 130 L 157 135 L 162 135 L 158 138 L 160 143 L 155 140 L 150 143 L 152 138 L 148 135 L 153 135 Z"/>
              </g>
              
              {/* Sparkle effects */}
              <g fill="#FFEB3B">
                <circle cx="70" cy="30" r="2"/>
                <circle cx="130" cy="25" r="2"/>
                <circle cx="25" cy="120" r="2"/>
                <circle cx="175" cy="125" r="2"/>
              </g>
            </svg>
          </div>
        </div>

        {/* Header Text */}
        <div className="text-center mb-8">
          <h1 className="text-white text-2xl font-bold mb-3">
            Get Started with <span className="text-purple-500">Zivora</span>
          </h1>
          <p className="text-gray-400 text-base">
            Create your account or sign in to continue
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-4 mb-6">
          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-4 px-6 rounded-2xl transition-colors"
          >
            Login
          </button>

          {/* Sign Up Button */}
          <button
            onClick={handleSignUp}
            className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-4 px-6 rounded-2xl transition-colors"
          >
            Sign Up
          </button>
        </div>





        {/* Terms and Privacy */}
        <p className="text-gray-500 text-xs text-center px-4 leading-relaxed">
          By signing up or logging in, I accept the Zivora{" "}
          <button
            onClick={() => navigate("/terms")}
            className="text-purple-400 underline hover:text-purple-300"
          >
            Terms of Service
          </button> and{" "}
          <button
            onClick={() => navigate("/privacy")}
            className="text-purple-400 underline hover:text-purple-300"
          >
            Privacy Policy
          </button>
        </p>
      </div>


    </div>
  );
}