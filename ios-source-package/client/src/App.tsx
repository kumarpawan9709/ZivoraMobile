import { Route, Switch } from "wouter";
import { useEffect, useState } from "react";
import { SplashScreen as CapacitorSplashScreen } from '@capacitor/splash-screen';
import LoadingScreen from "@/components/LoadingScreen";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

// Import onboarding and auth screens
import MobileOnboardingScreen from "@/components/MobileOnboardingScreen";
import MobileOnboarding2Screen from "@/components/MobileOnboarding2Screen";
import MobileOnboarding3Screen from "@/components/MobileOnboarding3Screen";
import GetStartedScreen from "@/components/GetStartedScreen";
import LoginScreen from "@/components/LoginScreen";
import SignUpScreen from "@/components/SignUpScreen";
import DashboardScreen from "@/components/DashboardScreen";
import CreateProfileScreen from "@/components/CreateProfileScreen";
import SettingsScreen from "@/components/SettingsScreen";
import PrivacyPolicyScreen from "@/components/PrivacyPolicyScreen";
import TermsOfServiceScreen from "@/components/TermsOfServiceScreen";
import { HelpSupportScreen } from "@/components/HelpSupportScreen";
import RiskScoreScreen from "@/components/RiskScoreScreen";
import DailyLogScreen from "@/components/DailyLogScreen";
import InsightsScreen from "@/components/InsightsScreen";
import HistoryScreen from "@/components/HistoryScreen";
import EducationScreen from "@/components/EducationScreen";
import LogSymptomsScreen from "@/components/LogSymptomsScreen";
import AddFoodScreen from "@/components/AddFoodScreen";
import NotificationsScreen from "@/components/NotificationsScreen";
import EditProfileScreen from "@/components/EditProfileScreen";
import ExportHealthDataScreen from "@/components/ExportHealthDataScreen";
import FoodHistoryScreen from "@/components/FoodHistoryScreen";
import ForgotPasswordScreen from "@/components/ForgotPasswordScreen";
import AnalysisReportScreen from "@/components/AnalysisReportScreen";
import PersonalInfoScreen from "@/components/PersonalInfoScreen";
import MobileHomeScreen from "@/components/MobileHomeScreen";
import AuthScreen from "@/components/AuthScreen";
import MainMenuScreen from "@/components/MainMenuScreen";
import MedicationsScreen from "@/components/MedicationsScreen";
// MobileSplashScreen removed - direct launch to onboarding
import PrivacySecurityScreen from "@/components/PrivacySecurityScreen";
// import SplashScreen from "@/components/SplashScreen"; // REMOVED FOR INSTANT LAUNCH

// App with loading splash screen
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    console.log('App mounted successfully');
    // Hide Capacitor splash screen and show our custom loading screen
    const initializeApp = async () => {
      try {
        // Hide Capacitor splash screen immediately
        await CapacitorSplashScreen.hide({
          fadeOutDuration: 0
        });
        console.log('Capacitor splash screen hidden');
      } catch (error) {
        // Capacitor not available or already hidden
        console.log('Splash screen handling skipped:', error);
      }
      
      // Mark app as ready after brief initialization
      setTimeout(() => {
        setIsAppReady(true);
      }, 200);
    };
    
    initializeApp();
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  console.log('App rendering...');

  // Show loading screen while app initializes
  if (isLoading || !isAppReady) {
    return <LoadingScreen onComplete={handleLoadingComplete} minDuration={1200} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen" style={{ background: '#1a1a2e' }}>
        <Switch>
          {/* DIRECT LAUNCH TO ONBOARDING - NO SPLASH SCREEN */}
          <Route path="/" component={MobileOnboardingScreen} />
          <Route path="/mobile-onboarding-1" component={MobileOnboardingScreen} />
          <Route path="/mobile-onboarding" component={MobileOnboardingScreen} />
          <Route path="/mobile-onboarding-2" component={MobileOnboarding2Screen} />
          <Route path="/mobile-onboarding-3" component={MobileOnboarding3Screen} />
          <Route path="/get-started" component={GetStartedScreen} />
          <Route path="/login" component={LoginScreen} />
          <Route path="/signup" component={SignUpScreen} />
          <Route path="/dashboard" component={DashboardScreen} />
          <Route path="/create-profile" component={CreateProfileScreen} />
          <Route path="/settings" component={SettingsScreen} />
          <Route path="/privacy" component={PrivacyPolicyScreen} />
          <Route path="/terms" component={TermsOfServiceScreen} />
          <Route path="/help" component={HelpSupportScreen} />
          <Route path="/risk-score" component={RiskScoreScreen} />
          <Route path="/daily-log" component={DailyLogScreen} />
          <Route path="/insights" component={InsightsScreen} />
          <Route path="/history" component={HistoryScreen} />
          <Route path="/education" component={EducationScreen} />
          <Route path="/log-symptoms" component={LogSymptomsScreen} />
          <Route path="/add-food" component={AddFoodScreen} />
          <Route path="/notifications" component={NotificationsScreen} />
          <Route path="/edit-profile" component={EditProfileScreen} />
          <Route path="/export-health-data" component={ExportHealthDataScreen} />
          <Route path="/food-history" component={FoodHistoryScreen} />
          <Route path="/forgot-password" component={ForgotPasswordScreen} />
          <Route path="/analysis-report" component={AnalysisReportScreen} />
          <Route path="/personal-info" component={PersonalInfoScreen} />
          <Route path="/home" component={MobileHomeScreen} />
          <Route path="/auth" component={AuthScreen} />
          <Route path="/main-menu" component={MainMenuScreen} />
          <Route path="/medications" component={MedicationsScreen} />
          <Route path="/privacy-security" component={PrivacySecurityScreen} />
          {/* SPLASH SCREENS REMOVED FROM ROUTING */}
          <Route>
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#1a1a2e' }}>
              <div className="text-white text-lg">Page not found</div>
            </div>
          </Route>
        </Switch>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;