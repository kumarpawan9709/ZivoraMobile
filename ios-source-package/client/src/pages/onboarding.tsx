import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function OnboardingScreen() {
  return (
    <div className="min-h-screen bg-zivora-dark flex items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-zivora-purple rounded-full flex items-center justify-center">
              <ArrowRight className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">
            Onboarding Screen
          </h1>
          
          <p className="text-center text-gray-600 mb-6">
            Next screen: "Migraine is more than a headache."
          </p>
          
          <div className="text-center">
            <p className="text-sm text-zivora-purple font-medium">
              Successfully navigated from splash screen!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
