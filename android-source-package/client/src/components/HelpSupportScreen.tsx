import { useState } from "react";
import { ChevronLeft, ChevronDown, ChevronRight, Phone, MessageCircle, Book, Users, PlayCircle, Send } from "lucide-react";
import { useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import ComingSoonPopup from "./ComingSoonPopup";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface HelpResource {
  id: number;
  title: string;
  description: string;
  type: string;
  url?: string;
  iconName: string;
}

export function HelpSupportScreen() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState("");

  // Fetch FAQs
  const { data: faqs = [], isLoading: faqsLoading } = useQuery<FAQ[]>({
    queryKey: ["/api/support/faqs"],
  });

  // Fetch help resources
  const { data: helpResources = [], isLoading: resourcesLoading } = useQuery<HelpResource[]>({
    queryKey: ["/api/support/help-resources"],
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ email, message }: { email: string; message: string }) => {
      return await apiRequest("POST", "/api/support/tickets", { 
        email, 
        message, 
        subject: "Support Request from Help Screen" 
      });
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully",
        description: "We'll get back to you within 24 hours",
      });
      setEmail("");
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/support/tickets"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFaqToggle = (faqId: number) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const handleResourceClick = (resourceTitle: string) => {
    setComingSoonFeature(resourceTitle);
    setShowComingSoon(true);
  };

  const handleSendMessage = () => {
    if (!email.trim() || !message.trim()) {
      toast({
        title: "Required fields",
        description: "Please fill in both email and message fields",
        variant: "destructive",
      });
      return;
    }
    sendMessageMutation.mutate({ email: email.trim(), message: message.trim() });
  };

  const handleContactSupport = () => {
    // Navigate to contact form or open email client
    window.location.href = "mailto:support@zivora.com?subject=Support Request";
  };

  const handleCallUs = () => {
    // Open phone dialer
    window.location.href = "tel:+1-800-ZIVORA";
  };

  const getResourceIcon = (iconName: string) => {
    switch (iconName) {
      case "book-open":
        return <Book className="w-5 h-5" />;
      case "users":
        return <Users className="w-5 h-5" />;
      case "play-circle":
        return <PlayCircle className="w-5 h-5" />;
      default:
        return <Book className="w-5 h-5" />;
    }
  };



  return (
    <div className="min-h-screen bg-[#2C3E50] text-white relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-600">
        <button
          onClick={() => navigate("/settings")}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-lg font-medium text-white">Help & Support</h1>
        <div className="w-10"></div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Contact Support Button */}
        <button
          onClick={handleContactSupport}
          className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white py-4 px-6 rounded-xl font-medium text-center flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Contact Support</span>
        </button>

        {/* Call Us Button */}
        <button
          onClick={handleCallUs}
          className="w-full bg-[#1E293B] text-white py-4 px-6 rounded-xl font-medium text-center flex items-center justify-center space-x-2 hover:bg-[#334155] transition-colors"
        >
          <Phone className="w-5 h-5" />
          <span>Call Us</span>
        </button>

        {/* Frequently Asked Questions */}
        <div className="space-y-4">
          <h2 className="text-white font-medium text-lg">Frequently Asked Questions</h2>
          
          <div className="space-y-3">
            {faqsLoading ? (
              <div className="text-gray-400">Loading FAQs...</div>
            ) : (
              faqs.map((faq) => (
                <div key={faq.id} className="bg-[#1A1D29] rounded-xl overflow-hidden">
                  <button
                    onClick={() => handleFaqToggle(faq.id)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-[#1F2332] transition-colors"
                  >
                    <span className="text-white font-medium">{faq.question}</span>
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedFaq === faq.id ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="px-4 pb-4">
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Send us a message */}
        <div className="space-y-4">
          <h2 className="text-white font-medium text-lg">Send us a message</h2>
          
          <div className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="your-email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#4A5568] border-[#4A5568] text-white placeholder-gray-400 focus:ring-[#8B5CF6] focus:border-[#8B5CF6]"
              />
            </div>
            
            <div>
              <Textarea
                placeholder="Describe your issue or question..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="bg-[#4A5568] border-[#4A5568] text-white placeholder-gray-400 focus:ring-[#8B5CF6] focus:border-[#8B5CF6] resize-none"
              />
            </div>
            
            <Button
              onClick={handleSendMessage}
              disabled={sendMessageMutation.isPending}
              className="w-full bg-[#6366F1] hover:bg-[#5855EB] text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </Button>
          </div>
        </div>

        {/* More Resources */}
        <div className="space-y-4">
          <h2 className="text-white font-medium text-lg">More Resources</h2>
          
          <div className="space-y-3">
            {resourcesLoading ? (
              <div className="text-gray-400">Loading resources...</div>
            ) : (
              helpResources.map((resource) => (
                <button
                  key={resource.id}
                  onClick={() => handleResourceClick(resource.title)}
                  className="w-full bg-[#1A1D29] rounded-xl p-4 text-left flex items-center justify-between hover:bg-[#1F2332] transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-gray-400">
                      {getResourceIcon(resource.iconName)}
                    </div>
                    <span className="text-white font-medium">{resource.title}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Coming Soon Popup */}
      <ComingSoonPopup
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
        featureName={comingSoonFeature}
      />
    </div>
  );
}