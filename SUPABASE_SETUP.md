# Supabase Integration Setup

This guide will help you set up Supabase integration for the Code Review application.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new account or sign in
2. Create a new project
3. Note down your project URL and anon key

## 2. Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with your actual Supabase project credentials.

## 3. Database Schema

Run the following SQL in your Supabase SQL editor to create the necessary tables:

```sql
-- Create analyses table
CREATE TABLE analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  repository_url TEXT NOT NULL,
  github_token TEXT,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  results JSONB,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create github_repos table
CREATE TABLE github_repos (
  id BIGINT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  html_url TEXT NOT NULL,
  description TEXT,
  private BOOLEAN DEFAULT false,
  fork BOOLEAN DEFAULT false,
  stargazers_count INTEGER DEFAULT 0,
  language TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_analyses_status ON analyses(status);
CREATE INDEX idx_github_repos_user_id ON github_repos(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_repos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own analyses" ON analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses" ON analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyses" ON analyses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own repos" ON github_repos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own repos" ON github_repos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own repos" ON github_repos
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_analyses_updated_at BEFORE UPDATE ON analyses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_github_repos_updated_at BEFORE UPDATE ON github_repos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 4. Configure Authentication

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Add your Supabase callback URL: `https://your-project.supabase.co/auth/v1/callback`
6. Copy the Client ID and Client Secret
7. In Supabase Dashboard, go to Authentication > Providers > Google
8. Enable Google provider and enter your Client ID and Client Secret

### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set the Authorization callback URL to: `https://your-project.supabase.co/auth/v1/callback`
4. Copy the Client ID and Client Secret
5. In Supabase Dashboard, go to Authentication > Providers > GitHub
6. Enable GitHub provider and enter your Client ID and Client Secret
7. Set the required scopes: `repo read:user user:email`

## 5. Site URL Configuration

In your Supabase Dashboard:
1. Go to Authentication > URL Configuration
2. Set your Site URL to your application URL (e.g., `http://localhost:5173` for development)
3. Add any additional redirect URLs you need

## 6. Install Dependencies

Make sure you have the required dependencies installed:

```bash
npm install @supabase/supabase-js
```

## 7. Features

With this setup, your application now supports:

- **Google Authentication**: Users can sign in with their Google accounts
- **GitHub Authentication**: Users can sign in with their GitHub accounts and access their repositories
- **Repository Selection**: GitHub users can select from their repositories instead of typing URLs
- **Analysis History**: All analyses are stored in the database and can be viewed in the user profile
- **Secure Token Storage**: GitHub tokens are stored securely in the database
- **Real-time Updates**: Analysis status is updated in real-time

## 8. Usage

1. Users can sign in with Google or GitHub
2. GitHub users will see a "Select from your GitHub repositories" button
3. All analyses are automatically saved to the database
4. Users can view their analysis history in their profile
5. GitHub tokens are stored securely and can be reused

## Troubleshooting

- Make sure your environment variables are correctly set
- Check that your Supabase project URL and anon key are correct
- Verify that OAuth providers are properly configured
- Ensure RLS policies are in place for security
- Check the browser console for any authentication errors 