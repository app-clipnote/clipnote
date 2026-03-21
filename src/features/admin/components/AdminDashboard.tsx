import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, CreditCard, TrendingUp, Activity, Search, 
  Download, MoreVertical, ArrowUpRight, LogOut, 
  Settings, Home, FileText, Menu, ChevronLeft, History, ArrowLeft
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import { getAllUsers, getAllSummaries } from '../../../lib/admin-storage';
import type { Profile as UserProfile, Summary } from '../../../types';
import logoImage from '../../../assets/logoicon.png';
import { storage, db } from '../../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export function AdminDashboard() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'analytics' | 'history' | 'settings'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [adminAvatar, setAdminAvatar] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=Admin');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const allUsers = await getAllUsers();
    const allSummaries = await getAllSummaries();
    setUsers(allUsers);
    setSummaries(allSummaries);

    try {
      const adminDoc = await getDoc(doc(db, "admins", "main_admin"));
      if (adminDoc.exists() && adminDoc.data().avatar_url) {
        setAdminAvatar(adminDoc.data().avatar_url);
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
      
      await setDoc(doc(db, "admins", "main_admin"), { avatar_url: url }, { merge: true });
      setAdminAvatar(url);
    } catch (error) {
      console.error("Avatar upload failed:", error);
    } finally {
      setIsUploading(false);
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

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHistory = summaries.filter(summary => 
    (summary.title || '').toLowerCase().includes(historySearchQuery.toLowerCase()) ||
    (summary.summary || '').toLowerCase().includes(historySearchQuery.toLowerCase())
  ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

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
  const PIE_COLORS = ['#ef4444', '#3b82f6', '#10b981']; 
  const sourceData = [
    { name: 'YouTube', value: summaries.filter(s => s.type === 'youtube').length },
    { name: 'Audio', value: summaries.filter(s => s.type === 'audio').length },
    { name: 'URL', value: summaries.filter(s => s.type === 'url').length },
  ].filter(d => d.value > 0);

  // Growth Data Mock for BarChart
  const activityData = [
    { name: 'Mon', summaries: Math.floor(summaries.length * 0.1) || 12 },
    { name: 'Tue', summaries: Math.floor(summaries.length * 0.15) || 19 },
    { name: 'Wed', summaries: Math.floor(summaries.length * 0.05) || 15 },
    { name: 'Thu', summaries: Math.floor(summaries.length * 0.2) || 22 },
    { name: 'Fri', summaries: Math.floor(summaries.length * 0.25) || 29 },
    { name: 'Sat', summaries: Math.floor(summaries.length * 0.1) || 32 },
    { name: 'Sun', summaries: Math.floor(summaries.length * 0.15) || 35 },
  ];

  return (
    <div className="flex h-screen bg-[#0A0A0B] text-gray-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-[280px]' : 'w-[80px]'} flex-shrink-0 bg-[#121212] border-r border-white/5 flex flex-col hidden md:flex transition-all duration-300`}>
        {/* Workspace Dropdown / Logo section */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3 p-1 overflow-hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
               <img src={logoImage} alt="ClipNote Logo" className="w-full h-full object-contain" />
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
                    <h3 className="text-sm font-medium text-white truncate">Administrator</h3>
                    <p className="text-xs text-gray-500 truncate">admin@clipnote.ai</p>
                  </div>
                )}
             </div>
            {isSidebarOpen && (
              <button 
                onClick={() => {
                  localStorage.removeItem('admin_session');
                  window.location.href = '/admin/auth';
                }}
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
                 <img src={logoImage} alt="ClipNote Logo" className="w-6 h-6 object-contain" />
             </div>
             <span className="font-semibold text-white">ClipNote Admin</span>
           </div>
           
           <div className="flex items-center gap-1">
             <Link to="/" className="p-2 text-gray-500 hover:bg-white/10 rounded-lg" title="Back to Website">
                <ArrowLeft className="w-5 h-5" />
             </Link>
             <button 
               onClick={() => {
                  localStorage.removeItem('admin_session');
                  window.location.href = '/admin/auth';
                }}
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
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm rounded-xl transition-all">
                  Filter
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
                              <button className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100" title="Manage User">
                                <MoreVertical className="w-4 h-4" />
                              </button>
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
                <button className="whitespace-nowrap px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm rounded-xl transition-all">
                  Filter by Type
                </button>
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
                              <button className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100" title="View Summary Details">
                                <MoreVertical className="w-4 h-4" />
                              </button>
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
                     {sourceData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={sourceData}
                              cx="50%"
                              cy="50%"
                              innerRadius={70}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                              stroke="none"
                            >
                              {sourceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#121212', borderColor: '#333', borderRadius: '12px', color: '#fff' }}
                              itemStyle={{ color: '#fff' }}
                            />
                            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}/>
                          </PieChart>
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
                       defaultValue="Administrator" 
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
                     <button type="button" className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all border border-transparent">
                       Update Profile
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
                  <div className="pt-4 flex justify-start">
                     <button className="px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                       Save Preferences
                     </button>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}
