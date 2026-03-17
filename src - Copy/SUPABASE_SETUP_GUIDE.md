# Supabase Setup Guide for AI Summarizer

Follow these steps to set up Supabase for your AI Summarizer application.

---

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click **"New Project"**
4. Fill in the details:
   - **Project Name**: AI Summarizer (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
5. Click **"Create new project"**
6. Wait 2-3 minutes for the project to be created

---

## Step 2: Run the SQL Schema

1. In your Supabase project dashboard, click on **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Copy the entire contents of the `supabase-schema.sql` file
4. Paste it into the SQL editor
5. Click **"Run"** (or press Ctrl/Cmd + Enter)
6. You should see a success message

**What this does:**
- Creates a `profiles` table for user information and plans
- Creates a `summaries` table for storing all AI summaries
- Creates a `user_settings` table for user preferences
- Sets up Row Level Security (RLS) policies for data protection
- Creates triggers to auto-create profiles when users sign up
- Creates indexes for better query performance

---

## Step 3: Enable Email Authentication

1. In your Supabase dashboard, go to **"Authentication"** → **"Providers"**
2. Make sure **"Email"** is enabled (it should be by default)
3. Optionally configure email templates:
   - Go to **"Authentication"** → **"Email Templates"**
   - Customize the confirmation and reset password emails

---

## Step 4: Get Your Supabase Credentials

You'll need two values to connect your app to Supabase:

### 4a. Get the Project URL
1. Go to **"Settings"** (gear icon at bottom of sidebar)
2. Click **"API"**
3. Find **"Project URL"** under "Project API keys"
4. Copy this value (looks like: `https://xxxxxxxxxxxxx.supabase.co`)

### 4b. Get the Anonymous/Public Key
1. On the same **"API"** page
2. Find **"Project API keys"** section
3. Copy the **"anon/public"** key (long string starting with `eyJ...`)

⚠️ **IMPORTANT**: 
- The `anon` key is safe to use in your frontend
- NEVER share your `service_role` key publicly

---

## Step 5: Provide Me With Your Credentials

Once you have completed steps 1-4, please provide me with:

```
Supabase URL: https://xxxxxxxxxxxxx.supabase.co
Supabase Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

I will then:
1. Create a `.env` file with your credentials
2. Update the app to use Supabase for authentication
3. Connect all database operations to Supabase
4. Add real-time features if needed

---

## Step 6: Testing (After Integration)

After I integrate Supabase, you can test:

1. **Sign Up**: Create a new account
   - Check the `profiles` table in Supabase (should auto-create a profile)
   - Check the `user_settings` table (should have default settings)

2. **Create Summaries**: Generate some summaries
   - Check the `summaries` table (should see your summaries)

3. **Test RLS**: Open your browser's dev tools
   - Try to access another user's data (should fail)

---

## Verification Checklist

Before providing credentials, verify:
- [ ] Supabase project is created and active
- [ ] SQL schema has been run successfully (check Tables in sidebar)
- [ ] Email authentication is enabled
- [ ] You have copied both the Project URL and anon key
- [ ] You have NOT shared the service_role key

---

## Database Structure Overview

### Tables Created:

**profiles**
- Stores user data (name, email, plan)
- Automatically created when user signs up
- Linked to Supabase Auth

**summaries**
- Stores all AI-generated summaries
- Linked to user via `user_id`
- Includes URL, title, summary text, and type

**user_settings**
- Stores user preferences
- Notifications, theme, language settings
- Auto-created with default values

### Security:
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Policies enforce data isolation

---

## Need Help?

If you encounter any issues:
1. Check the Supabase logs (Database → Logs)
2. Verify all SQL ran without errors
3. Make sure authentication is enabled
4. Double-check you copied the correct keys

Once you're ready, paste your credentials and I'll integrate everything! 🚀
