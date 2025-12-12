import React, { useState } from 'react';
import { Shield, Eye, EyeOff, ExternalLink, CheckCircle, AlertTriangle, ChevronDown, ChevronUp, Info, X } from 'lucide-react';

const PrivacyDashboard = () => {
  const [expandedPlatform, setExpandedPlatform] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);

  const platforms = [
    {
      name: 'Facebook',
      icon: '📘',
      color: 'bg-blue-500',
      riskLevel: 'high',
      settingsUrl: 'https://www.facebook.com/settings',
      categories: [
        {
          title: 'Privacy Settings',
          url: 'https://www.facebook.com/settings?tab=privacy',
          controls: [
            {
              setting: 'Who can see your future posts?',
              action: 'Set to "Friends" or "Only Me"',
              risk: 'high',
              why: 'If set to "Public", anyone on the internet can see your posts, photos, and personal updates',
              consequences: [
                'Strangers can see your photos, location, and personal life',
                'Scammers can gather information to impersonate you or your family',
                'Employers, insurance companies, or anyone can see your posts',
                'Your content can be used in ads or by data brokers without your knowledge'
              ]
            },
            {
              setting: 'Who can see your friends list?',
              action: 'Set to "Only Me"',
              risk: 'medium',
              why: 'Your friends list reveals your social network and can be used to target you or them',
              consequences: [
                'Scammers can see who you know and pretend to be your friends',
                'Marketers build profiles of your social circle',
                'Hackers use this to send fake friend requests to people you know',
                'Identity thieves learn about your relationships and connections'
              ]
            },
            {
              setting: 'Who can look you up using email/phone?',
              action: 'Set to "Friends" or turn OFF',
              risk: 'medium',
              why: 'Prevents strangers from finding your profile using contact information',
              consequences: [
                'Anyone with your email or phone can find your Facebook profile',
                'Data brokers can link your contact info to your social media',
                'Stalkers or unwanted contacts can easily find you',
                'Your phone number or email gets connected to your public posts'
              ]
            },
            {
              setting: 'Search engines linking to your profile',
              action: 'Turn OFF',
              risk: 'high',
              why: 'Prevents your Facebook profile from appearing in Google, Bing, and other search engines',
              consequences: [
                'Your Facebook profile appears when someone Googles your name',
                'Employers can easily find your social media during background checks',
                'Your profile remains visible even if you delete Facebook later',
                'Anyone worldwide can access your public information permanently'
              ]
            },
          ]
        },
        {
          title: 'Ad Preferences',
          url: 'https://www.facebook.com/adpreferences',
          controls: [
            {
              setting: 'Ads based on data from partners',
              action: 'Turn OFF',
              risk: 'high',
              why: 'Facebook buys your shopping history, browsing data, and real-world purchases from other companies',
              consequences: [
                'Facebook knows what you buy at stores, even offline',
                'Your credit card purchases are tracked and linked to your profile',
                'Websites you visit share your activity with Facebook',
                'This data is used to manipulate what you see and buy'
              ]
            },
            {
              setting: 'Ads based on your activity on Facebook Company Products',
              action: 'Turn OFF',
              risk: 'high',
              why: 'Facebook tracks everything you do on Instagram, WhatsApp, Messenger, and uses it for ads',
              consequences: [
                'Your private WhatsApp contacts and Instagram activity affect Facebook ads',
                'Facebook combines all your data across every app they own',
                'Your behavior is analyzed to predict and influence your decisions',
                'Data from one app is used to target you on all other apps'
              ]
            },
            {
              setting: 'Advertisers you\'ve interacted with',
              action: 'Review and remove',
              risk: 'medium',
              why: 'Shows which companies have uploaded your contact info to target you with ads',
              consequences: [
                'Companies you\'ve never given permission to have your data',
                'Your email/phone was sold to advertisers without your consent',
                'You\'ll keep seeing ads from companies based on old data',
                'This list shows how widely your information has been shared'
              ]
            },
          ]
        },
        {
          title: 'Apps and Websites',
          url: 'https://www.facebook.com/settings?tab=applications',
          controls: [
            {
              setting: 'Connected apps and websites',
              action: 'Remove apps you don\'t use',
              risk: 'high',
              why: 'Every app connected to your Facebook can access your personal data continuously',
              consequences: [
                'Old games and quizzes still have access to your profile, friends, and photos',
                'These apps can post on your behalf without asking',
                'If an app gets hacked, your Facebook data is exposed',
                'Apps sell or share your data with other companies'
              ]
            },
            {
              setting: 'Apps others use',
              action: 'Turn OFF all options',
              risk: 'high',
              why: 'When your friends use apps, those apps can access YOUR information too',
              consequences: [
                'Apps your friends use can see your photos, posts, and personal details',
                'You have no control over what apps your friends connect to',
                'Your data is shared without your permission or knowledge',
                'This is how Cambridge Analytica accessed 87 million people\'s data'
              ]
            },
          ]
        },
        {
          title: 'Off-Facebook Activity',
          url: 'https://www.facebook.com/off_facebook_activity',
          controls: [
            {
              setting: 'Off-Facebook activity tracking',
              action: 'Clear history and disconnect',
              risk: 'critical',
              why: 'Facebook tracks every website you visit and everything you do outside Facebook',
              consequences: [
                'Facebook knows every website you visit, even when logged out',
                'Your online shopping, browsing, and app usage is all tracked',
                'Facebook builds a complete profile of your life outside their platform',
                'This data is used to manipulate your emotions and behavior',
                'Medical sites, financial sites, everything is tracked and stored'
              ]
            },
          ]
        }
      ]
    },
    {
      name: 'Google',
      icon: '🔍',
      color: 'bg-red-500',
      riskLevel: 'high',
      settingsUrl: 'https://myaccount.google.com/',
      categories: [
        {
          title: 'Activity Controls',
          url: 'https://myaccount.google.com/activitycontrols',
          controls: [
            {
              setting: 'Web & App Activity',
              action: 'Turn OFF or set auto-delete to 3 months',
              risk: 'critical',
              why: 'Google saves every search, every website you visit, and every app you use',
              consequences: [
                'Google stores every single thing you\'ve ever searched - medical questions, personal problems, everything',
                'Your entire browsing history is saved and analyzed forever',
                'This can be subpoenaed in legal cases, divorces, or investigations',
                'Governments can request this data about you',
                'Hackers who breach Google get your complete search history'
              ]
            },
            {
              setting: 'Location History',
              action: 'Turn OFF',
              risk: 'critical',
              why: 'Google tracks everywhere you go, 24/7, even with GPS off',
              consequences: [
                'Google knows your home address, work, and everywhere you visit',
                'Can be used to prove you were somewhere (or weren\'t)',
                'Insurance companies could use this to deny claims',
                'Shows patterns: doctor visits, bars, protests, religious sites',
                'This data has been used in criminal investigations and divorce cases'
              ]
            },
            {
              setting: 'YouTube History',
              action: 'Turn OFF or set auto-delete',
              risk: 'high',
              why: 'Google saves every video you watch and analyzes your interests and vulnerabilities',
              consequences: [
                'Google knows your political views, fears, insecurities, and interests',
                'This data builds a psychological profile used to influence you',
                'Embarrassing or sensitive videos you watched are stored permanently',
                'Can reveal private aspects of your life you haven\'t shared with anyone'
              ]
            },
          ]
        },
        {
          title: 'Ad Settings',
          url: 'https://adssettings.google.com/',
          controls: [
            {
              setting: 'Ad Personalization',
              action: 'Turn OFF',
              risk: 'high',
              why: 'Google uses everything it knows about you to show ads designed to manipulate you',
              consequences: [
                'Ads are specifically designed to exploit your weaknesses and emotions',
                'Google sells access to your profile to any advertiser willing to pay',
                'You\'ll see predatory ads for things like payday loans if Google thinks you\'re struggling',
                'Your data is shared with thousands of advertising companies'
              ]
            },
          ]
        },
        {
          title: 'Third-Party Access',
          url: 'https://myaccount.google.com/permissions',
          controls: [
            {
              setting: 'Third-party apps with account access',
              action: 'Remove unused apps',
              risk: 'critical',
              why: 'Apps connected to your Google account can access your emails, files, and location',
              consequences: [
                'Apps can read your Gmail messages, including bank statements and private emails',
                'They can access your Google Drive files and photos',
                'If an app gets hacked, all your Google data is compromised',
                'Many apps sell this data to data brokers'
              ]
            },
          ]
        },
      ]
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      color: 'bg-blue-600',
      riskLevel: 'medium',
      settingsUrl: 'https://www.linkedin.com/settings/',
      categories: [
        {
          title: 'Visibility',
          url: 'https://www.linkedin.com/settings/data-visibility',
          controls: [
            {
              setting: 'Who can see your email address',
              action: 'Set to "Only you"',
              risk: 'high',
              why: 'Your email becomes visible to anyone who views your profile',
              consequences: [
                'Recruiters, salespeople, and scammers can spam your email',
                'Your email gets sold to marketing lists',
                'Anyone can use it to find your other social media accounts',
                'Increases risk of phishing and targeted scam emails'
              ]
            },
            {
              setting: 'Who can see your connections',
              action: 'Set to "Only you"',
              risk: 'medium',
              why: 'Your professional network becomes visible to competitors and strangers',
              consequences: [
                'Competitors can see your entire professional network',
                'Recruiters can poach your colleagues and connections',
                'Scammers can impersonate your connections',
                'Your professional relationships become public knowledge'
              ]
            },
            {
              setting: 'Profile viewing options',
              action: 'Consider "Private mode"',
              risk: 'low',
              why: 'People can see when you\'ve looked at their profile',
              consequences: [
                'Your interest in companies, competitors, or people is revealed',
                'Can create awkward professional situations',
                'Your job search activity may be visible to current employer'
              ]
            },
          ]
        },
        {
          title: 'Advertising',
          url: 'https://www.linkedin.com/settings/advertising',
          controls: [
            {
              setting: 'Use of your data for ads',
              action: 'Turn OFF all options',
              risk: 'medium',
              why: 'LinkedIn sells your professional data to advertisers',
              consequences: [
                'Your job title, skills, and interests are sold to recruiters and advertisers',
                'Your profile is used to target ads to other professionals like you',
                'Your engagement with posts influences what ads you see',
                'Your career history is monetized without your direct benefit'
              ]
            },
          ]
        },
      ]
    },
    {
      name: 'Instagram',
      icon: '📷',
      color: 'bg-pink-500',
      riskLevel: 'high',
      settingsUrl: 'https://www.instagram.com/accounts/privacy_and_security/',
      categories: [
        {
          title: 'Privacy',
          controls: [
            {
              setting: 'Private account',
              action: 'Turn ON',
              risk: 'high',
              why: 'Without this, anyone on the internet can see all your photos and stories',
              consequences: [
                'Strangers, stalkers, and creeps can see your photos',
                'Your location, lifestyle, and daily routine are public',
                'Photos of your kids or family are visible to everyone',
                'Your images can be stolen and used anywhere online'
              ]
            },
            {
              setting: 'Activity status',
              action: 'Turn OFF',
              risk: 'medium',
              why: 'Shows when you\'re online and active on Instagram',
              consequences: [
                'People know when you\'re awake and on your phone',
                'Can reveal your daily patterns and schedule',
                'Unwanted people know when you\'re available',
                'Creates pressure to respond immediately'
              ]
            },
          ]
        },
        {
          title: 'Ads',
          controls: [
            {
              setting: 'Data from partners',
              action: 'Turn OFF',
              risk: 'high',
              why: 'Instagram (owned by Facebook) buys your data from other companies',
              consequences: [
                'Instagram knows your purchases, browsing history, and app usage',
                'Your real-world shopping is tracked and linked to your profile',
                'This data is used to manipulate what you buy',
                'All Facebook company products share your data'
              ]
            },
          ]
        },
      ]
    },
    {
      name: 'TikTok',
      icon: '🎵',
      color: 'bg-black',
      riskLevel: 'high',
      settingsUrl: 'https://www.tiktok.com/settings',
      categories: [
        {
          title: 'Privacy & Data',
          controls: [
            {
              setting: 'Private account',
              action: 'Turn ON',
              risk: 'high',
              why: 'Your videos are visible to everyone, and TikTok\'s algorithm shows them to millions',
              consequences: [
                'Your videos can go viral and be seen by millions of strangers',
                'Content can be screen-recorded and shared anywhere',
                'Future employers, schools, or partners can find embarrassing content',
                'You have no control over who sees or shares your content'
              ]
            },
            {
              setting: 'Personalized ads',
              action: 'Turn OFF',
              risk: 'critical',
              why: 'TikTok tracks an enormous amount of data about your behavior and device',
              consequences: [
                'TikTok tracks your face, voice, typing patterns, and device information',
                'Knows your location, contacts, and everything you do on your phone',
                'This data can be accessed by foreign governments',
                'Your biometric data (face, voice) is stored and analyzed',
                'Can track you across other apps and websites'
              ]
            },
          ]
        },
      ]
    },
    {
      name: 'Amazon',
      icon: '📦',
      color: 'bg-orange-500',
      riskLevel: 'medium',
      settingsUrl: 'https://www.amazon.com/privacyprefs',
      categories: [
        {
          title: 'Privacy',
          controls: [
            {
              setting: 'Alexa voice recordings',
              action: 'Set auto-delete to 3 months',
              risk: 'high',
              why: 'Amazon stores recordings of everything you say to Alexa',
              consequences: [
                'Your private conversations are stored on Amazon\'s servers',
                'Alexa sometimes activates by accident and records you',
                'Amazon employees can listen to your recordings',
                'Can capture sensitive information, arguments, private moments',
                'Has been subpoenaed in criminal investigations'
              ]
            },
            {
              setting: 'Interest-based ads',
              action: 'Opt out',
              risk: 'medium',
              why: 'Amazon tracks everything you browse and buy to manipulate your purchasing',
              consequences: [
                'Amazon knows your financial situation based on what you buy',
                'Uses this to show you products at prices you\'re likely to pay',
                'Your shopping habits reveal personal and medical information',
                'Data is used to predict and influence your future purchases'
              ]
            },
          ]
        },
      ]
    },
  ];

  const togglePlatform = (platformName) => {
    setExpandedPlatform(expandedPlatform === platformName ? null : platformName);
  };

  const toggleCheck = (platformName, categoryIndex, controlIndex) => {
    const key = `${platformName}-${categoryIndex}-${controlIndex}`;
    setCheckedItems({...checkedItems, [key]: !checkedItems[key]});
  };

  const showInfo = (platform, category, control) => {
    setSelectedInfo({ platform, category, control });
    setShowInfoModal(true);
  };

  const getPlatformProgress = (platform) => {
    let total = 0;
    let checked = 0;
    platform.categories.forEach((category, catIdx) => {
      category.controls.forEach((control, ctrlIdx) => {
        total++;
        if (checkedItems[`${platform.name}-${catIdx}-${ctrlIdx}`]) checked++;
      });
    });
    return { checked, total, percentage: total > 0 ? Math.round((checked / total) * 100) : 0 };
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskBadgeColor = (risk) => {
    switch(risk) {
      case 'critical': return 'bg-red-500/20 border-red-500/50 text-red-300';
      case 'high': return 'bg-orange-500/20 border-orange-500/50 text-orange-300';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300';
      case 'low': return 'bg-green-500/20 border-green-500/50 text-green-300';
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 border border-white/20">
          <div className="flex items-center gap-4 mb-4">
            <Shield className="w-12 h-12 text-blue-400" />
            <div>
              <h1 className="text-4xl font-bold text-white">Privacy Control Center</h1>
              <p className="text-blue-200 mt-1">Understand the risks and protect your personal data</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-3xl font-bold text-white">{platforms.length}</div>
              <div className="text-sm text-blue-200">Platforms Covered</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-3xl font-bold text-white">
                {Object.values(checkedItems).filter(Boolean).length}
              </div>
              <div className="text-sm text-blue-200">Settings Secured</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-3xl font-bold text-white">
                {Math.round((Object.values(checkedItems).filter(Boolean).length / 
                  platforms.reduce((sum, p) => sum + p.categories.reduce((s, c) => s + c.controls.length, 0), 0)) * 100) || 0}%
              </div>
              <div className="text-sm text-blue-200">Privacy Score</div>
            </div>
          </div>
        </div>

        {/* Alert Box */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-100">
              <strong>How to use:</strong> Click the <Info className="w-4 h-4 inline mx-1" /> icon next to any setting to understand what happens if you don't change it. Click "Open Settings" to go directly to that page. Check the box when done.
            </div>
          </div>
        </div>

        {/* Platforms */}
        <div className="space-y-4">
          {platforms.map((platform) => {
            const progress = getPlatformProgress(platform);
            const isExpanded = expandedPlatform === platform.name;
            
            return (
              <div key={platform.name} className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
                {/* Platform Header */}
                <div 
                  className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => togglePlatform(platform.name)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{platform.icon}</div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{platform.name}</h2>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-sm font-semibold ${getRiskColor(platform.riskLevel)}`}>
                            {platform.riskLevel.toUpperCase()} RISK
                          </span>
                          <span className="text-sm text-blue-200">
                            {progress.checked}/{progress.total} completed
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-3xl font-bold text-white">{progress.percentage}%</div>
                        <div className="text-xs text-blue-200">Secured</div>
                      </div>
                      {isExpanded ? 
                        <ChevronUp className="w-6 h-6 text-white" /> : 
                        <ChevronDown className="w-6 h-6 text-white" />
                      }
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4 bg-white/10 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-white/20 p-6 bg-white/5">
                    <div className="space-y-6">
                      {platform.categories.map((category, catIdx) => (
                        <div key={catIdx} className="bg-white/5 rounded-lg p-5 border border-white/10">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-white">{category.title}</h3>
                            {category.url && (
                              <a 
                                href={category.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                              >
                                Open Settings
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            {category.controls.map((control, ctrlIdx) => {
                              const isChecked = checkedItems[`${platform.name}-${catIdx}-${ctrlIdx}`];
                              return (
                                <div 
                                  key={ctrlIdx}
                                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
                                >
                                  <div className="flex items-start gap-3">
                                    <div 
                                      className="flex-shrink-0 mt-0.5 cursor-pointer"
                                      onClick={() => toggleCheck(platform.name, catIdx, ctrlIdx)}
                                    >
                                      {isChecked ? (
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                      ) : (
                                        <div className="w-5 h-5 border-2 border-white/30 rounded-full" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                          <div className={`font-semibold ${isChecked ? 'text-green-200 line-through' : 'text-white'}`}>
                                            {control.setting}
                                          </div>
                                          <div className={`text-sm mt-1 ${isChecked ? 'text-green-200/70 line-through' : 'text-blue-200'}`}>
                                            → {control.action}
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                          <span className={`text-xs px-2 py-1 rounded border ${getRiskBadgeColor(control.risk)}`}>
                                            {control.risk.toUpperCase()}
                                          </span>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              showInfo(platform.name, category.title, control);
                                            }}
                                            className="p-1 hover:bg-blue-500/20 rounded-lg transition-colors"
                                          >
                                            <Info className="w-5 h-5 text-blue-400" />
                                          </button>
                                        </div>
                                      </div>
                                      <div className="mt-2 text-sm text-gray-300 bg-white/5 rounded p-2 border border-white/10">
                                        <strong className="text-yellow-300">⚠️ Why this matters:</strong> {control.why}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info Modal */}
        {showInfoModal && selectedInfo && (
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowInfoModal(false)}
          >
            <div 
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-2xl w-full border border-white/20 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedInfo.control.setting}</h3>
                    <p className="text-blue-200 mt-1">{selectedInfo.platform} - {selectedInfo.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${getRiskBadgeColor(selectedInfo.control.risk)}`}>
                {selectedInfo.control.risk.toUpperCase()} RISK
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="font-semibold text-white mb-2">What you should do:</h4>
                  <p className="text-blue-200">{selectedInfo.control.action}</p>
                </div>

                <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30">
                  <h4 className="font-semibold text-yellow-300 mb-2">Why this matters:</h4>
                  <p className="text-yellow-100">{selectedInfo.control.why}</p>
                </div>

                <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                  <h4 className="font-semibold text-red-300 mb-3">What could happen if you don't change this:</h4>
                  <ul className="space-y-2">
                    {selectedInfo.control.consequences.map((consequence, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-red-100">
                        <span className="text-red-400 flex-shrink-0">•</span>
                        <span>{consequence}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setShowInfoModal(false)}
                className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Got it, I'll change this setting
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Remember
          </h3>
          <ul className="space-y-2 text-blue-100 text-sm">
            <li>• These companies make billions by collecting and selling your data</li>
            <li>• Just because something is "convenient" doesn't mean it's safe</li>
            <li>• Your data can be used against you - in job searches, insurance, legal cases</li>
            <li>• Once your data is out there, you can never fully take it back</li>
            <li>• Review these settings every 3 months - companies change them without telling you</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrivacyDashboard;