'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CustomCursor = ({ s, videoSrc }) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const cursorRef = useRef(null);

  useEffect(() => {
    window.addEventListener('touchstart', function () {
      setIsTouchDevice(true);
    });

    const onMouseMove = (e) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5, // Animation duration
        ease: 'power2.out', // Easing function
      });
    };

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  useEffect(() => {
    // Animate the scale whenever the scale prop changes
    gsap.to(cursorRef.current, {
      scale: s,
      duration: 0.4,
      ease: 'power2.out',
    });
  }, [s]);

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor overflow-hidden bg-white ${
        isTouchDevice && 'hidden'
      } `}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${s}px`,
        height: `${s}px`,
        borderRadius: '50%',
        pointerEvents: 'none', // So that the cursor doesn't interfere with other elements
        zIndex: 8888, // Ensure cursor is on top
        transform: 'translate(-50%, -50%)',
        mixBlendMode: videoSrc ? 'normal' : 'difference',
      }}
    >
      {videoSrc && (
        <img
          className=""
          style={{
            zIndex: 9999,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          src={videoSrc}
        />
      )}
    </div>
  );
};

export default CustomCursor;
