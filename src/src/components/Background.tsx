import React, { useMemo } from 'react';

interface BackgroundProps {
  isDark: boolean;
}

export const Background = ({ isDark }: BackgroundProps) => {
  const stars = useMemo(() => 
    Array.from({ length: 60 }).map((_, i) => ({ 
      id: i, 
      top: `${Math.random() * 100}%`, 
      left: `${Math.random() * 100}%`, 
      size: `${Math.random() * 2 + 1}px`, 
      animationDuration: `${Math.random() * 3 + 2}s`, 
      animationDelay: `${Math.random() * 5}s`, 
      opacity: Math.random() * 0.5 + 0.3 
    })), 
  []);

  const parkClouds = useMemo(() => 
    Array.from({ length: 6 }).map((_, i) => ({ 
      id: i, 
      top: `${Math.random() * 40}%`, 
      left: `-20%`, 
      scale: Math.random() * 0.6 + 0.6, 
      opacity: Math.random() * 0.3 + 0.6, 
      duration: `${Math.random() * 40 + 40}s`, 
      delay: `${Math.random() * -40}s` 
    })), 
  []);

  const fallingLeaves = useMemo(() => 
    Array.from({ length: 8 }).map((_, i) => ({ 
      id: i, 
      left: `${Math.random() * 100}%`, 
      scale: Math.random() * 0.4 + 0.2, 
      rotation: Math.random() * 360, 
      duration: `${Math.random() * 15 + 15}s`, 
      delay: `${Math.random() * 15}s` 
    })), 
  []);

  const birds = useMemo(() => {
    const items = [];
    for(let i=0; i<2; i++) items.push({ id: `solo-${i}`, top: `${10 + Math.random() * 20}%`, delay: `${Math.random() * 20}s`, duration: `${25 + Math.random() * 10}s` });
    for(let i=0; i<3; i++) items.push({ id: `group-${i}`, top: `${20 + Math.random() * 5}%`, delay: `${Math.random() * 20 + 20}s`, duration: `30s` });
    return items;
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {isDark ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#0B1026] to-[#050505]" />
          {stars.map(star => (
            <div 
              key={star.id} 
              className="absolute rounded-full bg-white" 
              style={{ 
                top: star.top, 
                left: star.left, 
                width: star.size, 
                height: star.size, 
                opacity: star.opacity, 
                animation: `twinkle ${star.animationDuration} infinite ease-in-out ${star.animationDelay}` 
              }} 
            />
          ))}
          <div className="absolute -top-[10%] left-[20%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse duration-[8s]" />
          <div className="absolute bottom-[10%] -right-[10%] w-[600px] h-[600px] bg-violet-900/10 rounded-full blur-[130px] animate-pulse duration-[10s]" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] via-[#C8EAFF] to-[#F0FFF4]" />
          <div className="absolute top-[5%] right-[5%] w-[120px] h-[120px] bg-yellow-100 rounded-full blur-[40px] opacity-80" />
          {parkClouds.map(cloud => (
            <div 
              key={cloud.id} 
              className="absolute" 
              style={{ 
                top: cloud.top, 
                left: cloud.left, 
                opacity: cloud.opacity, 
                transform: `scale(${cloud.scale})`, 
                animation: `float-cloud ${cloud.duration} infinite linear ${cloud.delay}` 
              }}
            >
              <div className="w-[100px] h-[40px] bg-white rounded-full blur-[10px] relative">
                <div className="absolute -top-[20px] left-[15px] w-[40px] h-[40px] bg-white rounded-full"></div>
                <div className="absolute -top-[30px] left-[40px] w-[50px] h-[50px] bg-white rounded-full"></div>
              </div>
            </div>
          ))}
          {birds.map(bird => (
            <div 
              key={bird.id} 
              className="absolute text-slate-600/40" 
              style={{ 
                top: bird.top, 
                left: '-50px', 
                animation: `fly-bird ${bird.duration} infinite linear ${bird.delay}` 
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 12C2 12 5 9 12 12C19 15 22 12 22 12"/>
              </svg>
            </div>
          ))}
          {fallingLeaves.map(leaf => (
            <div 
              key={leaf.id} 
              className="absolute text-emerald-200/60" 
              style={{ 
                top: '-20px', 
                left: leaf.left, 
                transform: `scale(${leaf.scale})`, 
                animation: `fall-leaf ${leaf.duration} infinite ease-in-out ${leaf.delay}` 
              }}
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                style={{transform: `rotate(${leaf.rotation}deg)`}}
              >
                <path d="M12 2C12 2 14 8 20 12C14 16 12 22 12 22C12 22 10 16 4 12C10 8 12 2 12 2Z"/>
              </svg>
            </div>
          ))}
        </>
      )}

      <style>{`
        @keyframes twinkle { 
          0%, 100% { opacity: 0; transform: scale(0.5); } 
          50% { opacity: 1; transform: scale(1.2); box-shadow: 0 0 3px white; } 
        }
        @keyframes float-cloud { 
          0% { transform: translateX(0) scale(1); } 
          100% { transform: translateX(120vw) scale(1); } 
        }
        @keyframes fly-bird { 
          0% { transform: translateX(0) translateY(0) scale(0.8); } 
          25% { transform: translateX(30vw) translateY(10px) scale(0.8); } 
          50% { transform: translateX(60vw) translateY(-5px) scale(0.8); } 
          100% { transform: translateX(110vw) translateY(0) scale(0.8); } 
        }
        @keyframes fall-leaf { 
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; } 
          10% { opacity: 1; } 
          100% { transform: translateY(110vh) translateX(50px) rotate(360deg); opacity: 0; } 
        }
      `}</style>
    </div>
  );
};
