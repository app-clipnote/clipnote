import { useState, useEffect } from 'react';
import { X, User, CreditCard, Bell, Shield, Palette, Globe, Upload, Camera } from 'lucide-react';
import { useApp } from '../../App';
import { updateProfile } from '../../lib/auth';
import { getSettings, updateSettings } from '../../lib/settings';
import { PricingModal } from './PricingModal';
import { setTheme, applyTheme } from '../../lib/theme';
import { storage } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { user, setUser } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [showPricing, setShowPricing] = useState(false);


  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;
    try {
      const settings = await getSettings(user.id);
      if (settings) {
        setEmailNotifications(settings.email_notifications);
        setDarkMode(settings.theme === 'dark');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Update profile
      await updateProfile(user.id, { name, email, avatar });
      
      // Update settings
      await updateSettings(user.id, {
        email_notifications: emailNotifications,
        theme: darkMode ? 'dark' : 'light',
      });

      // Apply theme immediately
      setTheme(darkMode ? 'dark' : 'light');
      
      setUser({ ...user, name, email, avatar });
      onClose();

    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-border p-4 overflow-y-auto">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                      activeTab === tab.id
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-secondary'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'profile' && (
              <div className="max-w-2xl">
                <h3 className="text-xl font-semibold mb-6">Profile Settings</h3>
                
                <div className="flex flex-col items-center mb-8">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-secondary flex items-center justify-center border-2 border-border group-hover:border-primary transition-colors">
                      {avatar ? (
                        <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-muted-foreground" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer shadow-lg hover:bg-primary/90 transition-all active:scale-95">
                      <Camera className="w-4 h-4" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file && user) {
                            try {
                              setLoading(true);
                              const storageRef = ref(storage, `avatars/user_${user.id}_${Date.now()}`);
                              await uploadBytes(storageRef, file);
                              const url = await getDownloadURL(storageRef);
                              setAvatar(url);
                            } catch (err) {
                              console.error("Avatar upload failed:", err);
                              alert("Upload failed. Make sure Firebase Storage Rules are set to allow reads/writes!");
                            } finally {
                              setLoading(false);
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">Click the camera to upload a new avatar</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm mb-2">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-input-background border border-input rounded-xl outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-input-background border border-input rounded-xl outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Language</label>
                    <select className="w-full px-4 py-3 bg-input-background border border-input rounded-xl outline-none focus:border-primary transition-colors">
                      <option>English</option>
                      <option>Pidgin (Nigeria)</option>
                      <option>Yoruba</option>
                      <option>Igbo</option>
                      <option>Hausa</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="max-w-2xl">
                <h3 className="text-xl font-semibold mb-6">Billing & Subscription</h3>
                
                <div className="bg-card border border-border rounded-2xl p-6 mb-8 bg-gradient-to-br from-primary/5 to-transparent">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-lg capitalize">{user?.plan} Plan</h4>
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Active</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {user?.plan === 'free' ? 'Free forever' : `₦${user?.plan === 'pro' ? '25,000' : '60,000'}/month`}
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowPricing(true)}
                      className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
                    >
                      Explore Plans
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/50">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Usage this month</p>
                      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[45%]" />
                      </div>
                      <p className="text-xs mt-1 font-medium">45 / 100 summaries</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Next Billing Date</p>
                      <p className="text-sm font-medium">April 20, 2026</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="font-bold">Payment Methods</h4>
                  <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between group hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-secondary rounded-lg flex items-center justify-center border border-border">
                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">•••• •••• •••• 4242</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Expires 12/26</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-primary hover:underline uppercase tracking-wider">Edit</button>
                  </div>
                  <button className="w-full py-3 border border-dashed border-border rounded-xl text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-secondary transition-colors">
                    Add New Payment Method
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="max-w-2xl">
                <h3 className="text-xl font-semibold mb-6">Notification Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <button
                      onClick={() => setEmailNotifications(!emailNotifications)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        emailNotifications ? 'bg-primary' : 'bg-switch-background'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-card rounded-full shadow-sm transition-transform ${
                          emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium">Summary Complete</h4>
                      <p className="text-sm text-muted-foreground">Notify when summaries are ready</p>
                    </div>
                    <button className="w-12 h-6 rounded-full bg-primary">
                      <div className="w-5 h-5 bg-background rounded-full shadow-sm translate-x-6" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium">Weekly Digest</h4>
                      <p className="text-sm text-muted-foreground">Summary of your activity</p>
                    </div>
                    <button className="w-12 h-6 rounded-full bg-switch-background">
                      <div className="w-5 h-5 bg-background rounded-full shadow-sm translate-x-0.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium">Usage Alerts</h4>
                      <p className="text-sm text-muted-foreground">Get notified when you approach your limits</p>
                    </div>
                    <button className="w-12 h-6 rounded-full bg-primary">
                      <div className="w-5 h-5 bg-background rounded-full shadow-sm translate-x-6" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium">Product Updates</h4>
                      <p className="text-sm text-muted-foreground">New features and improvements</p>
                    </div>
                    <button className="w-12 h-6 rounded-full bg-primary">
                      <div className="w-5 h-5 bg-background rounded-full shadow-sm translate-x-6" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="max-w-2xl">
                <h3 className="text-xl font-semibold mb-6">Security & Privacy</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Change Password</h4>
                    <div className="space-y-4">
                      <input
                        type="password"
                        placeholder="Current Password"
                        className="w-full px-4 py-3 bg-input-background border border-input rounded-xl outline-none focus:border-primary transition-colors"
                      />
                      <input
                        type="password"
                        placeholder="New Password"
                        className="w-full px-4 py-3 bg-input-background border border-input rounded-xl outline-none focus:border-primary transition-colors"
                      />
                      <button className="px-6 py-2 bg-secondary hover:bg-secondary/80 rounded-xl font-medium transition-colors">
                        Update Password
                      </button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Recent Activity</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Globe className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Login from Lagos, Nigeria</p>
                            <p className="text-xs text-muted-foreground">Today at 10:45 AM</p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full font-bold uppercase">Success</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">API key added</p>
                            <p className="text-xs text-muted-foreground">Yesterday at 4:20 PM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-destructive">Danger Zone</h4>
                      <p className="text-xs text-muted-foreground">Action cannot be undone</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 text-sm font-medium border border-border rounded-xl hover:bg-secondary transition-colors">
                        Log out of all devices
                      </button>
                      <button className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground rounded-xl hover:bg-destructive/90 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="max-w-2xl">
                <h3 className="text-xl font-semibold mb-6">Appearance</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Theme</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setDarkMode(false)}
                        className={`p-4 border-2 rounded-xl transition-colors ${
                          !darkMode ? 'border-primary bg-accent' : 'border-border bg-card'
                        }`}
                      >
                        <div className="w-full h-20 bg-background border border-border rounded-lg mb-3" />
                        <p className="text-sm font-medium">Light</p>
                      </button>
                      <button
                        onClick={() => setDarkMode(true)}
                        className={`p-4 border-2 rounded-xl transition-colors ${
                          darkMode ? 'border-primary bg-accent' : 'border-border bg-card'
                        }`}
                      >
                        <div className="w-full h-20 bg-gray-900 rounded-lg mb-3" />
                        <p className="text-sm font-medium">Dark</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-border rounded-xl hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-lg active:scale-95"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {showPricing && <PricingModal onClose={() => setShowPricing(false)} />}
    </div>
  );
}