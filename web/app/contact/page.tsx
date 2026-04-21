import { Metadata } from "next";
import { Mail, MessageCircle, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us - CircleHub JnU",
  description: "Get in touch with our support team",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground">
            We&apos;re here to help. Reach out to us through any of these
            channels.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Send us a message
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-foreground">Email</h3>
                    <p className="text-muted-foreground">
                      support@circlehub.jnu.edu
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-foreground">Phone</h3>
                    <p className="text-muted-foreground">+88 (02) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-foreground">Address</h3>
                    <p className="text-muted-foreground">
                      JnU Campus, Dhaka, Bangladesh
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Office Hours
              </h3>
              <div className="space-y-2 text-muted-foreground">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <MessageCircle className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Quick Response
              </h3>
              <p className="text-muted-foreground text-sm">
                We typically respond to all inquiries within 24 hours during
                business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
