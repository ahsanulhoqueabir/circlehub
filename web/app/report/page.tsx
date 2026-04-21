import { Metadata } from "next";
import { AlertTriangle, Mail, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Report Issue - CircleHub JnU",
  description: "Report technical issues or concerns",
};

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Report an Issue
          </h1>
          <p className="text-lg text-muted-foreground">
            Help us improve by reporting technical issues or concerns
          </p>
        </div>

        {/* Report Form */}
        <div className="bg-card border border-border rounded-lg p-8">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Issue Type
              </label>
              <select className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select issue type</option>
                <option value="technical">Technical Issue</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="security">Security Concern</option>
                <option value="abuse">Report Abuse</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Subject
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of the issue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                rows={6}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Please provide detailed information about the issue..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Steps to Reproduce (Optional)
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1. Go to...&#10;2. Click on...&#10;3. See error..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Your Email (Optional)
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your.email@example.com"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Provide your email if you&apos;d like us to follow up with you
              </p>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Submit Report
            </button>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <Shield className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-foreground mb-2">
              Privacy Protected
            </h3>
            <p className="text-sm text-muted-foreground">
              Your report is confidential and will only be used to improve our
              service.
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <Mail className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-foreground mb-2">
              Quick Response
            </h3>
            <p className="text-sm text-muted-foreground">
              We review all reports within 48 hours and take appropriate action.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
