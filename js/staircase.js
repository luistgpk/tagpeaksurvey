// Staircase Method Implementation for Tagpeak Study

// Render Staircase Screen
const renderStaircaseScreen = (staircase) => {
    const realIndex = state.shuffledOrder[state.currentStaircaseIndex];
    const currentStaircase = state.staircases[realIndex];
    
    if (!currentStaircase) {
        calculateIndifferencePoints();
        renderScreen('demographics');
        return;
    }
    
    currentStaircase.status = 'active';
    
    // Check if next trial should be catch trial
    const nextTrialNumber = currentStaircase.trialCount + 1;
    state.isCurrentTrialCatch = currentStaircase.catchTrialIndices.includes(nextTrialNumber);
    
    const displayDiscount = state.isCurrentTrialCatch ? 100 : currentStaircase.currentDiscount;
    const basePriceFormatted = formatCurrency(currentStaircase.price, currentStaircase.currency);
    const monetaryDiscount = currentStaircase.price * (displayDiscount / 100);
    const monetaryCashbackGuaranteed = currentStaircase.price * (0.5 / 100);
    const monetaryCashbackMax = currentStaircase.price * (100 / 100);
    
    const formattedDiscount = formatCurrency(monetaryDiscount, currentStaircase.currency);
    const formattedCashbackGuaranteed = formatCurrency(monetaryCashbackGuaranteed, currentStaircase.currency);
    const formattedCashbackMax = formatCurrency(monetaryCashbackMax, currentStaircase.currency);
    
    const progressPercentage = ((state.currentStaircaseIndex + 1) / CONFIG.products.length) * 100;
    
    return `
        <div class="space-y-8">
            <!-- Progress Bar -->
            <div class="bg-white rounded-2xl p-6 shadow-lg">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold text-gray-800">Decision Study</h2>
                    <span class="text-sm font-medium text-gray-600">Product ${state.currentStaircaseIndex + 1} of ${CONFIG.products.length}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                    <div class="progress-bar h-3 rounded-full" style="width: ${progressPercentage}%"></div>
                </div>
            </div>
            
            <!-- Product Context -->
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
                <div class="flex items-center justify-center space-x-4 mb-4">
                    <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <i class="fas fa-shopping-cart text-white text-2xl"></i>
                    </div>
                    <div>
                        <h3 class="text-2xl font-bold text-gray-800">${currentStaircase.name}</h3>
                        <p class="text-lg text-gray-600">${basePriceFormatted} • ${currentStaircase.category}</p>
                    </div>
                </div>
                
                <p class="text-xl text-gray-700 mb-6">
                    Imagine you're buying this product. Which option would you choose?
                </p>
            </div>
            
            <!-- Decision Options -->
            <div class="grid md:grid-cols-2 gap-8">
                <!-- Tagpeak Option -->
                <div id="tagpeak-option" class="option-card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 text-center hover:border-green-400" onclick="handleStaircaseChoice('tagpeak')">
                    <div class="mb-6">
                        <div class="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-rocket text-white text-3xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-green-800 mb-2">Tagpeak Smart Cashback</h3>
                        <p class="text-sm text-green-600">Revolutionary investment-linked rewards</p>
                    </div>
                    
                    <div class="space-y-4 text-left">
                        <div class="bg-white rounded-lg p-4 border border-green-200">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-semibold text-green-800">Guaranteed Return:</span>
                                <span class="text-lg font-bold text-green-600">${formattedCashbackGuaranteed}</span>
                            </div>
                            <p class="text-sm text-green-600">0.5% minimum cashback</p>
                        </div>
                        
                        <div class="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 border border-green-300">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-semibold text-green-800">Potential Return:</span>
                                <span class="text-lg font-bold text-green-600">${formattedCashbackMax}</span>
                            </div>
                            <p class="text-sm text-green-600">Up to 100% through smart investing</p>
                        </div>
                        
                        <div class="flex items-center space-x-2 text-sm text-green-700">
                            <i class="fas fa-clock"></i>
                            <span>6-month investment period</span>
                        </div>
                        <div class="flex items-center space-x-2 text-sm text-green-700">
                            <i class="fas fa-unlock"></i>
                            <span>Withdraw anytime</span>
                        </div>
                    </div>
                </div>
                
                <!-- Traditional Discount Option -->
                <div id="discount-option" class="option-card bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 text-center hover:border-blue-400" onclick="handleStaircaseChoice('discount')">
                    <div class="mb-6">
                        <div class="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-percentage text-white text-3xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-blue-800 mb-2">Traditional Discount</h3>
                        <p class="text-sm text-blue-600">Immediate savings, no risk</p>
                    </div>
                    
                    <div class="space-y-4 text-left">
                        <div class="bg-white rounded-lg p-4 border border-blue-200">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-semibold text-blue-800">Discount Amount:</span>
                                <span class="text-lg font-bold text-blue-600">${formattedDiscount}</span>
                            </div>
                            <p class="text-sm text-blue-600">${displayDiscount.toFixed(1)}% off immediately</p>
                        </div>
                        
                        <div class="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4 border border-blue-300">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-semibold text-blue-800">You Pay:</span>
                                <span class="text-lg font-bold text-blue-600">${formatCurrency(currentStaircase.price - monetaryDiscount, currentStaircase.currency)}</span>
                            </div>
                            <p class="text-sm text-blue-600">Save money right now</p>
                        </div>
                        
                        <div class="flex items-center space-x-2 text-sm text-blue-700">
                            <i class="fas fa-bolt"></i>
                            <span>Instant savings</span>
                        </div>
                        <div class="flex items-center space-x-2 text-sm text-blue-700">
                            <i class="fas fa-shield-alt"></i>
                            <span>No risk, guaranteed</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Psychology Hint -->
            <div class="psychology-hint rounded-xl p-6 text-center">
                <div class="flex items-center justify-center space-x-3 mb-2">
                    <i class="fas fa-brain text-amber-600"></i>
                    <h4 class="font-semibold text-amber-800">Psychology Insight</h4>
                </div>
                <p class="text-sm text-amber-700">
                    ${getRandomHint()}
                </p>
            </div>
            
            <!-- Catch Trial Indicator (Hidden) -->
            ${state.isCurrentTrialCatch ? `
                <div class="text-center">
                    <div class="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>Special Test Round</span>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
};

// Handle staircase choice
window.handleStaircaseChoice = (choice) => {
    const realIndex = state.shuffledOrder[state.currentStaircaseIndex];
    const staircase = state.staircases[realIndex];
    
    // Update UI selection
    const tagpeakOption = document.getElementById('tagpeak-option');
    const discountOption = document.getElementById('discount-option');
    
    // Remove previous selections
    tagpeakOption.classList.remove('selected');
    discountOption.classList.remove('selected');
    
    // Add selection to chosen option
    const selectedOption = document.getElementById(`${choice}-option`);
    selectedOption.classList.add('selected');
    
    // Log trial
    staircase.trialCount++;
    const trialDiscount = state.isCurrentTrialCatch ? 100 : staircase.currentDiscount;
    
    // Handle catch trial
    if (state.isCurrentTrialCatch) {
        if (choice === 'tagpeak') {
            staircase.failedCatchTrials++;
            console.warn(`Catch trial failed for ${staircase.name}. Choice: Tagpeak @ 100% discount.`);
        }
        
        staircase.history.push({
            choice,
            discount: trialDiscount,
            trialNumber: staircase.trialCount,
            trialType: 'catch',
            catchFailed: (choice === 'tagpeak')
        });
        
        state.isCurrentTrialCatch = false;
        setTimeout(runNextStaircase, 1000);
        return;
    }
    
    // Normal trial logic
    staircase.history.push({
        choice,
        discount: trialDiscount,
        trialNumber: staircase.trialCount,
        trialType: 'normal'
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
        setTimeout(runNextStaircase, 1000);
        return;
    }
    
    // Calculate step size
    const stepIndex = Math.min(staircase.reversals, CONFIG.staircase.stepSizes.length - 1);
    const stepSize = CONFIG.staircase.stepSizes[stepIndex];
    
    if (choice === 'discount') {
        staircase.currentDiscount -= stepSize;
    } else {
        staircase.currentDiscount += stepSize;
    }
    
    // Clamp between 0% and 100%
    staircase.currentDiscount = Math.max(0, Math.min(100, staircase.currentDiscount));
    
    setTimeout(runNextStaircase, 1000);
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
            point: indifferencePoint.toFixed(2),
            category: staircase.category
        };
    });
};
