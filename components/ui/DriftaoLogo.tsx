
import React from 'react';

interface LogoProps {
  className?: string;
  color?: string;
}

export const DriftaoLogo: React.FC<LogoProps> = ({ className = "w-10 h-10", color = "currentColor" }) => {
  // We use CSS masks to render the PNG image. 
  // This allows us to strictly control the color of the logo using CSS (bg-current),
  // ensuring it works in the Pink header, White loader, and Themed generated pages.
  return (
    <div 
      className={`${className} bg-current`}
      style={{
        maskImage: 'url("/logo.png")',
        WebkitMaskImage: 'url("/logo.png")',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        // If a specific color prop is passed (overriding the class text color), apply it here
        ...(color !== 'currentColor' ? { backgroundColor: color } : {})
      }}
      role="img"
      aria-label="Driftao Logo"
    />
  );
};
