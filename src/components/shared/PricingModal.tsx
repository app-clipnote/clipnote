import { X, Check, Zap, Star, Shield } from 'lucide-react';
import { useApp } from '../../App';
import { updateProfile } from '../../lib/auth';

interface PricingModalProps {
  onClose: () => void;
}

export function PricingModal({ onClose }: PricingModalProps) {
  const { user, reloadUser } = useApp();

  const handleSelectPlan = async (plan: 'free' | 'pro' | 'pro-plus' | 'enterprise') => {
    if (!user) return;
    try {
      await updateProfile(user.id, { plan });
      await reloadUser();
      onClose();
    } catch (error) {
      console.error('Error switching plan:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
      <div className="bg-background border border-border rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-border/50 sticky top-0 bg-background z-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Manage Subscription</h2>
            <p className="text-muted-foreground font-medium">Upgrade, downgrade, or manage your API keys</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-secondary rounded-2xl transition-all active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Free */}
            <div className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col ${user?.plan === 'free' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-1">Free</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">₦0</span>
                  <span className="text-xs text-muted-foreground font-bold">/mo</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {['10 summaries/mo', 'Max 5 mins', 'Standard quality'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm font-medium">
                    <Check className="w-4 h-4 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelectPlan('free')}
                disabled={user?.plan === 'free'}
                className={`w-full py-3 rounded-xl font-bold transition-all ${user?.plan === 'free' ? 'bg-secondary text-muted-foreground cursor-default' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
              >
                {user?.plan === 'free' ? 'Current Plan' : 'Switch to Free'}
              </button>
            </div>

            {/* Pro */}
            <div className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col relative ${user?.plan === 'pro' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
              <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Popular</div>
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-1">Pro</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">₦25,000</span>
                  <span className="text-xs text-muted-foreground font-bold">/mo</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {['150 summaries/mo', 'Max 60 mins', 'High quality', 'Audio extraction'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm font-medium">
                    <Check className="w-4 h-4 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelectPlan('pro')}
                disabled={user?.plan === 'pro'}
                className={`w-full py-3 rounded-xl font-bold transition-all ${user?.plan === 'pro' ? 'bg-secondary text-muted-foreground cursor-default' : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20'}`}
              >
                {user?.plan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
              </button>
            </div>

            {/* Pro+ */}
            <div className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col ${user?.plan === 'pro-plus' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-1">Pro+</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">₦60,000</span>
                  <span className="text-xs text-muted-foreground font-bold">/mo</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {['Unlimited summaries*', 'Max 2+ hours', 'Premium AI', 'Priority queue'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm font-medium">
                    <Check className="w-4 h-4 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelectPlan('pro-plus')}
                disabled={user?.plan === 'pro-plus'}
                className={`w-full py-3 rounded-xl font-bold transition-all ${user?.plan === 'pro-plus' ? 'bg-secondary text-muted-foreground cursor-default' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
              >
                {user?.plan === 'pro-plus' ? 'Current Plan' : 'Go Pro+'}
              </button>
            </div>
          </div>

          {/* API Key Section */}
          <div className="bg-secondary/30 rounded-[2rem] p-8 border border-border/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Using your own API?</h3>
                </div>
                <p className="text-muted-foreground font-medium max-w-lg">
                  Bring your OpenAI or Anthropic API keys to use ClipNote at your own pace. You'll only pay for the platform features and use your own tokens for AI processing.
                </p>
              </div>
              <button className="px-8 py-3.5 bg-background border border-border rounded-xl font-bold hover:bg-secondary transition-all active:scale-95 whitespace-nowrap">
                Manage API Keys
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
