import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy - CircleHub JnU",
  description: "Learn about how we use cookies and tracking technologies",
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Cookie Policy
        </h1>
        <p className="text-muted-foreground mb-8">
          Last updated: January 18, 2026
        </p>

        <div className="prose prose-blue dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              What Are Cookies?
            </h2>
            <p className="text-muted-foreground">
              Cookies are small text files stored on your device when you visit
              our website. They help us provide you with a better experience by
              remembering your preferences and understanding how you use our
              platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              How We Use Cookies
            </h2>
            <p className="text-muted-foreground mb-4">
              We use cookies for the following purposes:
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-foreground mb-2">
                  Essential Cookies
                </h3>
                <p className="text-muted-foreground">
                  Required for the platform to function properly. These include
                  authentication, security, and session management cookies.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-foreground mb-2">
                  Functional Cookies
                </h3>
                <p className="text-muted-foreground">
                  Remember your preferences and settings, such as language,
                  theme, and notification preferences.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-foreground mb-2">
                  Analytics Cookies
                </h3>
                <p className="text-muted-foreground">
                  Help us understand how users interact with our platform,
                  identify areas for improvement, and measure performance.
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-foreground mb-2">
                  Performance Cookies
                </h3>
                <p className="text-muted-foreground">
                  Optimize loading times and ensure smooth operation of
                  features.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Types of Cookies We Use
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left text-foreground border-b border-border">
                      Cookie Name
                    </th>
                    <th className="px-4 py-2 text-left text-foreground border-b border-border">
                      Purpose
                    </th>
                    <th className="px-4 py-2 text-left text-foreground border-b border-border">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2 text-muted-foreground">
                      campus_connect_session
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      Maintains your login session
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">Session</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2 text-muted-foreground">
                      campus_connect_access_token
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      Authentication token
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      15 minutes
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2 text-muted-foreground">
                      campus_connect_refresh_token
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      Token refresh management
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">7 days</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2 text-muted-foreground">
                      theme_preference
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      Remembers your theme choice
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">1 year</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2 text-muted-foreground">
                      analytics_id
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      Anonymous usage analytics
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">2 years</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Third-Party Cookies
            </h2>
            <p className="text-muted-foreground mb-4">
              We may use third-party services that set their own cookies:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Google Analytics - for usage statistics and insights</li>
              <li>Authentication providers - for secure login services</li>
              <li>CDN services - for faster content delivery</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Managing Cookies
            </h2>
            <p className="text-muted-foreground mb-4">
              You have several options to manage cookies:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>
                <strong>Browser Settings:</strong> Most browsers allow you to
                block or delete cookies through their settings
              </li>
              <li>
                <strong>Opt-Out:</strong> You can opt out of analytics cookies
                while still using essential cookies
              </li>
              <li>
                <strong>Clear Cookies:</strong> You can delete all cookies at
                any time, but this may affect functionality
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Browser-Specific Instructions
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong>Chrome:</strong> Settings → Privacy and security →
                Cookies and other site data
              </p>
              <p>
                <strong>Firefox:</strong> Options → Privacy & Security → Cookies
                and Site Data
              </p>
              <p>
                <strong>Safari:</strong> Preferences → Privacy → Manage Website
                Data
              </p>
              <p>
                <strong>Edge:</strong> Settings → Cookies and site permissions →
                Manage and delete cookies
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Impact of Disabling Cookies
            </h2>
            <p className="text-muted-foreground mb-4">
              If you disable cookies, you may experience:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Inability to stay logged in</li>
              <li>Loss of personalized settings and preferences</li>
              <li>Reduced functionality of certain features</li>
              <li>Need to re-enter information repeatedly</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Updates to Cookie Policy
            </h2>
            <p className="text-muted-foreground">
              We may update this cookie policy from time to time to reflect
              changes in technology or regulations. We will notify you of
              significant changes through our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Contact Us
            </h2>
            <p className="text-muted-foreground">
              If you have questions about our use of cookies, please contact us
              at:
            </p>
            <p className="text-muted-foreground mt-2">
              Email: privacy@circlehub.jnu.edu
              <br />
              Address: JnU Campus, Dhaka, Bangladesh
            </p>
          </section>

          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-muted-foreground">
              By continuing to use CircleHub, you consent to our use of cookies
              as described in this policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
