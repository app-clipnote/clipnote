import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../../../App';
import { updateProfile, getProfile } from '../../../lib/auth';
import logoImage from '../../../assets/logoicon.png';


export function OnboardingFlow() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPlan = searchParams.get('plan') as any;
  const { user, setUser, setNeedsOnboarding } = useApp();
  const [step, setStep] = useState(initialPlan ? 2 : 1);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'pro-plus'>(initialPlan || 'free');
  const [saving, setSaving] = useState(false);

  const plans = [
    {
      id: 'free' as const,
      name: 'Free',
      price: '$0',
      description: 'For trying things out',
      features: [
        '10 video summaries/month',
        'Max video length: 5 minutes',
        'Standard summary quality',
        'Text export only',
        'Slower processing speed',
      ],
    },
    {
      id: 'pro' as const,
      name: 'Pro',
      price: '₦25,000',
      description: 'For students, creators & professionals',
      features: [
        '150 summaries/month',
        'Max video length: 60 minutes',
        'High-quality AI summaries',
        'Multiple formats (Bullet, Notes, Blog)',
        'Audio extraction included',
        'Download as PDF & DOCX',
        'Save history',
        'Faster processing (priority queue)',
      ],
      popular: true,
    },
    {
      id: 'pro-plus' as const,
      name: 'Pro+',
      price: '₦60,000',
      description: 'For heavy users & teams',
      features: [
        'Unlimited summaries*',
        'Max video length: 2+ hours',
        'Premium AI model (best quality)',
        'All summary formats',
        'Team workspace (coming soon)',
        'Priority processing (fastest)',
        'Early access to new features',
        'API access (optional)',
      ],
    },
  ];

  const handleContinue = async () => {
    if (step === 1) {
      setStep(2);
    } else {
      if (user) {
        setSaving(true);
        try {
          await updateProfile(user.id, { plan: selectedPlan });
          const updatedProfile = await getProfile(user.id);
          setUser({
            ...user,
            plan: updatedProfile.plan,
          });
          setNeedsOnboarding(false);
          navigate('/dashboard');
        } catch (error) {
          console.error('Error updating plan:', error);
          setSaving(false);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
              <img src={logoImage} alt="ClipNote Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-semibold">ClipNote</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Step {step} of 2</span>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-muted">
        <div className="max-w-4xl mx-auto px-6">
          <div className="h-1 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-12">
        {step === 1 ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-semibold mb-4">Welcome to ClipNote</h1>
              <p className="text-xl text-muted-foreground">
                Let's get you set up with the perfect plan
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-6">What can you do with ClipNote?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Summarize YouTube videos</h3>
                    <p className="text-muted-foreground">
                      Get key insights from any YouTube video in seconds
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Convert audio to text</h3>
                    <p className="text-muted-foreground">
                      Transform audio files into readable transcripts and summaries
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Text to audio conversion</h3>
                    <p className="text-muted-foreground">
                      Listen to your summaries on the go with AI voice
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Summarize web content</h3>
                    <p className="text-muted-foreground">
                      Extract key information from articles and documents
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-semibold mb-4">Choose your plan</h1>
              <p className="text-xl text-muted-foreground">
                Start free and upgrade anytime
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative text-left p-8 rounded-2xl border-2 transition-all ${
                    selectedPlan === plan.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm">
                      Popular
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    {selectedPlan === plan.id && (
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    )}
                  </div>

                  <div className="mb-2">
                    <span className="text-3xl font-semibold">{plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-background">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Back
            </button>
          )}
          {step === 1 && <div />}
          <button
            onClick={handleContinue}
            className="ml-auto bg-primary text-primary-foreground px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            {step === 2 ? 'Get started' : 'Continue'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}