'use client';

import { useState, useEffect, useRef } from 'react';

export default function ValentineInvitation() {
  const [response, setResponse] = useState<'yes' | 'no' | null>(null);
  const [noClickCount, setNoClickCount] = useState(0);
  const [showSweetAlert, setShowSweetAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSpecialMessage, setShowSpecialMessage] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'next' | 'prev'>('next');
  const [showInvitation, setShowInvitation] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sweet alert messages
  const sweetMessages = [
    "Are you sure? 🥺",
    "Really sure? 😢",
    "Think again! 💕",
    "Would you reconsider? 🌹",
    "Please say yes? 😊",
    "One more thought? ✨",
    "I'll be really sad... 😭",
    "My heart will break! 💔",
    "For me? Please? 🥰",
    "I made this just for you! 💖",
    "You're breaking my heart... 😔",
    "Maybe click Yes instead? 💝",
    "I'll be the best Valentine! 🌟",
    "Let's make memories! 💑",
    "Say yes for us! 💞",
    "I'm waiting... ⏳",
    "Don't leave me hanging! 😘",
    "It'll be magical! ✨",
    "YES is just one click away! 💕",
    "I believe in us! 🌸"
  ];

  // 20 Memories - Photo 12 will be special message
  const memories = [
    {
      image: "/start.jpg",
      title: "The Beginning",
      description: "Where our beautiful story started 💕",
      isSpecial: false
    },
    {
      image: "/1.jpg",
      title: "First Manila Date",
      description: "Our first adventure in the city 🌟",
      isSpecial: false
    },
    {
      image: "/3.jpg",
      title: " Moa Day",
      description: "Sun, sand, and your beautiful smile ✨",
      isSpecial: false
    },
    {
      image: "/4.jpg",
      title: "Coffee Moments",
      description: "Simple dates, deep conversations 🌹",
      isSpecial: false
    },
    {
      image: "/5.jpg",
      title: "Low Blood Days",
      description: "Even the rain couldn't dampen our joy ☔",
      isSpecial: false
    },
    {
      image: "/6.jpg",
      title: "SB Fun",
      description: "Celebrating life together 🎉",
      isSpecial: false
    },
    {
      image: "/makeup.jpg",
      title: "Makeup Session",
      description: "Beauty Touched by Love",
      isSpecial: false
    },
    {
      image: "/SM.jpg",
      title: "SM date",
      description: "A simple date at SM—walking hand in hand, sharing laughs, and turning an ordinary day into something special.",
      isSpecial: false
    },
    {
      image: "/stress.jpg",
      title: "Thesis Month",
      description: "In the middle of stress, we found comfort in simple moments.",
      isSpecial: false
    },
    {
      image: "/gym.jpg",
      title: "Gymrat",
      description: "Working on our bodies while building our relationship.",
      isSpecial: false
    },
    {
      image: "/foodtrip.jpg",
      title: " Food Trips",
      description: "Our kind of date: eating, laughing, and making memories.",
      isSpecial: false
    },
    // PHOTO 12 - SPECIAL MESSAGE (INDEX 11)
    {
      image: "",
      title: "Our Special Number ✨",
      description: "12 will always mean the world to us",
      isSpecial: true,
      specialMessage: "Happy First Anniversary, my love! Twelve will forever be our special number—a symbol of all the memories, laughter, and love we’ve shared. Every moment with you feels like pure magic, and my love for you grows deeper with every day. I love you more than words could ever express."
    },
    {
      image: "/review.jpg",
      title: "Review Dates",
      description: "Turning review sessions into moments of motivation and love",
      isSpecial: false
    },
    {
      image: "/class.jpg",
      title: "After Class",
      description: "After class means freedom, coffee, and smiles with you.",
      isSpecial: false
    },
    
  ];

  // Smooth navigation functions
  const nextPhoto = () => {
    setTransitionDirection('next');
    if (currentPhotoIndex === memories.length - 1) {
      setShowSpecialMessage(true);
    } else {
      setCurrentPhotoIndex((prev) => prev + 1);
    }
  };

  const prevPhoto = () => {
    setTransitionDirection('prev');
    if (showSpecialMessage) {
      setShowSpecialMessage(false);
      setCurrentPhotoIndex(memories.length - 1);
    } else if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex((prev) => prev - 1);
    }
  };

  const showNextButton = () => {
    if (response === 'yes' && showInvitation) {
      setShowInvitation(false);
      setCurrentPhotoIndex(0);
      initializeAndPlayMusic();
    }
  };

  // Initialize and play music automatically
  const initializeAndPlayMusic = async () => {
    if (audioRef.current) {
      try {
        audioRef.current.volume = 0.3;
        audioRef.current.loop = true;
        
        await audioRef.current.play();
        setIsPlaying(true);
        
      } catch (error) {
        console.log("Auto-play prevented, waiting for user interaction");
        
        const playOnInteraction = () => {
          if (audioRef.current && !isPlaying) {
            audioRef.current.play()
              .then(() => {
                setIsPlaying(true);
                document.removeEventListener('click', playOnInteraction);
                document.removeEventListener('touchstart', playOnInteraction);
              })
              .catch(() => {});
          }
        };
        
        document.addEventListener('click', playOnInteraction);
        document.addEventListener('touchstart', playOnInteraction);
      }
    }
  };

  const handleYesClick = () => {
    setResponse('yes');
    setShowInvitation(true);
  };

  const handleNoClick = () => {
    const newCount = noClickCount + 1;
    setNoClickCount(newCount);
    
    setAlertMessage(sweetMessages[Math.min(newCount - 1, sweetMessages.length - 1)]);
    setShowSweetAlert(true);
    
    setTimeout(() => {
      setShowSweetAlert(false);
    }, 1800);
  };

  const goBackToPhotos = () => {
    setShowSpecialMessage(false);
    setCurrentPhotoIndex(memories.length - 1);
  };

  // Preload images (skip empty images)
  useEffect(() => {
    const preloadImages = () => {
      const imagePromises = memories
        .filter(memory => memory.image && !memory.isSpecial)
        .map((memory) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = memory.image;
            img.onload = resolve;
            img.onerror = resolve;
          });
        });
      
      Promise.all(imagePromises).then(() => {
        setIsLoading(false);
      });
    };
    
    preloadImages();
  }, []);

  // Auto-advance photos every 8 seconds
  useEffect(() => {
    if (isPlaying && response === 'yes' && !showInvitation && !showSpecialMessage) {
      const interval = setInterval(() => {
        if (currentPhotoIndex === memories.length - 1) {
          setShowSpecialMessage(true);
        } else {
          setTransitionDirection('next');
          setCurrentPhotoIndex((prev) => prev + 1);
        }
      }, 100000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, response, showInvitation, showSpecialMessage, currentPhotoIndex]);

  // Initialize audio
  useEffect(() => {
    const audio = new Audio('/lifetime.mp3');
    audio.preload = 'auto';
    audioRef.current = audio;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle page visibility for music
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (audioRef.current) {
        if (document.hidden) {
          audioRef.current.pause();
        } else if (isPlaying) {
          audioRef.current.play().catch(() => {});
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPlaying]);

  // Swipe navigation for mobile
  useEffect(() => {
    if (response !== 'yes' || showInvitation) return;

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 50;
      const swipeDistance = touchEndX - touchStartX;

      if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
          // Swipe right - previous
          prevPhoto();
        } else {
          // Swipe left - next
          nextPhoto();
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [response, showInvitation, currentPhotoIndex, showSpecialMessage]);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex flex-col items-center justify-center p-3 relative overflow-hidden"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      
      {/* Hidden audio element */}
      <audio ref={audioRef} loop>
        <source src="/lifetime.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Sweet Alert Popup - Mobile Optimized */}
      {showSweetAlert && (
        <div className="fixed inset-0 flex items-center justify-center p-3 z-50 animate-fadeIn">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div className="relative bg-gradient-to-br from-white to-pink-50 rounded-2xl p-6 w-full max-w-xs shadow-2xl border border-pink-300 animate-popIn">
            <div className="text-center">
              <div className="text-4xl mb-3 animate-bounce">💕</div>
              <p className="text-gray-800 text-base font-medium mb-3">{alertMessage}</p>
              <div className="h-1 w-20 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full mx-auto"></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Mobile First Design */}
      <div className="w-full max-w-md relative z-10 px-2">
        
        {response === null ? (
          /* Initial Invitation - Mobile Optimized */
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-5 border border-white/40 animate-fadeInUp">
            
            {/* Mobile Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
                My Heart Has a Question... 💘
              </h1>
            </div>

            {/* Main Question Card - Mobile */}
            <div className="relative mb-8">
              <div className="absolute -inset-3 bg-gradient-to-r from-rose-400/10 to-pink-400/10 rounded-2xl blur-md"></div>
              <div className="relative bg-gradient-to-br from-white to-pink-50 rounded-xl p-5 border border-pink-200/50 shadow-md">
                <div className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-4 text-center">
                  Will you be my Valentine?
                </div>
                
                <p className="text-gray-600 text-sm text-center mb-4 leading-relaxed">
                  
                  <br />
                  Say YES and let our love story unfold with music 🎵
                </p>
              </div>
            </div>

            {/* Buttons - Mobile Optimized */}
            <div className="space-y-3">
              <button
                onClick={handleYesClick}
                className="w-full py-4 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 active:from-rose-600 active:via-pink-600 active:to-rose-600 text-white font-bold text-base rounded-xl transition-all duration-200 active:scale-95 shadow-lg active:shadow-xl touch-manipulation"
                style={{ touchAction: 'manipulation' }}
              >
                <span className="flex items-center justify-center gap-1">
                  YES
                </span>
              </button>

              <button
                onClick={handleNoClick}
                className="w-full py-3 bg-gradient-to-r from-gray-100 to-gray-200 active:from-gray-200 active:to-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200 active:scale-95 shadow-md active:shadow-lg border border-gray-300/50 touch-manipulation"
                style={{ touchAction: 'manipulation' }}
              >
                No
              </button>
            </div>
          </div>
        ) : response === 'yes' && showInvitation ? (
          /* INVITATION PAGE - Mobile Optimized */
          <div className="bg-gradient-to-br from-pink-50 via-white to-rose-50 rounded-2xl shadow-lg p-5 border border-pink-200 animate-fadeInUp">
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center">
                <h2 className="text-xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-3">
                  You Said YES! 💝
                </h2>
                <div className="h-1 w-32 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full mx-auto"></div>
              </div>

              {/* Invitation Card - Mobile */}
              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-r from-pink-300/10 to-rose-300/10 rounded-2xl blur-md"></div>
                <div className="relative bg-gradient-to-br from-white to-pink-50 rounded-xl p-5 border border-pink-200 shadow-md">
                  <div className="text-center space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-gray-800">
                        Valentine's Date Invitation
                      </h3>
                      <p className="text-pink-600 text-sm">Join me for a special day of love and memories 💕</p>
                    </div>

                    {/* Details - Mobile Layout */}
                    <div className="space-y-4 my-4">
                      {/* Date */}
                      <div className="space-y-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto">
                          <span className="text-lg text-white">📅</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-700 text-sm">Date</h4>
                          <p className="text-gray-600 text-xs">February 14, 2025</p>
                          <p className="text-pink-600 font-medium text-xs">Thursday</p>
                        </div>
                      </div>

                      {/* Time */}
                      <div className="space-y-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto">
                          <span className="text-lg text-white">🕒</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-700 text-sm">Time</h4>
                          <p className="text-gray-600 text-xs">10:AM onwards</p>
                          <p className="text-pink-600 font-medium text-xs">Golden Hour</p>
                        </div>
                      </div>

                      {/* Place */}
                      <div className="space-y-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto">
                          <span className="text-lg text-white">📍</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-700 text-sm">Place</h4>
                          <p className="text-gray-600 text-xs">Vintro Restaurent</p>
                          <p className="text-pink-600 font-medium text-xs">Lipa City</p>
                        </div>
                      </div>
                    </div>

                    {/* Special Message */}
                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border border-pink-100">
                      <p className="text-gray-700 text-sm italic">
                        "I've prepared something special for us. 
                        <span className="block mt-1 text-pink-600 font-medium">
                          Dress code: Something that makes you feel beautiful
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Button - Mobile */}
              <button
                onClick={showNextButton}
                className="w-full py-3 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 active:from-rose-600 active:via-pink-600 active:to-rose-600 text-white font-bold rounded-xl shadow-lg active:shadow-xl transition-all duration-200 active:scale-95 touch-manipulation"
                style={{ touchAction: 'manipulation' }}
              >
                <span className="flex items-center justify-center gap-1 text-sm">
                  Next 
                </span>
              </button>
            </div>
          </div>
        ) : showSpecialMessage ? (
          /* FINAL SPECIAL MESSAGE PAGE - Mobile */
          <div className="space-y-6 pb-20 animate-fadeIn">
            {/* Special Message Content */}
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-rose-400/10 rounded-2xl blur-md"></div>
              <div className="relative bg-gradient-to-br from-white/95 to-pink-50/95 backdrop-blur-sm rounded-2xl shadow-lg p-5 border border-white/40">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-3">
                      My  Message For You
                    </h3>
                    <div className="h-1 w-32 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 rounded-full mx-auto"></div>
                  </div>

                  {/* Your Personal Message Here - Mobile */}
                  <div className="space-y-4 text-gray-700 text-sm leading-relaxed text-center">
                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-5 border border-pink-200/50">
                      <p className="mb-4 italic text-base text-rose-600">
                        "After beautiful memories, my heart is overflowing with love for you..."
                      </p>
                      
                      <div className="space-y-3">
                        <p>
                          Every single moment with you has been a blessing. From our first meeting to every laugh we've shared, 
                          you've made my life infinitely better.
                        </p>
                        
                        <p className="font-semibold text-pink-600">
                          Thank you for being you, for loving me, and for saying YES today.
                        </p>
                        
                        <p>
                          I promise to cherish you, to support you, and to love you more with each passing day.
                          You are, and will always be, my forever Valentine. 
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <p className="text-gray-600 text-sm">With all my heart,</p>
                      <p className="text-lg font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mt-1">
                        Your Forever Love 💝
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Button - Mobile */}
            <button
              onClick={goBackToPhotos}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 active:from-pink-600 active:to-rose-600 text-white font-bold rounded-xl shadow-lg active:shadow-xl transition-all duration-200 active:scale-95 touch-manipulation"
              style={{ touchAction: 'manipulation' }}
            >
              ← Back to Our Memories
            </button>
          </div>
        ) : (
          /* PHOTOS SECTION - Mobile Optimized with Swipe Support */
          <div className="space-y-6 pb-20">
            {/* Swipe Instructions for Mobile */}
            <div className="text-center">
              <p className="text-gray-600 text-xs">
                
              </p>
            </div>

            {/* Current Memory Display - Mobile */}
            {!isLoading && (
              <div className={`relative ${transitionDirection === 'next' ? 'animate-slideInRight' : 'animate-slideInLeft'}`}>
                <div className="relative bg-gradient-to-br from-white/95 to-pink-50/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/40">
                  
                  {/* SPECIAL FOR PHOTO 12 (Index 11) - Mobile */}
                  {currentPhotoIndex === 11 ? (
                    <div className="relative min-h-[300px] flex items-center justify-center p-4">
                      {/* Background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 opacity-90"></div>
                      
                      {/* Content */}
                      <div className="relative z-10 text-center w-full px-3">
                        <div className="mb-6">
                          <h2 className="text-2xl font-bold text-white mb-3">
                            Our Special Number ✨
                          </h2>
                          <div className="h-1 w-32 bg-white/50 rounded-full mx-auto"></div>
                        </div>
                        
                        <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 mb-6">
                          <p className="text-lg text-white mb-4 italic">
                            "This number will always hold a special place in our hearts"
                          </p>
                          
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <p className="text-base text-white leading-relaxed">
                              {memories[11].specialMessage}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // NORMAL PHOTOS - Mobile Optimized
                    <div className="relative">
                      <div className="relative h-[250px] overflow-hidden bg-gray-100 touch-pan-y"
                        style={{ touchAction: 'pan-y' }}
                      >
                        {/* Main Image Container - Mobile Optimized */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <img
                            src={memories[currentPhotoIndex].image}
                            alt={memories[currentPhotoIndex].title}
                            className="max-w-full max-h-full w-auto h-auto object-contain"
                            style={{
                              maxWidth: '100%',
                              maxHeight: '100%',
                              width: 'auto',
                              height: 'auto',
                              objectFit: 'contain' as const
                            }}
                            loading="lazy"
                          />
                          
                          {/* Subtle gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bio/Description Section - Mobile */}
                  <div className="p-4">
                    {/* Header with memory info - Mobile */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ${
                          currentPhotoIndex === 11 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                            : 'bg-gradient-to-r from-pink-500 to-rose-500'
                        }`}>
                          {currentPhotoIndex + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-base">
                            {memories[currentPhotoIndex].title}
                          </h3>
                          <p className="text-gray-500 text-xs">
                            Memory {currentPhotoIndex + 1} of {memories.length}
                            {currentPhotoIndex === 11 && " • Special ✨"}
                          </p>
                        </div>
                      </div>
                      
                      {/* Music Indicator - Mobile */}
                      {isPlaying && (
                        <div className="flex items-center gap-2 bg-gradient-to-r from-pink-50 to-rose-50 px-3 py-1 rounded-full shadow-sm border border-pink-200">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 2, 1].map((height, i) => (
                              <div 
                                key={i}
                                className="w-1 rounded-full bg-gradient-to-t from-pink-500 to-rose-500 animate-music-wave"
                                style={{ 
                                  height: `${height * 0.5}rem`,
                                  animationDelay: `${i * 0.1}s` 
                                }}
                              ></div>
                            ))}
                          </div>
                          <span className="text-xs font-medium text-pink-600">
                            🎵
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bio/Description Card - Mobile */}
                    <div className="mb-4">
                      <div className={`p-4 rounded-lg border ${
                        currentPhotoIndex === 11
                          ? 'bg-gradient-to-r from-purple-50/80 to-pink-50/80 border-purple-200'
                          : 'bg-gradient-to-r from-pink-50/80 to-rose-50/80 border-pink-200'
                      }`}>
                        <p className={`text-center text-sm leading-relaxed ${
                          currentPhotoIndex === 11 ? 'text-purple-700' : 'text-gray-700'
                        }`}>
                          {memories[currentPhotoIndex].description}
                        </p>
                      </div>
                    </div>

                    {/* Navigation Buttons - Mobile (Touch Friendly) */}
                    <div className="flex justify-between gap-2">
                      <button
                        onClick={prevPhoto}
                        disabled={currentPhotoIndex === 0}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 font-medium flex-1 ${
                          currentPhotoIndex === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white active:from-pink-600 active:to-rose-600 active:scale-95 shadow-md active:shadow-lg'
                        } touch-manipulation`}
                        style={{ touchAction: 'manipulation' }}
                      >
                        <span className="text-lg">←</span>
                        <span className="text-sm">Previous</span>
                      </button>
                      
                      {/* Next Button - Mobile */}
                      {currentPhotoIndex === memories.length - 1 ? (
                        <button
                          onClick={nextPhoto}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white rounded-lg active:scale-95 transition-all duration-200 font-medium flex-1 shadow-md active:shadow-lg touch-manipulation"
                          style={{ touchAction: 'manipulation' }}
                        >
                          <span className="text-sm">Final Message</span>
                          <span className="text-lg">💌 →</span>
                        </button>
                      ) : (
                        <button
                          onClick={nextPhoto}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg active:from-rose-600 active:to-pink-600 active:scale-95 transition-all duration-200 font-medium flex-1 shadow-md active:shadow-lg touch-manipulation"
                          style={{ touchAction: 'manipulation' }}
                        >
                          <span className="text-sm">Next</span>
                          <span className="text-lg">→</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Bar - Mobile */}
            <div className="bg-gradient-to-br from-white/90 to-pink-50/90 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/40">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-700">Journey Through Our Memories</span>
                <span className={`text-xs font-bold ${
                  currentPhotoIndex === 11 ? 'text-purple-600' : 'text-pink-600'
                }`}>
                  {currentPhotoIndex + 1} / {memories.length}
                </span>
              </div>
              <div className="w-full bg-gray-200/50 rounded-full h-2 mb-1">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ease-out ${
                    currentPhotoIndex === 11
                      ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500'
                      : 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500'
                  }`}
                  style={{ width: `${((currentPhotoIndex + 1) / memories.length) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500 text-[10px]">First Memory</span>
                <span className={`text-xs font-medium ${
                  currentPhotoIndex >= 11 ? 'text-purple-600' : 'text-gray-500'
                }`}>
                  {currentPhotoIndex >= 11 ? '✨ Special 12 ✨' : 'Memory 12'}
                </span>
                <span className="text-xs text-gray-500 text-[10px]">Final Message</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Music Control - Mobile Bottom Center */}
      {response === 'yes' && !showInvitation && (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center z-30">
          <button
            onClick={() => {
              if (audioRef.current) {
                if (isPlaying) {
                  audioRef.current.pause();
                  setIsPlaying(false);
                } else {
                  audioRef.current.play().then(() => setIsPlaying(true));
                }
              }
            }}
            className="w-12 h-12 bg-gradient-to-br from-white to-pink-50 rounded-full shadow-lg border border-pink-200/50 flex items-center justify-center active:scale-95 transition-all duration-200 touch-manipulation"
            style={{ touchAction: 'manipulation' }}
          >
            <div className={`text-xl ${isPlaying ? 'text-pink-600' : 'text-gray-400'}`}>
              {isPlaying ? '🎵' : '🔇'}
            </div>
          </button>
        </div>
      )}

      {/* Mobile Optimized Animations */}
      <style jsx global>{`
        /* Mobile Optimized Keyframes */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        @keyframes slideInRight {
          from { 
            opacity: 0; 
            transform: translateX(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }

        @keyframes slideInLeft {
          from { 
            opacity: 0; 
            transform: translateX(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }

        @keyframes musicWave {
          0%, 100% { 
            transform: scaleY(0.7); 
          }
          50% { 
            transform: scaleY(1.3); 
          }
        }

        @keyframes popIn {
          0% { 
            transform: scale(0.9) translateY(10px); 
            opacity: 0; 
          }
          100% { 
            transform: scale(1) translateY(0); 
            opacity: 1; 
          }
        }

        /* Animation Classes for Mobile */
        .animate-fadeIn { 
          animation: fadeIn 0.3s ease-out; 
          animation-fill-mode: both;
        }
        .animate-fadeInUp { 
          animation: fadeInUp 0.4s ease-out; 
          animation-fill-mode: both;
        }
        .animate-slideInRight { 
          animation: slideInRight 0.3s ease-out; 
          animation-fill-mode: both;
        }
        .animate-slideInLeft { 
          animation: slideInLeft 0.3s ease-out; 
          animation-fill-mode: both;
        }
        .animate-music-wave { 
          animation: musicWave 0.6s ease-in-out infinite; 
        }
        .animate-popIn { 
          animation: popIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); 
          animation-fill-mode: both;
        }

        /* Mobile Touch Improvements */
        .touch-manipulation {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
        }

        /* Prevent text selection on mobile */
        * {
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
        }

        /* Better button feedback on mobile */
        button:active {
          transform: scale(0.98);
        }

        /* Improve scrolling on iOS */
        .overflow-touch {
          -webkit-overflow-scrolling: touch;
        }

        /* Prevent zoom on double-tap */
        button, a {
          touch-action: manipulation;
        }

        /* Responsive font sizes */
        @media (max-width: 360px) {
          .text-2xl { font-size: 1.5rem; }
          .text-xl { font-size: 1.25rem; }
          .text-lg { font-size: 1.125rem; }
          .text-base { font-size: 0.875rem; }
          .text-sm { font-size: 0.75rem; }
          .text-xs { font-size: 0.625rem; }
        }

        /* Optimize animations for mobile */
        @media (prefers-reduced-motion: reduce) {
          .animate-fadeIn,
          .animate-fadeInUp,
          .animate-slideInRight,
          .animate-slideInLeft,
          .animate-popIn {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          
          .animate-music-wave {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}