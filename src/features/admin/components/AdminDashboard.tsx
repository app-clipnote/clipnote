import { useState, useEffect } from 'react';
import { Users, CreditCard, TrendingUp, Activity, Search, Download, MoreVertical, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getAllUsers, getAllSummaries } from '../../../lib/admin-storage';
import type { Profile as UserProfile } from '../../../types';
import type { Summary } from '../../../types';

export function AdminDashboard() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'analytics'>('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allUsers = getAllUsers();
    const allSummaries = getAllSummaries();
    setUsers(allUsers);
    setSummaries(allSummaries);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage users and monitor platform activity</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors">
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>
      </header>

      <div className="p-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 border-b-2 transition-colors ${
              activeTab === 'analytics'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>12%</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                <p className="text-3xl font-semibold">{stats.totalUsers}</p>
              </div>

              <div className="bg-white border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>8%</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Active Users</p>
                <p className="text-3xl font-semibold">{stats.activeUsers}</p>
              </div>

              <div className="bg-white border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>24%</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Total Summaries</p>
                <p className="text-3xl font-semibold">{stats.totalSummaries}</p>
              </div>

              <div className="bg-white border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>18%</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Monthly Revenue</p>
                <p className="text-3xl font-semibold">₦{stats.revenue.toLocaleString()}</p>
              </div>
            </div>

            {/* Subscription Breakdown */}
            <div className="bg-white border border-border rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-6">Subscription Breakdown</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Free Plan</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${(stats.freeUsers / stats.totalUsers) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-16 text-right">{stats.freeUsers} users</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">Pro Plan</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(stats.proUsers / stats.totalUsers) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-16 text-right">{stats.proUsers} users</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Pro+ Plan</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500"
                        style={{ width: `${(stats.proPlusUsers / stats.totalUsers) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-16 text-right">{stats.proPlusUsers} users</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-border rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-6">Recent Signups</h2>
              <div className="space-y-4">
                {users.slice(0, 5).reverse().map((user) => (
                  <div key={user.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">{user.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        user.plan === 'pro-plus'
                          ? 'bg-orange-100 text-orange-700'
                          : user.plan === 'pro'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {user.plan === 'pro-plus' ? 'Pro+' : user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-xl outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Users Table */}
            <div className="bg-white border border-border rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-secondary border-b border-border">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">User</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Plan</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Summaries</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Joined</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const userSummaries = summaries.filter(s => s.user_id === user.id);
                    return (
                      <tr key={user.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium">{user.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            user.plan === 'pro-plus'
                              ? 'bg-orange-100 text-orange-700'
                              : user.plan === 'pro'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {user.plan === 'pro-plus' ? 'Pro+' : user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm">{userSummaries.length}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground">
                            {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Content Type Distribution */}
              <div className="bg-white border border-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-6">Content Type Distribution</h2>
                <div className="space-y-4">
                  {['youtube', 'audio', 'url'].map((type) => {
                    const count = summaries.filter(s => s.type === type).length;
                    const percentage = summaries.length > 0 ? (count / summaries.length) * 100 : 0;
                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="capitalize">{type}</span>
                          <span className="font-medium">{count} ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* User Activity */}
              <div className="bg-white border border-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-6">Top Active Users</h2>
                <div className="space-y-4">
                  {users
                    .map(user => ({
                      ...user,
                      summaryCount: summaries.filter(s => s.user_id === user.id).length
                    }))
                    .sort((a, b) => b.summaryCount - a.summaryCount)
                    .slice(0, 5)
                    .map((user, index) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="text-sm">{user.name}</span>
                        </div>
                        <span className="text-sm font-medium">{user.summaryCount} summaries</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
