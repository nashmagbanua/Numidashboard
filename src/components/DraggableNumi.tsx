
import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { AIPanel } from './AIPanel';
import numiImage from '../assets/numi-doll.png';

// ✅ 1. MOBILE DETECTION HOOK – ILAGAY ITO SA ITAAS
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

// ✅ 2. MAIN COMPONENT – ILALAGAY SA ILALIM NITO
const DraggableNumi = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      <Draggable disabled={isMobile}>
        <div
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000,
            cursor: 'pointer',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'bounce 2s infinite'
          }}
        >
          <img
            src={numiImage}
            alt="Numi"
            style={{ width: '70px', height: '70px', borderRadius: '50%' }}
          />
        </div>
      </Draggable>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: isMobile ? '0' : '10%',
            left: isMobile ? '0' : '50%',
            transform: isMobile ? 'none' : 'translateX(-50%)',
            width: isMobile ? '100%' : '90%',
            height: isMobile ? '100%' : 'auto',
            maxWidth: '500px',
            zIndex: 1001,
            backgroundColor: 'white',
            borderRadius: isMobile ? '0' : '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            padding: '20px',
            overflowY: 'auto'
          }}
        >
          <button
            onClick={() => setIsOpen(false)}
            style={{
              position: 'absolute',
              top: 10,
              right: 15,
              fontSize: '18px',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            ❌
          </button>
          <AIPanel isOpen={true} onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
};

export default DraggableNumi;
