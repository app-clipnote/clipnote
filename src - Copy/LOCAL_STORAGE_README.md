# AI Summarizer - Local Storage Version

This app now runs **100% locally** using browser localStorage. No external database or authentication service required!

## 🚀 Quick Start

1. **Sign Up**: Create a new account with any email and password
2. **Login**: Use the same credentials to log back in
3. All data persists in your browser's localStorage

## 🔑 How Authentication Works

### Sign Up
```
Email: test@example.com
Password: password123
Name: Test User
```
- Creates a user in localStorage
- Automatically logs you in
- Redirects to onboarding to choose a plan

### Login
- Enter the same email/password you used during signup
- Validates credentials against localStorage
- Loads your profile and summaries

### Logout
- Clears the current session
- Your data remains in localStorage for next login

## 💾 Data Storage

All data is stored in browser localStorage under these keys:

- `ai_summarizer_users` - All user accounts
- `ai_summarizer_current_user` - Current logged-in user ID
- `ai_summarizer_summaries` - All summaries
- `ai_summarizer_settings` - User settings

## 🧪 Testing

### Create a Test Account
1. Go to `/auth`
2. Click "Sign up"
3. Fill in:
   - Name: `Test User`
   - Email: `test@test.com`
   - Password: `test123`
4. Submit form
5. Choose a plan
6. Start using the app!

### View Stored Data
Open browser DevTools Console and run:
```javascript
// View all users
JSON.parse(localStorage.getItem('ai_summarizer_users'))

// View current user ID
localStorage.getItem('ai_summarizer_current_user')

// View all summaries
JSON.parse(localStorage.getItem('ai_summarizer_summaries'))
```

### Clear All Data
To reset everything:
```javascript
localStorage.clear()
```

## 🔒 Security Notes

⚠️ **For Development/Demo Only**
- Passwords are stored in plain text
- No encryption
- Data is not secure
- Anyone with access to your browser can view the data

For production, you would need:
- Password hashing (bcrypt, argon2)
- Server-side authentication
- Secure database
- HTTPS
- Token-based auth (JWT)

## 🐛 Troubleshooting

### Can't Login?
1. Check browser console for errors
2. Verify you're using the correct email/password
3. Try creating a new account
4. Clear localStorage and try again

### Data Not Persisting?
1. Check if localStorage is enabled in your browser
2. Check if you're in private/incognito mode (localStorage may be limited)
3. Check browser storage quota

### See All Users
```javascript
// In browser console
const users = JSON.parse(localStorage.getItem('ai_summarizer_users') || '{}');
Object.values(users).forEach(u => {
  console.log(`Email: ${u.email}, Password: ${u.password}`);
});
```

## 📦 What Changed from Supabase Version

### Removed
- ❌ Supabase client
- ❌ External API calls
- ❌ Network dependencies
- ❌ Email rate limits
- ❌ AbortError issues

### Added
- ✅ Local storage utilities
- ✅ Client-side authentication
- ✅ Simplified session management
- ✅ Instant performance
- ✅ Works offline

## 🎯 Features Still Working

✅ User signup/login/logout
✅ Profile management
✅ Summary creation
✅ Summary history
✅ Settings persistence
✅ Plan selection
✅ Complete dashboard functionality

## 📝 Data Structure

### User Profile
```typescript
{
  id: string;
  email: string;
  name: string;
  password: string;
  plan: 'free' | 'pro' | 'enterprise';
  created_at: string;
  updated_at: string;
}
```

### Summary
```typescript
{
  id: string;
  user_id: string;
  url: string;
  title: string;
  summary: string;
  type: 'youtube' | 'audio' | 'url';
  created_at: string;
  updated_at: string;
}
```

### Settings
```typescript
{
  id: string;
  user_id: string;
  language: string;
  email_notifications: boolean;
  summary_complete_notifications: boolean;
  weekly_digest: boolean;
  theme: 'light' | 'dark';
  created_at: string;
  updated_at: string;
}
```
