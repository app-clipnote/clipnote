import logoImage from '../../assets/logoicon.png';

export function Footer() {
  return (
    <footer className="w-full">
      <div className="w-full bg-[#0a0c10] p-12 md:p-24 relative overflow-hidden text-white">
        {/* Newsletter Section */}
        <div className="relative z-10 text-center max-w-2xl mx-auto mb-24">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
            Stay Ahead with Content<br />
            <span className="font-dancing text-primary italic">Insights and Updates</span>
          </h2>
          <p className="text-white/40 mb-10 text-lg">
            Subscribe to our newsletter for expert tips, updates, and<br className="hidden md:block" />
            the latest trends in content summarization.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white/5 p-2 rounded-full border border-white/10 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-transparent border-none outline-none px-6 py-2 text-white w-full placeholder:text-white/20"
            />
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-bold transition-all whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>

        <div className="w-full h-px bg-white/10 mb-20 relative z-10" />

        {/* Navigation Section */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 max-w-7xl mx-auto">
          <div className="md:col-span-6">
            <div className="flex items-center gap-3 mb-6">
              <img src={logoImage} alt="ClipNote Logo" className="w-8 h-8 object-contain" />
              <span className="text-3xl font-bold tracking-tight">ClipNote</span>
            </div>
            <p className="text-white/40 max-w-xs leading-relaxed">
              Make your complicated content<br />
              more simple
            </p>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold mb-6 text-white/60">Features</h4>
            <ul className="space-y-4 text-white/40 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Summaries</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Audio Text</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold mb-6 text-white/60">Support</h4>
            <ul className="space-y-4 text-white/40 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Help</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold mb-6 text-white/60">Legal</h4>
            <ul className="space-y-4 text-white/40 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>

        {/* Large Watermark Background Text */}
        <div className="absolute bottom-[-10%] left-0 w-full flex justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[25vw] font-bold text-white/[0.03] tracking-tighter leading-none">
            ClipNote
          </span>
        </div>
      </div>
    </footer>
  );
}
