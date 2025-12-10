import { useState, useEffect } from 'react';
import { Home, User, Bell, Plus, ChevronRight, Calendar, DollarSign, TrendingUp, TrendingDown, Check, X, Share2, Lock, Globe, Play, Clock, MapPin, Plane, Hotel, Activity, Sparkles, Loader2 } from 'lucide-react';

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
  .animate-slideUp {
    animation: slideUp 0.3s ease-out;
  }
`;
document.head.appendChild(style);

// Types
type Plan = {
  id: string;
  title: string;
  destination: string;
  duration: string;
  basePrice: number;
  imageUrl: string;
  description: string;
  steps: Step[];
  creatorId?: string;
  visibility?: 'public' | 'private' | 'link-only';
  rating?: number;
  reviewCount?: number;
  cloneCount?: number;
  version?: number;
};

type Step = {
  id: string;
  type: 'flight' | 'hotel' | 'activity';
  title: string;
  description: string;
  basePrice: number;
  currentPrice?: number;
  dependsOn?: string[];
  conditionalLogic?: string;
  metadata?: {
    confirmationCode?: string;
    documentUrl?: string;
    externalLink?: string;
  };
};

type UserPreferences = {
  startDate: string;
  endDate: string;
  budget: number;
};

type Screen = 'home' | 'detail' | 'preferences' | 'simulation' | 'execute' | 'success' | 'profile' | 'notifications' | 'create-plan' | 'plan-settings' | 'integrations' | 'welcome' | 'signin' | 'signup' | 'onboarding';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  preferences?: {
    budgetRange: string;
    travelStyle: string[];
    interests: string[];
    preferredDestinations: string[];
    travelFrequency: string;
    notifications: boolean;
  };
  hasCompletedOnboarding: boolean;
};

// Plan image component for consistent rendering
const PlanImage = ({ plan, className = "" }: { plan: Plan, className?: string }) => {
  const gradients: { [key: string]: string } = {
    '1': 'from-pink-500 via-red-500 to-yellow-500', // Tokyo
    '2': 'from-blue-600 via-purple-600 to-pink-500', // Paris
    '3': 'from-green-400 via-teal-500 to-blue-500', // Bali
    '4': 'from-cyan-500 via-blue-600 to-indigo-700', // Iceland
    '5': 'from-orange-500 via-red-500 to-pink-600', // Barcelona
  };

  const emoji: { [key: string]: string } = {
    '1': '🗼', // Tokyo
    '2': '🗼', // Paris
    '3': '🏝️', // Bali
    '4': '🏔️', // Iceland
    '5': '🏛️', // Barcelona
  };

  return (
    <div className={`bg-gradient-to-br ${gradients[plan.id] || 'from-blue-500 to-purple-600'} flex items-center justify-center ${className}`}>
      <div className="text-white text-center">
        <div className="text-6xl mb-2">{emoji[plan.id] || '✈️'}</div>
        <div className="text-sm font-semibold opacity-90">{plan.destination}</div>
      </div>
    </div>
  );
};

// Mock Data
const mockPlans: Plan[] = [
  {
    id: '1',
    title: 'Tokyo Essentials',
    destination: 'Tokyo, Japan',
    duration: '5 days',
    basePrice: 1850,
    imageUrl: '', // Using gradient backgrounds instead
    description: 'Experience the perfect blend of traditional and modern Tokyo with curated stays and seamless travel.',
    rating: 4.8,
    reviewCount: 234,
    cloneCount: 1200,
    version: 3,
    visibility: 'public',
    steps: [
      { id: 'f1', type: 'flight', title: 'Round-trip Flight', description: 'SFO → NRT (Economy)', basePrice: 850, metadata: { confirmationCode: 'ANA7J8K9' } },
      { id: 'h1', type: 'hotel', title: 'Hotel Stay', description: 'Shibuya District • 4 nights', basePrice: 1000, dependsOn: ['f1'], metadata: { confirmationCode: 'HTL234567' } },
    ],
  },
  {
    id: '2',
    title: 'Paris Romance',
    destination: 'Paris, France',
    duration: '6 days',
    basePrice: 2200,
    imageUrl: '',
    description: 'Classic Parisian experience with central accommodation and direct flights.',
    rating: 4.9,
    reviewCount: 456,
    cloneCount: 2100,
    version: 2,
    visibility: 'public',
    steps: [
      { id: 'f2', type: 'flight', title: 'Round-trip Flight', description: 'JFK → CDG (Economy)', basePrice: 950 },
      { id: 'h2', type: 'hotel', title: 'Hotel Stay', description: 'Le Marais • 5 nights', basePrice: 1250, dependsOn: ['f2'] },
    ],
  },
  {
    id: '3',
    title: 'Bali Retreat',
    destination: 'Bali, Indonesia',
    duration: '7 days',
    basePrice: 1650,
    imageUrl: '',
    description: 'Relax in tropical paradise with beachfront stays and easy connections.',
    rating: 4.7,
    reviewCount: 189,
    cloneCount: 850,
    version: 1,
    visibility: 'public',
    steps: [
      { id: 'f3', type: 'flight', title: 'Round-trip Flight', description: 'LAX → DPS (Economy)', basePrice: 750 },
      { id: 'h3', type: 'hotel', title: 'Hotel Stay', description: 'Seminyak Beach • 6 nights', basePrice: 900, dependsOn: ['f3'] },
    ],
  },
  {
    id: '4',
    title: 'Iceland Adventure',
    destination: 'Reykjavik, Iceland',
    duration: '5 days',
    basePrice: 1950,
    imageUrl: '',
    description: 'Discover the land of fire and ice with convenient travel and downtown lodging.',
    rating: 4.6,
    reviewCount: 321,
    cloneCount: 1500,
    version: 2,
    visibility: 'public',
    steps: [
      { id: 'f4', type: 'flight', title: 'Round-trip Flight', description: 'BOS → KEF (Economy)', basePrice: 850 },
      { id: 'h4', type: 'hotel', title: 'Hotel Stay', description: 'Central Reykjavik • 4 nights', basePrice: 1100, dependsOn: ['f4'] },
    ],
  },
  {
    id: '5',
    title: 'Barcelona Culture',
    destination: 'Barcelona, Spain',
    duration: '6 days',
    basePrice: 1800,
    imageUrl: '',
    description: 'Explore Gaudí masterpieces and Mediterranean vibes with prime location stays.',
    rating: 4.5,
    reviewCount: 567,
    cloneCount: 1800,
    version: 1,
    visibility: 'public',
    steps: [
      { id: 'f5', type: 'flight', title: 'Round-trip Flight', description: 'MIA → BCN (Economy)', basePrice: 800 },
      { id: 'h5', type: 'hotel', title: 'Hotel Stay', description: 'Gothic Quarter • 5 nights', basePrice: 1000, dependsOn: ['f5'] },
    ],
  },
];

// Service Worker Registration
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('SW registered:', reg))
        .catch(err => console.log('SW registration failed:', err));
    });
  }
};

// Main App Component
export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [userPlans, setUserPlans] = useState<Plan[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    registerServiceWorker();

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const navigateTo = (newScreen: Screen, plan?: Plan) => {
    setScreen(newScreen);
    if (plan) setSelectedPlan(plan);
  };

  const handlePlanCreated = (newPlan: Plan) => {
    setUserPlans(prev => [newPlan, ...prev]);
    navigateTo('home');
  };

  const handleSignUp = (email: string, name: string, password: string) => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      name,
      hasCompletedOnboarding: false,
    };
    setCurrentUser(newUser);
    navigateTo('onboarding');
  };

  const handleSignIn = (email: string, password: string) => {
    // Simulated sign in
    const user: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      name: email.split('@')[0],
      hasCompletedOnboarding: true,
      preferences: {
        budgetRange: '$1000-$3000',
        travelStyle: ['Adventure', 'Cultural'],
        interests: ['Food', 'History'],
        preferredDestinations: ['Asia', 'Europe'],
        travelFrequency: 'Monthly',
        notifications: true,
      }
    };
    setCurrentUser(user);
    navigateTo('home');
  };

  const handleOnboardingComplete = (preferences: any) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        preferences,
        hasCompletedOnboarding: true,
      };
      setCurrentUser(updatedUser);
      navigateTo('home');
    }
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    navigateTo('welcome');
  };

  const allPlans = [...userPlans, ...mockPlans];

  // Show auth screens if not logged in
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {screen === 'welcome' && (
          <WelcomeScreen 
            onSignIn={() => navigateTo('signin')}
            onSignUp={() => navigateTo('signup')}
          />
        )}
        
        {screen === 'signin' && (
          <SignInScreen 
            onBack={() => navigateTo('welcome')}
            onSignIn={handleSignIn}
            onSwitchToSignUp={() => navigateTo('signup')}
          />
        )}
        
        {screen === 'signup' && (
          <SignUpScreen 
            onBack={() => navigateTo('welcome')}
            onSignUp={handleSignUp}
            onSwitchToSignIn={() => navigateTo('signin')}
          />
        )}
      </div>
    );
  }

  // Show onboarding if not completed
  if (!currentUser.hasCompletedOnboarding) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <OnboardingFlow onComplete={handleOnboardingComplete} user={currentUser} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {screen === 'home' && (
        <HomeScreen 
          plans={allPlans}
          userPlans={userPlans}
          user={currentUser}
          onPlanSelect={(plan) => navigateTo('detail', plan)}
          onCreateClick={() => navigateTo('create-plan')}
          isInstallable={isInstallable}
          onInstall={handleInstallClick}
        />
      )}
      
      {screen === 'detail' && selectedPlan && (
        <PlanDetailScreen 
          plan={selectedPlan}
          onBack={() => navigateTo('home')}
          onClone={() => navigateTo('preferences')}
        />
      )}
      
      {screen === 'preferences' && selectedPlan && (
        <PreferenceInputScreen
          plan={selectedPlan}
          onBack={() => navigateTo('detail', selectedPlan)}
          onContinue={(prefs) => {
            setPreferences(prefs);
            navigateTo('simulation');
          }}
        />
      )}
      
      {screen === 'simulation' && selectedPlan && preferences && (
        <SimulationScreen
          plan={selectedPlan}
          preferences={preferences}
          onBack={() => navigateTo('preferences')}
          onExecute={(results) => {
            setSimulationResults(results);
            navigateTo('execute');
          }}
        />
      )}
      
      {screen === 'execute' && selectedPlan && (
        <ExecutePlanScreen
          plan={selectedPlan}
          simulationResults={simulationResults}
          onBack={() => navigateTo('simulation')}
          onComplete={() => navigateTo('success')}
        />
      )}
      
      {screen === 'success' && (
        <SuccessScreen onBackHome={() => navigateTo('home')} />
      )}
      
      {screen === 'profile' && (
        <ProfileScreen 
          onBack={() => navigateTo('home')} 
          user={currentUser}
          onSignOut={handleSignOut}
        />
      )}
      
      {screen === 'notifications' && (
        <NotificationsScreen onBack={() => navigateTo('home')} />
      )}
      
      {screen === 'create-plan' && (
        <CreatePlanScreen 
          onBack={() => navigateTo('home')} 
          onPlanCreated={handlePlanCreated}
        />
      )}

      <BottomNav currentScreen={screen} onNavigate={navigateTo} />
    </div>
  );
}

// Home Screen Component
function HomeScreen({ plans, userPlans, user, onPlanSelect, onCreateClick, isInstallable, onInstall }: any) {
  return (
    <div className="pb-4">
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-8 safe-top">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Welcome back, {user.name}! 👋</h1>
            <p className="text-sm opacity-90">Ready for your next adventure?</p>
          </div>
        </div>
        
        {/* Personalized recommendations based on preferences */}
        {user.preferences && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} />
              <span className="text-sm font-semibold">Personalized for you</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {user.preferences.travelStyle?.slice(0, 2).map((style: string) => (
                <span key={style} className="bg-white/20 px-2 py-1 rounded-full">{style}</span>
              ))}
              <span className="bg-white/20 px-2 py-1 rounded-full">{user.preferences.budgetRange}</span>
            </div>
          </div>
        )}
      </header>

      {isInstallable && (
        <div className="mx-6 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="font-medium text-sm text-blue-900">Install Stepbase</p>
              <p className="text-xs text-blue-700 mt-1">Add to home screen for quick access</p>
            </div>
            <button 
              onClick={onInstall}
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
            >
              Install
            </button>
          </div>
        </div>
      )}

      {/* Your Plans Section */}
      {userPlans.length > 0 && (
        <div className="px-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Your Plans</h2>
              <p className="text-xs text-muted-foreground">Plans you've created</p>
            </div>
            <button onClick={onCreateClick} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm hover:bg-primary/90 transition-colors">
              <Plus size={16} />
              New Plan
            </button>
          </div>

          <div className="space-y-4">
            {userPlans.map((plan: Plan) => (
              <div 
                key={plan.id}
                onClick={() => onPlanSelect(plan)}
                className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl overflow-hidden shadow-sm border-2 border-purple-200 cursor-pointer hover:shadow-md transition-all"
              >
                <div className="relative h-48">
                  <PlanImage plan={plan} className="w-full h-full" />
                  <div className="absolute top-3 left-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    ✨ Your Creation
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    ${plan.basePrice}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{plan.title}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{plan.destination} • {plan.duration}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      ⭐ {plan.rating || 'New'} {plan.reviewCount ? `(${plan.reviewCount})` : ''}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {plan.visibility}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Popular Plans</h2>
            <p className="text-xs text-muted-foreground">Curated by the community</p>
          </div>
          {userPlans.length === 0 && (
            <button onClick={onCreateClick} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm hover:bg-primary/90 transition-colors">
              <Plus size={16} />
              Create Plan
            </button>
          )}
        </div>

        <div className="space-y-4">
          {mockPlans.map((plan: Plan) => (
            <div 
              key={plan.id}
              onClick={() => onPlanSelect(plan)}
              className="bg-card rounded-xl overflow-hidden shadow-sm border border-border cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="relative h-48">
                <PlanImage plan={plan} className="w-full h-full" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  ${plan.basePrice}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{plan.title}</h3>
                <p className="text-muted-foreground text-sm mb-2">{plan.destination} • {plan.duration}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    ⭐ {plan.rating} ({plan.reviewCount})
                  </span>
                  <span>{plan.cloneCount?.toLocaleString()} clones</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// AI Summary Component
function AISummary({ plan }: { plan: Plan }) {
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showSummary, setShowSummary] = useState(false);

  const generateSummary = async () => {
    setLoading(true);
    setError('');
    setShowSummary(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `Create a concise, engaging summary of this travel plan in 2-3 paragraphs. Focus on highlighting the key experiences, value proposition, and what makes this trip special:

Title: ${plan.title}
Destination: ${plan.destination}
Duration: ${plan.duration}
Price: $${plan.basePrice}
Description: ${plan.description}

Steps included:
${plan.steps.map((s, i) => `${i + 1}. ${s.title}: ${s.description} ($${s.basePrice})`).join('\n')}

Write in a friendly, enthusiastic tone that would excite potential travelers.`
            }
          ]
        })
      });

      const data = await response.json();
      
      if (data.content && data.content[0] && data.content[0].text) {
        setSummary(data.content[0].text);
      } else {
        setError('Unable to generate summary. Please try again.');
      }
    } catch (err) {
      setError('Failed to generate summary. Please check your connection.');
      console.error('AI Summary error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!showSummary) {
    return (
      <button
        onClick={generateSummary}
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-purple-600 hover:to-blue-600 transition-all"
      >
        <Sparkles size={18} />
        Get AI Summary
      </button>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-200">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={18} className="text-purple-600" />
        <h3 className="font-semibold text-purple-900">AI Summary</h3>
      </div>
      
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin text-purple-600" size={32} />
        </div>
      )}
      
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}
      
      {summary && (
        <div className="text-sm text-gray-700 leading-relaxed space-y-3">
          {summary.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      )}
      
      {summary && (
        <button
          onClick={generateSummary}
          className="mt-4 text-purple-600 text-sm font-medium flex items-center gap-1 hover:text-purple-700"
        >
          <Sparkles size={14} />
          Regenerate
        </button>
      )}
    </div>
  );
}

// Plan Detail Screen - Enhanced with better viewing
function PlanDetailScreen({ plan, onBack, onClone }: any) {
  return (
    <div className="min-h-screen pb-24">
      <div className="relative h-64">
        <PlanImage plan={plan} className="w-full h-full" />
        <button onClick={onBack} className="absolute top-6 left-6 safe-top w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <div className="absolute top-6 right-6 safe-top flex gap-2">
          <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
            <Share2 size={18} />
          </button>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{plan.title}</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <MapPin size={16} />
              {plan.destination} • {plan.duration}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">${plan.basePrice}</div>
            <div className="text-sm text-muted-foreground">base price</div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6 text-sm">
          <span className="flex items-center gap-1">
            ⭐ {plan.rating} ({plan.reviewCount} reviews)
          </span>
          <span className="text-muted-foreground">{plan.cloneCount?.toLocaleString()} clones</span>
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            {plan.visibility}
          </span>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">About This Plan</h3>
          <p className="text-muted-foreground leading-relaxed">{plan.description}</p>
        </div>

        {/* AI Summary Section */}
        <div className="mb-6">
          <AISummary plan={plan} />
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock size={20} />
            Plan Itinerary ({plan.steps.length} steps)
          </h2>
          <div className="space-y-3">
            {plan.steps.map((step: Step, idx: number) => (
              <div key={step.id} className="bg-muted/50 rounded-xl p-4 border border-border">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {step.type === 'flight' && <Plane size={16} className="text-blue-600" />}
                      {step.type === 'hotel' && <Hotel size={16} className="text-purple-600" />}
                      {step.type === 'activity' && <Activity size={16} className="text-green-600" />}
                      <h3 className="font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-blue-600">${step.basePrice}</span>
                      {step.metadata?.confirmationCode && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-muted-foreground">
                          Sample: {step.metadata.confirmationCode}
                        </span>
                      )}
                    </div>
                    {step.conditionalLogic && (
                      <div className="mt-2 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        ℹ️ {step.conditionalLogic}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-200">
          <h3 className="font-semibold mb-2 text-sm">💡 What's Included</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>✓ Complete travel itinerary</li>
            <li>✓ Price simulation & optimization</li>
            <li>✓ Automated booking coordination</li>
            <li>✓ Real-time updates & notifications</li>
          </ul>
        </div>

        <button 
          onClick={onClone}
          className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-primary/90 transition-colors"
        >
          Clone & Customize This Plan
        </button>
      </div>
    </div>
  );
}

// Preference Input Screen - Fixed date inputs
function PreferenceInputScreen({ plan, onBack, onContinue }: any) {
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState(plan.basePrice.toString());
  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    if (!budget || parseFloat(budget) <= 0) {
      newErrors.budget = 'Budget must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      onContinue({ startDate, endDate, budget: parseFloat(budget) });
    }
  };

  return (
    <div className="min-h-screen">
      <header className="bg-primary text-primary-foreground px-6 py-6 safe-top">
        <button onClick={onBack} className="mb-4 flex items-center gap-2">
          <ChevronRight size={20} className="rotate-180" />
          Back
        </button>
        <h1 className="text-2xl font-bold">Customize Your Trip</h1>
        <p className="text-sm opacity-90 mt-1">Set your travel preferences for {plan.title}</p>
      </header>

      <div className="px-6 py-6">
        <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="text-2xl">📅</div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-blue-900 mb-1">Plan Duration</h3>
              <p className="text-xs text-blue-700">This plan is designed for {plan.duration}. Adjust your dates accordingly.</p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Start Date</label>
            <input 
              type="date"
              value={startDate}
              min={today}
              onChange={(e) => {
                setStartDate(e.target.value);
                setErrors({ ...errors, startDate: null });
              }}
              className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
            {errors.startDate && (
              <p className="text-red-600 text-xs mt-1">{errors.startDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">End Date</label>
            <input 
              type="date"
              value={endDate}
              min={startDate || today}
              onChange={(e) => {
                setEndDate(e.target.value);
                setErrors({ ...errors, endDate: null });
              }}
              className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
            {errors.endDate && (
              <p className="text-red-600 text-xs mt-1">{errors.endDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Total Budget (USD)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3.5 text-muted-foreground" size={18} />
              <input 
                type="number"
                value={budget}
                min="0"
                step="50"
                onChange={(e) => {
                  setBudget(e.target.value);
                  setErrors({ ...errors, budget: null });
                }}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="Enter your budget"
              />
            </div>
            {errors.budget && (
              <p className="text-red-600 text-xs mt-1">{errors.budget}</p>
            )}
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-muted-foreground">Base price: ${plan.basePrice}</span>
              {budget && parseFloat(budget) < plan.basePrice && (
                <span className="text-orange-600 font-medium">⚠️ Below base price</span>
              )}
              {budget && parseFloat(budget) > plan.basePrice && (
                <span className="text-green-600 font-medium">✓ Above base price</span>
              )}
            </div>
          </div>
        </div>

        <button 
          onClick={handleContinue}
          className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold mt-8 hover:bg-primary/90 transition-colors shadow-lg"
        >
          Continue to Simulation
        </button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          You'll be able to review everything before booking
        </p>
      </div>
    </div>
  );
}

// Simulation Screen
function SimulationScreen({ plan, preferences, onBack, onExecute }: any) {
  const [isSimulating, setIsSimulating] = useState(true);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    setTimeout(() => {
      const priceChange = Math.random() > 0.5 ? 1 : -1;
      const changeAmount = Math.floor(Math.random() * 200) + 50;
      const simulatedPrice = plan.basePrice + (priceChange * changeAmount);

      setResults({
        originalPrice: plan.basePrice,
        simulatedPrice,
        priceChange: priceChange * changeAmount,
        savings: preferences.budget - simulatedPrice,
        confidence: Math.floor(Math.random() * 20) + 75,
      });
      setIsSimulating(false);
    }, 2500);
  }, []);

  if (isSimulating) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold mb-2">Running Simulation...</h2>
          <p className="text-muted-foreground mb-4">Analyzing prices across multiple platforms</p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              Checking flight prices
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              Comparing hotel rates
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              Optimizing booking timing
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="bg-primary text-primary-foreground px-6 py-6 safe-top">
        <button onClick={onBack} className="mb-4 flex items-center gap-2">
          <ChevronRight size={20} className="rotate-180" />
          Back
        </button>
        <h1 className="text-2xl font-bold">Simulation Complete</h1>
        <p className="text-sm opacity-90 mt-1">Here's your optimized pricing</p>
      </header>

      <div className="px-6 py-6">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-blue-200 shadow-lg">
          <div className="text-center mb-6">
            <div className="text-sm text-muted-foreground mb-2">Optimized Price</div>
            <div className="text-5xl font-bold mb-3">
              ${results.simulatedPrice}
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              results.priceChange > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {results.priceChange > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              ${Math.abs(results.priceChange)} {results.priceChange > 0 ? 'higher' : 'lower'} than base
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-xs text-muted-foreground mb-1">Base Price</div>
              <div className="text-xl font-semibold">${results.originalPrice}</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-xs text-muted-foreground mb-1">Your Budget</div>
              <div className="text-xl font-semibold">${preferences.budget}</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 mb-6 shadow-sm">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Play size={18} className="text-primary" />
            Analysis Details
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Confidence Score</span>
                <span className="font-semibold text-lg">{results.confidence}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${results.confidence}%` }}
                ></div>
              </div>
            </div>
            
            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Budget Status</span>
                <span className={`font-semibold text-lg ${results.savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {results.savings >= 0 ? `$${results.savings} under budget` : `$${Math.abs(results.savings)} over budget`}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-border">
              <div className="text-xs text-muted-foreground mb-2">Travel Dates</div>
              <div className="text-sm font-medium">
                {new Date(preferences.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} 
                {' → '}
                {new Date(preferences.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <div className="text-xl">⚡</div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-yellow-900 mb-1">Best Time to Book</h4>
              <p className="text-xs text-yellow-700">
                Based on our analysis, booking now gives you a {results.confidence}% chance of getting the best prices. 
                Prices may change within the next 24-48 hours.
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => onExecute(results)}
          className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg text-lg"
        >
          Proceed to Booking
        </button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          No payment required at this step
        </p>
      </div>
    </div>
  );
}

// Execute Plan Screen
function ExecutePlanScreen({ plan, simulationResults, onBack, onComplete }: any) {
  const [executing, setExecuting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const executeStep = async (stepId: string) => {
    setExecuting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setCompletedSteps(prev => [...prev, stepId]);
    setExecuting(false);
    
    if (currentStep < plan.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setTimeout(() => onComplete(), 500);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <header className="bg-primary text-primary-foreground px-6 py-6 safe-top">
        <button onClick={onBack} className="mb-4 flex items-center gap-2">
          <ChevronRight size={20} className="rotate-180" />
          Back
        </button>
        <h1 className="text-2xl font-bold">Execute Plan</h1>
        <p className="text-sm opacity-90 mt-1">Booking your travel components</p>
      </header>

      <div className="px-6 py-6">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-5 mb-6 border-2 border-green-200 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Final Price</div>
              <div className="text-3xl font-bold">${simulationResults.simulatedPrice}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1">Progress</div>
              <div className="text-3xl font-bold">{completedSteps.length}/{plan.steps.length}</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(completedSteps.length / plan.steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-4">
          {plan.steps.map((step: Step, idx: number) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = idx === currentStep;
            const isPending = idx > currentStep;

            return (
              <div 
                key={step.id}
                className={`border-2 rounded-xl p-5 transition-all ${
                  isCompleted ? 'border-green-500 bg-green-50' :
                  isCurrent ? 'border-primary bg-blue-50 shadow-md' :
                  'border-border bg-card opacity-60'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold ${
                    isCompleted ? 'bg-green-500' :
                    isCurrent ? 'bg-primary' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {isCompleted ? <Check size={20} /> : idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {step.type === 'flight' && <Plane size={18} className="text-blue-600" />}
                      {step.type === 'hotel' && <Hotel size={18} className="text-purple-600" />}
                      {step.type === 'activity' && <Activity size={18} className="text-green-600" />}
                      <h3 className="font-semibold text-lg">{step.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-blue-600">${step.basePrice}</span>
                      {isCompleted && (
                        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                          ✓ Booked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {isCurrent && !isCompleted && (
                  <button
                    onClick={() => executeStep(step.id)}
                    disabled={executing}
                    className="w-full mt-4 bg-primary text-primary-foreground py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    {executing ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Booking...
                      </>
                    ) : (
                      <>
                        <Check size={18} />
                        Book This Step
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {completedSteps.length === plan.steps.length && (
          <div className="mt-6 bg-green-50 border-2 border-green-500 rounded-xl p-5 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check size={32} className="text-white" />
            </div>
            <h3 className="font-bold text-lg mb-1">All Steps Complete!</h3>
            <p className="text-sm text-muted-foreground">Finalizing your bookings...</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Success Screen
function SuccessScreen({ onBackHome }: any) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Check size={48} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Plan Executed Successfully!</h1>
        <p className="text-muted-foreground mb-3">
          Your travel components have been booked successfully.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Check your email for confirmation details and booking references.
        </p>
        
        <div className="bg-blue-50 rounded-xl p-4 mb-8 border border-blue-200">
          <h3 className="font-semibold text-sm text-blue-900 mb-2">📧 What's Next?</h3>
          <ul className="text-xs text-blue-700 space-y-1 text-left">
            <li>• Confirmation emails sent to your inbox</li>
            <li>• Calendar invites for your travel dates</li>
            <li>• Reminders before your departure</li>
          </ul>
        </div>

        <button 
          onClick={onBackHome}
          className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

// Profile Screen
function ProfileScreen({ onBack, user, onSignOut }: any) {
  return (
    <div className="min-h-screen pb-24">
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-6 safe-top">
        <button onClick={onBack} className="mb-4 flex items-center gap-2">
          <ChevronRight size={20} className="rotate-180" />
          Back
        </button>
        <h1 className="text-2xl font-bold">Profile</h1>
      </header>
      <div className="px-6 py-6">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>

        {user.preferences && (
          <div className="mb-6 space-y-4">
            <h3 className="font-semibold text-lg">Your Preferences</h3>
            
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-sm text-muted-foreground mb-2">Travel Style</div>
              <div className="flex flex-wrap gap-2">
                {user.preferences.travelStyle?.map((style: string) => (
                  <span key={style} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                    {style}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-sm text-muted-foreground mb-2">Budget Range</div>
              <div className="text-lg font-semibold">{user.preferences.budgetRange}</div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-sm text-muted-foreground mb-2">Interests</div>
              <div className="flex flex-wrap gap-2">
                {user.preferences.interests?.map((interest: string) => (
                  <span key={interest} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-sm text-muted-foreground mb-2">Travel Frequency</div>
              <div className="text-lg font-semibold">{user.preferences.travelFrequency}</div>
            </div>
          </div>
        )}

        <div className="space-y-3 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Plans Created</div>
            <div className="text-2xl font-bold">3</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Plans Cloned</div>
            <div className="text-2xl font-bold">12</div>
          </div>
        </div>

        <button 
          onClick={onSignOut}
          className="w-full bg-red-50 text-red-600 border-2 border-red-200 py-3 rounded-xl font-semibold hover:bg-red-100 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

// Notifications Screen
function NotificationsScreen({ onBack }: any) {
  return (
    <div className="min-h-screen pb-24">
      <header className="bg-primary text-primary-foreground px-6 py-6 safe-top">
        <button onClick={onBack} className="mb-4 flex items-center gap-2">
          <ChevronRight size={20} className="rotate-180" />
          Back
        </button>
        <h1 className="text-2xl font-bold">Notifications</h1>
      </header>
      <div className="px-6 py-6">
        <div className="text-center py-12 text-muted-foreground">
          <Bell size={48} className="mx-auto mb-4 opacity-50" />
          <p>No new notifications</p>
        </div>
      </div>
    </div>
  );
}

// Create Plan Screen - Complete Multi-Step Wizard
function CreatePlanScreen({ onBack, onPlanCreated }: any) {
  const [currentStep, setCurrentStep] = useState(1);
  const [planData, setPlanData] = useState({
    title: '',
    destination: '',
    duration: '',
    description: '',
    visibility: 'public' as 'public' | 'private' | 'link-only',
    gradientId: '1',
  });
  const [steps, setSteps] = useState<Step[]>([]);
  const [editingStep, setEditingStep] = useState<Step | null>(null);
  const [showStepModal, setShowStepModal] = useState(false);

  const totalSteps = 3;

  // Calculate total price
  const totalPrice = steps.reduce((sum, step) => sum + step.basePrice, 0);

  const handleBasicInfoSubmit = () => {
    if (planData.title && planData.destination && planData.duration && planData.description) {
      setCurrentStep(2);
    }
  };

  const handleAddStep = (step: Step) => {
    if (editingStep) {
      setSteps(steps.map(s => s.id === editingStep.id ? step : s));
    } else {
      setSteps([...steps, step]);
    }
    setEditingStep(null);
    setShowStepModal(false);
  };

  const handleDeleteStep = (stepId: string) => {
    setSteps(steps.filter(s => s.id !== stepId));
  };

  const handlePublish = () => {
    const newPlan: Plan = {
      id: `user-${Date.now()}`,
      title: planData.title,
      destination: planData.destination,
      duration: planData.duration,
      basePrice: totalPrice,
      imageUrl: '',
      description: planData.description,
      steps: steps,
      visibility: planData.visibility,
      creatorId: 'current-user',
      version: 1,
      rating: undefined,
      reviewCount: undefined,
      cloneCount: 0,
    };
    onPlanCreated(newPlan);
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-6 safe-top">
        <button onClick={onBack} className="mb-4 flex items-center gap-2">
          <ChevronRight size={20} className="rotate-180" />
          Cancel
        </button>
        <h1 className="text-2xl font-bold mb-2">Create Your Plan</h1>
        <p className="text-sm opacity-90">Design an amazing travel experience</p>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
      </header>

      <div className="px-6 py-6">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-200">
              <div className="flex items-start gap-3">
                <div className="text-3xl">✨</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-purple-900 mb-1">Let's Start Creating!</h3>
                  <p className="text-sm text-purple-700">Tell us about your dream destination and we'll help you build the perfect itinerary.</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Plan Title *</label>
              <input 
                type="text"
                value={planData.title}
                onChange={(e) => setPlanData({...planData, title: e.target.value})}
                placeholder="e.g., Mediterranean Adventure"
                className="w-full px-4 py-3 border-2 border-border rounded-xl bg-input-background focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Destination *</label>
              <input 
                type="text"
                value={planData.destination}
                onChange={(e) => setPlanData({...planData, destination: e.target.value})}
                placeholder="e.g., Rome, Italy"
                className="w-full px-4 py-3 border-2 border-border rounded-xl bg-input-background focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Duration *</label>
              <input 
                type="text"
                value={planData.duration}
                onChange={(e) => setPlanData({...planData, duration: e.target.value})}
                placeholder="e.g., 7 days"
                className="w-full px-4 py-3 border-2 border-border rounded-xl bg-input-background focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Description *</label>
              <textarea 
                value={planData.description}
                onChange={(e) => setPlanData({...planData, description: e.target.value})}
                placeholder="Describe what makes this plan special..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-border rounded-xl bg-input-background focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">Choose Visual Theme</label>
              <div className="grid grid-cols-3 gap-3">
                {['1', '2', '3', '4', '5'].map((id) => (
                  <button
                    key={id}
                    onClick={() => setPlanData({...planData, gradientId: id})}
                    className={`h-20 rounded-xl transition-all ${
                      planData.gradientId === id 
                        ? 'ring-4 ring-purple-500 scale-105' 
                        : 'ring-2 ring-border hover:scale-105'
                    }`}
                  >
                    <PlanImage plan={{...planData, id} as Plan} className="w-full h-full rounded-xl" />
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleBasicInfoSubmit}
              disabled={!planData.title || !planData.destination || !planData.duration || !planData.description}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
            >
              Continue to Add Steps
            </button>
          </div>
        )}

        {/* Step 2: Add Steps */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-5 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="text-3xl">🎯</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-1">Build Your Itinerary</h3>
                  <p className="text-sm text-blue-700">Add flights, hotels, and activities. Each step can have its own pricing and details.</p>
                </div>
              </div>
            </div>

            {/* Current Total */}
            <div className="bg-white border-2 border-green-200 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Price</div>
                  <div className="text-3xl font-bold text-green-600">${totalPrice}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-1">Steps Added</div>
                  <div className="text-3xl font-bold">{steps.length}</div>
                </div>
              </div>
            </div>

            {/* Steps List */}
            {steps.length > 0 && (
              <div className="space-y-3">
                {steps.map((step, idx) => (
                  <div key={step.id} className="bg-card border-2 border-border rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {step.type === 'flight' && <Plane size={16} className="text-blue-600" />}
                          {step.type === 'hotel' && <Hotel size={16} className="text-purple-600" />}
                          {step.type === 'activity' && <Activity size={16} className="text-green-600" />}
                          <h3 className="font-semibold">{step.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-blue-600">${step.basePrice}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingStep(step);
                                setShowStepModal(true);
                              }}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteStep(step.id)}
                              className="text-xs text-red-600 hover:text-red-700 font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Step Button */}
            <button
              onClick={() => {
                setEditingStep(null);
                setShowStepModal(true);
              }}
              className="w-full border-2 border-dashed border-primary rounded-xl py-4 text-primary font-semibold hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Step
            </button>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex-1 border-2 border-border rounded-xl py-3 font-semibold hover:bg-muted transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={steps.length === 0}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Publish */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-5 border border-green-200">
              <div className="flex items-start gap-3">
                <div className="text-3xl">🚀</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 mb-1">Almost There!</h3>
                  <p className="text-sm text-green-700">Review your plan and choose who can see it.</p>
                </div>
              </div>
            </div>

            {/* Plan Preview */}
            <div className="bg-card border-2 border-border rounded-xl overflow-hidden">
              <PlanImage plan={{...planData, id: planData.gradientId} as Plan} className="w-full h-48" />
              <div className="p-5">
                <h2 className="text-2xl font-bold mb-2">{planData.title}</h2>
                <p className="text-muted-foreground mb-3 flex items-center gap-2">
                  <MapPin size={16} />
                  {planData.destination} • {planData.duration}
                </p>
                <p className="text-sm text-muted-foreground mb-4">{planData.description}</p>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Price</span>
                    <span className="text-2xl font-bold text-green-600">${totalPrice}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">Total Steps</span>
                    <span className="text-lg font-semibold">{steps.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visibility Settings */}
            <div>
              <label className="block text-sm font-semibold mb-3">Plan Visibility</label>
              <div className="space-y-2">
                <button
                  onClick={() => setPlanData({...planData, visibility: 'public'})}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    planData.visibility === 'public' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-border hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Globe size={20} className="text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold mb-1">Public</div>
                      <div className="text-xs text-muted-foreground">Anyone can discover and clone your plan</div>
                    </div>
                    {planData.visibility === 'public' && <Check size={20} className="text-purple-600" />}
                  </div>
                </button>

                <button
                  onClick={() => setPlanData({...planData, visibility: 'private'})}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    planData.visibility === 'private' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-border hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Lock size={20} className="text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold mb-1">Private</div>
                      <div className="text-xs text-muted-foreground">Only you can see and use this plan</div>
                    </div>
                    {planData.visibility === 'private' && <Check size={20} className="text-purple-600" />}
                  </div>
                </button>

                <button
                  onClick={() => setPlanData({...planData, visibility: 'link-only'})}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    planData.visibility === 'link-only' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-border hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Share2 size={20} className="text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold mb-1">Link Only</div>
                      <div className="text-xs text-muted-foreground">Only people with the link can access</div>
                    </div>
                    {planData.visibility === 'link-only' && <Check size={20} className="text-purple-600" />}
                  </div>
                </button>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex-1 border-2 border-border rounded-xl py-3 font-semibold hover:bg-muted transition-colors"
              >
                Back
              </button>
              <button
                onClick={handlePublish}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Check size={20} />
                Publish Plan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Step Modal */}
      {showStepModal && (
        <StepModal
          step={editingStep}
          onSave={handleAddStep}
          onClose={() => {
            setShowStepModal(false);
            setEditingStep(null);
          }}
        />
      )}
    </div>
  );
}

// Step Modal Component
function StepModal({ step, onSave, onClose }: any) {
  const [stepData, setStepData] = useState<Step>(step || {
    id: `step-${Date.now()}`,
    type: 'flight',
    title: '',
    description: '',
    basePrice: 0,
  });

  const handleSave = () => {
    if (stepData.title && stepData.description && stepData.basePrice > 0) {
      onSave(stepData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 animate-fadeIn" onClick={onClose}>
      <div 
        className="bg-white rounded-t-3xl w-full max-w-2xl max-h-[80vh] overflow-y-auto pb-safe animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">{step ? 'Edit Step' : 'Add New Step'}</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="px-6 py-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-3">Step Type</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setStepData({...stepData, type: 'flight'})}
                className={`p-4 rounded-xl border-2 transition-all ${
                  stepData.type === 'flight' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-border hover:border-blue-300'
                }`}
              >
                <Plane size={24} className="text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-semibold">Flight</div>
              </button>
              <button
                onClick={() => setStepData({...stepData, type: 'hotel'})}
                className={`p-4 rounded-xl border-2 transition-all ${
                  stepData.type === 'hotel' 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-border hover:border-purple-300'
                }`}
              >
                <Hotel size={24} className="text-purple-600 mx-auto mb-2" />
                <div className="text-sm font-semibold">Hotel</div>
              </button>
              <button
                onClick={() => setStepData({...stepData, type: 'activity'})}
                className={`p-4 rounded-xl border-2 transition-all ${
                  stepData.type === 'activity' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-border hover:border-green-300'
                }`}
              >
                <Activity size={24} className="text-green-600 mx-auto mb-2" />
                <div className="text-sm font-semibold">Activity</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Title *</label>
            <input 
              type="text"
              value={stepData.title}
              onChange={(e) => setStepData({...stepData, title: e.target.value})}
              placeholder="e.g., Round-trip Flight"
              className="w-full px-4 py-3 border-2 border-border rounded-xl bg-input-background focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Description *</label>
            <textarea 
              value={stepData.description}
              onChange={(e) => setStepData({...stepData, description: e.target.value})}
              placeholder="e.g., JFK → CDG (Economy)"
              rows={3}
              className="w-full px-4 py-3 border-2 border-border rounded-xl bg-input-background focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Price (USD) *</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3.5 text-muted-foreground" size={18} />
              <input 
                type="number"
                value={stepData.basePrice || ''}
                onChange={(e) => setStepData({...stepData, basePrice: parseFloat(e.target.value) || 0})}
                placeholder="0"
                min="0"
                className="w-full pl-10 pr-4 py-3 border-2 border-border rounded-xl bg-input-background focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={!stepData.title || !stepData.description || stepData.basePrice <= 0}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
          >
            {step ? 'Update Step' : 'Add Step'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Welcome Screen
function WelcomeScreen({ onSignIn, onSignUp }: any) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
              ✈️
            </div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Stepbase
            </h1>
            <p className="text-muted-foreground text-lg">
              Clone, customize, and execute your perfect travel plan
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-12">
            <div className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="text-purple-600" size={24} />
              </div>
              <div className="flex-1">
                <div className="font-semibold mb-1">AI-Powered Planning</div>
                <div className="text-sm text-muted-foreground">Get smart recommendations tailored to you</div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 border border-blue-200">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
              <div className="flex-1">
                <div className="font-semibold mb-1">Price Optimization</div>
                <div className="text-sm text-muted-foreground">Find the best deals with simulations</div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 border border-green-200">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="text-green-600" size={24} />
              </div>
              <div className="flex-1">
                <div className="font-semibold mb-1">One-Click Booking</div>
                <div className="text-sm text-muted-foreground">Execute entire plans seamlessly</div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-3">
            <button
              onClick={onSignUp}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Get Started
            </button>
            <button
              onClick={onSignIn}
              className="w-full bg-white border-2 border-border py-4 rounded-xl font-semibold hover:bg-muted transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8 text-center text-xs text-muted-foreground">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </div>
    </div>
  );
}

// Sign In Screen
function SignInScreen({ onBack, onSignIn, onSwitchToSignUp }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});

  const handleSubmit = () => {
    const newErrors: any = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSignIn(email, password);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 px-6 py-8 safe-top">
        <button onClick={onBack} className="mb-8 flex items-center gap-2 text-muted-foreground">
          <ChevronRight size={20} className="rotate-180" />
          Back
        </button>

        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8">Sign in to continue your journey</p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: null });
                }}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border-2 border-border rounded-xl bg-input-background focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: null });
                }}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-border rounded-xl bg-input-background focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              />
              {errors.password && (
                <p className="text-red-600 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Sign In
            </button>

            <div className="text-center">
              <button
                onClick={onSwitchToSignUp}
                className="text-purple-600 font-medium hover:text-purple-700"
              >
                Don't have an account? Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sign Up Screen
function SignUpScreen({ onBack, onSignUp, onSwitchToSignIn }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});

  const handleSubmit = () => {
    const newErrors: any = {};
    
    if (!name) {
      newErrors.name = 'Name is required';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSignUp(email, name, password);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 px-6 py-8 safe-top">
        <button onClick={onBack} className="mb-8 flex items-center gap-2 text-muted-foreground">
          <ChevronRight size={20} className="rotate-180" />
          Back
        </button>

        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-muted-foreground mb-8">Start planning your dream trips today</p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2">Full Name</label>
              <input 
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors({ ...errors, name: null });
                }}
                placeholder="John Doe"
                className="w-full px-4 py-3 border-2 border-border rounded-xl bg-input-background focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              />
              {errors.name && (
                <p className="text-red-600 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: null });
                }}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border-2 border-border rounded-xl bg-input-background focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: null });
                }}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-border rounded-xl bg-input-background focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              />
              {errors.password && (
                <p className="text-red-600 text-xs mt-1">{errors.password}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">Must be at least 6 characters</p>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Create Account
            </button>

            <div className="text-center">
              <button
                onClick={onSwitchToSignIn}
                className="text-purple-600 font-medium hover:text-purple-700"
              >
                Already have an account? Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Onboarding Flow
function OnboardingFlow({ onComplete, user }: any) {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    budgetRange: '',
    travelStyle: [] as string[],
    interests: [] as string[],
    preferredDestinations: [] as string[],
    travelFrequency: '',
    notifications: true,
  });

  const totalSteps = 5;

  const budgetOptions = ['$500-$1000', '$1000-$3000', '$3000-$5000', '$5000+', 'Flexible'];
  const travelStyles = ['Adventure', 'Relaxation', 'Cultural', 'Luxury', 'Budget', 'Family'];
  const interestOptions = ['Food', 'History', 'Nature', 'Shopping', 'Nightlife', 'Art', 'Sports', 'Beach'];
  const destinationOptions = ['Asia', 'Europe', 'Americas', 'Africa', 'Oceania', 'Middle East'];
  const frequencyOptions = ['Rarely', 'Once a year', 'Few times a year', 'Monthly', 'Weekly'];

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    }
    return [...array, item];
  };

  const canProceed = () => {
    switch (step) {
      case 1: return preferences.budgetRange !== '';
      case 2: return preferences.travelStyle.length > 0;
      case 3: return preferences.interests.length > 0;
      case 4: return preferences.preferredDestinations.length > 0;
      case 5: return preferences.travelFrequency !== '';
      default: return false;
    }
  };

  const handleComplete = () => {
    onComplete(preferences);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-6 safe-top">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Let's personalize your experience</h1>
          <button 
            onClick={() => onComplete(preferences)}
            className="text-sm opacity-75 hover:opacity-100"
          >
            Skip
          </button>
        </div>
        
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
      </header>

      <div className="flex-1 px-6 py-8 overflow-y-auto">
        {/* Step 1: Budget Range */}
        {step === 1 && (
          <div className="max-w-md mx-auto animate-fadeIn">
            <div className="text-4xl mb-4">💰</div>
            <h2 className="text-2xl font-bold mb-2">What's your typical travel budget?</h2>
            <p className="text-muted-foreground mb-8">This helps us suggest plans within your price range</p>

            <div className="space-y-3">
              {budgetOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setPreferences({ ...preferences, budgetRange: option })}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    preferences.budgetRange === option
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-border hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{option}</span>
                    {preferences.budgetRange === option && <Check className="text-purple-600" size={20} />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Travel Style */}
        {step === 2 && (
          <div className="max-w-md mx-auto animate-fadeIn">
            <div className="text-4xl mb-4">✨</div>
            <h2 className="text-2xl font-bold mb-2">What's your travel style?</h2>
            <p className="text-muted-foreground mb-8">Select all that apply</p>

            <div className="grid grid-cols-2 gap-3">
              {travelStyles.map((style) => (
                <button
                  key={style}
                  onClick={() => setPreferences({ 
                    ...preferences, 
                    travelStyle: toggleArrayItem(preferences.travelStyle, style)
                  })}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    preferences.travelStyle.includes(style)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-border hover:border-purple-300'
                  }`}
                >
                  <div className="font-semibold mb-1">{style}</div>
                  {preferences.travelStyle.includes(style) && (
                    <Check className="text-purple-600 mx-auto" size={16} />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Interests */}
        {step === 3 && (
          <div className="max-w-md mx-auto animate-fadeIn">
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold mb-2">What interests you?</h2>
            <p className="text-muted-foreground mb-8">Choose your favorite activities</p>

            <div className="grid grid-cols-2 gap-3">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  onClick={() => setPreferences({ 
                    ...preferences, 
                    interests: toggleArrayItem(preferences.interests, interest)
                  })}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    preferences.interests.includes(interest)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-border hover:border-blue-300'
                  }`}
                >
                  <div className="font-semibold mb-1">{interest}</div>
                  {preferences.interests.includes(interest) && (
                    <Check className="text-blue-600 mx-auto" size={16} />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Preferred Destinations */}
        {step === 4 && (
          <div className="max-w-md mx-auto animate-fadeIn">
            <div className="text-4xl mb-4">🌍</div>
            <h2 className="text-2xl font-bold mb-2">Where do you love to explore?</h2>
            <p className="text-muted-foreground mb-8">Select your preferred regions</p>

            <div className="space-y-3">
              {destinationOptions.map((destination) => (
                <button
                  key={destination}
                  onClick={() => setPreferences({ 
                    ...preferences, 
                    preferredDestinations: toggleArrayItem(preferences.preferredDestinations, destination)
                  })}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    preferences.preferredDestinations.includes(destination)
                      ? 'border-green-500 bg-green-50'
                      : 'border-border hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{destination}</span>
                    {preferences.preferredDestinations.includes(destination) && (
                      <Check className="text-green-600" size={20} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Travel Frequency */}
        {step === 5 && (
          <div className="max-w-md mx-auto animate-fadeIn">
            <div className="text-4xl mb-4">📅</div>
            <h2 className="text-2xl font-bold mb-2">How often do you travel?</h2>
            <p className="text-muted-foreground mb-8">This helps us understand your needs</p>

            <div className="space-y-3 mb-8">
              {frequencyOptions.map((frequency) => (
                <button
                  key={frequency}
                  onClick={() => setPreferences({ ...preferences, travelFrequency: frequency })}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    preferences.travelFrequency === frequency
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-border hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{frequency}</span>
                    {preferences.travelFrequency === frequency && <Check className="text-purple-600" size={20} />}
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-200">
              <div className="flex items-start gap-3">
                <Bell className="text-blue-600 mt-0.5" size={20} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Enable notifications</span>
                    <button
                      onClick={() => setPreferences({ ...preferences, notifications: !preferences.notifications })}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        preferences.notifications ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}></div>
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Get alerts about price drops and travel deals
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="px-6 pb-8 safe-bottom">
        <div className="flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 border-2 border-border rounded-xl py-3 font-semibold hover:bg-muted transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={() => {
              if (step < totalSteps) {
                setStep(step + 1);
              } else {
                handleComplete();
              }
            }}
            disabled={!canProceed()}
            className={`font-semibold rounded-xl py-3 transition-all shadow-lg ${
              step > 1 ? 'flex-1' : 'w-full'
            } ${
              canProceed()
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            {step < totalSteps ? 'Continue' : 'Complete Setup'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Bottom Navigation
function BottomNav({ currentScreen, onNavigate }: any) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'create-plan', icon: Plus, label: 'Create' },
    { id: 'notifications', icon: Bell, label: 'Alerts' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border pb-safe z-50 shadow-lg">
      <div className="flex items-center justify-around px-4 py-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentScreen === item.id ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <item.icon size={24} />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}