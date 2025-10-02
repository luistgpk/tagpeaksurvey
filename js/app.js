// Tagpeak Consumer Psychology Study
// Modern survey using staircase method to evaluate psychological consequences

import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2';

// Configuration
const CONFIG = {
    supabase: {
        url: 'YOUR_SUPABASE_URL',
        anonKey: 'YOUR_SUPABASE_ANON_KEY'
    },
    products: [
        { id: 'low', name: 'Premium Headphones', price: 299, currency: '€', category: 'Electronics' },
        { id: 'medium', name: 'Designer Watch', price: 899, currency: '€', category: 'Luxury' },
        { id: 'high', name: 'MacBook Pro', price: 2499, currency: '€', category: 'Technology' }
    ],
    staircase: {
        startDiscounts: [5, 15, 25],
        stepSizes: [8, 4, 2, 1, 0.5, 0.25],
        reversalsToEnd: 6,
        catchTrialsPerProduct: 1,
        maxTrialsForCatch: 25
    },
    psychologyHints: [
        "💡 Did you know? 73% of consumers prefer immediate gratification over delayed rewards",
        "🧠 Research shows that perceived value increases by 23% when benefits are personalized",
        "📊 Studies indicate that investment-linked rewards trigger different psychological responses than traditional discounts",
        "🎯 Behavioral economics suggests that 'potential gains' can be more motivating than 'guaranteed losses'",
        "💭 Your decision-making style reveals interesting patterns about risk tolerance and future planning"
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
    psychologyProfile: {
        riskTolerance: null,
        timePreference: null,
        decisionStyle: null,
        valuePerception: null
    },
    isCurrentTrialCatch: false,
    sessionStartTime: null
};

// Initialize Supabase
const supabase = createClient(CONFIG.supabase.url, CONFIG.supabase.anonKey);

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

// Screen rendering functions
const renderScreen = async (screenName, data = {}) => {
    state.currentScreen = screenName;
    const contentArea = document.getElementById('content-area');
    
    // Fade out
    contentArea.style.opacity = '0';
    
    setTimeout(() => {
        contentArea.innerHTML = '';
        
        switch (screenName) {
            case 'welcome':
                contentArea.innerHTML = renderWelcomeScreen();
                break;
            case 'tagpeak_explanation':
                contentArea.innerHTML = renderTagpeakExplanationScreen();
                break;
            case 'psychology_quiz':
                contentArea.innerHTML = renderPsychologyQuizScreen();
                break;
            case 'staircase':
                contentArea.innerHTML = renderStaircaseScreen(data.staircase);
                break;
            case 'demographics':
                contentArea.innerHTML = renderDemographicsScreen();
                break;
            case 'results':
                contentArea.innerHTML = renderResultsScreen();
                break;
            case 'thank_you':
                contentArea.innerHTML = renderThankYouScreen();
                break;
        }
        
        // Fade in
        contentArea.style.opacity = '1';
        contentArea.classList.add('slide-in');
    }, 300);
};

// Welcome Screen
const renderWelcomeScreen = () => {
    return `
        <div class="text-center space-y-8">
            <div class="space-y-4">
                <h1 class="text-5xl font-black gradient-text mb-4">
                    🧠 Consumer Psychology Study
                </h1>
                <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                    Help us understand how new shopping benefits influence your decision-making process
                </p>
            </div>
            
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
                <div class="flex items-center justify-center space-x-4 mb-6">
                    <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <i class="fas fa-brain text-white text-2xl"></i>
                    </div>
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800">What You'll Discover</h2>
                        <p class="text-gray-600">Your shopping psychology profile</p>
                    </div>
                </div>
                
                <div class="grid md:grid-cols-3 gap-6 text-left">
                    <div class="space-y-2">
                        <div class="flex items-center space-x-2">
                            <i class="fas fa-clock text-blue-500"></i>
                            <span class="font-semibold">Duration</span>
                        </div>
                        <p class="text-sm text-gray-600">8-12 minutes</p>
                    </div>
                    <div class="space-y-2">
                        <div class="flex items-center space-x-2">
                            <i class="fas fa-shield-alt text-green-500"></i>
                            <span class="font-semibold">Privacy</span>
                        </div>
                        <p class="text-sm text-gray-600">100% anonymous</p>
                    </div>
                    <div class="space-y-2">
                        <div class="flex items-center space-x-2">
                            <i class="fas fa-gift text-purple-500"></i>
                            <span class="font-semibold">Reward</span>
                        </div>
                        <p class="text-sm text-gray-600">Personal insights</p>
                    </div>
                </div>
            </div>
            
            <div class="psychology-hint rounded-xl p-4">
                <p class="text-sm font-medium text-amber-800">
                    ${getRandomHint()}
                </p>
            </div>
            
            <button onclick="startSurvey()" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Start Your Psychology Journey
                <i class="fas fa-arrow-right ml-2"></i>
            </button>
        </div>
    `;
};

// Tagpeak Explanation Screen
const renderTagpeakExplanationScreen = () => {
    return `
        <div class="space-y-8">
            <div class="text-center">
                <h1 class="text-4xl font-bold text-gray-800 mb-4">
                    🚀 Introducing Tagpeak
                </h1>
                <p class="text-xl text-gray-600">
                    A revolutionary new way to get more from your purchases
                </p>
            </div>
            
            <div class="grid md:grid-cols-2 gap-8">
                <div class="space-y-6">
                    <div class="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
                        <h3 class="text-xl font-bold text-red-800 mb-3">
                            <i class="fas fa-exclamation-triangle mr-2"></i>
                            Traditional Cashback
                        </h3>
                        <ul class="space-y-2 text-red-700">
                            <li>• Fixed percentage (usually 1-5%)</li>
                            <li>• Immediate but limited return</li>
                            <li>• No growth potential</li>
                            <li>• Often expires or has restrictions</li>
                        </ul>
                    </div>
                    
                    <div class="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg">
                        <h3 class="text-xl font-bold text-green-800 mb-3">
                            <i class="fas fa-rocket mr-2"></i>
                            Tagpeak Innovation
                        </h3>
                        <ul class="space-y-2 text-green-700">
                            <li>• <strong>Guaranteed 0.5%</strong> minimum cashback</li>
                            <li>• <strong>Potential up to 100%</strong> through smart investing</li>
                            <li>• Professional investment management</li>
                            <li>• Flexible withdrawal anytime</li>
                        </ul>
                    </div>
                </div>
                
                <div class="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
                    <h3 class="text-2xl font-bold text-gray-800 mb-4">How It Works</h3>
                    <div class="space-y-4">
                        <div class="flex items-start space-x-3">
                            <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                            <div>
                                <h4 class="font-semibold text-gray-800">Make a Purchase</h4>
                                <p class="text-sm text-gray-600">Shop normally, get guaranteed 0.5% cashback</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-3">
                            <div class="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                            <div>
                                <h4 class="font-semibold text-gray-800">Smart Investment</h4>
                                <p class="text-sm text-gray-600">Our experts invest your cashback for 6 months</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-3">
                            <div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                            <div>
                                <h4 class="font-semibold text-gray-800">Maximum Returns</h4>
                                <p class="text-sm text-gray-600">Potential to reach 100% of your purchase value</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="text-center">
                <button onclick="renderScreen('psychology_quiz')" class="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    I Understand - Let's Begin
                    <i class="fas fa-arrow-right ml-2"></i>
                </button>
            </div>
        </div>
    `;
};

// Psychology Quiz Screen
const renderPsychologyQuizScreen = () => {
    return `
        <div class="space-y-8">
            <div class="text-center">
                <h1 class="text-4xl font-bold text-gray-800 mb-4">
                    🧠 Psychology Assessment
                </h1>
                <p class="text-xl text-gray-600">
                    Help us understand your decision-making style
                </p>
            </div>
            
            <div class="max-w-4xl mx-auto space-y-6">
                <div class="bg-white rounded-2xl p-8 shadow-lg">
                    <h3 class="text-xl font-bold text-gray-800 mb-6">Question 1: Risk Tolerance</h3>
                    <p class="text-gray-600 mb-6">When making financial decisions, you prefer:</p>
                    <div class="grid md:grid-cols-3 gap-4">
                        <div class="option-card bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center" onclick="selectPsychologyAnswer('riskTolerance', 'conservative')">
                            <i class="fas fa-shield-alt text-red-500 text-3xl mb-3"></i>
                            <h4 class="font-semibold text-red-800">Conservative</h4>
                            <p class="text-sm text-red-600">Guaranteed, safe returns</p>
                        </div>
                        <div class="option-card bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center" onclick="selectPsychologyAnswer('riskTolerance', 'moderate')">
                            <i class="fas fa-balance-scale text-yellow-500 text-3xl mb-3"></i>
                            <h4 class="font-semibold text-yellow-800">Moderate</h4>
                            <p class="text-sm text-yellow-600">Balanced risk and reward</p>
                        </div>
                        <div class="option-card bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center" onclick="selectPsychologyAnswer('riskTolerance', 'aggressive')">
                            <i class="fas fa-rocket text-green-500 text-3xl mb-3"></i>
                            <h4 class="font-semibold text-green-800">Aggressive</h4>
                            <p class="text-sm text-green-600">High risk, high reward</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-2xl p-8 shadow-lg">
                    <h3 class="text-xl font-bold text-gray-800 mb-6">Question 2: Time Preference</h3>
                    <p class="text-gray-600 mb-6">You value benefits that are:</p>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="option-card bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center" onclick="selectPsychologyAnswer('timePreference', 'immediate')">
                            <i class="fas fa-bolt text-blue-500 text-3xl mb-3"></i>
                            <h4 class="font-semibold text-blue-800">Immediate</h4>
                            <p class="text-sm text-blue-600">I want benefits right now</p>
                        </div>
                        <div class="option-card bg-purple-50 border-2 border-purple-200 rounded-xl p-6 text-center" onclick="selectPsychologyAnswer('timePreference', 'future')">
                            <i class="fas fa-clock text-purple-500 text-3xl mb-3"></i>
                            <h4 class="font-semibold text-purple-800">Future-Oriented</h4>
                            <p class="text-sm text-purple-600">I can wait for better returns</p>
                        </div>
                    </div>
                </div>
                
                <div class="insight-card rounded-xl p-6">
                    <div class="flex items-center space-x-3 mb-3">
                        <i class="fas fa-lightbulb text-amber-500 text-xl"></i>
                        <h4 class="font-semibold text-gray-800">Psychology Insight</h4>
                    </div>
                    <p class="text-sm text-gray-600">
                        Your answers help us understand your decision-making patterns and how different benefit structures appeal to your psychological profile.
                    </p>
                </div>
            </div>
            
            <div class="text-center">
                <button id="psychology-continue" onclick="startStaircaseStudy()" class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                    Continue to Study
                    <i class="fas fa-arrow-right ml-2"></i>
                </button>
            </div>
        </div>
    `;
};

// Initialize the app
const initializeApp = async () => {
    state.sessionStartTime = new Date();
    state.userId = crypto.randomUUID();
    await renderScreen('welcome');
};

// Global functions
window.startSurvey = () => renderScreen('tagpeak_explanation');
window.selectPsychologyAnswer = (category, value) => {
    state.psychologyProfile[category] = value;
    updatePsychologyQuizUI();
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
    // Initialize staircase study
    initializeStaircaseStudy();
    renderScreen('staircase', { staircase: state.staircases[0] });
};

// Initialize staircase study
const initializeStaircaseStudy = () => {
    // Shuffle product order
    state.shuffledOrder = CONFIG.products
        .map((product, index) => ({ product, sort: Math.random(), index }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ index }) => index);

    // Initialize staircases
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

// Screen functions will be included in the main file for simplicity

// Initialize the application
document.addEventListener('DOMContentLoaded', initializeApp);
