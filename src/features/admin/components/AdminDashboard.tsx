import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, CreditCard, TrendingUp, Activity, Search, 
  Download, MoreVertical, ArrowUpRight, LogOut, 
  Settings, Home, FileText, Menu, ChevronLeft, History, ArrowLeft, Trash2, Eye
} from 'lucide-react';
import { deleteDoc } from 'firebase/firestore';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip 
} from 'recharts';
import { getAllUsers, getAllSummaries } from '../../../lib/admin-storage';
import type { Profile as UserProfile, Summary } from '../../../types';
import logoIcon from '../../../assets/logoicon.png'; // Verified path: src/assets/logoicon.png
import { storage, db } from '../../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export function AdminDashboard() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'analytics' | 'history' | 'settings'>(
    (localStorage.getItem('admin_active_tab') as any) || 'overview'
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [adminAvatar, setAdminAvatar] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=Admin');
  const [adminName, setAdminName] = useState('Administrator');
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [userFilter, setUserFilter] = useState('all');
  const [historyFilter, setHistoryFilter] = useState('all');

  // Modal States
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewType, setViewType] = useState<'user' | 'summary' | null>(null);

  useEffect(() => {
    localStorage.setItem('admin_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const allUsers = await getAllUsers();
    const allSummaries = await getAllSummaries();
    setUsers(allUsers);
    setSummaries(allSummaries);

    try {
      const storedUid = localStorage.getItem('admin_uid');
      const docRef = doc(db, "admins", storedUid || "main_admin");
      const adminDoc = await getDoc(docRef);
      
      if (adminDoc.exists()) {
        const data = adminDoc.data();
        if (data.avatar_url) setAdminAvatar(data.avatar_url);
        if (data.name) setAdminName(data.name);
      } else if (storedUid) {
        // Initialize admin document if it doesn't exist
        await setDoc(docRef, {
          name: adminName,
          avatar_url: adminAvatar,
          created_at: new Date().toISOString()
        });
      } else {
        // Fallback for legacy
        const legacyDoc = await getDoc(doc(db, "admins", "main_admin"));
        if (legacyDoc.exists()) {
          const data = legacyDoc.data();
          if (data.avatar_url) setAdminAvatar(data.avatar_url);
          if (data.name) setAdminName(data.name);
        }
      }
    } catch (e) {
      console.error("Failed to load admin profile:", e);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const storageRef = ref(storage, `avatars/admin_${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      const storedUid = localStorage.getItem('admin_uid');
      await setDoc(doc(db, "admins", storedUid || "main_admin"), { avatar_url: url }, { merge: true });
      setAdminAvatar(url);
    } catch (error) {
      console.error("Avatar upload failed:", error);
      alert("Image upload failed! Please ensure your Firebase Storage rules are set to enable read/write.");
    } finally {
      setIsUploading(false);
      // Reset input value to allow re-uploading same file
      event.target.value = '';
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUpdatingProfile(true);
      const storedUid = localStorage.getItem('admin_uid');
      await setDoc(doc(db, "admins", storedUid || "main_admin"), { 
        name: adminName,
        updated_at: new Date().toISOString()
      }, { merge: true });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("Failed to update profile. Please check your connection.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      setIsUpdatingProfile(true);
      const storedUid = localStorage.getItem('admin_uid');
      await setDoc(doc(db, "admins", storedUid || "main_admin"), { 
        preferences: {
          email_notifications: true,
          security_alerts: true,
          system_updates: false
        },
        updated_at: new Date().toISOString()
      }, { merge: true });
      alert("Preferences saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save preferences.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      setIsDeleting(userId);
      await deleteDoc(doc(db, "users", userId));
      setUsers(users.filter(u => u.id !== userId));
      alert("User deleted successfully.");
    } catch (e) {
      console.error(e);
      alert("Failed to delete user.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      setIsUpdatingProfile(true);
      await setDoc(doc(db, "users", selectedUser.id), {
        name: selectedUser.name,
        plan: selectedUser.plan
      }, { merge: true });
      setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
      setIsEditModalOpen(false);
      alert("User updated successfully!");
    } catch (e) {
      console.error(e);
      alert("Failed to update user.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleDeleteSummary = async (summaryId: string) => {
    if (!confirm("Are you sure you want to delete this summary?")) return;
    try {
      setIsDeleting(summaryId);
      await deleteDoc(doc(db, "summaries", summaryId));
      setSummaries(summaries.filter(s => s.id !== summaryId));
      alert("Summary deleted successfully.");
    } catch (e) {
      console.error(e);
      alert("Failed to delete summary.");
    } finally {
      setIsDeleting(null);
    }
  };

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => {
      const userSummaries = summaries.filter(s => s.user_id === u.id);
      return userSummaries.length > 0;
    }).length,
    totalSummaries: summaries.length,
    revenue: users.reduce((acc, user) => {
      if (user.plan === 'pro') return acc + 25000;
      if (user.plan === 'pro-plus') return acc + 60000;
      return acc;
    }, 0),
    proUsers: users.filter(u => u.plan === 'pro').length,
    proPlusUsers: users.filter(u => u.plan === 'pro-plus').length,
    freeUsers: users.filter(u => u.plan === 'free').length,
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = userFilter === 'all' || user.plan === userFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredHistory = summaries.filter(summary => {
    const matchesSearch = (summary.title || '').toLowerCase().includes(historySearchQuery.toLowerCase()) ||
                         (summary.summary || '').toLowerCase().includes(historySearchQuery.toLowerCase());
    const matchesFilter = historyFilter === 'all' || summary.type === historyFilter;
    return matchesSearch && matchesFilter;
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Plan', 'Joined'];
    const rows = filteredUsers.map(u => [
      u.name,
      u.email,
      u.plan,
      new Date(u.created_at).toISOString()
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `clipnote_users_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const mainNavItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'history', label: 'History', icon: History }
  ] as const;

  const systemNavItems = [
    { id: 'settings', label: 'Platform Settings', icon: Settings },
  ] as const;

  // Recharts Data
  const sourceData = [
    { name: 'YouTube', value: summaries.filter(s => s.type === 'youtube').length },
    { name: 'Audio', value: summaries.filter(s => s.type === 'audio').length },
    { name: 'URL', value: summaries.filter(s => s.type === 'url').length },
  ];

  // Dynamic Growth Data (Last 7 Days)
  const activityData = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
    const daySummaries = summaries.filter(s => new Date(s.created_at).toDateString() === d.toDateString());
    return { name: dayStr, summaries: daySummaries.length };
  });

  return (
    <div className="flex h-screen bg-[#0A0A0B] text-gray-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-[280px]' : 'w-[80px]'} flex-shrink-0 bg-[#121212] border-r border-white/5 flex flex-col hidden md:flex transition-all duration-300`}>
        {/* Workspace Dropdown / Logo section */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3 p-1 overflow-hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
               <img src={logoIcon} alt="ClipNote Logo" className="w-full h-full object-contain" />
            </div>
            {isSidebarOpen && (
              <div className="flex-1 overflow-hidden whitespace-nowrap">
                <h3 className="text-sm font-semibold truncate text-white">ClipNote Admin</h3>
              </div>
            )}
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors shrink-0">
            {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-6 space-y-8 scrollbar-none">
          <div>
            {isSidebarOpen && <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Main Menu</h4>}
            <nav className="space-y-1">
              {mainNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'} gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    activeTab === item.id
                      ? 'bg-white/5 text-white font-medium'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  title={!isSidebarOpen ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {isSidebarOpen && <span className="truncate">{item.label}</span>}
                </button>
              ))}
            </nav>
          </div>

          <div>
            {isSidebarOpen && <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">System</h4>}
            <nav className="space-y-1">
              {systemNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'} gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    activeTab === item.id
                      ? 'bg-white/5 text-white font-medium'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  title={!isSidebarOpen ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {isSidebarOpen && <span className="truncate">{item.label}</span>}
                </button>
              ))}
            </nav>
          </div>
          
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-white/5 flex flex-col gap-2">
           <Link
              to="/"
              className={`w-full flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'} gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-gray-400 hover:text-white hover:bg-white/5`}
              title={!isSidebarOpen ? "Back to Website" : undefined}
            >
              <ArrowLeft className="w-5 h-5 shrink-0" />
              {isSidebarOpen && <span className="truncate">Back to Website</span>}
            </Link>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-white/5">
          <div className={`flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'} overflow-hidden`}>
             <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-[#222] border border-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                   <img src={adminAvatar} alt="Admin" className="w-full h-full object-cover" />
                </div>
                {isSidebarOpen && (
                  <div className="flex-1 overflow-hidden">
                    <h3 className="text-sm font-medium text-white truncate">{adminName}</h3>
                    <p className="text-xs text-gray-500 truncate">admin@clipnote.ai</p>
                  </div>
                )}
             </div>
            {isSidebarOpen && (
              <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#0B0B0E] bg-gradient-to-br from-[#0B0B0E] via-[#0D0A14] to-[#120F1C]">
        {/* Mobile Header */}
        <header className="md:hidden border-b border-white/5 bg-[#121212] flex items-center justify-between p-4 sticky top-0 z-50">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                 <img src={logoIcon} alt="ClipNote Logo" className="w-6 h-6 object-contain" />
             </div>
             <span className="font-semibold text-white">ClipNote Admin</span>
           </div>
           
           <div className="flex items-center gap-1">
             <Link to="/" className="p-2 text-gray-500 hover:bg-white/10 rounded-lg" title="Back to Website">
                <ArrowLeft className="w-5 h-5" />
             </Link>
             <button 
               onClick={() => setShowLogoutConfirm(true)}
                className="p-2 text-gray-500 hover:bg-white/10 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
             </button>
           </div>
        </header>

        {/* Content Tabs Header (Mobile) */}
        <div className="md:hidden flex gap-2 p-4 border-b border-white/5 overflow-x-auto scrollbar-none bg-[#121212]/80 backdrop-blur-md">
           {[...mainNavItems, ...systemNavItems].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  activeTab === item.id ? 'bg-white/10 text-white' : 'text-gray-400'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
           ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          
          {/* Header Area */}
          <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
             <div>
               <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-3 tracking-tight">
                 {activeTab === 'overview' && 'Platform Overview'}
                 {activeTab === 'users' && 'Manage Users'}
                 {activeTab === 'analytics' && 'Detailed Analytics'}
                 {activeTab === 'history' && 'Platform History'}
                 {activeTab === 'settings' && 'Platform Settings'}
               </h1>
               <p className="text-gray-400 text-sm md:text-base max-w-xl leading-relaxed">
                 {activeTab === 'overview' && 'Monitor key metrics, active users, and system performance at a glance. Suitable for overall platform health assessment.'}
                 {activeTab === 'users' && 'View and manage user accounts, subscription tiers, and activity logs across the platform.'}
                 {activeTab === 'analytics' && 'Dive deep into content usage, popular summaries, and engagement metrics.'}
                 {activeTab === 'history' && 'Browse through all generated summaries to monitor usage and platform activity.'}
                 {activeTab === 'settings' && 'Configure central administrative settings and manage your admin profile.'}
               </p>
             </div>
             {activeTab === 'overview' && (
               <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm rounded-xl transition-all">
                 <Download className="w-4 h-4" />
                 Export Data
               </button>
             )}
          </div>

          {/* Tab Contents */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                  { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", trend: "+12%" },
                  { label: "Active Users", value: stats.activeUsers, icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", trend: "+8%" },
                  { label: "Total Summaries", value: stats.totalSummaries, icon: FileText, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", trend: "+24%" },
                  { label: "Monthly Revenue", value: `₦${stats.revenue.toLocaleString()}`, icon: CreditCard, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", trend: "+18%" },
                ].map((stat, i) => (
                  <div key={i} className={`bg-[#1A1A1A]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-6 transition-all hover:border-white/10 `}>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.border} border`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div className="flex items-center gap-1 text-sm text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                        <ArrowUpRight className="w-3 h-3" />
                        <span className="font-medium text-[11px]">{stat.trend}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-2xl md:text-3xl font-semibold text-white tracking-tight">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Subscription Breakdown */}
                <div className="bg-[#1A1A1A]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-6 lg:p-8">
                  <h2 className="text-lg font-medium text-white mb-6">Subscription Limits</h2>
                  <div className="space-y-5">
                    {[
                       { label: "Free Plan", count: stats.freeUsers, total: stats.totalUsers, color: "bg-gray-400" },
                       { label: "Pro Plan", count: stats.proUsers, total: stats.totalUsers, color: "bg-purple-500" },
                       { label: "Pro+ Plan", count: stats.proPlusUsers, total: stats.totalUsers, color: "bg-amber-500" }
                    ].map(plan => (
                      <div key={plan.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-3 w-32">
                          <div className={`w-2 h-2 rounded-full ${plan.color}`}></div>
                          <span className="text-sm text-gray-300">{plan.label}</span>
                        </div>
                        <div className="flex-1 flex items-center gap-4 mx-4">
                          <div className="w-full h-1.5 bg-[#222] rounded-full overflow-hidden">
                            <div
                              className={`h-full ${plan.color} rounded-full`}
                              style={{ width: `${stats.totalUsers > 0 ? (plan.count / stats.totalUsers) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-white w-12 text-right">{plan.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-[#1A1A1A]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-6 lg:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-medium text-white">Recent Signups</h2>
                  </div>
                  <div className="space-y-2">
                    {users.slice(0, 4).reverse().map((user) => (
                      <div key={user.id} className="flex items-center justify-between py-2 rounded-xl group hover:bg-white/5 px-2 -mx-2 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#222] border border-white/5 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-300">{user.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-200">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase ${
                            user.plan === 'pro-plus'
                              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                              : user.plan === 'pro'
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                              : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                          }`}>
                            {user.plan === 'pro-plus' ? 'Pro+' : user.plan}
                          </span>
                        </div>
                      </div>
                    ))}
                    {users.length === 0 && (
                      <div className="text-center py-6 text-gray-500 text-sm">No recent signups to display.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-[#1A1A1A]/60 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-16rem)] min-h-[500px]">
              <div className="p-4 border-b border-white/5 flex items-center gap-4">
                <div className="relative max-w-sm flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users by name or email..."
                    className="w-full pl-9 pr-4 py-2 bg-[#121212] border border-white/5 rounded-xl text-sm outline-none focus:border-white/20 transition-colors text-white placeholder-gray-500"
                  />
                </div>
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="px-4 py-2 bg-[#121212] border border-white/10 text-white text-sm rounded-xl outline-none focus:border-primary transition-colors cursor-pointer"
                >
                  <option value="all">All Plans</option>
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="pro-plus">Pro+</option>
                </select>
                <button 
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm rounded-xl transition-all"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
              <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <table className="w-full whitespace-nowrap text-sm">
                  <thead className="sticky top-0 bg-[#1A1A1A]/95 backdrop-blur-md z-10 border-b border-white/5">
                    <tr>
                      <th className="text-left px-6 py-4 font-medium text-gray-400 text-xs uppercase tracking-wider">User</th>
                      <th className="text-left px-6 py-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Plan</th>
                      <th className="text-left px-6 py-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Summaries</th>
                      <th className="text-left px-6 py-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Joined</th>
                      <th className="text-right px-6 py-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => {
                        const userSummaries = summaries.filter(s => s.user_id === user.id);
                        return (
                          <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-[#222] border border-white/5 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-medium text-gray-300">{user.name.charAt(0).toUpperCase()}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-medium text-gray-200">{user.name}</span>
                                  <span className="text-xs text-gray-500">{user.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-widest ${
                                user.plan === 'pro-plus'
                                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                  : user.plan === 'pro'
                                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                  : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                              }`}>
                                {user.plan === 'pro-plus' ? 'Pro+' : user.plan}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-400">
                              {userSummaries.length}
                            </td>
                            <td className="px-6 py-4 text-gray-500 text-xs">
                              {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                            </td>
                             <td className="px-6 py-4 text-right">
                               <div className="flex items-center justify-end gap-2">
                                 <button 
                                   onClick={() => { setSelectedUser(user); setViewType('user'); setIsViewModalOpen(true); }}
                                   className="p-2.5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all border border-white/5 active:scale-95" 
                                   title="View User Details"
                                 >
                                   <Eye className="w-4 h-4" />
                                 </button>
                                 <button 
                                   onClick={() => { setSelectedUser(user); setIsEditModalOpen(true); }}
                                   className="p-2.5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all border border-white/5 active:scale-95" 
                                   title="Edit User"
                                 >
                                   <Settings className="w-4 h-4" />
                                 </button>
                                 <button 
                                   onClick={() => handleDeleteUser(user.id)}
                                   disabled={isDeleting === user.id}
                                   className="p-2.5 bg-red-500/10 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-xl transition-all border border-red-500/10 active:scale-95 disabled:opacity-50" 
                                   title="Delete User"
                                  >
                                   <Trash2 className="w-4 h-4" />
                                 </button>
                               </div>
                             </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          No users found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'history' && (
            <div className="bg-[#1A1A1A]/60 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-16rem)] min-h-[500px]">
              <div className="p-4 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative max-w-sm flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    placeholder="Search all summaries..."
                    className="w-full pl-9 pr-4 py-2 bg-[#121212] border border-white/5 rounded-xl text-sm outline-none focus:border-white/20 transition-colors text-white placeholder-gray-500"
                  />
                </div>
                 <select
                  value={historyFilter}
                  onChange={(e) => setHistoryFilter(e.target.value)}
                  className="px-4 py-2 bg-[#121212] border border-white/10 text-white text-sm rounded-xl outline-none focus:border-primary transition-colors cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="youtube">YouTube</option>
                  <option value="audio">Audio</option>
                  <option value="url">URL</option>
                </select>
              </div>
              <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <table className="w-full whitespace-nowrap text-sm">
                  <thead className="sticky top-0 bg-[#1A1A1A]/95 backdrop-blur-md z-10 border-b border-white/5">
                    <tr>
                      <th className="text-left px-6 py-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Title / Preview</th>
                      <th className="text-left px-6 py-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Type</th>
                      <th className="text-left px-6 py-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Author</th>
                      <th className="text-left px-6 py-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Date Created</th>
                      <th className="text-right px-6 py-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredHistory.length > 0 ? (
                      filteredHistory.map((summary) => {
                        const author = users.find(u => u.id === summary.user_id);
                        return (
                          <tr key={summary.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-6 py-4 max-w-[300px] truncate">
                              <span className="font-medium text-gray-200 block truncate">{summary.title}</span>
                              <span className="text-xs text-gray-500 block truncate mt-0.5">{summary.summary || 'No content preview available'}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-widest ${
                                summary.type === 'youtube'
                                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                  : summary.type === 'audio'
                                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              }`}>
                                {summary.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-400">
                              {author ? author.name : 'Unknown User'}
                            </td>
                            <td className="px-6 py-4 text-gray-500 text-xs">
                              {new Date(summary.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </td>
                             <td className="px-6 py-4 text-right">
                               <div className="flex items-center justify-end gap-2">
                                 <button 
                                   onClick={() => { setSelectedSummary(summary); setViewType('summary'); setIsViewModalOpen(true); }}
                                   className="p-2.5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all border border-white/5 active:scale-95" 
                                   title="View Summary"
                                 >
                                   <Eye className="w-4 h-4" />
                                 </button>
                                 <button 
                                   onClick={() => handleDeleteSummary(summary.id)}
                                   disabled={isDeleting === summary.id}
                                   className="p-2.5 bg-red-500/10 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-xl transition-all border border-red-500/10 active:scale-95 disabled:opacity-50" 
                                   title="Delete Summary"
                                  >
                                   <Trash2 className="w-4 h-4" />
                                 </button>
                               </div>
                             </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          No history found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1A1A1A]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:p-8 flex flex-col">
                  <h2 className="text-lg font-medium text-white mb-6">Source Analytics</h2>
                  <div className="flex-1 flex items-center justify-center min-h-[300px]">
                     {sourceData.some(d => d.value > 0) ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={sourceData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="name" stroke="#888" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis stroke="#888" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#121212', borderColor: '#333', borderRadius: '12px', color: '#fff' }} 
                            />
                            <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                          </LineChart>
                        </ResponsiveContainer>
                     ) : (
                        <p className="text-gray-500 text-sm">Not enough data to generate charts.</p>
                     )}
                  </div>
                </div>

                <div className="bg-[#1A1A1A]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:p-8 flex flex-col">
                  <h2 className="text-lg font-medium text-white mb-6">Summaries Created (Last 7 Days)</h2>
                  <div className="flex-1 flex items-center justify-center min-h-[300px]">
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={activityData}
                          margin={{ top: 20, right: 30, left: -20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                          <XAxis dataKey="name" stroke="#888" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
                          <YAxis stroke="#888" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
                          <Tooltip 
                            cursor={{ fill: '#222' }} 
                            contentStyle={{ backgroundColor: '#121212', borderColor: '#333', borderRadius: '12px', color: '#fff' }} 
                          />
                          <Bar dataKey="summaries" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
                </div>
             </div>
          )}

          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Profile Settings */}
              <div className="bg-[#1A1A1A]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:p-8">
                <h2 className="text-lg font-medium text-white mb-6">Profile Settings</h2>
                <form className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex flex-col gap-3">
                     <label className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Profile Avatar</label>
                     <div className="flex items-center gap-4">
                       <div className="w-16 h-16 rounded-full bg-[#222] border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                         {isUploading ? (
                           <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                         ) : (
                           <img src={adminAvatar} alt="Admin Avatar" className="object-cover w-full h-full" />
                         )}
                       </div>
                       <div className="flex flex-col gap-2">
                         <div className="flex items-center gap-2">
                           <label className={`cursor-pointer px-4 py-2 ${isUploading ? 'bg-white/5 opacity-50' : 'bg-white/5 hover:bg-white/10'} border border-white/10 text-white text-sm rounded-xl transition-all font-medium`}>
                             {isUploading ? 'Uploading...' : 'Upload Image'}
                             <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploading} />
                           </label>
                           {!isUploading && (
                             <button type="button" onClick={() => setAdminAvatar('https://api.dicebear.com/7.x/avataaars/svg?seed=Admin')} className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl text-sm transition-all font-medium">
                               Remove
                             </button>
                           )}
                         </div>
                         <p className="text-[11px] text-gray-500">Suggested: 400x400px. Max size: 2MB.</p>
                       </div>
                     </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                     <label className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Full Name</label>
                      <input 
                        type="text" 
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-sm text-white focus:border-primary focus:outline-none transition-colors"
                      />
                  </div>
                  <div className="flex flex-col gap-1.5">
                     <label className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Email Address</label>
                     <input 
                       type="email" 
                       defaultValue="admin@clipnote.ai" 
                       className="w-full px-4 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-sm text-gray-400 focus:outline-none cursor-not-allowed"
                       disabled
                     />
                     <span className="text-[11px] text-gray-500 mt-0.5">Contact technical support to change primary administrative emails.</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                     <label className="text-xs font-semibold text-gray-400 tracking-wider uppercase">New Password</label>
                     <input 
                       type="password" 
                       placeholder="••••••••" 
                       className="w-full px-4 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-sm text-white focus:border-primary focus:outline-none transition-colors"
                     />
                  </div>
                   <div className="pt-4">
                      <button 
                        type="button" 
                        onClick={handleUpdateProfile}
                        disabled={isUpdatingProfile}
                        className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all border border-transparent disabled:opacity-50 flex items-center gap-2"
                      >
                        {isUpdatingProfile ? (
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : null}
                        {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
                      </button>
                   </div>
                </form>
              </div>

              {/* System Preferences */}
              <div className="bg-[#1A1A1A]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:p-8">
                <h2 className="text-lg font-medium text-white mb-6">System Preferences</h2>
                <div className="space-y-6">
                  {/* Setting toggle 1 */}
                  <div className="flex items-center justify-between pb-6 border-b border-white/5">
                    <div className="pr-4">
                      <h3 className="text-sm text-gray-200 font-medium">Maintenance Mode</h3>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">Temporarily disable access to the platform for all non-admin users.</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ring-offset-[#0B0B0E] bg-[#333]">
                      <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                    </button>
                  </div>

                  {/* Setting toggle 2 */}
                  <div className="flex items-center justify-between pb-6 border-b border-white/5">
                    <div className="pr-4">
                      <h3 className="text-sm text-gray-200 font-medium">New User Registration</h3>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">Allow new users to sign up for accounts.</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ring-offset-[#0B0B0E] bg-primary/80">
                      <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                    </button>
                  </div>

                  {/* Save button */}
                   <div className="pt-4 mt-6">
                      <button 
                        type="button" 
                        onClick={handleSavePreferences}
                        disabled={isUpdatingProfile}
                        className="px-5 py-2.5 bg-white/5 text-white text-sm font-semibold rounded-xl hover:bg-white/10 transition-all border border-white/10 disabled:opacity-50 flex items-center gap-2"
                      >
                        {isUpdatingProfile ? 'Saving...' : 'Save Preferences'}
                      </button>
                   </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* View Detail Modal */}
      {isViewModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsViewModalOpen(false)} />
          <div className="relative bg-[#1A1A1A] border border-white/5 w-full max-w-2xl rounded-[2rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold text-white mb-6">Details</h3>
            
            {viewType === 'user' && selectedUser && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Name</p>
                    <p className="text-white font-medium">{selectedUser.name}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-white font-medium">{selectedUser.email}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Plan</p>
                    <span className="text-primary font-bold uppercase text-xs">{selectedUser.plan}</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">User ID</p>
                    <p className="text-gray-400 text-[10px] break-all">{selectedUser.id}</p>
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl">
                   <p className="text-xs text-gray-500 mb-1">Recent Activity</p>
                   <p className="text-gray-400 text-sm">Joined {new Date(selectedUser.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            )}

            {viewType === 'summary' && selectedSummary && (
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Summary Title</p>
                  <p className="text-white font-medium">{selectedSummary.title}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Content Preview</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{selectedSummary.summary}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Source Type</p>
                    <p className="text-white font-medium capitalize">{selectedSummary.type}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Created At</p>
                    <p className="text-white font-medium">{new Date(selectedSummary.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8">
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative bg-[#1A1A1A] border border-white/5 w-full max-w-md rounded-[2rem] p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Edit User</h3>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Full Name</label>
                <input 
                  type="text" 
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-sm text-white focus:border-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Subscription Plan</label>
                <select 
                  value={selectedUser.plan}
                  onChange={(e) => setSelectedUser({...selectedUser, plan: e.target.value as any})}
                  className="w-full px-4 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-sm text-white focus:border-primary outline-none transition-all"
                >
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="pro-plus">Pro+</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div className="pt-4 flex flex-col gap-3">
                <button 
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50"
                >
                  {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative bg-[#1A1A1A] border border-white/5 w-full max-w-sm rounded-[2rem] p-8 shadow-2xl scale-in text-center">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogOut className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Are you sure?</h3>
            <p className="text-gray-400 mb-8">You will be logged out of the admin session.</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  localStorage.removeItem('admin_session');
                  window.location.href = '/admin/auth';
                }}
                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 active:scale-95"
              >
                Yes, Log Out
              </button>
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
