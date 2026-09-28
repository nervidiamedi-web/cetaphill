import React, { useState } from 'react';
import { QuizAnswers, QuizRecommendation, Product } from '../types';
import { Sparkles, ArrowRight, ArrowLeft, RefreshCw, Plus, CheckCircle2, AlertTriangle, Play } from 'lucide-react';

interface SkinQuizProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
  setCurrentView: (view: string) => void;
  setSelectedProductId: (id: string | null) => void;
}

const quizSteps = [
  {
    key: 'skinType',
    title: 'Identify your skin type',
    description: 'Based on how your skin behaves throughout a typical day without products.',
    options: [
      { value: 'Dry', label: 'Dry / Flaky', desc: 'Feels tight, lacks moisture, may have dull or rough patches.' },
      { value: 'Oily', label: 'Oily / Shiny', desc: 'Excess sebum, visible shine all over, enlarged pores.' },
      { value: 'Combination', label: 'Combination', desc: 'Oily in the T-zone (forehead, nose, chin) but dry/normal elsewhere.' },
      { value: 'Normal', label: 'Normal / Balanced', desc: 'Rarely feels tight or shiny, balanced sebum and moisture.' }
    ]
  },
  {
    key: 'concern',
    title: 'Select your primary clinical skin concern',
    description: 'The main target area you want our dermatologist formulations to address.',
    options: [
      { value: 'Dry Skin', label: 'Severe Dehydration', desc: 'Loss of plumpness, fine micro-cracks, tight skin layers.' },
      { value: 'Oily Skin', label: 'Sebum & Pore Control', desc: 'Visible shiny spots, dilated pores, irregular oil balance.' },
      { value: 'Acne-Prone', label: 'Breakouts & Acne', desc: 'Active pimples, blemishes, blackheads, post-acne marks.' },
      { value: 'Sensitive Skin', label: 'Redness & Irritation', desc: 'Compromised skin barrier, burning sensations, reactive to weather.' },
      { value: 'Anti-Aging', label: 'Aging & Fine Lines', desc: 'Loss of collagen, visible fine wrinkles, hyperpigmentation.' }
    ]
  },
  {
    key: 'sensitivity',
    title: 'Define your skin sensitivity level',
    description: 'Helps us modulate active ingredient concentrations to avoid irritation.',
    options: [
      { value: 'High', label: 'Highly Reactive', desc: 'Frequently burns, turns red easily, experiences flaking with active ingredients.' },
      { value: 'Moderate', label: 'Mildly Sensitive', desc: 'Rare flaking or redness under strong active acids, overall manageable.' },
      { value: 'Low', label: 'Resilient / Tolerant', desc: 'Can handle potent concentrations of Retinol or Vitamin C with zero issues.' }
    ]
  },
  {
    key: 'ageGroup',
    title: 'Select your age bracket',
    description: 'Skincare requirements shift dramatically with different biochemical stages.',
    options: [
      { value: 'Under 25', label: 'Under 25', desc: 'Focus on balance, deep cleansing, and absolute protection.' },
      { value: '25-40', label: '25 to 40', desc: 'Focus on first fine lines, collagen protection, and cellular turnover.' },
      { value: 'Over 40', label: 'Over 40', desc: 'Focus on lipid replenishment, structural firming, and deep repair.' }
    ]
  },
  {
    key: 'budget',
    title: 'Skincare routine budget priority',
    description: 'Helps us tailor our recommendations to focus on essential steps first.',
    options: [
      { value: 'Essentials', label: 'Essentials Only', desc: 'Primary core steps: Cleanse, Treat, Hydrate (3-Step).' },
      { value: 'Full Routine', label: 'Full Clinical Experience', desc: 'Comprehensive system: Includes specialized masks, exfoliants, and boosters.' }
    ]
  }
];

export default function SkinQuiz({ products, onAddToCart, setCurrentView, setSelectedProductId }: SkinQuizProps) {
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    skinType: '',
    concern: '',
    sensitivity: '',
    ageGroup: '',
    budget: ''
  });
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<QuizRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addedRoutine, setAddedRoutine] = useState(false);

  const handleSelectOption = (value: string) => {
    const currentStepKey = quizSteps[stepIdx].key as keyof QuizAnswers;
    setAnswers(prev => ({ ...prev, [currentStepKey]: value }));
  };

  const handleNext = () => {
    if (stepIdx < quizSteps.length - 1) {
      setStepIdx(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (stepIdx > 0) {
      setStepIdx(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers)
      });
      if (!res.ok) throw new Error('Dermatology engine failed to process answers.');
      const data = await res.json();
      setRecommendation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAllToCart = () => {
    if (!recommendation) return;
    recommendation.routine.forEach(step => {
      const p = products.find(prod => prod.id === step.productId);
      if (p && p.stock > 0) {
        onAddToCart(p, 1);
      }
    });
    setAddedRoutine(true);
    setTimeout(() => setAddedRoutine(false), 3000);
  };

  const resetQuiz = () => {
    setStepIdx(0);
    setAnswers({
      skinType: '',
      concern: '',
      sensitivity: '',
      ageGroup: '',
      budget: ''
    });
    setRecommendation(null);
    setError(null);
  };

  const currentStep = quizSteps[stepIdx];
  const currentAnswer = answers[currentStep.key as keyof QuizAnswers];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Title & Description */}
      {!recommendation && !loading && (
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold text-[#0082C8] bg-[#EEF5F9] border border-[#D1E5F2] uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI Diagnostics
          </span>
          <h1 className="text-3xl font-extrabold text-[#002D62]">Interactive Clinical Skin Quiz</h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto mt-2">
            Formulate a customized daily skincare routine in under 2 minutes. Our Dermatology system maps your skin parameters directly to proven active ingredients.
          </p>
        </div>
      )}

      {/* QUIZ FORM */}
      {!recommendation && !loading && (
        <div className="bg-white border border-[#E2EBF1] rounded-3xl shadow-xs overflow-hidden">
          {/* Progress bar */}
          <div className="w-full bg-[#EEF5F9] h-2">
            <div
              className="bg-[#0082C8] h-full transition-all duration-300"
              style={{ width: `${((stepIdx + 1) / quizSteps.length) * 100}%` }}
            />
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              <span>Step {stepIdx + 1} of {quizSteps.length}</span>
              <span>{Math.round(((stepIdx + 1) / quizSteps.length) * 100)}% Complete</span>
            </div>

            <h2 className="text-xl font-extrabold text-[#002D62] mb-1">{currentStep.title}</h2>
            <p className="text-gray-500 text-xs mb-6">{currentStep.description}</p>

            {/* Options grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentStep.options.map(option => {
                const isSelected = currentAnswer === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelectOption(option.value)}
                    className={`text-left p-4 rounded-2xl border transition-all duration-200 focus:outline-hidden cursor-pointer ${
                      isSelected
                        ? 'border-[#0082C8] bg-[#EEF5F9] shadow-xs ring-2 ring-[#0082C8]/20'
                        : 'border-[#E2EBF1] hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`text-sm font-bold ${isSelected ? 'text-[#002D62]' : 'text-[#002D62]'}`}>
                          {option.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{option.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isSelected ? 'border-[#0082C8] bg-[#0082C8]' : 'border-gray-300'
                      }`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation footer */}
          <div className="bg-[#F4F8FA] px-6 py-4 border-t border-[#E2EBF1] flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={stepIdx === 0}
              className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full transition-colors cursor-pointer ${
                stepIdx === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:text-[#002D62] hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
            
            <button
              onClick={handleNext}
              disabled={!currentAnswer}
              className={`flex items-center gap-1.5 text-xs font-bold text-white px-6 py-2.5 rounded-full shadow-xs transition-all cursor-pointer ${
                currentAnswer
                  ? 'bg-[#002D62] hover:bg-[#0082C8] hover:shadow-md'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {stepIdx === quizSteps.length - 1 ? 'Formulate Routine' : 'Next Step'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* LOADING SCREEN */}
      {loading && (
        <div className="bg-white border border-[#E2EBF1] rounded-3xl p-8 text-center shadow-xs">
          <div className="flex flex-col items-center py-12">
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-gray-100 border-t-[#0082C8] animate-spin" />
              <div className="absolute inset-2.5 bg-[#EEF5F9] rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#0082C8]" />
              </div>
            </div>
            
            <h3 className="text-lg font-extrabold text-[#002D62] mb-2">Analyzing Skin Scaffold...</h3>
            
            <div className="max-w-sm text-xs text-gray-500 space-y-1">
              <p>• Extracting physiological characteristics...</p>
              <p>• Matching dermal lipid requirements...</p>
              <p>• Verifying biochemical compatibility of active serums...</p>
            </div>
          </div>
        </div>
      )}

      {/* ERROR PANEL */}
      {error && (
        <div className="bg-white border border-[#E2EBF1] rounded-3xl p-6 shadow-xs text-center">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-[#002D62] mb-2">Clinical Diagnostics Delayed</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">{error}</p>
          <button
            onClick={resetQuiz}
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#002D62] text-white px-5 py-2.5 rounded-full cursor-pointer hover:bg-[#0082C8] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Skin Analysis
          </button>
        </div>
      )}

      {/* RESULTS DISPLAY */}
      {recommendation && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Header Area */}
          <div className="bg-white border border-[#E2EBF1] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold text-white bg-[#43B02A]">
                Diagnostics Ready
              </span>
              <h2 className="text-2xl font-extrabold text-[#002D62]">Your Tailored Skincare Regimen</h2>
              <p className="text-xs text-gray-500">
                Biological Matrix: {answers.skinType} Skin • Concern: {answers.concern} • Sensitivity: {answers.sensitivity}
              </p>
            </div>
            
            <div className="flex gap-3 flex-shrink-0 w-full md:w-auto">
              <button
                onClick={resetQuiz}
                className="flex-1 md:flex-initial text-center text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 px-4 py-2.5 rounded-full border border-gray-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Retake Quiz
              </button>
              <button
                onClick={handleAddAllToCart}
                disabled={addedRoutine}
                className={`flex-1 md:flex-initial text-center text-xs font-bold text-white px-6 py-2.5 rounded-full shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  addedRoutine
                    ? 'bg-[#43B02A]'
                    : 'bg-[#002D62] hover:bg-[#0082C8] hover:shadow-md'
                }`}
              >
                {addedRoutine ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    Routine Added!
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Full Routine to Cart
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Steps Column */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-base font-extrabold text-[#002D62] border-b border-[#E2EBF1] pb-2">Clinical Protocol Steps</h3>
              
              {recommendation.routine.map(step => {
                const matchedProduct = products.find(p => p.id === step.productId);
                return (
                  <div key={step.step} className="bg-white border border-[#E2EBF1] rounded-2xl p-5 flex gap-4 hover:shadow-xs transition-shadow relative overflow-hidden">
                    
                    {/* Step number badge */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#EEF5F9] text-[#002D62] font-black text-sm flex items-center justify-center border border-[#D1E5F2]">
                      {step.step}
                    </div>

                    <div className="flex-grow space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="text-[9px] font-bold text-[#0082C8] uppercase bg-[#EEF5F9] px-2.5 py-0.5 rounded-full tracking-wide mr-2 border border-[#D1E5F2]">
                            {step.type}
                          </span>
                          <span className="text-xs text-gray-400">Step Formulation</span>
                        </div>
                        {matchedProduct && (
                          <span className="text-xs font-black text-[#002D62]">Rs. {matchedProduct.price.toLocaleString()}</span>
                        )}
                      </div>

                      <h4 className="text-sm font-extrabold text-[#002D62]">
                        {matchedProduct ? (
                          <button
                            onClick={() => {
                              setSelectedProductId(matchedProduct.id);
                              setCurrentView('pdp');
                            }}
                            className="hover:text-[#0082C8] text-left transition-colors cursor-pointer"
                          >
                            {matchedProduct.name}
                          </button>
                        ) : (
                          step.productName
                        )}
                      </h4>

                      <p className="text-xs text-gray-500 leading-relaxed bg-[#F4F8FA] p-3 rounded-xl border border-[#E2EBF1]">
                        <span className="font-semibold text-gray-700">Dermatologist instructions:</span> {step.instructions}
                      </p>

                      {matchedProduct && (
                        <div className="pt-2 flex justify-between items-center gap-4">
                          <button
                            onClick={() => {
                              setSelectedProductId(matchedProduct.id);
                              setCurrentView('pdp');
                            }}
                            className="text-[10px] font-extrabold text-[#0082C8] hover:underline cursor-pointer"
                          >
                            View Ingredients &amp; Benefits
                          </button>
                          
                          {matchedProduct.stock === 0 ? (
                            <span className="text-[10px] text-red-500 font-bold uppercase">Out of Stock</span>
                          ) : (
                            <button
                              onClick={() => {
                                onAddToCart(matchedProduct, 1);
                                const btn = document.getElementById(`add-btn-${step.step}`);
                                if (btn) {
                                  btn.innerText = "Added ✓";
                                  setTimeout(() => { if (btn) btn.innerText = "Add Item"; }, 2000);
                                }
                              }}
                              id={`add-btn-${step.step}`}
                              className="text-[10px] font-extrabold text-[#002D62] hover:text-[#0082C8] transition-colors flex items-center gap-0.5 cursor-pointer uppercase tracking-wider"
                            >
                              Add Item
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Analysis & Tips Column */}
            <div className="space-y-6">
              
              {/* Biochemical Explanation */}
              <div className="bg-white border border-[#E2EBF1] rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-extrabold text-[#002D62] border-b border-[#E2EBF1] pb-2">Biochemical Report</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {recommendation.explanation}
                </p>
              </div>

              {/* Clinical Guidelines Tips */}
              <div className="bg-[#EEF5F9]/50 border border-[#D1E5F2] rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-extrabold text-[#002D62] flex items-center gap-1.5">
                  <Sparkles className="w-4.5 h-4.5 text-[#0082C8]" />
                  Clinical Guidelines
                </h3>
                <ul className="space-y-3">
                  {recommendation.tips.map((tip, idx) => (
                    <li key={idx} className="text-xs text-gray-600 leading-relaxed flex items-start gap-2">
                      <span className="text-[#0082C8] font-bold mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
