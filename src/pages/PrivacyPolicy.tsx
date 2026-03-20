import { Shield, Lock, Eye, FileText } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: March 20, 2026</p>
        </div>

        <div className="bg-secondary/30 rounded-3xl p-8 md:p-12 space-y-8 border border-border">
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-primary" /> 1. Information We Collect
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We collect information that you provide directly to us, such as when you create an account, subscribe to a service, or communicate with us. This may include your name, email address, and payment information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-primary" /> 2. How We Use Your Information
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services, to process transactions, and to communicate with you about your account and our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" /> 3. Data Security
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" /> 4. Your Choices
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You may update, correct, or delete your account information at any time by logging into your account or contacting us.
            </p>
          </section>

          <section className="pt-8 border-t border-border">
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us at privacy@clipnote.ai
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
