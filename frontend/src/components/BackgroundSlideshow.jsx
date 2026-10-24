import React, { useState, useEffect } from 'react';

const images = [
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=3000&auto=format&fit=crop', // Lush Valley
  'https://images.unsplash.com/photo-1542451313056-b7c8e626645f?q=80&w=3000&auto=format&fit=crop', // Mountain Lake
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=3000&auto=format&fit=crop', // Forest Path
  'https://images.unsplash.com/photo-1444459094776-88af74d22187?q=80&w=3000&auto=format&fit=crop', // Snowy peak / nature
];

const BackgroundSlideshow = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3000); // 3 seconds
        
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: -1,
            overflow: 'hidden'
        }}>
            {images.map((img, index) => (
                <div
                    key={img}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${img})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transition: 'opacity 1.5s ease-in-out',
                        opacity: index === currentIndex ? 1 : 0
                    }}
                />
            ))}
            {/* Overlay to ensure the premium glass UI remains perfectly readable against bright nature photos */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(3px)',
                WebkitBackdropFilter: 'blur(3px)'
            }} />
        </div>
    );
};

export default BackgroundSlideshow;
