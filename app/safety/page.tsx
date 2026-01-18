import { Metadata } from "next";
import {
  Shield,
  UserCheck,
  Eye,
  Lock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Safety Guidelines - CircleHub JnU",
  description: "Stay safe while using CircleHub services",
};

export default function SafetyPage() {
  const safety_tips = [
    {
      icon: UserCheck,
      title: "Verify Identity",
      description:
        "Always verify the identity of the person you're meeting. Use JnU email verification.",
    },
    {
      icon: Eye,
      title: "Meet in Public",
      description:
        "Arrange meetings in public, well-lit campus areas during daytime hours.",
    },
    {
      icon: Lock,
      title: "Protect Personal Info",
      description:
        "Never share sensitive personal information like passwords or financial details.",
    },
    {
      icon: AlertCircle,
      title: "Trust Your Instincts",
      description:
        "If something feels wrong, trust your gut and don't proceed with the interaction.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Safety Guidelines
          </h1>
          <p className="text-lg text-muted-foreground">
            Your safety is our priority. Follow these guidelines to stay safe.
          </p>
        </div>

        {/* Safety Tips */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {safety_tips.map((tip) => (
            <div
              key={tip.title}
              className="bg-card border border-border rounded-lg p-6"
            >
              <tip.icon className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {tip.title}
              </h3>
              <p className="text-muted-foreground">{tip.description}</p>
            </div>
          ))}
        </div>

        {/* Do's and Don'ts */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Do's */}
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-foreground">
                Do&apos;s
              </h2>
            </div>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Use your JnU email for verification</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Meet in public campus locations</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Report suspicious activity immediately</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Keep your account information private</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Communicate through the platform when possible</span>
              </li>
            </ul>
          </div>

          {/* Don'ts */}
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
              <h2 className="text-xl font-semibold text-foreground">
                Don&apos;ts
              </h2>
            </div>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <span className="text-red-600 mr-2">✗</span>
                <span>Don&apos;t share your password with anyone</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">✗</span>
                <span>Don&apos;t meet in isolated or unsafe areas</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">✗</span>
                <span>Don&apos;t ignore red flags or suspicious behavior</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">✗</span>
                <span>Don&apos;t send money before verifying claims</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">✗</span>
                <span>Don&apos;t share financial or ID card details</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Additional Guidelines */}
        <div className="bg-card border border-border rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Additional Safety Measures
          </h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-foreground mb-1">
                For Lost & Found Items
              </h3>
              <p className="text-muted-foreground">
                Request proper identification before returning items. Verify
                ownership through specific details only the owner would know.
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-foreground mb-1">
                For Item Sharing
              </h3>
              <p className="text-muted-foreground">
                Document the condition of items before sharing. Set clear terms
                and return dates. Consider taking photos as proof.
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-foreground mb-1">
                Emergency Contact
              </h3>
              <p className="text-muted-foreground">
                If you feel unsafe or encounter suspicious activity, contact
                campus security immediately or report through our platform.
              </p>
            </div>
          </div>
        </div>

        {/* Report Issues */}
        <div className="mt-8 text-center p-8 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Report Safety Concerns
          </h3>
          <p className="text-muted-foreground mb-4">
            If you encounter any safety issues, please report them immediately.
          </p>
          <a
            href="/report"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Report Issue
          </a>
        </div>
      </div>
    </div>
  );
}
