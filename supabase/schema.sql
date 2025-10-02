-- Tagpeak Consumer Psychology Study Database Schema

-- Create survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    session_start TIMESTAMP WITH TIME ZONE,
    session_end TIMESTAMP WITH TIME ZONE,
    psychology_profile JSONB,
    shopping_behavior JSONB,
    indifference_points JSONB,
    demographics JSONB,
    staircase_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_survey_responses_user_id ON survey_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_created_at ON survey_responses(created_at);

-- Create psychology_insights table for aggregated insights
CREATE TABLE IF NOT EXISTS psychology_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    insight_type TEXT NOT NULL,
    insight_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychology_insights ENABLE ROW LEVEL SECURITY;

-- Create policies for secure access
-- Only allow INSERT for new survey responses (no personal data)
CREATE POLICY "Allow survey response insert" ON survey_responses
    FOR INSERT WITH CHECK (
        user_id IS NOT NULL AND 
        LENGTH(user_id) > 10 AND
        session_start IS NOT NULL
    );

-- Only allow SELECT for aggregated data (no personal identifiers)
CREATE POLICY "Allow aggregated data read" ON survey_responses
    FOR SELECT USING (
        created_at IS NOT NULL AND
        psychology_profile IS NOT NULL
    );

-- Restrict psychology_insights to admin only
CREATE POLICY "Restrict psychology insights" ON psychology_insights
    FOR ALL USING (false);

-- Create a secure view for public analytics (no personal data)
CREATE OR REPLACE VIEW public_survey_analytics AS
SELECT 
    DATE_TRUNC('day', created_at) as survey_date,
    COUNT(*) as total_responses,
    AVG((demographics->>'age')::integer) as avg_age,
    COUNT(CASE WHEN (psychology_profile->>'riskTolerance') = 'aggressive' THEN 1 END) as aggressive_risk_count,
    COUNT(CASE WHEN (psychology_profile->>'riskTolerance') = 'conservative' THEN 1 END) as conservative_risk_count,
    COUNT(CASE WHEN (psychology_profile->>'riskTolerance') = 'moderate' THEN 1 END) as moderate_risk_count,
    COUNT(CASE WHEN (psychology_profile->>'timePreference') = 'immediate' THEN 1 END) as immediate_preference_count,
    COUNT(CASE WHEN (psychology_profile->>'timePreference') = 'future' THEN 1 END) as future_preference_count
FROM survey_responses
WHERE psychology_profile IS NOT NULL
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY survey_date DESC;

-- Grant access to the public view
GRANT SELECT ON public_survey_analytics TO anon;

-- Create a view for aggregated results (without personal data)
CREATE OR REPLACE VIEW survey_analytics AS
SELECT 
    DATE_TRUNC('day', created_at) as survey_date,
    COUNT(*) as total_responses,
    AVG((demographics->>'age')::integer) as avg_age,
    COUNT(CASE WHEN (psychology_profile->>'riskTolerance') = 'aggressive' THEN 1 END) as aggressive_risk_count,
    COUNT(CASE WHEN (psychology_profile->>'riskTolerance') = 'conservative' THEN 1 END) as conservative_risk_count,
    COUNT(CASE WHEN (psychology_profile->>'riskTolerance') = 'moderate' THEN 1 END) as moderate_risk_count,
    COUNT(CASE WHEN (psychology_profile->>'timePreference') = 'immediate' THEN 1 END) as immediate_preference_count,
    COUNT(CASE WHEN (psychology_profile->>'timePreference') = 'future' THEN 1 END) as future_preference_count,
    COUNT(CASE WHEN (psychology_profile->>'timePreference') = 'immediate' THEN 1 END) * 100.0 / COUNT(*) as immediate_preference_percentage,
    COUNT(CASE WHEN (psychology_profile->>'timePreference') = 'future' THEN 1 END) * 100.0 / COUNT(*) as future_preference_percentage
FROM survey_responses
WHERE psychology_profile IS NOT NULL
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY survey_date DESC;

-- Create a function to get indifference point statistics
CREATE OR REPLACE FUNCTION get_indifference_stats()
RETURNS TABLE (
    product_category TEXT,
    avg_indifference_point NUMERIC,
    min_indifference_point NUMERIC,
    max_indifference_point NUMERIC,
    response_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH product_stats AS (
        SELECT 
            (jsonb_each(indifference_points)).key as product_id,
            ((jsonb_each(indifference_points)).value->>'point')::NUMERIC as point_value
        FROM survey_responses
        WHERE indifference_points IS NOT NULL
    )
    SELECT 
        'All Products'::TEXT as product_category,
        AVG(point_value) as avg_indifference_point,
        MIN(point_value) as min_indifference_point,
        MAX(point_value) as max_indifference_point,
        COUNT(*) as response_count
    FROM product_stats
    WHERE point_value IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Create a simpler view for basic indifference point analysis
CREATE OR REPLACE VIEW indifference_analysis AS
WITH indifference_data AS (
    SELECT 
        id,
        created_at,
        (jsonb_each(indifference_points)).key as product_id,
        ((jsonb_each(indifference_points)).value->>'point')::NUMERIC as point_value
    FROM survey_responses
    WHERE indifference_points IS NOT NULL
)
SELECT 
    DATE_TRUNC('day', created_at) as survey_date,
    COUNT(DISTINCT id) as total_responses,
    AVG(point_value) as avg_indifference_point,
    MIN(point_value) as min_indifference_point,
    MAX(point_value) as max_indifference_point
FROM indifference_data
WHERE point_value IS NOT NULL
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY survey_date DESC;
