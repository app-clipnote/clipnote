import { FileText, Gavel, AlertCircle, HelpCircle } from 'lucide-react';

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <FileText className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: March 20, 2026</p>
        </div>

        <div className="bg-secondary/30 rounded-3xl p-8 md:p-12 space-y-8 border border-border">
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Gavel className="w-6 h-6 text-primary" /> 1. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using ClipNote, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-primary" /> 2. Use License
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Permission is granted to temporarily use the services provided by ClipNote for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-primary" /> 3. Disclaimer
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The materials on ClipNote are provided on an 'as is' basis. ClipNote makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="pt-8 border-t border-border">
            <h2 className="text-xl font-semibold mb-4">Contact</h2>
            <p className="text-muted-foreground">
              Questions about the Terms of Service should be sent to us at support@clipnote.ai
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
