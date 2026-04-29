import { Link } from "react-router-dom";
import { ShoppingCart, Tag } from "lucide-react";

const Button = ({ hrefLink = '#', btnName = 'Click Me', colorName = 'white' }) => {
  const isBuy = btnName.toLowerCase() === 'buy';

  return (
    <Link
      to={hrefLink}
      className={`
        relative inline-flex items-center justify-center gap-4
        px-14 py-5 text-xl font-black tracking-[0.15em] uppercase
        rounded-[1.2rem] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
        hover:scale-[1.05] active:scale-[0.98] group
        ${isBuy 
          ? "bg-[#056973] text-white shadow-[0_15px_35px_rgba(5,105,115,0.3)] hover:shadow-[0_20px_45px_rgba(5,105,115,0.5)] border-2 border-[#056973]" 
          : "bg-transparent text-[#056973] border-2 border-[#056973] hover:bg-[#056973]/5"
        }
      `}
    >
      {isBuy ? (
        <ShoppingCart size={28} strokeWidth={2.5} className="group-hover:rotate-[-10deg] transition-transform duration-300" />
      ) : (
        <Tag size={28} strokeWidth={2.5} className="group-hover:rotate-[10deg] transition-transform duration-300" />
      )}
      
      <span className="relative z-10">{btnName}</span>
      
      {/* Premium Border Glow for Buy Button */}
      {isBuy && (
        <div className="absolute inset-0 rounded-[1.2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[inset_0_0_20px_rgba(255,255,255,0.2)]" />
      )}
    </Link>
  );
};

export default Button;