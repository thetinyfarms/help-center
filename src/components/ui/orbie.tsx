'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface OrbieProps {
  state?: string;
  icon?: boolean;
  hover?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const SharedDefs = () => (
  <defs>
    <filter id="head-glow" x="8.00004" y="5.99983" width="55.4412" height="55.4412" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feMorphology radius="20" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_168_1015"/>
        <feOffset/>
        <feGaussianBlur stdDeviation="7.35294"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_168_1015"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_168_1015" result="shape"/>
    </filter>
    <filter id="glow" x="0.352942" y="-1.64706" width="75.2941" height="75.2941" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset/>
        <feGaussianBlur stdDeviation="8.82353"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.873684 0 0 0 0 0.84 0 0 0 0 1 0 0 0 1 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_168_1015"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset/>
        <feGaussianBlur stdDeviation="8.82353"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.873684 0 0 0 0 0.84 0 0 0 0 1 0 0 0 1 0"/>
        <feBlend mode="normal" in2="effect1_dropShadow_168_1015" result="effect2_dropShadow_168_1015"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset/>
        <feGaussianBlur stdDeviation="1.05882"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.780392 0 0 0 0 0.717647 0 0 0 0 0.984314 0 0 0 1 0"/>
        <feBlend mode="normal" in2="effect2_dropShadow_168_1015" result="effect3_dropShadow_168_1015"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect3_dropShadow_168_1015" result="shape"/>
    </filter>
    <filter id="sphere" x="10.9412" y="11.2941" width="52.9412" height="47.0588" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feMorphology radius="0.294118" operator="erode" in="SourceAlpha" result="effect1_innerShadow_168_1015"/>
        <feOffset dx="2.35294" dy="-0.588235"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.2 0 0 0 0 0.0745098 0 0 0 0 0.407843 0 0 0 1 0"/>
        <feBlend mode="screen" in2="shape" result="effect1_innerShadow_168_1015"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feMorphology radius="0.294118" operator="erode" in="SourceAlpha" result="effect2_innerShadow_168_1015"/>
        <feOffset dx="0.441176" dy="0.441176"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/>
        <feBlend mode="normal" in2="effect1_innerShadow_168_1015" result="effect2_innerShadow_168_1015"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-2.35294" dy="-2.35294"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.305618 0 0 0 0 0.122247 0 0 0 0 0.557753 0 0 0 0.1 0"/>
        <feBlend mode="multiply" in2="effect2_innerShadow_168_1015" result="effect3_innerShadow_168_1015"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="7.05882"/>
        <feGaussianBlur stdDeviation="2.94118"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.38 0 0 0 0 0.724444 0 0 0 0 1 0 0 0 1 0"/>
        <feBlend mode="soft-light" in2="effect3_innerShadow_168_1015" result="effect4_innerShadow_168_1015"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-7.05882" dy="2.35294"/>
        <feGaussianBlur stdDeviation="4.11765"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.972549 0 0 0 0 0.505882 0 0 0 0 0.917647 0 0 0 1 0"/>
        <feBlend mode="soft-light" in2="effect4_innerShadow_168_1015" result="effect5_innerShadow_168_1015"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-15.2941" dy="-11.7647"/>
        <feGaussianBlur stdDeviation="2.35294"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.3219 0 0 0 0 0.87 0 0 0 0 0.43152 0 0 0 1 0"/>
        <feBlend mode="soft-light" in2="effect5_innerShadow_168_1015" result="effect6_innerShadow_168_1015"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feMorphology radius="0.294118" operator="erode" in="SourceAlpha" result="effect7_innerShadow_168_1015"/>
        <feOffset dx="-0.588235" dy="-0.588235"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.271137 0 0 0 0 0.609297 0 0 0 0 0.97 0 0 0 1 0"/>
        <feBlend mode="luminosity" in2="effect6_innerShadow_168_1015" result="effect7_innerShadow_168_1015"/>
    </filter>
    <filter id="left-eye" x="16.1176" y="24.1178" width="13.2647" height="13.2647" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feMorphology radius="1.17647" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_168_1015"/>
        <feOffset/>
        <feGaussianBlur stdDeviation="2.35294"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.780392 0 0 0 0 0.717647 0 0 0 0 0.984314 0 0 0 1 0"/>
        <feBlend mode="overlay" in2="BackgroundImageFix" result="effect1_dropShadow_168_1015"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_168_1015" result="shape"/>
    </filter>
    <filter id="right-eye" x="26.1176" y="26.1178" width="13.2647" height="13.2647" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feMorphology radius="1.17647" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_168_1015"/>
        <feOffset/>
        <feGaussianBlur stdDeviation="2.35294"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.780392 0 0 0 0 0.717647 0 0 0 0 0.984314 0 0 0 1 0"/>
        <feBlend mode="overlay" in2="BackgroundImageFix" result="effect1_dropShadow_168_1015"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_168_1015" result="shape"/>
    </filter>
    <radialGradient id="paint0_radial_168_1015" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(53.8824 49.0882) rotate(-137.936) scale(40.6079)">
        <stop offset="0.15" stopColor="#459BF7"/>
        <stop offset="0.863148" stopColor="#8344E9" stopOpacity="0"/>
        <stop offset="0.948787" stopColor="#925FF2"/>
    </radialGradient>
    <radialGradient id="paint1_radial_168_1015" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(45.9412 18.6471) rotate(-148.955) scale(35.359 19.1193)">
        <stop stopColor="#F881EA"/>
        <stop offset="0.75" stopColor="#CD37B9" stopOpacity="0"/>
    </radialGradient>
    <radialGradient id="paint2_radial_168_1015" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(40.0588 36) rotate(-74.8355) scale(32.606 11.8112)">
        <stop stopColor="#E755D6"/>
        <stop offset="0.75" stopColor="#CD37B9" stopOpacity="0"/>
    </radialGradient>
    <radialGradient id="paint3_radial_168_1015" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(23.4412 50.4118) rotate(-30.0285) scale(47.8999 22.1708)">
        <stop stopColor="#00C74F"/>
        <stop offset="0.75" stopColor="#00C74F" stopOpacity="0"/>
    </radialGradient>
    <radialGradient id="paint4_radial_168_1015" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(18 40.1176) rotate(-12.4332) scale(19.125 16.6117)">
        <stop stopColor="#52DE6E"/>
        <stop offset="0.75" stopColor="#00C74F" stopOpacity="0"/>
    </radialGradient>
    <radialGradient id="paint5_radial_168_1015" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(18 29.8235) rotate(28.0179) scale(36.3149 23.6168)">
        <stop stopColor="#61B9FF"/>
        <stop offset="0.75" stopColor="#459BF7" stopOpacity="0"/>
    </radialGradient>
    <linearGradient id="paint6_linear_168_1015" x1="27.1175" y1="42.3238" x2="29.477" y2="50.4759" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" stopOpacity="0"/>
        <stop offset="0.45" stopColor="white"/>
        <stop offset="0.85" stopColor="white" stopOpacity="0.5"/>
        <stop offset="1" stopColor="white" stopOpacity="0"/>
    </linearGradient>
    <linearGradient id="paint7_linear_168_1015" x1="31.3333" y1="36.4168" x2="23.7228" y2="31.3584" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" stopOpacity="0"/>
        <stop offset="0.45" stopColor="white"/>
        <stop offset="0.85" stopColor="white" stopOpacity="0.5"/>
        <stop offset="1" stopColor="white" stopOpacity="0"/>
    </linearGradient>
  </defs>
);
const baseClasses = "absolute !size-full top-0 left-0 pointer-events-none transition-[left,top,transform] duration-[150ms,150ms,150ms]"
const hoverClasses = "group-hover:scale-[1.15]"

const OrbieGlow = React.memo(({className, state, hover}: { className?: string; state?: any; hover?: boolean; }) => (
  <svg
    viewBox="0 0 74 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      baseClasses,
      "orbie-glow absolute size-full top-0 left-0 opacity-50 transition-[left,top,transform,opacity] duration-[150ms,150ms,150ms,1s]",
      hover && hoverClasses + " group-hover:opacity-80",
      state === "thinking" && "opacity-100 animate-pulse",
      state === "ping" && "opacity-100 animate-ping",
      className
    )}
  >
    <SharedDefs />
    <g filter="url(#glow)">
      <path d="M52.1421 50.1421C44.3317 57.9526 31.6684 57.9526 23.8579 50.1421C16.0474 42.3317 16.0474 29.6684 23.8579 21.8579C31.6684 14.0474 44.3317 14.0474 52.1421 21.8579C59.9526 29.6684 59.9526 42.3317 52.1421 50.1421Z" fill="white" fillOpacity="0.01" shapeRendering="crispEdges"/>
    </g>
  </svg>
));
OrbieGlow.displayName = 'OrbieGlow';

const OrbieSphere = React.memo(({hover, state}: { hover?: boolean; state?: string; }) => (
  <svg
    viewBox="0 0 74 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      baseClasses,
      "orbie-sphere absolute size-full top-0 left-0 pointer-events-none",
      hover && hoverClasses,
    )}
  >
    <SharedDefs />
    <g filter="url(#sphere)">
      <path d="M52.1421 50.1421C44.3317 57.9526 31.6684 57.9526 23.8579 50.1421C16.0474 42.3317 16.0474 29.6684 23.8579 21.8579C31.6684 14.0474 44.3317 14.0474 52.1421 21.8579C59.9526 29.6684 59.9526 42.3317 52.1421 50.1421Z" fill="url(#paint0_radial_168_1015)" className="backdrop-blur-sm"/>
      <path d="M52.1421 50.1421C44.3317 57.9526 31.6684 57.9526 23.8579 50.1421C16.0474 42.3317 16.0474 29.6684 23.8579 21.8579C31.6684 14.0474 44.3317 14.0474 52.1421 21.8579C59.9526 29.6684 59.9526 42.3317 52.1421 50.1421Z" fill="url(#paint1_radial_168_1015)" className="backdrop-blur-sm"/>
      <path d="M52.1421 50.1421C44.3317 57.9526 31.6684 57.9526 23.8579 50.1421C16.0474 42.3317 16.0474 29.6684 23.8579 21.8579C31.6684 14.0474 44.3317 14.0474 52.1421 21.8579C59.9526 29.6684 59.9526 42.3317 52.1421 50.1421Z" fill="url(#paint2_radial_168_1015)" className="backdrop-blur-sm"/>
      <path d="M52.1421 50.1421C44.3317 57.9526 31.6684 57.9526 23.8579 50.1421C16.0474 42.3317 16.0474 29.6684 23.8579 21.8579C31.6684 14.0474 44.3317 14.0474 52.1421 21.8579C59.9526 29.6684 59.9526 42.3317 52.1421 50.1421Z" fill="url(#paint3_radial_168_1015)" className="backdrop-blur-sm"/>
      <path d="M52.1421 50.1421C44.3317 57.9526 31.6684 57.9526 23.8579 50.1421C16.0474 42.3317 16.0474 29.6684 23.8579 21.8579C31.6684 14.0474 44.3317 14.0474 52.1421 21.8579C59.9526 29.6684 59.9526 42.3317 52.1421 50.1421Z" fill="url(#paint4_radial_168_1115)" className="backdrop-blur-sm"/>
      <path d="M52.1421 50.1421C44.3317 57.9526 31.6684 57.9526 23.8579 50.1421C16.0474 42.3317 16.0474 29.6684 23.8579 21.8579C31.6684 14.0474 44.3317 14.0474 52.1421 21.8579C59.9526 29.6684 59.9526 42.3317 52.1421 50.1421Z" fill="url(#paint5_radial_168_1015)" className="backdrop-blur-sm" fillOpacity="0.9"/>
    </g>
  </svg>
));
OrbieSphere.displayName = 'OrbieSphere';

const OrbieFace = React.memo(({className, state, hover}: { className?: string; state?: any; hover?: boolean; }) => (
  <svg
    viewBox="0 0 74 72" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      baseClasses,
      "orbie-face absolute size-full opacity-0 transition-all duration-200 delay-0 left-[12%] bottom-[-5%] scale-x-[-0.7] scale-y-[0.7]",
      state !== "hidden" && "delay-150 opacity-100 left-[4%] bottom-0 scale-x-[-0.95] scale-y-[0.95]",
      hover && hoverClasses,
      className
    )}
  >
    <SharedDefs />
    <g>
      <path d="M55.268 33.0364C48.5108 46.7 28.6522 50.2271 21.6515 48.047C20.7389 47.7628 17.7553 46.007 20.4105 43.0108" stroke="url(#paint6_linear_168_1015)" strokeLinecap="round" strokeWidth={1.5}/>
      <path d="M48.5821 13.6847C34.8453 14.6766 23.5799 32.2682 23.2812 39.3857C23.2422 40.3136 23.8892 43.6219 27.5835 42.1942" stroke="url(#paint7_linear_168_1015)" strokeLinecap="round" strokeWidth={1.5}/>
      <g filter="url(#left-eye)">
          <circle cx="22.75" cy="30.7502" r="1" fill="white"/>
      </g>
      <g filter="url(#right-eye)">
          <circle cx="32.75" cy="32.7502" r="1" fill="white"/>
      </g>
    </g>
  </svg>
));

const OrbieCustomContent = React.memo(({state, hover, children}: { state?: any; hover?: boolean; children: React.ReactNode; }) => (
  <div className={cn(
    baseClasses,
    "orbie-custom absolute size-full top-0 left-0 flex items-center justify-center ml-0.25 pointer-events-none hover:group:-mt-3",
    hover && hoverClasses,
    state !== "hidden" && "opacity-0",
  )}>
    {children}
  </div>
));


const Orbie = React.memo(function Orbie({
  state = "hidden",
  icon = false,
  hover = false,
  className,
  children,
}: OrbieProps) {
  return (
    <div
    className={cn("relative group", icon && "pointer-events-none", className)}
    >
      <OrbieGlow state={state} hover={hover} />
      <OrbieSphere state={state} hover={hover} />
      {children}
    </div>
  );
});

export const OrbieIndicator = ({className = "", state = "idle"}) => (
  <Orbie icon state={state} className={cn("absolute -top-1.5 -right-1.5 size-5 shrink-0", className)} />
);

export const OrbieBackground = ({className = ""}) => (
  <div className={cn("z-[-1] !bg-ai !absolute top-0 right-0 !size-full pointer-events-none overflow-hidden", className)} />
);

export { Orbie, OrbieFace, OrbieCustomContent };
