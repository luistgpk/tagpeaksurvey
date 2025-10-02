// Additional Screen Components

// Demographics Screen
const renderDemographicsScreen = () => {
    return `
        <div class="space-y-8">
            <div class="text-center">
                <h1 class="text-4xl font-bold text-gray-800 mb-4">
                    📊 Personal Information
                </h1>
                <p class="text-xl text-gray-600">
                    Help us understand your background (all information is anonymous)
                </p>
            </div>
            
            <form id="demographics-form" class="max-w-4xl mx-auto space-y-8">
                <div class="bg-white rounded-2xl p-8 shadow-lg">
                    <h3 class="text-xl font-bold text-gray-800 mb-6">Basic Information</h3>
                    
                    <div class="grid md:grid-cols-2 gap-6">
                        <div>
                            <label for="age" class="block text-sm font-medium text-gray-700 mb-2">Age</label>
                            <input type="number" id="age" name="age" min="18" max="100" required 
                                   class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                            <div class="grid grid-cols-2 gap-3">
                                <label class="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="gender" value="Female" required class="text-blue-600">
                                    <span>Female</span>
                                </label>
                                <label class="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="gender" value="Male" class="text-blue-600">
                                    <span>Male</span>
                                </label>
                                <label class="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="gender" value="Non-binary" class="text-blue-600">
                                    <span>Non-binary</span>
                                </label>
                                <label class="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="gender" value="Prefer not to say" class="text-blue-600">
                                    <span>Prefer not to say</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-2xl p-8 shadow-lg">
                    <h3 class="text-xl font-bold text-gray-800 mb-6">Education & Experience</h3>
                    
                    <div class="space-y-6">
                        <div>
                            <label for="education" class="block text-sm font-medium text-gray-700 mb-2">Education Level</label>
                            <select id="education" name="education" required 
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Select your education level</option>
                                <option value="High School">High School</option>
                                <option value="Associate Degree">Associate Degree</option>
                                <option value="Bachelor's Degree">Bachelor's Degree</option>
                                <option value="Master's Degree">Master's Degree</option>
                                <option value="Doctorate">Doctorate</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Investment Experience</label>
                            <div class="grid grid-cols-2 gap-3">
                                <label class="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="investment_experience" value="None" required class="text-blue-600">
                                    <span>No experience</span>
                                </label>
                                <label class="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="investment_experience" value="Beginner" class="text-blue-600">
                                    <span>Beginner</span>
                                </label>
                                <label class="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="investment_experience" value="Intermediate" class="text-blue-600">
                                    <span>Intermediate</span>
                                </label>
                                <label class="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="investment_experience" value="Advanced" class="text-blue-600">
                                    <span>Advanced</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-2xl p-8 shadow-lg">
                    <h3 class="text-xl font-bold text-gray-800 mb-6">Shopping Behavior</h3>
                    
                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Shopping Benefits</label>
                            <div class="grid grid-cols-2 gap-3">
                                <label class="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="shopping_preference" value="Immediate discounts" required class="text-blue-600">
                                    <span>Immediate discounts</span>
                                </label>
                                <label class="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="shopping_preference" value="Cashback rewards" class="text-blue-600">
                                    <span>Cashback rewards</span>
                                </label>
                                <label class="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="shopping_preference" value="Loyalty points" class="text-blue-600">
                                    <span>Loyalty points</span>
                                </label>
                                <label class="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="shopping_preference" value="No preference" class="text-blue-600">
                                    <span>No preference</span>
                                </label>
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Annual Income Range</label>
                            <select name="income" required 
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Select income range</option>
                                <option value="Under $25,000">Under $25,000</option>
                                <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                                <option value="$50,000 - $75,000">$50,000 - $75,000</option>
                                <option value="$75,000 - $100,000">$75,000 - $100,000</option>
                                <option value="$100,000 - $150,000">$100,000 - $150,000</option>
                                <option value="Over $150,000">Over $150,000</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="text-center">
                    <button type="submit" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                        Complete Study
                        <i class="fas fa-check ml-2"></i>
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
    
    // Generate psychology insights based on responses
    const insights = generatePsychologyInsights();
    
    return `
        <div class="space-y-8">
            <div class="text-center">
                <h1 class="text-4xl font-bold text-gray-800 mb-4">
                    🎯 Your Psychology Profile
                </h1>
                <p class="text-xl text-gray-600">
                    Based on your decisions, here's what we discovered about your shopping psychology
                </p>
            </div>
            
            <!-- Key Results -->
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Your Decision Threshold</h2>
                <div class="text-center mb-6">
                    <div class="text-6xl font-black text-blue-600 mb-2">${avgIndifferencePoint.toFixed(1)}%</div>
                    <p class="text-lg text-gray-600">Average discount needed to choose traditional discount over Tagpeak</p>
                </div>
                
                <div class="grid md:grid-cols-3 gap-6">
                    ${results.map(result => `
                        <div class="bg-white rounded-xl p-6 text-center shadow-lg">
                            <h3 class="font-bold text-gray-800 mb-2">${result.name}</h3>
                            <div class="text-3xl font-bold text-blue-600 mb-1">${result.point}%</div>
                            <p class="text-sm text-gray-600">${result.price}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Psychology Insights -->
            <div class="grid md:grid-cols-2 gap-8">
                <div class="bg-white rounded-2xl p-8 shadow-lg">
                    <h3 class="text-xl font-bold text-gray-800 mb-6">Your Psychology Profile</h3>
                    <div class="space-y-4">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-brain text-blue-600"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-800">Risk Tolerance</h4>
                                <p class="text-sm text-gray-600">${state.psychologyProfile.riskTolerance || 'Not assessed'}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-clock text-green-600"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-800">Time Preference</h4>
                                <p class="text-sm text-gray-600">${state.psychologyProfile.timePreference || 'Not assessed'}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-2xl p-8 shadow-lg">
                    <h3 class="text-xl font-bold text-gray-800 mb-6">Key Insights</h3>
                    <div class="space-y-4">
                        ${insights.map(insight => `
                            <div class="flex items-start space-x-3">
                                <div class="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <i class="fas fa-lightbulb text-yellow-600 text-xs"></i>
                                </div>
                                <p class="text-sm text-gray-700">${insight}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <!-- Call to Action -->
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 text-center">
                <h3 class="text-2xl font-bold text-gray-800 mb-4">Interested in Tagpeak?</h3>
                <p class="text-gray-600 mb-6">Based on your profile, you might be a great fit for our innovative cashback system!</p>
                <div class="space-x-4">
                    <button onclick="window.open('https://tagpeak.com', '_blank')" class="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300">
                        Learn More
                    </button>
                    <button onclick="renderScreen('thank_you')" class="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300">
                        Complete Study
                    </button>
                </div>
            </div>
        </div>
    `;
};

// Thank You Screen
const renderThankYouScreen = () => {
    return `
        <div class="text-center space-y-8">
            <div class="space-y-4">
                <div class="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <i class="fas fa-check text-white text-4xl"></i>
                </div>
                <h1 class="text-5xl font-black gradient-text mb-4">
                    Thank You! 🎉
                </h1>
                <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                    Your participation helps us understand consumer psychology and improve shopping experiences
                </p>
            </div>
            
            <div class="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">What Happens Next?</h2>
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
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-envelope text-purple-600"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-800">Updates</h3>
                            <p class="text-sm text-gray-600">We may share research findings (optional)</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-2">Your Session ID</h3>
                <p class="font-mono text-sm text-gray-600 break-all">${state.userId}</p>
                <p class="text-xs text-gray-500 mt-2">Keep this for reference if needed</p>
            </div>
            
            <div class="space-x-4">
                <button onclick="window.open('https://tagpeak.com', '_blank')" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Visit Tagpeak
                    <i class="fas fa-external-link-alt ml-2"></i>
                </button>
                <button onclick="location.reload()" class="bg-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Take Survey Again
                    <i class="fas fa-redo ml-2"></i>
                </button>
            </div>
        </div>
    `;
};

// Generate psychology insights based on user responses
const generatePsychologyInsights = () => {
    const insights = [];
    const avgPoint = Object.values(state.indifferencePoints).reduce((sum, result) => sum + parseFloat(result.point), 0) / Object.keys(state.indifferencePoints).length;
    
    if (avgPoint < 10) {
        insights.push("You have a strong preference for innovative benefits over traditional discounts");
    } else if (avgPoint < 25) {
        insights.push("You're open to new benefit structures but still value immediate savings");
    } else {
        insights.push("You prefer traditional, guaranteed benefits over innovative alternatives");
    }
    
    if (state.psychologyProfile.riskTolerance === 'aggressive') {
        insights.push("Your risk tolerance aligns well with investment-linked benefits");
    } else if (state.psychologyProfile.riskTolerance === 'conservative') {
        insights.push("You prefer guaranteed, low-risk benefits");
    }
    
    if (state.psychologyProfile.timePreference === 'future') {
        insights.push("Your future-oriented mindset makes you a good candidate for long-term benefit structures");
    } else {
        insights.push("You value immediate gratification in your shopping benefits");
    }
    
    return insights;
};

// Handle demographics form submission
window.handleDemographicsSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const demographics = {};
    for (const [key, value] of formData.entries()) {
        demographics[key] = value;
    }
    
    state.demographics = demographics;
    
    // Save to Supabase
    await saveResultsToSupabase();
    
    // Show results
    renderScreen('results');
};

// Save results to Supabase
const saveResultsToSupabase = async () => {
    try {
        const { data, error } = await supabase
            .from('survey_responses')
            .insert({
                user_id: state.userId,
                session_start: state.sessionStartTime,
                session_end: new Date(),
                psychology_profile: state.psychologyProfile,
                indifference_points: state.indifferencePoints,
                demographics: state.demographics,
                staircase_data: state.staircases,
                created_at: new Date()
            });
            
        if (error) throw error;
        console.log('Results saved successfully');
    } catch (error) {
        console.error('Error saving results:', error);
    }
};
