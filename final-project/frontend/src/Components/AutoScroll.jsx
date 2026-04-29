import React, { useEffect, useRef, useState } from "react";
import Card from "./Card.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AutoScroll = ({ count = 8, pxPerSec = 220 }) => {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const lastRef = useRef(null);
  const [paused, setPaused] = useState(false);

  const items = Array.from({ length: count }).map((_, i) => i);
  const loopItems = [...items, ...items];

  const speed = pxPerSec / 1000;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.scrollLeft = 0;

    const step = (time) => {
      if (!lastRef.current) lastRef.current = time;
      const delta = time - lastRef.current;
      lastRef.current = time;

      if (!paused) {
        el.scrollLeft += speed * delta;

        // Only reset if running, not while paused
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft -= el.scrollWidth / 2;
        }
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastRef.current = null;
    };
  }, [paused, speed, count]);

  const manualScroll = (deltaPx) => {
    const el = containerRef.current;
    if (!el) return;
    setPaused(true);
    el.scrollBy({ left: deltaPx, behavior: "smooth" });

    setTimeout(() => {
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft -= el.scrollWidth / 2;
      }
      setPaused(false);
    }, 600);
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => manualScroll(-300)}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow hover:bg-gray-100"
      >
        <ChevronLeft size={20} />
      </button>

      <div
        ref={containerRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="flex gap-4 px-4 overflow-hidden hide-scrollbar"
        style={{ alignItems: "stretch" }}
      >
        {loopItems.map((_, idx) => (
          <div key={idx} className="flex-shrink-0 min-w-[220px]">
            <Card />
          </div>
        ))}
      </div>

      <button
        onClick={() => manualScroll(300)}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow hover:bg-gray-100"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default AutoScroll;
