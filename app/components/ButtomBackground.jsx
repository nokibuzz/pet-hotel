
'use client';

const BottomBackground = () => {
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-10 h-1/5"
      style={{
        backgroundImage: 'url(/images/background/bottomBackground.png)',
        backgroundRepeat: 'repeat-x',
        backgroundSize: 'auto 100%',
      }}
    >
    </div>  
  );
};

export default BottomBackground;

