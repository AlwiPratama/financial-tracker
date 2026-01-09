import svgPaths from "../../imports/svg-honplui1vr";

interface LogoProps {
  size?: number;
  className?: string;
  isDark?: boolean;
}

export const Logo = ({ size = 70, className = "", isDark = false }: LogoProps) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg 
        className="block size-full" 
        fill="none" 
        preserveAspectRatio="xMidYMid meet" 
        viewBox="0 0 70 70"
      >
        <g id="Frame 1">
          <rect 
            fill={isDark ? "#2DD4BF" : "#14B8A6"} 
            height="70" 
            id="Rectangle 1" 
            rx="28" 
            width="70" 
          />
          <path 
            d={svgPaths.p3c6c1800} 
            fill={isDark ? "#0F172A" : "#FFFFFF"} 
            id="Union" 
          />
        </g>
      </svg>
    </div>
  );
};
