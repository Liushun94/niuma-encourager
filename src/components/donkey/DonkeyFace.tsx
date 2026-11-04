const INK = '#2e2419';
const BODY = '#a9998a';
const MANE = '#5c4a3c';

interface DonkeyFaceProps {
  headphones?: boolean;
  expression?: 'happy' | 'phone';
  className?: string;
}

/** 正面的驴头，用来做听歌摸鱼和设置页的形象 */
export function DonkeyFace({
  headphones = false,
  expression = 'happy',
  className,
}: DonkeyFaceProps) {
  return (
    <g className={className}>
      {/* 肩膀 */}
      <path
        d="M 88 400 C 88 340, 134 312, 200 312 C 266 312, 312 340, 312 400 Z"
        fill={BODY}
        stroke={INK}
        strokeWidth="5"
        strokeLinejoin="round"
      />

      {/* 耳朵 */}
      <path
        d="M 146 142 C 116 94, 104 48, 128 41 C 154 34, 174 94, 180 134 Z"
        fill={BODY}
        stroke={INK}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M 254 142 C 284 94, 296 48, 272 41 C 246 34, 226 94, 220 134 Z"
        fill={BODY}
        stroke={INK}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M 152 127 C 132 90, 125 64, 136 61 C 148 57, 162 96, 167 122 Z"
        fill="#e6a99f"
      />
      <path
        d="M 248 127 C 268 90, 275 64, 264 61 C 252 57, 238 96, 233 122 Z"
        fill="#e6a99f"
      />

      {/* 头 */}
      <path
        d="M 200 104 C 260 104, 296 148, 296 212 C 296 258, 276 294, 246 314 L 241 338 C 236 354, 164 354, 159 338 L 154 314 C 124 294, 104 258, 104 212 C 104 148, 140 104, 200 104 Z"
        fill={BODY}
        stroke={INK}
        strokeWidth="5"
        strokeLinejoin="round"
      />

      {/* 口鼻 */}
      <ellipse
        cx="200"
        cy="313"
        rx="58"
        ry="41"
        fill="#e3d7c7"
        stroke={INK}
        strokeWidth="4"
      />
      <ellipse cx="181" cy="311" rx="4.5" ry="6" fill={INK} opacity="0.85" />
      <ellipse cx="219" cy="311" rx="4.5" ry="6" fill={INK} opacity="0.85" />
      <path
        d="M 184 331 Q 200 342 216 331"
        fill="none"
        stroke={INK}
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* 眼睛 */}
      {expression === 'phone' ? (
        <>
          <g>
            <ellipse cx="167" cy="240" rx="10" ry="11.5" fill="#fffdf6" stroke={INK} strokeWidth="4" />
            <circle cx="169.5" cy="246" r="4.8" fill={INK} />
            <circle cx="171.2" cy="243.8" r="1.5" fill="#fffdf6" />
            <rect x="162" y="250" width="7" height="2.4" rx="1.2" fill="#9ec7d6" opacity="0.9" />
          </g>
          <g>
            <ellipse cx="233" cy="240" rx="10" ry="11.5" fill="#fffdf6" stroke={INK} strokeWidth="4" />
            <circle cx="230.5" cy="246" r="4.8" fill={INK} />
            <circle cx="228.8" cy="243.8" r="1.5" fill="#fffdf6" />
            <rect x="231" y="250" width="7" height="2.4" rx="1.2" fill="#9ec7d6" opacity="0.9" />
          </g>
          <path d="M 150 226 L 146 220 M 250 226 L 254 220" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path
            d="M 155 240 Q 167 225 179 240"
            fill="none"
            stroke={INK}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M 221 240 Q 233 225 245 240"
            fill="none"
            stroke={INK}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path d="M 151 230 L 146 223 M 249 230 L 254 223" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        </>
      )}

      {/* 腮红 */}
      <ellipse cx="136" cy="275" rx="17" ry="10" fill="#e59a86" opacity="0.55" />
      <ellipse cx="264" cy="275" rx="17" ry="10" fill="#e59a86" opacity="0.55" />

      {/* 额前呆毛 */}
      <path
        d="M 185 112 C 182 96, 190 86, 199 92 C 208 86, 216 96, 213 112 C 204 106, 194 106, 185 112 Z"
        fill={MANE}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* 小围巾 */}
      <path
        d="M 140 344 C 166 358, 234 358, 260 344 L 266 366 C 234 380, 166 380, 134 366 Z"
        fill="#3f5c43"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M 200 364 L 214 386 L 198 380 L 186 386 Z" fill="#3f5c43" stroke={INK} strokeWidth="3" strokeLinejoin="round" />

      {headphones && (
        <g className="headphone">
          <path
            d="M 110 204 C 106 116, 150 86, 200 86 C 250 86, 294 116, 290 204"
            fill="none"
            stroke="#3f5c43"
            strokeWidth="17"
            strokeLinecap="round"
          />
          <path
            d="M 110 204 C 106 116, 150 86, 200 86 C 250 86, 294 116, 290 204"
            fill="none"
            stroke="#6f8a6d"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.7"
          />
          <g>
            <rect
              x="84"
              y="186"
              width="56"
              height="88"
              rx="24"
              fill="#e8892e"
              stroke={INK}
              strokeWidth="5"
            />
            <rect x="98" y="200" width="28" height="60" rx="13" fill="#c96a17" />
            <circle cx="112" cy="258" r="4" fill="#ecb441" />
          </g>
          <g>
            <rect
              x="260"
              y="186"
              width="56"
              height="88"
              rx="24"
              fill="#e8892e"
              stroke={INK}
              strokeWidth="5"
            />
            <rect x="274" y="200" width="28" height="60" rx="13" fill="#c96a17" />
            <circle cx="288" cy="258" r="4" fill="#ecb441" />
          </g>
          <path
            d="M 312 272 C 324 294, 308 310, 320 330"
            fill="none"
            stroke={INK}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>
      )}
    </g>
  );
}
