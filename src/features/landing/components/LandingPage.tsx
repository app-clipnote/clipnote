import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { 
  Brain, 
  ShieldCheck, 
  Zap, 
  MessageSquare,
  UploadCloud,
  ArrowRight,
  Plus,
  Minus,
  Youtube,
  Mic,
  Video,
  FileText,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Star,
  Quote
} from 'lucide-react';
import logoImage from 'figma:asset/93280cfc232010059111a5f16ed394e8480e436c.png';
import { ThemeToggle } from '../../../components/shared/ThemeToggle';
import { useApp } from '../../../App';
import { ImageWithFallback } from '../../../components/figma/ImageWithFallback';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import looperGroup from '../../../assets/LooperGroup.svg';

export function LandingPage() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [url, setUrl] = useState('');
  const [activeSource, setActiveSource] = useState('YouTube');
  const [activeLength, setActiveLength] = useState('Detailed');
  const [summaryMode, setSummaryMode] = useState('Balanced');
  const [activeFaqCategory, setActiveFaqCategory] = useState('Subscription');
  const faqCategories = ['Account Support', 'Subscription', 'For Creators', 'Payment'];

  const faqs = [
    {
      category: "Account Support",
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking on 'Forgot Password' in the login screen. We will send you a secure link to your registered email address."
    },
    {
      category: "Account Support",
      question: "Can I use ClipNote on multiple devices?",
      answer: "Yes, your account can be accessed from any device. Your summaries and history are synced across all platforms automatically."
    },
    {
      category: "Account Support",
      question: "How do I delete my account?",
      answer: "You can permanently delete your account from the security settings. please note this action is irreversible."
    },
    {
      category: "Account Support",
      question: "What languages are supported?",
      answer: "Currently we support over 50 languages including English, Spanish, French, German, Mandarin, and Japanese."
    },
    {
      category: "Account Support",
      question: "Is my data encrypted?",
      answer: "Yes, all your data is encrypted both at rest and in transit using industry-standard AES-256 encryption."
    },
    {
      category: "Subscription",
      question: "Do you need Credit card for 14-Day Trial?",
      answer: "Absolutely not! You can start your 14-day pro trial without entering any payment information."
    },
    {
      category: "Subscription",
      question: "What happens if i want to cancel my subscription?",
      answer: "You still pay for the remainder of the time for the plan you signed up for. Your access remains active until the end of the billing period."
    },
    {
      category: "Subscription",
      question: "Can I get a refund?",
      answer: "We offer a 7-day money-back guarantee for all our paid plans if you're not satisfied with the service."
    },
    {
      category: "Subscription",
      question: "Is there a student discount?",
      answer: "Yes! Students with a valid .edu email address are eligible for a 50% discount on our annual Pro plan."
    },
    {
      category: "Subscription",
      question: "What's the difference between Pro and Enterprise?",
      answer: "Enterprise includes custom AI modeling, priority support, and dedicated account management for large teams."
    },
    {
      category: "For Creators",
      question: "Is there a limit on video length for summaries?",
      answer: "Pro users can summarize videos up to 4 hours long. Free users are limited to 15 minutes per video."
    },
    {
      category: "For Creators",
      question: "Can I export summaries to PDF or Notion?",
      answer: "Yes! You can export your summaries to multiple formats including PDF, TXT, and direct sync to Notion (for Enterprise users)."
    },
    {
      category: "For Creators",
      question: "Can I use these summaries in my own videos?",
      answer: "Absolutely! Our summaries are yours to use. Many creators use them to generate video descriptions and social media posts."
    },
    {
      category: "For Creators",
      question: "Does it support private YouTube videos?",
      answer: "Currently we only support public and unlisted YouTube videos. Private videos cannot be accessed by our AI engine."
    },
    {
      category: "For Creators",
      question: "Can I customize the summary length?",
      answer: "Yes, you can choose between 'Short', 'Detailed', and 'Comprehensive' modes to get the exact level of detail you need."
    },
    {
      category: "Payment",
      question: "Can I Purchase Courses from outside the US?",
      answer: "Yes, our payment processor supports international cards and various digital wallets from almost every country."
    },
    {
      category: "Payment",
      question: "Possible to upgrade my plan even after signing up?",
      answer: "Absolutely! You can upgrade your plan at any time from your account settings. The price will be prorated based on your current cycle."
    },
    {
      category: "Payment",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and Apple Pay. For Enterprise customers, we also support bank transfers."
    },
    {
      category: "Payment",
      question: "Do you provide invoices for business?",
      answer: "Yes, you can download VAT-compliant invoices directly from your billing dashboard for every transaction."
    },
    {
      category: "Payment",
      question: "Is there a discount for annual billing?",
      answer: "Yes, choosing annual billing saves you 20% compared to monthly payments on all our pro plans."
    }
  ];

  const filteredFaqs = faqs.filter(faq => faq.category === activeFaqCategory);

  const testimonials = [
    {
      name: "Olivia Bennett",
      email: "olivia.b@email.com",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop",
      quote: "The interface is clean and intuitive, making it super easy to process my study materials. I love the AI chat feature!",
      rating: 5.0
    },
    {
      name: "Emily Thompson",
      email: "emily.t@gmail.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&h=200&auto=format&fit=crop",
      quote: "I've been using ClipNote for a few weeks now, and I'm genuinely impressed. It saves me hours every single day.",
      rating: 5.0
    },
    {
      name: "David Chen",
      email: "d.chen@tech.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop",
      quote: "As a researcher, this tool is indispensable. The semantic mapping is far superior to any other tool I've tested.",
      rating: 4.9
    }
  ];

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    customPaging: (i: number) => (
      <div className="w-2 h-2 rounded-full bg-primary/20 mt-8 hover:bg-primary transition-colors" />
    )
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        {/* Looper Group Background */}
        <div className="absolute inset-0 pointer-events-none z-0 flex justify-center opacity-40">
          <img 
            src={looperGroup} 
            alt="" 
            className="w-full h-full object-cover min-w-[1440px]" 
          />
        </div>


        <div className="max-w-6xl mx-auto px-6 pt-32 md:pt-40 pb-16 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-border/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-8 shadow-sm backdrop-blur-sm"
          >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          AI Powered Summarization
        </motion.div>

        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-[80px] font-semibold mb-6 leading-[1.05] tracking-tight text-foreground"
        >
          Summarize videos<br />
          in <span className="font-dancing text-primary font-normal px-2 relative inline-flex pb-2 -mb-2">seconds</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
        >
          Get 99% accurate AI insights from hours of YouTube content instantly. Built for students, researchers, and busy professionals.
        </motion.p>
        {/* Modern SaaS Input UI */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto relative group mb-10"
        >
          <div className="bg-background rounded-2xl sm:rounded-full p-2 flex flex-col sm:flex-row items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-border/60 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] hover:border-border ring-1 ring-transparent focus-within:ring-primary/20 focus-within:border-primary/50 relative overflow-hidden min-h-[64px] sm:min-h-0">
            {/* Input Field */}
            <div className="flex-1 w-full flex items-center px-6 py-2">
              <i className="ri-youtube-fill text-red-500 text-2xl mr-4 opacity-80" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste any YouTube URL or audio link here..."
                className="w-full bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground font-medium text-[15px]"
              />
            </div>

            {/* CTA Button */}
            <div className="w-full sm:w-auto mt-2 sm:mt-0 px-2 sm:px-0 pb-2 sm:pb-0">
              <button 
                onClick={() => navigate(user ? '/dashboard' : '/auth')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-[14px] hover:bg-primary/90 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                {user ? 'Go to Dashboard' : 'Summarize'} <i className="ri-arrow-right-line" />
              </button>
            </div>
          </div>
          
          {/* Helper tags below input */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5"><Mic className="w-3.5 h-3.5 text-primary"/> Audio Files</span>
            <span className="flex items-center gap-1.5"><Youtube className="w-3.5 h-3.5 text-primary"/> YouTube</span>
            <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-primary"/> Documents</span>
          </div>
        </motion.div>
        </div>
      </section>

      {/* Bento Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-32 bg-secondary/20 rounded-[3rem] mb-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Everything you <span className="font-dancing text-primary text-5xl md:text-6xl px-1">need</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto font-medium">
            Powerful tools designed for the modern content consumer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto md:auto-rows-[240px]">
          <div className="md:col-span-1 md:row-span-1 bg-card border border-border rounded-3xl p-8 flex flex-col justify-between hover:shadow-xl transition-shadow group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Smart Extraction</h3>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                Automatically identify chapters, key quotes, and action items without lifting a finger.
              </p>
            </div>
          </div>

          <div className="md:col-span-1 md:row-span-1 bg-card border border-border rounded-3xl p-8 flex flex-col justify-between hover:shadow-xl transition-shadow group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Privacy First</h3>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                Local-first processing ensures your sensitive documents and IP never leave your account securely.
              </p>
            </div>
          </div>

          <div className="md:col-span-1 md:row-span-2 bg-primary rounded-3xl p-8 flex flex-col justify-between text-white relative overflow-hidden group hover:shadow-2xl transition-all">
            <div className="relative z-10 mt-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Neural Engine</h3>
              <p className="text-white/80 font-medium leading-relaxed">
                Our proprietary combination of semantic mapping and real-time processing results in the highest fidelity summaries on the market.
              </p>
            </div>
            <div className="relative z-10 mt-8 md:mt-0">
              <button 
                onClick={() => navigate(user ? '/dashboard' : '/auth')} 
                className="flex items-center gap-2 font-bold text-sm uppercase tracking-widest hover:gap-4 transition-all"
              >
                {user ? 'View Dashboard' : 'Try it now'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute inset-0 opacity-10 pointer-events-none transition-opacity group-hover:opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary-foreground)_1px,_transparent_1px)] bg-[size:20px_20px]"></div>
            </div>
          </div>

          <div className="md:col-span-2 md:row-span-1 bg-card border border-border rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 hover:shadow-xl transition-shadow overflow-hidden group">
            <div className="flex-1 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs font-bold text-primary mb-4">
                <Sparkles className="w-3 h-3" /> New Feature
              </div>
              <h3 className="text-2xl font-bold mb-3">Interactive Chat</h3>
              <p className="text-muted-foreground font-medium max-w-md">
                Don't just read the summary. Ask questions directly to your video or document to find exact timestamps and deeper context.
              </p>
            </div>
            <div className="w-full md:w-64 h-48 md:h-full bg-secondary/50 rounded-2xl p-4 border border-border rounded-2xl relative overflow-hidden flex items-center justify-center group-hover:bg-secondary transition-colors text-center">
              <img 
                src="https://images.unsplash.com/photo-1587560699334-cc4ff634909a?q=80&w=2670&auto=format&fit=crop" 
                alt="Chat illustration"
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 transition-opacity duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-32 overflow-hidden">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            How it <span className="font-dancing text-primary text-5xl md:text-6xl px-1">works</span>
          </h2>
          <p className="text-muted-foreground font-medium">From raw content to crystal clear insights in three simple steps.</p>
        </div>

        <div className="max-w-5xl mx-auto relative">
          {/* Connecting Line (Hidden on Mobile) */}
          <div className="hidden md:block absolute top-[52px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="w-28 h-28 mx-auto bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-border flex flex-col items-center justify-center mb-8 relative transition-transform duration-500 group-hover:-translate-y-2">
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg shadow-primary/20">1</div>
                <UploadCloud className="w-10 h-10 text-primary mb-1" />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">Import Content</h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-[260px] mx-auto z-10">
                Paste any YouTube link, upload an audio file, or drag and drop your document directly into the platform.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="w-28 h-28 mx-auto bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-border flex flex-col items-center justify-center mb-8 relative transition-transform duration-500 group-hover:-translate-y-2 md:translate-y-4">
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg shadow-primary/20">2</div>
                <Sparkles className="w-10 h-10 text-primary mb-1" />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight md:-mt-4">Neural Analysis</h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-[260px] mx-auto z-10">
                Our proprietary AI models instantly analyze context, speaker intent, and semantic structure to extract the essence.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="w-28 h-28 mx-auto bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-border flex flex-col items-center justify-center mb-8 relative transition-transform duration-500 group-hover:-translate-y-2">
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg shadow-primary/20">3</div>
                <MessageSquare className="w-10 h-10 text-primary mb-1" />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">Review & Chat</h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-[260px] mx-auto">
                Get your summary instantly. Ask follow-up questions and chat with your content for even deeper detail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section id="testimonials" className="max-w-7xl mx-auto px-6 py-32">
        <div className="bg-secondary/30 rounded-[3rem] p-12 md:p-20 overflow-hidden border border-border/50">
          <div className="text-center mb-16">
            <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">What they say about us</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Loved by <span className="font-dancing text-primary text-5xl md:text-6xl px-1">thousands</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <Slider {...carouselSettings}>
              {testimonials.map((t, idx) => (
                <div key={idx} className="outline-none py-8">
                  <div className="bg-card text-card-foreground border border-border/50 rounded-3xl p-8 md:p-12 shadow-xl mx-4 relative">
                    <i className="ri-double-quotes-l text-6xl text-primary/10 absolute top-8 left-8"></i>
                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                      <div className="shrink-0">
                        <ImageWithFallback 
                          src={t.avatar} 
                          alt={t.name} 
                          className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full shadow-lg ring-4 ring-primary/10" 
                        />
                      </div>
                      <div className="flex-1 pt-4 md:pt-0">
                        <p className="text-xl md:text-2xl font-medium leading-relaxed mb-8">
                          "{t.quote}"
                        </p>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-border/50 pt-6">
                          <div>
                            <h4 className="font-bold text-lg">{t.name}</h4>
                            <p className="text-sm text-muted-foreground">{t.email}</p>
                          </div>
                          <div className="flex items-center gap-0.5 md:gap-1 text-primary bg-primary/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < Math.floor(t.rating) ? 'fill-primary text-primary' : 'text-primary'}`} 
                                size={14}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* High-Impact CTA Section - Based on Attached Design */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-20">
        <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden min-h-[500px] md:min-h-[600px] flex flex-col justify-between p-8 md:p-24 shadow-2xl group">
          {/* Background Image with Dark Overlay */}
          <div className="absolute inset-0 z-0 bg-[#0a0c10]">
            <img 
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
              alt="Abstract background" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 mix-blend-luminosity" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 backdrop-blur-[1px]"></div>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-start text-left">
            <div className="md:col-span-8">
              <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8 max-w-2xl tracking-tight">
                Insights That Work<br />
                Around You
              </h2>
              <p className="text-white/60 text-lg md:text-xl max-w-md leading-relaxed font-medium">
                Our AI experts handle the noise so you can focus on what matters.
              </p>
            </div>
            
            <div className="md:col-span-4 flex flex-col items-start md:items-end gap-4 md:text-right pt-4">
              {['YOUTUBE SUMMARIES', 'AUDIO TO TEXT', 'CHAT WITH AI', 'DETAILED ANALYSIS'].map((item) => (
                <span key={item} className="text-white/60 hover:text-white transition-colors text-sm font-bold tracking-[0.15em] cursor-default">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Yellow Action Bar */}
          <div className="relative z-10 mt-12">
            <div className="bg-[#EAB308] rounded-[2rem] p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <span className="text-black font-black text-sm md:text-lg uppercase tracking-tight ml-4">
                HAVE CONTENT IN NEED OF A REFRESH?
              </span>
              <button 
                onClick={() => navigate(user ? '/dashboard' : '/auth')}
                className="bg-[#0a0c10] text-white px-10 py-4 rounded-full font-bold text-sm hover:bg-black/80 transition-all shadow-lg hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                {user ? 'Return to Dashboard' : 'Get Started Now'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Redesigned based on Image */}
      <section id="faq" className="pb-32">
        {/* FAQ Hero Header */}
        <div className="relative w-full min-h-[400px] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[#0a0c10]">
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeFaqCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                src={
                  activeFaqCategory === 'Account Support' ? "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2670&auto=format&fit=crop" :
                  activeFaqCategory === 'Subscription' ? "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop" :
                  activeFaqCategory === 'For Creators' ? "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2670&auto=format&fit=crop" :
                  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2670&auto=format&fit=crop"
                }
                alt="FAQ Category theme" 
                className="w-full h-full object-cover mix-blend-luminosity" 
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-[#0a0c10]"></div>
          </div>

          <div className="relative z-10 max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">How can we help You?</h2>
            <p className="text-white/70 text-lg font-medium leading-relaxed">
              Welcome to our Frequently Asked Questions Center, find answers and useful tips to assist you in getting the most out of our platform
            </p>
          </div>
        </div>

        {/* FAQ Content Area */}
        <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-20">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {faqCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFaqCategory(category)}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
                  activeFaqCategory === category
                    ? 'bg-white text-black'
                    : 'bg-[#1a1c20] text-white/60 hover:text-white hover:bg-[#25282e]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ Accordions */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFaqCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {filteredFaqs.map((faq, index) => (
                  <details 
                    key={index} 
                    className="group bg-[#1a1c20] text-white border border-white/5 rounded-2xl p-6 transition-all hover:bg-[#1f2126]"
                  >
                    <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-lg outline-none">
                      {faq.question}
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-open:bg-white group-open:text-black transition-all shrink-0 ml-4 border border-white/10">
                        <ArrowDown className="w-5 h-5 group-open:hidden" />
                        <ArrowUp className="w-5 h-5 hidden group-open:block" />
                      </div>
                    </summary>
                    <div className="mt-6 text-white/60 font-medium leading-relaxed pr-12 border-t border-white/10 pt-4">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
