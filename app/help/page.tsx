import { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, MessageCircle, BookOpen, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Help Center - CircleHub JnU",
  description: "Get help and find answers to common questions",
};

export default function HelpPage() {
  const help_topics = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn how to use CircleHub effectively",
      link: "#getting-started",
    },
    {
      icon: HelpCircle,
      title: "FAQs",
      description: "Find answers to frequently asked questions",
      link: "#faqs",
    },
    {
      icon: MessageCircle,
      title: "Contact Support",
      description: "Get help from our support team",
      link: "/contact",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            How can we help you?
          </h1>
          <p className="text-lg text-muted-foreground">
            Find answers and get support for CircleHub JnU
          </p>
        </div>

        {/* Help Topics */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {help_topics.map((topic) => (
            <Link
              key={topic.title}
              href={topic.link}
              className="p-6 border border-border rounded-lg hover:border-blue-500 transition-colors bg-card"
            >
              <topic.icon className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {topic.title}
              </h3>
              <p className="text-muted-foreground">{topic.description}</p>
            </Link>
          ))}
        </div>

        {/* Getting Started Section */}
        <div id="getting-started" className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Getting Started
          </h2>
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-lg bg-card">
              <h3 className="font-semibold text-foreground mb-2">
                Report a Lost Item
              </h3>
              <p className="text-muted-foreground">
                Go to{" "}
                <Link href="/lost" className="text-blue-600 hover:underline">
                  Lost Items
                </Link>{" "}
                page and click &quot;Report Lost Item&quot;. Fill in the details
                and submit.
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card">
              <h3 className="font-semibold text-foreground mb-2">
                Report a Found Item
              </h3>
              <p className="text-muted-foreground">
                Go to{" "}
                <Link href="/found" className="text-blue-600 hover:underline">
                  Found Items
                </Link>{" "}
                page and click &quot;Report Found Item&quot;. Provide item
                details and your contact information.
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card">
              <h3 className="font-semibold text-foreground mb-2">
                Share Items
              </h3>
              <p className="text-muted-foreground">
                Visit{" "}
                <Link href="/share" className="text-blue-600 hover:underline">
                  Share Items
                </Link>{" "}
                to list items you want to share with the community.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div id="faqs" className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-lg bg-card">
              <h3 className="font-semibold text-foreground mb-2">
                How do I claim a found item?
              </h3>
              <p className="text-muted-foreground">
                View the found item details and click &quot;Claim This
                Item&quot;. Provide proof of ownership and your contact
                information.
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card">
              <h3 className="font-semibold text-foreground mb-2">
                Is my personal information safe?
              </h3>
              <p className="text-muted-foreground">
                Yes, we take privacy seriously. Only necessary information is
                shared to help reunite lost items.
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card">
              <h3 className="font-semibold text-foreground mb-2">
                What if I can&apos;t find my item?
              </h3>
              <p className="text-muted-foreground">
                Keep checking regularly and enable notifications. You can also
                contact our support team for assistance.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center p-8 border border-border rounded-lg bg-card">
          <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Still need help?
          </h2>
          <p className="text-muted-foreground mb-4">
            Our support team is here to help you
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
