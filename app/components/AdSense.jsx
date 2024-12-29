"use client";

import { useEffect } from 'react';

const AdSense = ({ client, slot }) => {
  useEffect(() => {
    if (!window.adsbygoogle) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7467390618217637';
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    if (window.adsbygoogle && window.adsbygoogle.length > 0) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, []); 

  return (
    <div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSense;
