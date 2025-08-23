import { useEffect } from "react";
import { useLocation } from "wouter";

export default function MobileHomeScreen() {
  const [location, navigate] = useLocation();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    if (!token || !user) {
      console.log("User not authenticated - redirecting to login");
      navigate("/get-started");
      return;
    }
    
    console.log("User authenticated - showing welcome screen");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">


      <div className="text-center">
        <h1 className="text-white text-2xl font-bold mb-4">Welcome to ZIVORA</h1>
        <p className="text-gray-400">Your migraine tracking journey begins here</p>
      </div>


    </div>
  );
}