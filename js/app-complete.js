// Tagpeak Consumer Psychology Study - Complete Implementation
// Modern survey using staircase method to evaluate psychological consequences

// Configuration - Environment variables from Vercel or fallback to placeholders
const CONFIG = {
    supabase: {
        url: 'https://mevruhsacqhcqrylcwje.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ldnJ1aHNhY3FoY3FyeWxjd2plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDg1MjcsImV4cCI6MjA3NDk4NDUyN30._42ZLdMK9ml3fVdwLmk7slxO05-sXZyyv8ByDvt1yL4'
    },
    products: [
        { 
            id: 'low', 
            name: 'Premium Headphones', 
            price: 299, 
            currency: '€', 
            category: 'Electronics',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
            successStory: { name: 'Maria', product: 'headphones', spent: 299, cashback: 21, percentage: 7, period: '6 months' }
        },
        { 
            id: 'medium', 
            name: 'Designer Watch', 
            price: 899, 
            currency: '€', 
            category: 'Luxury',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
            successStory: { name: 'João', product: 'watch', spent: 899, cashback: 378, percentage: 42, period: '6 months' }
        },
        { 
            id: 'high', 
            name: 'MacBook Pro', 
            price: 2499, 
            currency: '€', 
            category: 'Technology',
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
            successStory: { name: 'Ana', product: 'laptop', spent: 2499, cashback: 50, percentage: 2, period: '6 months' }
        }
    ],
    staircase: {
        startDiscounts: [10, 20, 30],
        stepSizes: [15, 10, 5, 3, 2, 1],
        reversalsToEnd: 3,
        catchTrialsPerProduct: 0,
        maxTrialsForCatch: 10
    },
    psychologyHints: [
        "💡 Did you know? Smart shoppers who think long-term often see their small investments grow into significant returns over time",
        "🧠 Did you know? Research shows that people who consider future benefits tend to make more rewarding financial decisions",
        "📊 Did you know? Studies indicate that patient investment strategies often deliver better results than quick decisions",
        "🎯 Did you know? The most successful investors let their money work for them through smart, long-term strategies",
        "💭 Did you know? Your shopping preferences reveal fascinating insights about your decision-making style and future planning"
    ],
    shoppingBehaviorQuestions: [
        {
            id: 'online_shopping',
            question: 'How often do you shop online?',
            options: [
                { text: 'Daily', value: 'daily' },
                { text: 'Weekly', value: 'weekly' },
                { text: 'Monthly', value: 'monthly' },
                { text: 'Rarely', value: 'rarely' }
            ]
        },
        {
            id: 'discount_seeking',
            question: 'How do you typically look for discounts?',
            options: [
                { text: 'I always search for the best deals', value: 'always_search' },
                { text: 'I compare prices before buying', value: 'compare_prices' },
                { text: 'I use discount codes when available', value: 'use_codes' },
                { text: 'I buy when I need something', value: 'need_based' }
            ]
        },
        {
            id: 'cashback_usage',
            question: 'Have you ever used cashback or reward programs?',
            options: [
                { text: 'Yes, regularly', value: 'regularly' },
                { text: 'Yes, occasionally', value: 'occasionally' },
                { text: 'No, but interested', value: 'interested' },
                { text: 'No, not interested', value: 'not_interested' }
            ]
        },
        {
            id: 'shopping_style',
            question: 'How would you describe your shopping style?',
            options: [
                { text: 'Impulsive - I buy what I like', value: 'impulsive' },
                { text: 'Planned - I research before buying', value: 'planned' },
                { text: 'Mixed - depends on the situation', value: 'mixed' },
                { text: 'Minimal - I only buy necessities', value: 'minimal' }
            ]
        },
        {
            id: 'investment_interest',
            question: 'How interested are you in investment opportunities?',
            options: [
                { text: 'Very interested', value: 'very_interested' },
                { text: 'Somewhat interested', value: 'somewhat_interested' },
                { text: 'Not very interested', value: 'not_very_interested' },
                { text: 'Not interested at all', value: 'not_interested' }
            ]
        }
    ]
};

// Global state
let state = {
    currentScreen: 'loading',
    userId: null,
    staircases: [],
    currentStaircaseIndex: -1,
    shuffledOrder: [],
    indifferencePoints: {},
    demographics: null,
    shoppingBehavior: {},
    psychologyProfile: {
        riskTolerance: null,
        timePreference: null
    },
    comprehensionAnswers: {},
    enhancedAnalytics: {
        brandAffinity: null,
        purchaseIntent: null,
        discountSensitivity: null,
        innovationAdoption: null,
        decisionTime: [],
        hesitationPatterns: [],
        choiceConsistency: null
    },
    isCurrentTrialCatch: false,
    sessionStartTime: null,
    transitionTimer: null
};

// Initialize Supabase with proper error handling
let supabaseClient = null;

const initializeSupabase = async () => {
    try {
        // Dynamic import for Supabase client
        const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js@2');
        supabaseClient = createClient(CONFIG.supabase.url, CONFIG.supabase.anonKey);
        console.log('Supabase initialized successfully');
        return true;
    } catch (error) {
        console.warn('Supabase initialization failed:', error);
        console.warn('Survey will continue without data persistence');
        return true; // Continue even if Supabase fails
    }
};

// Utility functions
const formatCurrency = (value, currency) => {
    const isInteger = Math.abs(value - Math.round(value)) < 1e-9;
    if (isInteger) {
        return `${Math.round(value)}${currency}`;
    }
    return `${value.toFixed(2).replace('.', ',')}${currency}`;
};

const getRandomHint = () => {
    return CONFIG.psychologyHints[Math.floor(Math.random() * CONFIG.psychologyHints.length)];
};

const generateUniqueRandomIndices = (count, max) => {
    const indices = new Set();
    while (indices.size < count) {
        const randomIndex = Math.floor(Math.random() * max) + 1;
        indices.add(randomIndex);
    }
    return Array.from(indices);
};

// Enhanced analytics calculation functions
const calculateBrandAffinity = () => {
    // Based on psychology profile and shopping behavior
    const riskTolerance = state.psychologyProfile.riskTolerance;
    const timePreference = state.psychologyProfile.timePreference;
    const shoppingStyle = state.shoppingBehavior.shopping_style;
    
    let affinity = 0;
    if (riskTolerance === 'aggressive' && timePreference === 'future') affinity = 0.9;
    else if (riskTolerance === 'moderate' && timePreference === 'future') affinity = 0.7;
    else if (riskTolerance === 'conservative' && timePreference === 'immediate') affinity = 0.3;
    else affinity = 0.5;
    
    return affinity;
};

const calculatePurchaseIntent = () => {
    // Based on indifference points and psychology profile
    const avgIndifferencePoint = Object.values(state.indifferencePoints).reduce((sum, result) => sum + parseFloat(result.point), 0) / Object.keys(state.indifferencePoints).length;
    
    // Lower indifference point = higher purchase intent for Tagpeak
    if (avgIndifferencePoint < 10) return 0.9;
    else if (avgIndifferencePoint < 25) return 0.7;
    else if (avgIndifferencePoint < 50) return 0.5;
    else return 0.3;
};

const calculateDiscountSensitivity = () => {
    // Based on average indifference point
    const avgIndifferencePoint = Object.values(state.indifferencePoints).reduce((sum, result) => sum + parseFloat(result.point), 0) / Object.keys(state.indifferencePoints).length;
    
    // Higher indifference point = higher discount sensitivity
    return Math.min(avgIndifferencePoint / 100, 1);
};

const calculateInnovationAdoption = () => {
    // Based on comprehension answers and psychology profile
    const comprehensionScore = state.comprehensionAnswers ? 
        Object.values(state.comprehensionAnswers).filter(result => result.isCorrect).length / 3 : 0;
    
    const riskTolerance = state.psychologyProfile.riskTolerance;
    const timePreference = state.psychologyProfile.timePreference;
    
    let adoption = comprehensionScore * 0.4; // 40% weight on understanding
    
    if (riskTolerance === 'aggressive') adoption += 0.3;
    else if (riskTolerance === 'moderate') adoption += 0.2;
    
    if (timePreference === 'future') adoption += 0.3;
    else if (timePreference === 'immediate') adoption += 0.1;
    
    return Math.min(adoption, 1);
};

const calculateChoiceConsistency = () => {
    // Analyze staircase choices for consistency patterns
    const allChoices = [];
    state.staircases.forEach(staircase => {
        staircase.history.forEach(trial => {
            if (trial.trialType === 'normal') {
                allChoices.push(trial.choice);
            }
        });
    });
    
    if (allChoices.length < 2) return 0.5;
    
    const tagpeakChoices = allChoices.filter(choice => choice === 'tagpeak').length;
    const consistency = Math.abs((tagpeakChoices / allChoices.length) - 0.5) * 2; // 0-1 scale
    
    return consistency;
};

// Partner insights generation
const generatePartnerInsights = (allResponses) => {
    const insights = {
        totalResponses: allResponses.length,
        averageIndifferencePoint: 0,
        tagpeakPreferenceRate: 0,
        demographicBreakdown: {},
        psychologyProfileDistribution: {},
        partnerRecommendations: [],
        roiProjections: {}
    };

    if (allResponses.length === 0) return insights;

    // Calculate average indifference point
    const indifferencePoints = allResponses.map(response => {
        const points = Object.values(response.indifference_points || {});
        return points.reduce((sum, p) => sum + parseFloat(p.point || 0), 0) / points.length;
    }).filter(p => !isNaN(p));

    insights.averageIndifferencePoint = indifferencePoints.reduce((sum, p) => sum + p, 0) / indifferencePoints.length;

    // Calculate Tagpeak preference rate
    insights.tagpeakPreferenceRate = indifferencePoints.filter(p => p < 25).length / indifferencePoints.length * 100;

    // Demographics breakdown
    allResponses.forEach(response => {
        const demo = response.demographics || {};
        const age = demo.age;
        const gender = demo.gender;
        
        if (age) {
            const range = age < 25 ? '18-24' : age < 35 ? '25-34' : age < 45 ? '35-44' : age < 55 ? '45-54' : '55+';
            insights.demographicBreakdown[range] = (insights.demographicBreakdown[range] || 0) + 1;
        }
        
        if (gender) {
            insights.demographicBreakdown[gender] = (insights.demographicBreakdown[gender] || 0) + 1;
        }
    });

    // Psychology profile distribution
    allResponses.forEach(response => {
        const profile = response.psychology_profile || {};
        const key = `${profile.riskTolerance || 'Unknown'}-${profile.timePreference || 'Unknown'}`;
        insights.psychologyProfileDistribution[key] = (insights.psychologyProfileDistribution[key] || 0) + 1;
    });

    // Generate partner recommendations
    if (insights.tagpeakPreferenceRate > 70) {
        insights.partnerRecommendations.push("High Tagpeak preference detected - ideal for partnership");
    } else if (insights.tagpeakPreferenceRate > 50) {
        insights.partnerRecommendations.push("Moderate Tagpeak preference - good partnership potential");
    } else {
        insights.partnerRecommendations.push("Lower Tagpeak preference - consider education campaigns");
    }

    if (insights.averageIndifferencePoint < 20) {
        insights.partnerRecommendations.push("Low discount sensitivity - customers value innovation over savings");
    } else if (insights.averageIndifferencePoint > 40) {
        insights.partnerRecommendations.push("High discount sensitivity - focus on immediate value proposition");
    }

    // ROI projections
    const avgPurchaseIntent = allResponses.reduce((sum, r) => sum + (r.enhanced_analytics?.purchaseIntent || 0), 0) / allResponses.length;
    const avgBrandAffinity = allResponses.reduce((sum, r) => sum + (r.enhanced_analytics?.brandAffinity || 0), 0) / allResponses.length;
    
    insights.roiProjections = {
        estimatedConversionRate: (avgPurchaseIntent * 100).toFixed(1) + '%',
        brandAffinityScore: (avgBrandAffinity * 100).toFixed(1) + '%',
        partnershipPotential: avgBrandAffinity > 0.7 ? 'High' : avgBrandAffinity > 0.5 ? 'Medium' : 'Low',
        recommendedDiscount: insights.averageIndifferencePoint < 20 ? 'Low (5-10%)' : 'Medium (15-25%)'
    };

    return insights;
};

// Screen rendering functions
const renderScreen = async (screenName, data = {}) => {
    console.log(`🎭 Rendering screen: ${screenName}`);
    state.currentScreen = screenName;
    const contentArea = document.getElementById('content-area');
    
    if (!contentArea) {
        console.error('❌ Content area not found!');
        return;
    }
    
    console.log('📱 Content area found:', contentArea);
    
    // Fade out
    contentArea.style.opacity = '0';
    
    setTimeout(() => {
        contentArea.innerHTML = '';
        
        let html = '';
        switch (screenName) {
            case 'welcome':
                html = renderWelcomeScreen();
                break;
            case 'shopping_behavior':
                html = renderShoppingBehaviorScreen();
                break;
            case 'tagpeak_explanation':
                html = renderTagpeakExplanationScreen();
                break;
            case 'comprehension_check':
                html = renderComprehensionCheckScreen();
                break;
            case 'success_stories':
                html = renderSuccessStoriesScreen();
                break;
            case 'psychology_quiz':
                html = renderPsychologyQuizScreen();
                break;
            case 'product_transition':
                html = renderProductTransitionScreen(data.product);
                break;
            case 'staircase':
                html = renderStaircaseScreen(data.staircase);
                break;
            case 'demographics':
                html = renderDemographicsScreen();
                break;
            case 'results':
                html = renderResultsScreen();
                break;
            case 'thank_you':
                html = renderThankYouScreen();
                break;
        }
        
        console.log(`📝 Generated HTML for ${screenName}:`, html.substring(0, 200) + '...');
        contentArea.innerHTML = html;
        
        // Fade in
        contentArea.style.opacity = '1';
        contentArea.classList.add('slide-in');
        
        // Add form event listener for demographics
        if (screenName === 'demographics') {
            const form = document.getElementById('demographics-form');
            if (form) {
                form.addEventListener('submit', handleDemographicsSubmit);
            }
        }
        
        // Add auto-advance for product transition
        if (screenName === 'product_transition') {
            startTransitionTimer();
        }
        
        console.log('✅ Screen rendered successfully');
    }, 300);
};

// Welcome Screen
const renderWelcomeScreen = () => {
    return `
        <div class="text-center space-y-6 md:space-y-8 h-full flex flex-col justify-center px-4">
            <div class="space-y-4">
                <h1 class="text-3xl md:text-4xl lg:text-5xl font-black gradient-text">
                    🧠 Consumer Psychology Study
                </h1>
                <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                    Help us understand how new shopping benefits influence your decision-making process
                </p>
            </div>
            
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 md:p-8 border border-blue-200">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-center">
                    <div class="space-y-2">
                        <div class="flex items-center justify-center space-x-2">
                            <i class="fas fa-clock text-blue-500"></i>
                            <span class="font-semibold">Duration</span>
                        </div>
                        <p class="text-sm text-gray-600">8-12 minutes</p>
                    </div>
                    <div class="space-y-2">
                        <div class="flex items-center justify-center space-x-2">
                            <i class="fas fa-shield-alt text-green-500"></i>
                            <span class="font-semibold">Privacy</span>
                        </div>
                        <p class="text-sm text-gray-600">100% anonymous</p>
                    </div>
                    <div class="space-y-2">
                        <div class="flex items-center justify-center space-x-2">
                            <i class="fas fa-gift text-purple-500"></i>
                            <span class="font-semibold">Reward</span>
                        </div>
                        <p class="text-sm text-gray-600">Personal insights</p>
                    </div>
                </div>
            </div>
            
            <button onclick="startSurvey()" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg w-full md:w-auto">
                Start Your Shopping Journey
                <i class="fas fa-arrow-right ml-2"></i>
            </button>
        </div>
    `;
};

// Shopping Behavior Screen
const renderShoppingBehaviorScreen = () => {
    return `
        <div class="space-y-4 md:space-y-8 h-full overflow-y-auto">
            <div class="text-center">
                <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 md:mb-4">
                    🛍️ Tell Us About Your Shopping Habits
                </h1>
                <p class="text-lg md:text-xl text-gray-600 px-4">
                    Help us understand how you shop and what benefits you value
                </p>
            </div>
            
            <div class="w-full space-y-4 md:space-y-6 lg:space-y-8">
                ${CONFIG.shoppingBehaviorQuestions.map((question, index) => `
                    <div class="bg-white rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg">
                        <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Question ${index + 1}: ${question.question}</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            ${question.options.map(option => `
                                <div class="option-card bg-gray-50 border-2 border-gray-200 rounded-xl p-4 md:p-6 text-center cursor-pointer hover:border-blue-400 transition-all duration-200" 
                                     data-question-id="${question.id}" 
                                     data-answer="${option.value}"
                                     onclick="selectShoppingBehavior('${question.id}', '${option.value}')">
                                    <span class="font-semibold text-gray-800 text-sm md:text-base">${option.text}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
                
                <div class="text-center">
                    <button id="shopping-continue" onclick="renderScreen('tagpeak_explanation')" 
                            class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-semibold text-base md:text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto" 
                            disabled>
                        Continue to Tagpeak
                        <i class="fas fa-arrow-right ml-2"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
};

// Tagpeak Explanation Screen
const renderTagpeakExplanationScreen = () => {
    return `
        <div class="space-y-4 md:space-y-8 h-full overflow-y-auto">
            <div class="text-center">
                <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 md:mb-4">
                    🚀 Introducing Tagpeak
                </h1>
                <p class="text-lg md:text-xl text-gray-600 px-4">
                    A revolutionary new way to get more from your purchases
                </p>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                <div class="space-y-6">
                    <div class="bg-red-50 border-l-4 border-red-400 p-4 md:p-6 rounded-lg">
                        <h3 class="text-lg md:text-xl font-bold text-red-800 mb-2 md:mb-3">
                            <i class="fas fa-exclamation-triangle mr-2"></i>
                            Traditional Cashback
                        </h3>
                        <ul class="space-y-2 text-red-700">
                            <li>• Low fixed percentage (usually 1-5%)</li>
                            <li>• Membership fees</li>
                            <li>• No growth potential</li>
                            <li>• Often capped or limited total amount</li>
                        </ul>
                    </div>
                    
                    <div class="bg-green-50 border-l-4 border-green-400 p-4 md:p-6 rounded-lg">
                        <h3 class="text-lg md:text-xl font-bold text-green-800 mb-2 md:mb-3">
                            <i class="fas fa-rocket mr-2"></i>
                            Tagpeak Innovation
                        </h3>
                        <ul class="space-y-2 text-green-700">
                            <li>• <strong>Guaranteed 0.5%</strong> minimum cashback</li>
                            <li>• <strong>Potential for more</strong> based on Tagpeak's market performance</li>
                            <li>• <strong>No risk to you</strong> - Tagpeak manages all investments</li>
                            <li>• <strong>Flexible withdrawal</strong> anytime during 6 months</li>
                            <li>• <strong>Your money stays safe</strong> - you're not investing</li>
                        </ul>
                    </div>
                </div>
                
                <div class="bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-6 lg:p-8 rounded-2xl">
                    <h3 class="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">How It Works</h3>
                    <div class="space-y-4">
                        <div class="flex items-start space-x-3">
                            <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                            <div>
                                <h4 class="font-semibold text-gray-800">Shop</h4>
                                <p class="text-sm text-gray-600">Make your purchase, Tagpeak will know about it</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-3">
                            <div class="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                            <div>
                                <h4 class="font-semibold text-gray-800">Tagpeak Invests</h4>
                                <p class="text-sm text-gray-600">Tagpeak uses financial markets to potentially boost your cashback</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-3">
                            <div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                            <div>
                                <h4 class="font-semibold text-gray-800">Withdraw at any time</h4>
                                <p class="text-sm text-gray-600">From Day 1, it will be possible to get your hands on whatever cashback you see</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="text-center">
                <button onclick="renderScreen('comprehension_check')" class="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-semibold text-base md:text-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg w-full md:w-auto">
                    Test Your Understanding
                    <i class="fas fa-arrow-right ml-2"></i>
                </button>
            </div>
        </div>
    `;
};

// Comprehension Check Screen
const renderComprehensionCheckScreen = () => {
    return `
        <div class="space-y-4 md:space-y-8 h-full overflow-y-auto">
            <div class="text-center">
                <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 md:mb-4">
                    🧠 Quick Understanding Check
                </h1>
                <p class="text-lg md:text-xl text-gray-600 px-4">
                    Let's make sure you understand how Tagpeak works before we continue
                </p>
            </div>
            
            <div class="w-full space-y-4 md:space-y-6">
                <div class="bg-white rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg">
                    <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Question 1: Core Concept</h3>
                    <p class="text-gray-600 mb-4 md:mb-6">What is the main difference between Tagpeak and traditional cashback?</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4" data-question="1">
                        <div class="option-card bg-gray-50 border-2 border-gray-200 rounded-xl p-4 md:p-6 text-center cursor-pointer hover:border-blue-400 transition-all duration-200" 
                             data-answer="A" onclick="selectComprehensionAnswer(1, 'A')">
                            <span class="font-semibold text-gray-800 text-sm md:text-base">A) Tagpeak gives you more money back</span>
                        </div>
                        <div class="option-card bg-gray-50 border-2 border-gray-200 rounded-xl p-4 md:p-6 text-center cursor-pointer hover:border-blue-400 transition-all duration-200" 
                             data-answer="B" onclick="selectComprehensionAnswer(1, 'B')">
                            <span class="font-semibold text-gray-800 text-sm md:text-base">B) Tagpeak uses financial markets to potentially boost your cashback</span>
                        </div>
                        <div class="option-card bg-gray-50 border-2 border-gray-200 rounded-xl p-4 md:p-6 text-center cursor-pointer hover:border-blue-400 transition-all duration-200" 
                             data-answer="C" onclick="selectComprehensionAnswer(1, 'C')">
                            <span class="font-semibold text-gray-800 text-sm md:text-base">C) Tagpeak is faster than traditional cashback</span>
                        </div>
                        <div class="option-card bg-gray-50 border-2 border-gray-200 rounded-xl p-4 md:p-6 text-center cursor-pointer hover:border-blue-400 transition-all duration-200" 
                             data-answer="D" onclick="selectComprehensionAnswer(1, 'D')">
                            <span class="font-semibold text-gray-800 text-sm md:text-base">D) Tagpeak is more secure than traditional cashback</span>
                        </div>
                    </div>
                    <div id="feedback-1" class="mt-4 p-3 rounded-lg hidden">
                        <p class="text-sm font-medium"></p>
                    </div>
                </div>
                
                <div class="bg-white rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg">
                    <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Question 2: Risk Understanding</h3>
                    <p class="text-gray-600 mb-4 md:mb-6">What is the minimum cashback you're guaranteed with Tagpeak?</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4" data-question="2">
                        <div class="option-card bg-gray-50 border-2 border-gray-200 rounded-xl p-4 md:p-6 text-center cursor-pointer hover:border-blue-400 transition-all duration-200" 
                             data-answer="A" onclick="selectComprehensionAnswer(2, 'A')">
                            <span class="font-semibold text-gray-800 text-sm md:text-base">A) 0.5%</span>
                        </div>
                        <div class="option-card bg-gray-50 border-2 border-gray-200 rounded-xl p-4 md:p-6 text-center cursor-pointer hover:border-blue-400 transition-all duration-200" 
                             data-answer="B" onclick="selectComprehensionAnswer(2, 'B')">
                            <span class="font-semibold text-gray-800 text-sm md:text-base">B) 1%</span>
                        </div>
                        <div class="option-card bg-gray-50 border-2 border-gray-200 rounded-xl p-4 md:p-6 text-center cursor-pointer hover:border-blue-400 transition-all duration-200" 
                             data-answer="C" onclick="selectComprehensionAnswer(2, 'C')">
                            <span class="font-semibold text-gray-800 text-sm md:text-base">C) 5%</span>
                        </div>
                        <div class="option-card bg-gray-50 border-2 border-gray-200 rounded-xl p-4 md:p-6 text-center cursor-pointer hover:border-blue-400 transition-all duration-200" 
                             data-answer="D" onclick="selectComprehensionAnswer(2, 'D')">
                            <span class="font-semibold text-gray-800 text-sm md:text-base">D) 10%</span>
                        </div>
                    </div>
                    <div id="feedback-2" class="mt-4 p-3 rounded-lg hidden">
                        <p class="text-sm font-medium"></p>
                    </div>
                </div>
                
                <div class="bg-white rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg">
                    <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Question 3: Time Frame</h3>
                    <p class="text-gray-600 mb-4 md:mb-6">For how long does the cashback grow?</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4" data-question="3">
                        <div class="option-card bg-gray-50 border-2 border-gray-200 rounded-xl p-4 md:p-6 text-center cursor-pointer hover:border-blue-400 transition-all duration-200" 
                             data-answer="A" onclick="selectComprehensionAnswer(3, 'A')">
                            <span class="font-semibold text-gray-800 text-sm md:text-base">A) 1 month</span>
                        </div>
                        <div class="option-card bg-gray-50 border-2 border-gray-200 rounded-xl p-4 md:p-6 text-center cursor-pointer hover:border-blue-400 transition-all duration-200" 
                             data-answer="B" onclick="selectComprehensionAnswer(3, 'B')">
                            <span class="font-semibold text-gray-800 text-sm md:text-base">B) 3 months</span>
                        </div>
                        <div class="option-card bg-gray-50 border-2 border-gray-200 rounded-xl p-4 md:p-6 text-center cursor-pointer hover:border-blue-400 transition-all duration-200" 
                             data-answer="C" onclick="selectComprehensionAnswer(3, 'C')">
                            <span class="font-semibold text-gray-800 text-sm md:text-base">C) 6 months</span>
                        </div>
                        <div class="option-card bg-gray-50 border-2 border-gray-200 rounded-xl p-4 md:p-6 text-center cursor-pointer hover:border-blue-400 transition-all duration-200" 
                             data-answer="D" onclick="selectComprehensionAnswer(3, 'D')">
                            <span class="font-semibold text-gray-800 text-sm md:text-base">D) 1 year</span>
                        </div>
                    </div>
                    <div id="feedback-3" class="mt-4 p-3 rounded-lg hidden">
                        <p class="text-sm font-medium"></p>
                    </div>
                </div>
                
                <div class="text-center">
                    <button id="comprehension-continue" onclick="renderScreen('success_stories')" 
                            class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-semibold text-base md:text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto" 
                            disabled>
                        Continue to Examples
                        <i class="fas fa-arrow-right ml-2"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
};

// Success Stories Screen
const renderSuccessStoriesScreen = () => {
    return `
        <div class="space-y-4 md:space-y-8 h-full overflow-y-auto">
            <div class="text-center">
                <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 md:mb-4">
                    💰 Real Success Stories
                </h1>
                <p class="text-lg md:text-xl text-gray-600 px-4">
                    See how Tagpeak has helped real people get more from their purchases
                </p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                ${CONFIG.products.map(product => `
                    <div class="bg-white rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg border-l-4 border-green-400">
                        <div class="text-center mb-4 md:mb-6">
                            <img src="${product.image}" alt="${product.name}" class="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl mx-auto mb-3 md:mb-4">
                            <h3 class="text-lg md:text-xl font-bold text-gray-800">${product.name}</h3>
                            <p class="text-gray-600">${formatCurrency(product.price, product.currency)}</p>
                        </div>
                        
                        <div class="bg-green-50 rounded-xl p-4 md:p-6">
                            <div class="flex items-center space-x-3 mb-3 md:mb-4">
                                <div class="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-full flex items-center justify-center">
                                    <i class="fas fa-user text-white text-lg md:text-xl"></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-gray-800 text-sm md:text-base">${product.successStory.name}</h4>
                                    <p class="text-xs md:text-sm text-gray-600">Real Tagpeak user</p>
                                </div>
                            </div>
                            
                            <div class="space-y-3">
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600">Price paid:</span>
                                    <span class="font-bold text-gray-800">${formatCurrency(product.successStory.spent, '€')}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600">Tagpeak Cash Rewards:</span>
                                    <span class="font-bold text-green-600">${formatCurrency(product.successStory.cashback, '€')}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600">Time period:</span>
                                    <span class="font-bold text-purple-600">${product.successStory.period}</span>
                                </div>
                            </div>
                            
                            <div class="mt-4 p-3 bg-green-100 rounded-lg">
                                <p class="text-sm text-green-800 font-semibold text-center">
                                    ${product.successStory.percentage}% cashback!
                                </p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 md:p-6 lg:p-8 text-center">
                <h3 class="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-4">Ready to Experience Tagpeak?</h3>
                <p class="text-gray-600 mb-4 md:mb-6">Now you'll make some decisions to help us understand your preferences</p>
                <button onclick="renderScreen('psychology_quiz')" class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-semibold text-base md:text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg w-full md:w-auto">
                    Start the Study
                    <i class="fas fa-arrow-right ml-2"></i>
                </button>
            </div>
        </div>
    `;
};

// Psychology Quiz Screen
const renderPsychologyQuizScreen = () => {
    return `
        <div class="space-y-4 md:space-y-8 h-full overflow-y-auto">
            <div class="text-center">
                <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 md:mb-4">
                    🧠 Psychology Assessment
                </h1>
                <p class="text-lg md:text-xl text-gray-600 px-4">
                    Help us understand your decision-making style
                </p>
            </div>
            
            <div class="w-full space-y-4 md:space-y-6">
                <div class="bg-white rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg">
                    <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Question 1: Risk Tolerance</h3>
                    <p class="text-gray-600 mb-4 md:mb-6">When making financial decisions, you prefer:</p>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4" data-category="riskTolerance">
                        <div class="option-card bg-red-50 border-2 border-red-200 rounded-xl p-4 md:p-6 text-center" data-value="conservative" onclick="selectPsychologyAnswer('riskTolerance', 'conservative')">
                            <i class="fas fa-shield-alt text-red-500 text-2xl md:text-3xl mb-2 md:mb-3"></i>
                            <h4 class="font-semibold text-red-800 text-sm md:text-base">Conservative</h4>
                            <p class="text-xs md:text-sm text-red-600">Guaranteed, safe returns</p>
                        </div>
                        <div class="option-card bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 md:p-6 text-center" data-value="moderate" onclick="selectPsychologyAnswer('riskTolerance', 'moderate')">
                            <i class="fas fa-balance-scale text-yellow-500 text-2xl md:text-3xl mb-2 md:mb-3"></i>
                            <h4 class="font-semibold text-yellow-800 text-sm md:text-base">Moderate</h4>
                            <p class="text-xs md:text-sm text-yellow-600">Balanced risk and reward</p>
                        </div>
                        <div class="option-card bg-green-50 border-2 border-green-200 rounded-xl p-4 md:p-6 text-center" data-value="aggressive" onclick="selectPsychologyAnswer('riskTolerance', 'aggressive')">
                            <i class="fas fa-rocket text-green-500 text-2xl md:text-3xl mb-2 md:mb-3"></i>
                            <h4 class="font-semibold text-green-800 text-sm md:text-base">Aggressive</h4>
                            <p class="text-xs md:text-sm text-green-600">High risk, high reward</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg">
                    <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Question 2: Time Preference</h3>
                    <p class="text-gray-600 mb-4 md:mb-6">You value benefits that are:</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4" data-category="timePreference">
                        <div class="option-card bg-blue-50 border-2 border-blue-200 rounded-xl p-4 md:p-6 text-center" data-value="immediate" onclick="selectPsychologyAnswer('timePreference', 'immediate')">
                            <i class="fas fa-bolt text-blue-500 text-2xl md:text-3xl mb-2 md:mb-3"></i>
                            <h4 class="font-semibold text-blue-800 text-sm md:text-base">Immediate</h4>
                            <p class="text-xs md:text-sm text-blue-600">I want benefits right now</p>
                        </div>
                        <div class="option-card bg-purple-50 border-2 border-purple-200 rounded-xl p-4 md:p-6 text-center" data-value="future" onclick="selectPsychologyAnswer('timePreference', 'future')">
                            <i class="fas fa-clock text-purple-500 text-2xl md:text-3xl mb-2 md:mb-3"></i>
                            <h4 class="font-semibold text-purple-800 text-sm md:text-base">Future-Oriented</h4>
                            <p class="text-xs md:text-sm text-purple-600">I can wait for better returns</p>
                        </div>
                    </div>
                </div>
                
                <div class="insight-card rounded-xl p-4 md:p-6">
                    <div class="flex items-center space-x-3 mb-2 md:mb-3">
                        <i class="fas fa-lightbulb text-amber-500 text-lg md:text-xl"></i>
                        <h4 class="font-semibold text-gray-800 text-sm md:text-base">Psychology Insight</h4>
                    </div>
                    <p class="text-xs md:text-sm text-gray-600">
                        Your answers help us understand your decision-making patterns and how different benefit structures appeal to your psychological profile.
                    </p>
                </div>
            </div>
            
            <div class="text-center">
                <button id="psychology-continue" onclick="startStaircaseStudy()" class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-semibold text-base md:text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto" disabled>
                    Continue to Study
                    <i class="fas fa-arrow-right ml-2"></i>
                </button>
            </div>
        </div>
    `;
};

// Product Transition Screen
const renderProductTransitionScreen = (product) => {
    return `
        <div class="text-center space-y-6 h-full flex flex-col justify-center px-4">
            <div class="space-y-4">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-800">Now Think About Buying</h1>
                <div class="flex items-center justify-center space-x-4">
                    <img src="${product.image}" alt="${product.name}" class="w-16 h-16 object-cover rounded-lg">
                    <div class="text-left">
                        <h3 class="text-lg font-bold text-gray-800">${product.name}</h3>
                        <p class="text-sm text-gray-600">${formatCurrency(product.price, product.currency)}</p>
                    </div>
                </div>
            </div>
            
            <div class="text-center">
                <button id="continue-transition" onclick="startNextStaircase()" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Continue to Decisions
                    <i class="fas fa-arrow-right ml-2"></i>
                </button>
            </div>
        </div>
    `;
};

// Staircase Screen
const renderStaircaseScreen = (staircase) => {
    const realIndex = state.shuffledOrder[state.currentStaircaseIndex];
    const currentStaircase = state.staircases[realIndex];
    
    if (!currentStaircase) {
        calculateIndifferencePoints();
        renderScreen('demographics');
        return;
    }
    
    const displayDiscount = state.isCurrentTrialCatch ? 100 : currentStaircase.currentDiscount;
    const basePriceFormatted = formatCurrency(currentStaircase.price, currentStaircase.currency);
    const monetaryDiscount = currentStaircase.price * (displayDiscount / 100);
    const monetaryCashbackGuaranteed = currentStaircase.price * (0.5 / 100);
    const monetaryCashbackMax = currentStaircase.price * (100 / 100);
    
    const formattedDiscount = formatCurrency(monetaryDiscount, currentStaircase.currency);
    const formattedCashbackGuaranteed = formatCurrency(monetaryCashbackGuaranteed, currentStaircase.currency);
    const formattedCashbackMax = formatCurrency(monetaryCashbackMax, currentStaircase.currency);
    
    const progressPercentage = ((state.currentStaircaseIndex + 1) / CONFIG.products.length) * 100;
    const isFirstDecision = currentStaircase.trialCount === 0;
    const questionText = isFirstDecision 
        ? `Imagine you're buying this product. Which deal would you choose?`
        : `What if the discount was ${currentStaircase.currentDiscount > currentStaircase.previousDiscount ? 'higher' : 'lower'}? Which would you prefer?`;
    
    return `
        <div class="space-y-4 md:space-y-8 h-full overflow-y-auto">
            <div class="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
                <div class="flex flex-col md:flex-row justify-between items-center mb-3 md:mb-4 space-y-2 md:space-y-0">
                    <h2 class="text-xl md:text-2xl font-bold text-gray-800">Decision Study</h2>
                    <span class="text-sm font-medium text-gray-600">Product ${state.currentStaircaseIndex + 1} of ${CONFIG.products.length}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 md:h-3">
                    <div class="progress-bar h-2 md:h-3 rounded-full" style="width: ${progressPercentage}%"></div>
                </div>
            </div>
            
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 md:p-6 lg:p-8 text-center">
                <div class="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 mb-4 md:mb-6">
                    <img src="${currentStaircase.image}" alt="${currentStaircase.name}" class="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl shadow-lg">
                    <div>
                        <h3 class="text-xl md:text-2xl font-bold text-gray-800">${currentStaircase.name}</h3>
                        <p class="text-base md:text-lg text-gray-600">${basePriceFormatted} • ${currentStaircase.category}</p>
                    </div>
                </div>
                <p class="text-lg md:text-xl text-gray-700 px-4">${questionText}</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                <div id="tagpeak-option" class="option-card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-3 md:p-6 lg:p-8 text-center pulse-glow" onclick="handleStaircaseChoice('tagpeak')">
                    <div class="mb-3 md:mb-6">
                        <div class="w-12 h-12 md:w-20 md:h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4">
                            <i class="fas fa-rocket text-white text-lg md:text-3xl"></i>
                        </div>
                        <h3 class="text-lg md:text-2xl font-bold text-green-800 mb-1 md:mb-2">Tagpeak Smart Cashback</h3>
                        <p class="text-xs md:text-sm text-green-600">Investment-powered rewards that grow over time</p>
                    </div>
                    <div class="space-y-3 md:space-y-4 text-left">
                        <div class="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-3 md:p-4 border-2 border-green-300">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-semibold text-green-800 text-sm md:text-base">Growth Potential:</span>
                                <span class="text-lg md:text-xl font-bold text-green-600">${formattedCashbackMax}</span>
                            </div>
                            <p class="text-xs md:text-sm text-green-700 mb-2 md:mb-3">Watch your cashback grow from 0.5% to 100%!</p>
                            
                            <!-- Animated Growth Chart -->
                            <div class="growth-chart">
                                <div class="growth-bar"></div>
                                <div class="growth-percentage">Growing...</div>
                            </div>
                            
                            <div class="flex justify-between text-xs text-green-600 mt-2">
                                <span>0.5%</span>
                                <span>100%</span>
                            </div>
                        </div>
                        <div class="bg-white rounded-lg p-3 md:p-4 border border-green-200">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-semibold text-green-800 text-sm md:text-base">Safety Net:</span>
                                <span class="text-base md:text-lg font-bold text-green-600">${formattedCashbackGuaranteed}</span>
                            </div>
                            <p class="text-xs md:text-sm text-green-700">Minimum guaranteed cashback</p>
                        </div>
                    </div>
                </div>
                
                <div id="discount-option" class="option-card bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-3 md:p-6 lg:p-8 text-center" onclick="handleStaircaseChoice('discount')">
                    <div class="mb-3 md:mb-6">
                        <div class="w-12 h-12 md:w-20 md:h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4">
                            <i class="fas fa-percentage text-white text-lg md:text-3xl"></i>
                        </div>
                        <h3 class="text-lg md:text-2xl font-bold text-blue-800 mb-1 md:mb-2">Traditional Discount</h3>
                    </div>
                    <div class="space-y-3 md:space-y-4 text-left">
                        <div class="bg-white rounded-lg p-3 md:p-4 border-2 border-blue-200">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-semibold text-blue-800 text-sm md:text-base">Discount:</span>
                                <span class="text-lg md:text-xl font-bold text-blue-600">${formattedDiscount}</span>
                            </div>
                            <p class="text-xs md:text-sm text-blue-700">${Math.round(displayDiscount)}% off immediately</p>
                        </div>
                        <div class="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-3 md:p-4">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-semibold text-blue-800 text-sm md:text-base">You Pay:</span>
                                <span class="text-base md:text-lg font-bold text-blue-600">${formatCurrency(currentStaircase.price - monetaryDiscount, currentStaircase.currency)}</span>
                            </div>
                            <p class="text-xs md:text-sm text-blue-700">Save money right now</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 md:p-6 text-center">
                <div class="flex items-center justify-center space-x-3 mb-2">
                    <i class="fas fa-lightbulb text-blue-600"></i>
                    <h4 class="font-semibold text-blue-800 text-sm md:text-base">Quick Tip</h4>
                </div>
                <p class="text-xs md:text-sm text-blue-700 px-4">
                    There's no right or wrong answer - choose what feels right for you!
                </p>
            </div>
        </div>
    `;
};

// Demographics Screen
const renderDemographicsScreen = () => {
    return `
        <div class="space-y-4 md:space-y-8 h-full overflow-y-auto">
            <div class="text-center">
                <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 md:mb-4">📊 Personal Information</h1>
                <p class="text-lg md:text-xl text-gray-600 px-4">Help us understand your background (all information is anonymous)</p>
            </div>
            
            <form id="demographics-form" class="w-full space-y-4 md:space-y-6 lg:space-y-8">
                <div class="bg-white rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg">
                    <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Basic Information</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <label for="age" class="block text-sm font-medium text-gray-700 mb-2">Age</label>
                            <input type="number" id="age" name="age" min="18" max="100" required 
                                   class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                                <label class="flex items-center space-x-2 p-2 md:p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="gender" value="Female" required class="text-blue-600">
                                    <span class="text-sm md:text-base">Female</span>
                                </label>
                                <label class="flex items-center space-x-2 p-2 md:p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="gender" value="Male" class="text-blue-600">
                                    <span class="text-sm md:text-base">Male</span>
                                </label>
                                <label class="flex items-center space-x-2 p-2 md:p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="gender" value="Non-binary" class="text-blue-600">
                                    <span class="text-sm md:text-base">Non-binary</span>
                                </label>
                                <label class="flex items-center space-x-2 p-2 md:p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="gender" value="Prefer not to say" class="text-blue-600">
                                    <span class="text-sm md:text-base">Prefer not to say</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="text-center">
                    <button type="submit" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-semibold text-base md:text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg w-full md:w-auto">
                        Complete Study <i class="fas fa-check ml-2"></i>
                    </button>
                </div>
            </form>
        </div>
    `;
};

// Results Screen
const renderResultsScreen = () => {
    const results = Object.values(state.indifferencePoints);
    const avgIndifferencePoint = results.reduce((sum, result) => sum + parseFloat(result.point), 0) / results.length;
    
    return `
        <div class="space-y-4 md:space-y-8 h-full overflow-y-auto">
            <div class="text-center">
                <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 md:mb-4">🎯 Your Psychology Profile</h1>
                <p class="text-lg md:text-xl text-gray-600 px-4">Based on your decisions, here's what we discovered about your shopping psychology</p>
            </div>
            
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 md:p-6 lg:p-8">
                <h2 class="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 text-center">Your Decision Threshold</h2>
                <div class="text-center mb-4 md:mb-6">
                    <div class="text-4xl md:text-5xl lg:text-6xl font-black text-blue-600 mb-2">${Math.round(avgIndifferencePoint)}%</div>
                    <p class="text-base md:text-lg text-gray-600 px-4">Average discount needed to choose traditional discount over Tagpeak</p>
                </div>
            </div>
            
            <div class="text-center">
                <button onclick="renderScreen('thank_you')" class="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-semibold text-base md:text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg w-full md:w-auto">
                    Continue <i class="fas fa-arrow-right ml-2"></i>
                </button>
            </div>
        </div>
    `;
};

// Thank You Screen
const renderThankYouScreen = () => {
    return `
        <div class="text-center space-y-6 md:space-y-8 h-full flex flex-col justify-center px-4">
            <div class="space-y-4">
                <div class="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <i class="fas fa-check text-white text-3xl md:text-4xl"></i>
                </div>
                <h1 class="text-3xl md:text-4xl lg:text-5xl font-black gradient-text">Thank You! 🎉</h1>
                <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">Your participation helps us understand consumer psychology and improve shopping experiences</p>
            </div>
            
            <div class="bg-white rounded-2xl p-6 md:p-8 shadow-lg max-w-2xl mx-auto">
                <h2 class="text-xl md:text-2xl font-bold text-gray-800 mb-4">What Happens Next?</h2>
                <div class="space-y-4 text-left">
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-database text-blue-600"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-800">Data Analysis</h3>
                            <p class="text-sm text-gray-600">Your responses will be analyzed anonymously</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-chart-line text-green-600"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-800">Research Impact</h3>
                            <p class="text-sm text-gray-600">Help shape the future of consumer benefits</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 md:p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-2">Your Session ID</h3>
                <p class="font-mono text-sm text-gray-600 break-all">${state.userId}</p>
                <p class="text-xs text-gray-500 mt-2">Keep this for reference if needed</p>
            </div>
            
            <div class="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
                <button onclick="window.open('https://tagpeak.com', '_blank')" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg w-full md:w-auto">
                    Visit Tagpeak <i class="fas fa-external-link-alt ml-2"></i>
                </button>
                <button onclick="location.reload()" class="bg-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg w-full md:w-auto">
                    Take Survey Again <i class="fas fa-redo ml-2"></i>
                </button>
            </div>
        </div>
    `;
};

// Global functions
window.startSurvey = () => renderScreen('shopping_behavior');

window.selectShoppingBehavior = (questionId, value) => {
    state.shoppingBehavior[questionId] = value;
    
    // Update visual selection
    const questionContainer = document.querySelector(`[data-question-id="${questionId}"]`)?.closest('.bg-white');
    if (questionContainer) {
        // Remove all selections in this question
        questionContainer.querySelectorAll('.option-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to clicked option
        const selectedOption = questionContainer.querySelector(`[data-answer="${value}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
    }
    
    updateShoppingBehaviorUI();
};

window.selectPsychologyAnswer = (category, value) => {
    state.psychologyProfile[category] = value;
    
    // Update visual selection
    const questionContainer = document.querySelector(`[data-category="${category}"]`)?.closest('.bg-white');
    if (questionContainer) {
        // Remove all selections in this question
        questionContainer.querySelectorAll('.option-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to clicked option
        const selectedOption = questionContainer.querySelector(`[data-value="${value}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
    }
    
    updatePsychologyQuizUI();
};

window.updateShoppingBehaviorUI = () => {
    const continueBtn = document.getElementById('shopping-continue');
    const isComplete = Object.keys(state.shoppingBehavior).length === CONFIG.shoppingBehaviorQuestions.length;
    continueBtn.disabled = !isComplete;
    
    if (isComplete) {
        continueBtn.classList.remove('disabled:opacity-50', 'disabled:cursor-not-allowed');
    }
};

window.updatePsychologyQuizUI = () => {
    const continueBtn = document.getElementById('psychology-continue');
    const isComplete = Object.values(state.psychologyProfile).every(value => value !== null);
    continueBtn.disabled = !isComplete;
    
    if (isComplete) {
        continueBtn.classList.remove('disabled:opacity-50', 'disabled:cursor-not-allowed');
    }
};

window.startStaircaseStudy = () => {
    initializeStaircaseStudy();
    renderScreen('staircase', { staircase: state.staircases[0] });
};

// Initialize staircase study
const initializeStaircaseStudy = () => {
    state.shuffledOrder = CONFIG.products
        .map((product, index) => ({ product, sort: Math.random(), index }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ index }) => index);

    state.staircases = CONFIG.products.map(product => {
        const startOptions = CONFIG.staircase.startDiscounts;
        const randomIndex = Math.floor(Math.random() * startOptions.length);
        const initialDiscount = startOptions[randomIndex];
        
        const catchTrialIndices = generateUniqueRandomIndices(
            CONFIG.staircase.catchTrialsPerProduct,
            CONFIG.staircase.maxTrialsForCatch
        );

        return {
            ...product,
            status: 'pending',
            initialDiscount,
            currentDiscount: initialDiscount,
            previousDiscount: initialDiscount,
            history: [],
            reversals: 0,
            lastChoice: null,
            reversalPoints: [],
            trialCount: 0,
            failedCatchTrials: 0,
            catchTrialIndices: catchTrialIndices.sort((a, b) => a - b)
        };
    });

    state.currentStaircaseIndex = 0;
    state.isCurrentTrialCatch = false;
};

// Handle staircase choice
window.handleStaircaseChoice = (choice) => {
    const realIndex = state.shuffledOrder[state.currentStaircaseIndex];
    const staircase = state.staircases[realIndex];
    
    // Update UI
    document.querySelectorAll('.option-card').forEach(card => card.classList.remove('selected'));
    document.getElementById(`${choice}-option`).classList.add('selected');
    
    // Log trial
    staircase.trialCount++;
    const trialDiscount = state.isCurrentTrialCatch ? 100 : staircase.currentDiscount;
    
    if (state.isCurrentTrialCatch) {
        if (choice === 'tagpeak') {
            staircase.failedCatchTrials++;
        }
        staircase.history.push({
            choice, discount: trialDiscount, trialNumber: staircase.trialCount, trialType: 'catch'
        });
        state.isCurrentTrialCatch = false;
        setTimeout(runNextStaircase, 1000);
        return;
    }
    
    // Normal trial logic
    staircase.history.push({
        choice, discount: trialDiscount, trialNumber: staircase.trialCount, trialType: 'normal'
    });
    
    const isReversal = staircase.lastChoice && staircase.lastChoice !== choice;
    if (isReversal) {
        staircase.reversals++;
        staircase.reversalPoints.push(staircase.currentDiscount);
    }
    staircase.lastChoice = choice;
    
    if (staircase.reversals >= CONFIG.staircase.reversalsToEnd) {
        staircase.status = 'completed';
        state.currentStaircaseIndex++;
        setTimeout(runNextStaircase, 1000); // Show transition for new product
        return;
    }
    
    // Calculate step size
    const stepIndex = Math.min(staircase.reversals, CONFIG.staircase.stepSizes.length - 1);
    const stepSize = CONFIG.staircase.stepSizes[stepIndex];
    
    // Update previous discount before changing current
    staircase.previousDiscount = staircase.currentDiscount;
    
    if (choice === 'discount') {
        staircase.currentDiscount -= stepSize;
    } else {
        staircase.currentDiscount += stepSize;
    }
    
    staircase.currentDiscount = Math.max(0, Math.min(100, staircase.currentDiscount));
    setTimeout(continueStaircase, 1000); // Continue with same product
};

// Start transition timer
const startTransitionTimer = () => {
    let timeLeft = 5;
    const button = document.getElementById('continue-transition');
    
    if (button) {
        const originalText = button.innerHTML;
        
        const updateButton = () => {
            if (timeLeft > 0) {
                button.innerHTML = `Continue to Decisions (${timeLeft}s) <i class="fas fa-arrow-right ml-2"></i>`;
                timeLeft--;
                state.transitionTimer = setTimeout(updateButton, 1000);
            } else {
                button.innerHTML = originalText;
                startNextStaircase();
            }
        };
        
        updateButton();
    }
};

// Clear transition timer
const clearTransitionTimer = () => {
    if (state.transitionTimer) {
        clearTimeout(state.transitionTimer);
        state.transitionTimer = null;
    }
};

// Start next staircase (called by button or timer)
window.startNextStaircase = () => {
    clearTransitionTimer();
    const realIndex = state.shuffledOrder[state.currentStaircaseIndex];
    const currentStaircase = state.staircases[realIndex];
    
    if (!currentStaircase) {
        calculateIndifferencePoints();
        renderScreen('demographics');
        return;
    }
    
    renderScreen('staircase', { staircase: currentStaircase });
};

// Run next staircase
const runNextStaircase = () => {
    const realIndex = state.shuffledOrder[state.currentStaircaseIndex];
    const currentStaircase = state.staircases[realIndex];
    
    if (!currentStaircase) {
        calculateIndifferencePoints();
        renderScreen('demographics');
        return;
    }
    
    // Show transition screen first
    renderScreen('product_transition', { product: currentStaircase });
};

// Continue to next staircase step (within same product)
const continueStaircase = () => {
    const realIndex = state.shuffledOrder[state.currentStaircaseIndex];
    const currentStaircase = state.staircases[realIndex];
    
    if (!currentStaircase) {
        calculateIndifferencePoints();
        renderScreen('demographics');
        return;
    }
    
    // Go directly to staircase (no transition for same product)
    renderScreen('staircase', { staircase: currentStaircase });
};

// Calculate indifference points
const calculateIndifferencePoints = () => {
    state.indifferencePoints = {};
    state.staircases.forEach(staircase => {
        const relevantReversals = staircase.reversalPoints.slice(-4);
        let indifferencePoint = 0;
        
        if (relevantReversals.length > 0) {
            const sum = relevantReversals.reduce((acc, val) => acc + val, 0);
            indifferencePoint = sum / relevantReversals.length;
        } else {
            indifferencePoint = staircase.currentDiscount;
        }
        
        state.indifferencePoints[staircase.id] = {
            name: staircase.name,
            price: formatCurrency(staircase.price, staircase.currency),
            point: Math.round(indifferencePoint),
            category: staircase.category
        };
    });
};

// Secure data saving function
const saveSurveyData = async () => {
    if (!supabaseClient) {
        console.warn('Supabase not available, data not saved');
        return;
    }

    try {
        console.log('💾 Saving survey data...', {
            userId: state.userId,
            psychologyProfile: state.psychologyProfile,
            shoppingBehavior: state.shoppingBehavior,
            indifferencePoints: state.indifferencePoints,
            demographics: state.demographics,
            staircases: state.staircases.length,
            comprehensionAnswers: state.comprehensionAnswers
        });
        
        console.log('🔍 Supabase client status:', supabaseClient ? 'Available' : 'Not available');

        // Calculate enhanced analytics
        state.enhancedAnalytics.brandAffinity = calculateBrandAffinity();
        state.enhancedAnalytics.purchaseIntent = calculatePurchaseIntent();
        state.enhancedAnalytics.discountSensitivity = calculateDiscountSensitivity();
        state.enhancedAnalytics.innovationAdoption = calculateInnovationAdoption();
        state.enhancedAnalytics.choiceConsistency = calculateChoiceConsistency();

        // Combine shopping behavior with comprehension answers
        const combinedShoppingBehavior = {
            ...state.shoppingBehavior,
            comprehension_answers: state.comprehensionAnswers,
            enhanced_analytics: state.enhancedAnalytics
        };

        const surveyData = {
            user_id: state.userId,
            session_start: state.sessionStartTime,
            session_end: new Date(),
            psychology_profile: state.psychologyProfile,
            shopping_behavior: combinedShoppingBehavior,
            indifference_points: state.indifferencePoints,
            demographics: state.demographics,
            staircase_data: state.staircases
        };

        const { data, error } = await supabaseClient
            .from('survey_responses')
            .insert(surveyData);

        if (error) {
            console.error('❌ Supabase error:', error);
            console.error('❌ Error details:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            // Don't throw - let survey continue
            return;
        }
        
        console.log('✅ Survey data saved successfully:', data);
    } catch (error) {
        console.error('❌ Error saving survey data:', error);
        console.error('Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
        });
        // Survey continues even if save fails
    }
};

// Handle demographics form
window.handleDemographicsSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const demographics = {};
    for (const [key, value] of formData.entries()) {
        demographics[key] = value;
    }
    state.demographics = demographics;
    
    // Save data securely
    await saveSurveyData();
    
    renderScreen('thank_you');
};

// Test Supabase connection
const testSupabaseConnection = async () => {
    if (!supabaseClient) {
        console.warn('❌ Supabase client not initialized');
        return false;
    }

    try {
        console.log('🔍 Testing Supabase connection...');
        const { data, error } = await supabaseClient
            .from('survey_responses')
            .select('count')
            .limit(1);
        
        if (error) {
            console.error('❌ Supabase connection test failed:', error);
            return false;
        }
        
        console.log('✅ Supabase connection successful');
        return true;
    } catch (error) {
        console.error('❌ Supabase connection test error:', error);
        return false;
    }
};

// Initialize the application
const initializeApp = async () => {
    console.log('🚀 Initializing Tagpeak Survey...');
    state.sessionStartTime = new Date();
    state.userId = crypto.randomUUID();
    
    console.log('📊 State initialized:', state);
    
    // Initialize Supabase
    await initializeSupabase();
    
    // Test Supabase connection
    await testSupabaseConnection();
    
    console.log('🎨 Rendering welcome screen...');
    await renderScreen('welcome');
    console.log('✅ Survey initialized successfully!');
};

// Comprehension check functions
window.selectComprehensionAnswer = (questionNumber, answer) => {
    const correctAnswers = {
        1: 'B', // Tagpeak uses financial markets to potentially boost cashback
        2: 'A', // 0.5% minimum cashback
        3: 'C'  // 6 months period
    };
    
    const isCorrect = answer === correctAnswers[questionNumber];
    const questionContainer = document.querySelector(`[data-question="${questionNumber}"]`);
    const feedbackDiv = document.getElementById(`feedback-${questionNumber}`);
    
    // Update visual selection
    questionContainer.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = questionContainer.querySelector(`[data-answer="${answer}"]`);
    selectedCard.classList.add('selected');
    
    // Show feedback
    feedbackDiv.classList.remove('hidden');
    if (isCorrect) {
        feedbackDiv.className = 'mt-4 p-3 rounded-lg bg-green-100 border border-green-300';
        feedbackDiv.querySelector('p').textContent = '✅ Correct! You understand how Tagpeak works.';
        feedbackDiv.querySelector('p').className = 'text-sm font-medium text-green-800';
    } else {
        feedbackDiv.className = 'mt-4 p-3 rounded-lg bg-red-100 border border-red-300';
        feedbackDiv.querySelector('p').textContent = `❌ Not quite. The correct answer is ${correctAnswers[questionNumber]}. Please review the Tagpeak explanation and try again.`;
        feedbackDiv.querySelector('p').className = 'text-sm font-medium text-red-800';
    }
    
    // Store the answer
    if (!state.comprehensionAnswers) {
        state.comprehensionAnswers = {};
    }
    state.comprehensionAnswers[questionNumber] = { answer, isCorrect };
    
    // Update continue button
    updateComprehensionUI();
};

window.updateComprehensionUI = () => {
    const continueBtn = document.getElementById('comprehension-continue');
    const allAnswered = state.comprehensionAnswers && Object.keys(state.comprehensionAnswers).length === 3;
    const allCorrect = allAnswered && Object.values(state.comprehensionAnswers).every(result => result.isCorrect);
    
    continueBtn.disabled = !allCorrect;
    
    if (allCorrect) {
        continueBtn.classList.remove('disabled:opacity-50', 'disabled:cursor-not-allowed');
        continueBtn.textContent = 'Continue to Examples';
    } else if (allAnswered) {
        continueBtn.textContent = 'Please answer all questions correctly';
    }
};

document.addEventListener('DOMContentLoaded', initializeApp);

