/** 所有动画场景共用的农场背景 */
export function Scenery() {
  return (
    <g className="scenery">
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdf8ec" />
          <stop offset="58%" stopColor="#f8e9cd" />
          <stop offset="100%" stopColor="#f2ddb8" />
        </linearGradient>
      </defs>

      <rect width="640" height="460" fill="url(#skyGrad)" />

      {/* 太阳 */}
      <circle cx="526" cy="86" r="36" fill="#f3b45a" opacity="0.9" />
      <circle
        cx="526"
        cy="86"
        r="50"
        fill="none"
        stroke="#e8a23e"
        strokeWidth="2"
        strokeDasharray="3 9"
        opacity="0.6"
      />

      {/* 云 */}
      <g className="cloud cloud-1" fill="#fffaf0" opacity="0.85">
        <ellipse cx="150" cy="92" rx="36" ry="17" />
        <ellipse cx="180" cy="84" rx="28" ry="20" />
        <ellipse cx="206" cy="95" rx="30" ry="14" />
      </g>
      <g className="cloud cloud-2" fill="#fffaf0" opacity="0.65">
        <ellipse cx="380" cy="138" rx="28" ry="12" />
        <ellipse cx="404" cy="130" rx="22" ry="15" />
        <ellipse cx="424" cy="139" rx="22" ry="10" />
      </g>

      {/* 远山 */}
      <path
        d="M0 292 C 70 258, 138 284, 208 268 C 286 250, 330 286, 404 276 C 480 266, 540 294, 640 270 L640 460 L0 460 Z"
        fill="#ddd2b4"
      />
      <path
        d="M0 320 C 90 296, 164 314, 244 302 C 330 289, 402 318, 486 308 C 556 300, 606 314, 640 306 L640 460 L0 460 Z"
        fill="#d3c5a3"
      />

      {/* 院子 */}
      <rect y="308" width="640" height="152" fill="#e9dcc2" />
      <ellipse cx="320" cy="332" rx="278" ry="104" fill="#e3d2ae" />
      <ellipse cx="320" cy="332" rx="278" ry="104" fill="none" stroke="#d5c197" strokeWidth="2" opacity="0.6" />

      {/* 草丛和石子 */}
      <path d="M56 356 l4 -12 l4 12 M66 356 l3 -8 l3 8" stroke="#b6a580" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M570 400 l4 -12 l4 12 M580 400 l3 -8 l3 8" stroke="#b6a580" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M96 416 l4 -10 l4 10 M105 416 l3 -7 l3 7" stroke="#b6a580" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="594" cy="352" rx="6" ry="3.5" fill="#cdbb95" />
      <ellipse cx="468" cy="430" rx="5" ry="3" fill="#cdbb95" />
      <ellipse cx="70" cy="340" rx="4" ry="2.5" fill="#cdbb95" />

      {/* 干草垛 */}
      <g transform="translate(72 340)">
        <ellipse cx="0" cy="34" rx="46" ry="10" fill="#8f7a52" opacity="0.16" />
        <rect x="-40" y="-2" width="80" height="38" rx="18" fill="#dbb96f" stroke="#8a6b35" strokeWidth="3" />
        <path d="M-30 4 h60 M-32 14 h64 M-30 24 h60" stroke="#c3a054" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M-12 -2 v38 M12 -2 v38" stroke="#c3a054" strokeWidth="2" opacity="0.6" />
      </g>
    </g>
  );
}
