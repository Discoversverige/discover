"use client";

import { useMemo } from "react";
import type { Route } from "@/lib/routes";
import type { Lang } from "@/lib/i18n";

interface Props {
  route: Route;
  activeStop: number;
  onStopClick: (i: number) => void;
  lang: Lang;
}

export default function MalmoMap({ route, activeStop, onStopClick, lang }: Props) {
  const stops = route.stops;

  const pathD = stops.map((s, i) => `${i === 0 ? "M" : "L"} ${s.x} ${s.y}`).join(" ");

  const totalLen = useMemo(() => {
    let len = 0;
    for (let i = 1; i < stops.length; i++) {
      const dx = stops[i].x - stops[i - 1].x;
      const dy = stops[i].y - stops[i - 1].y;
      len += Math.sqrt(dx * dx + dy * dy);
    }
    return len;
  }, [stops]);

  return (
    <svg viewBox="0 0 1000 700" className="malmo-svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(20,25,30,0.04)" strokeWidth="1" />
        </pattern>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9dce4" />
          <stop offset="100%" stopColor="#dde8ec" />
        </linearGradient>
        <radialGradient id="routeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="1000" height="700" fill="url(#sea)" />

      <g opacity="0.25" stroke="#8fb0bd" strokeWidth="1" fill="none">
        <path d="M 0 80 Q 50 75, 100 80 T 200 80 T 300 80 T 400 80 T 500 80 T 600 80" />
        <path d="M 100 120 Q 150 115, 200 120 T 300 120 T 400 120 T 500 120 T 600 120 T 700 120" />
        <path d="M 0 160 Q 50 155, 100 160 T 200 160 T 300 160 T 400 160 T 500 160" />
      </g>

      <path d="M 0 700 L 0 380 Q 60 340, 140 330 Q 200 290, 260 270 Q 320 230, 390 200 Q 450 180, 520 210 Q 600 230, 680 280 Q 780 320, 880 360 Q 960 390, 1000 420 L 1000 700 Z" fill="#f0ead8" />
      <path d="M 0 380 Q 60 340, 140 330 Q 200 290, 260 270 Q 320 230, 390 200 Q 450 180, 520 210 Q 600 230, 680 280 Q 780 320, 880 360 Q 960 390, 1000 420" fill="none" stroke="#d6cba8" strokeWidth="2" />

      <ellipse cx="360" cy="440" rx="85" ry="55" fill="#d4e0bf" opacity="0.9" />
      <ellipse cx="530" cy="560" rx="90" ry="60" fill="#d4e0bf" opacity="0.9" />
      <ellipse cx="690" cy="560" rx="55" ry="40" fill="#d4e0bf" opacity="0.9" />

      <path d="M 200 420 Q 300 400, 430 395 Q 550 390, 680 400 Q 780 410, 850 430" fill="none" stroke="#c9dce4" strokeWidth="14" strokeLinecap="round" />
      <path d="M 440 340 L 440 420" stroke="#c9dce4" strokeWidth="10" strokeLinecap="round" />

      <rect x="0" y="0" width="1000" height="700" fill="url(#grid)" />

      <g className="place-labels" fontFamily="'JetBrains Mono', monospace" fontSize="10" fill="#7a7668" letterSpacing="1.5">
        <text x="120" y="110" opacity="0.6">ÖRESUND</text>
        <text x="350" y="460" opacity="0.55">SLOTTSPARKEN</text>
        <text x="510" y="585" opacity="0.55">PILDAMMARNA</text>
        <text x="680" y="585" opacity="0.55">FOLKETS PARK</text>
        <text x="440" y="305" opacity="0.55">GAMLA STAN</text>
        <text x="620" y="470" opacity="0.55">MÖLLEVÅNGEN</text>
        <text x="240" y="260" opacity="0.55">RIBERSBORG</text>
        <text x="460" y="120" opacity="0.55">VÄSTRA HAMNEN</text>
      </g>

      <path d={pathD} stroke="url(#routeGlow)" strokeWidth="40" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <path key={route.title.sv + "-bg"} d={pathD} stroke="var(--accent)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 6" opacity="0.35" />
      <path key={route.title.sv + "-fg"} className="route-draw" d={pathD} stroke="var(--accent)" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: totalLen, strokeDashoffset: totalLen }} />

      {stops.map((stop, i) => {
        const isActive = i === activeStop;
        const delay = 0.6 + i * 0.2;
        return (
          <g key={i} className="map-stop" style={{ animationDelay: `${delay}s`, cursor: "pointer" }} onClick={() => onStopClick(i)}>
            {isActive && <circle cx={stop.x} cy={stop.y} r="26" fill="var(--accent)" opacity="0.15" className="halo" />}
            <circle cx={stop.x} cy={stop.y} r="14" fill="#faf7ee" stroke="var(--accent)" strokeWidth="2.5" />
            <text x={stop.x} y={stop.y + 4} textAnchor="middle" fontFamily="'Inter Tight', sans-serif" fontSize="11" fontWeight="600" fill="var(--accent)">
              {String.fromCharCode(65 + i)}
            </text>
            <g transform={`translate(${stop.x + 22}, ${stop.y - 6})`}>
              <text fontFamily="'Instrument Serif', serif" fontSize="16" fill="#1a1814" className="stop-name">
                {stop.name[lang] || stop.name.en}
              </text>
              <text y="15" fontFamily="'JetBrains Mono', monospace" fontSize="9" fill="#7a7668" letterSpacing="1" className="stop-kind">
                {(stop.kind[lang] || stop.kind.en).toUpperCase()}
              </text>
            </g>
          </g>
        );
      })}

      <g transform="translate(930, 80)" fontFamily="'JetBrains Mono', monospace" fontSize="9" fill="#7a7668">
        <circle r="22" fill="none" stroke="#d6cba8" strokeWidth="1" />
        <text y="-26" textAnchor="middle" fontWeight="600" fill="#1a1814">N</text>
        <line y1="-18" y2="14" stroke="#1a1814" strokeWidth="1.5" />
        <polygon points="0,-18 -4,-10 4,-10" fill="var(--accent)" />
      </g>
    </svg>
  );
}
