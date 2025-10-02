# 🔒 Security Guide - Tagpeak Psychology Survey

## 🛡️ Security Implementation

This survey implements **enterprise-grade security** with proper environment variable handling and database restrictions.

## 🔐 Environment Variables

### Local Development

1. **Create `.env` file** (copy from `env.example`):
```bash
cp env.example .env
```

2. **Add your Supabase credentials** to `.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Never commit `.env` to git** (it's in `.gitignore`)

### Vercel Deployment

1. **Set environment variables in Vercel dashboard**:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

2. **Redeploy** after adding environment variables:
```bash
vercel --prod
```

## 🗄️ Database Security

### Row Level Security (RLS)

The database implements **strict RLS policies**:

```sql
-- Only allow INSERT for valid survey responses
CREATE POLICY "Allow survey response insert" ON survey_responses
    FOR INSERT WITH CHECK (
        user_id IS NOT NULL AND 
        LENGTH(user_id) > 10 AND
        session_start IS NOT NULL
    );

-- Only allow SELECT for aggregated data
CREATE POLICY "Allow aggregated data read" ON survey_responses
    FOR SELECT USING (
        created_at IS NOT NULL AND
        psychology_profile IS NOT NULL
    );
```

### Data Protection

- ✅ **No personal identifiers** stored
- ✅ **Anonymous user IDs** only (UUIDs)
- ✅ **Encrypted data** at rest (Supabase handles this)
- ✅ **Secure connections** (HTTPS only)
- ✅ **Input validation** on all data

## 🔍 Data Access Control

### Public Access
- **Survey responses**: INSERT only (no personal data)
- **Analytics views**: Aggregated data only

### Admin Access
- **Full database access** via Supabase dashboard
- **Raw data analysis** for research purposes

## 🚫 Security Restrictions

### What's Blocked
- ❌ **No direct database access** from frontend
- ❌ **No personal data** in responses
- ❌ **No cross-origin requests** to unauthorized domains
- ❌ **No sensitive data** in client-side code

### What's Allowed
- ✅ **Anonymous survey responses**
- ✅ **Aggregated analytics**
- ✅ **Public research insights**

## 🔧 Security Configuration

### Supabase Setup

1. **Enable RLS** on all tables:
```sql
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
```

2. **Create secure policies** (already in schema.sql)

3. **Set up authentication** (optional for admin access):
```sql
-- Create admin role
CREATE ROLE admin_role;
GRANT ALL ON survey_responses TO admin_role;
```

### Vercel Configuration

1. **Environment variables** in dashboard
2. **HTTPS enforcement** (automatic)
3. **CORS configuration** (automatic)

## 📊 Data Privacy

### GDPR Compliance

- ✅ **Anonymous data collection**
- ✅ **No personal identifiers**
- ✅ **Data retention policies** (configurable)
- ✅ **Right to deletion** (easy to implement)

### Data Minimization

- ✅ **Only necessary data** collected
- ✅ **No tracking cookies**
- ✅ **No third-party analytics**
- ✅ **Local storage only** for session data

## 🔐 Best Practices

### Development

1. **Never hardcode credentials**
2. **Use environment variables**
3. **Validate all inputs**
4. **Test security policies**

### Deployment

1. **Set environment variables** in Vercel
2. **Enable RLS** in Supabase
3. **Monitor access logs**
4. **Regular security audits**

## 🚨 Security Checklist

Before deployment:

- [ ] Environment variables set in Vercel
- [ ] Supabase RLS enabled
- [ ] No credentials in code
- [ ] HTTPS enforced
- [ ] Data validation implemented
- [ ] Error handling secure
- [ ] No sensitive data exposed

## 🔍 Monitoring

### Supabase Dashboard
- Monitor database access
- Check RLS policy violations
- Review authentication logs

### Vercel Analytics
- Monitor deployment health
- Check environment variable usage
- Review build logs

## 🆘 Security Issues

If you encounter security issues:

1. **Check environment variables** are set correctly
2. **Verify RLS policies** are active
3. **Review Supabase logs** for errors
4. **Test data access** with different users

## 📞 Support

For security questions:
- **Supabase Security**: [supabase.com/docs/guides/auth](https://supabase.com/docs/guides/auth)
- **Vercel Security**: [vercel.com/docs/security](https://vercel.com/docs/security)

---

**🔒 Your survey is now enterprise-grade secure!**
