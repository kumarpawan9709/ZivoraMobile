import { ArrowLeft, Home, BarChart3, Calendar, MessageCircle, Settings, Search } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import ComingSoonPopup from "./ComingSoonPopup";

export default function PrivacyPolicyScreen() {
  const [location, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("Privacy");
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleBackClick = () => {
    navigate('/settings');
  };

  const handleSearchClick = () => {
    setShowComingSoon(true);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Mobile Header */}
      <div className="bg-gray-800 px-4 py-4 flex items-center justify-between">
        <button 
          onClick={handleBackClick}
          className="p-2 hover:bg-gray-700 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-lg font-semibold">
          {activeTab === "Terms" ? "Terms & Conditions" : "Privacy Policy"}
        </h1>
        <button 
          onClick={handleSearchClick}
          className="p-2 hover:bg-gray-700 rounded-full transition-colors"
        >
          <Search className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-800 px-4 py-3 flex gap-2">
        <button
          onClick={() => setActiveTab("Terms")}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "Terms" 
              ? "bg-gray-700 text-white" 
              : "bg-transparent text-gray-500"
          }`}
        >
          Terms
        </button>
        <button
          onClick={() => setActiveTab("Privacy")}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "Privacy" 
              ? "bg-gray-700 text-white" 
              : "bg-transparent text-gray-500"
          }`}
        >
          Privacy
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6 pb-20">
        {activeTab === "Terms" && (
          <>
            {/* User Agreement Section */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">User Agreement</h2>
              <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                <p>
                  By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <p>
                  This application provides users with access to a rich collection of resources, including various communications tools, forums, shopping services, search services, and personalized content.
                </p>
                <p>
                  You are responsible for maintaining the confidentiality of your account information that occur under your account. You agree to immediately notify us of any unauthorized use of your account.
                </p>
              </div>
            </section>

            {/* License Section */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">License</h2>
              <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                <p>
                  Permission is granted to temporarily download one copy of the materials on this application for personal, non-commercial transitory viewing only.
                </p>
                <p>This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to reverse engineer any software contained in the application</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                </ul>
                <p>
                  This license shall automatically terminate if you violate any of these restrictions and may be terminated by us at any time.
                </p>
              </div>
            </section>

            {/* Liability Section */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Liability</h2>
              <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                <p>
                  The materials within this application are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
                <p>
                  In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this application.
                </p>
                <p>
                  You acknowledge that you use this application at your own risk and that we shall not be liable for any direct, indirect, incidental, special, or consequential damages.
                </p>
              </div>
            </section>

            {/* Governing Law Section */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Governing Law</h2>
              <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                <p>
                  These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which our company is incorporated and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
                </p>
                <p>
                  Any legal action or proceeding arising under this agreement will be brought exclusively in courts located in our jurisdiction, and the parties hereby irrevocably consent to the personal jurisdiction and venue therein.
                </p>
                <p>
                  If any provision of these terms is deemed invalid or unenforceable, the remaining provisions shall remain in full force and effect.
                </p>
              </div>
            </section>
          </>
        )}

        {activeTab === "Privacy" && (
          <>
            {/* Data Collection Section */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Data Collection</h2>
              <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                <p>
                  We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This may include your name, email address, and usage data.
                </p>
                <p>
                  We automatically collect certain information about your device and usage patterns when you use our app, including device identifiers, operating system information, and app usage statistics.
                </p>
              </div>
            </section>

            {/* Usage of Information Section */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Usage of Information</h2>
              <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                <p>
                  We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you about your account and our services.
                </p>
                <p>
                  Your data helps us personalize your experience, analyze usage patterns, and develop new features that better serve our users needs.
                </p>
              </div>
            </section>

            {/* User Rights Section */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">User Rights</h2>
              <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                <p>
                  You have the right to access, update, or delete your personal information at any time through your account settings or by contacting our support team.
                </p>
                <p>
                  You may also request a copy of your data, restrict processing, or withdraw consent where applicable under relevant privacy laws.
                </p>
              </div>
            </section>

            {/* Third-Party Services Section */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Third-Party Services</h2>
              <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                <p>
                  We may share your information with trusted third-party service providers who assist us in operating our app and providing services to you.
                </p>
                <p>
                  These partners are bound by confidentiality agreements and are only permitted to use your information for the specific purposes they provide to us.
                </p>
              </div>
            </section>

            {/* Contact Us Section */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Contact Us</h2>
              <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                <p>
                  If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@example.com or through the app's support section.
                </p>
                <p className="text-gray-400 text-xs">Last updated: Jun 15, 2025</p>
              </div>
            </section>
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-4 py-2">
        <div className="flex justify-around items-center">
          <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center p-2">
            <Home className="w-6 h-6 text-gray-400" />
          </button>
          <button className="flex flex-col items-center p-2">
            <BarChart3 className="w-6 h-6 text-gray-400" />
          </button>
          <button className="flex flex-col items-center p-2">
            <Calendar className="w-6 h-6 text-gray-400" />
          </button>
          <button className="flex flex-col items-center p-2">
            <MessageCircle className="w-6 h-6 text-gray-400" />
          </button>
          <button className="flex flex-col items-center p-2">
            <Settings className="w-6 h-6 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Coming Soon Popup */}
      <ComingSoonPopup
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
        featureName="Search"
      />
    </main>
  );
}