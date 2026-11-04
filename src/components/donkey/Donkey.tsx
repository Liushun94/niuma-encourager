const INK = '#2e2419';
const BODY = '#a9998a';
const BODY_DARK = '#8f7f71';
const BELLY = '#cbbcac';
const MANE = '#5c4a3c';

interface DonkeyProps {
  flinching?: boolean;
}

/**
 * 侧面的拉磨驴。本地坐标：原点在蹄子下沿，朝 +x 方向。
 * 草料的支点装在头顶，胡萝卜悬在鼻子前方。
 */
export function Donkey({ flinching = false }: DonkeyProps) {
  return (
    <g className={`donkey${flinching ? ' is-flinching' : ''}`}>
      {/* 尾巴 */}
      <g className="donkey-tail">
        <path
          d="M -45 -58 C -58 -64, -66 -54, -61 -43"
          fill="none"
          stroke={MANE}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M -62 -45 C -66 -39, -63 -33, -59 -32 C -55 -31, -54 -37, -57 -43 Z"
          fill={MANE}
          stroke={INK}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>

      {/* 远侧腿 */}
      <Leg x={-31} dark phase="b" />
      <Leg x={31} dark phase="b" />

      {/* 身体和头 */}
      <g className="donkey-bob">
        <ellipse
          cx="0"
          cy="-53"
          rx="48"
          ry="28"
          transform="rotate(-4)"
          fill={BODY}
          stroke={INK}
          strokeWidth="3.5"
        />
        <path
          d="M -34 -62 C -18 -74, 12 -77, 28 -66"
          fill="none"
          stroke={BELLY}
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M -24 -33 C -8 -26, 16 -26, 32 -34"
          fill="none"
          stroke={BELLY}
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* 脖子 */}
        <path
          d="M 24 -68 C 28 -92, 40 -104, 54 -100 L 66 -84 C 56 -68, 40 -62, 24 -68 Z"
          fill={BODY}
          stroke={INK}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        <g className="donkey-head">
          {/* 耳朵 */}
          <path
            d="M 52 -114 C 44 -132, 38 -150, 45 -153 C 52 -156, 59 -136, 62 -119 Z"
            fill={BODY}
            stroke={INK}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M 64 -119 C 61 -138, 65 -156, 72 -154 C 79 -152, 77 -133, 73 -117 Z"
            fill={BODY}
            stroke={INK}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M 67 -123 C 65 -136, 67 -145, 70 -144 C 73 -143, 72 -132, 70 -122 Z"
            fill="#e6a99f"
          />

          {/* 头 */}
          <path
            d="M 46 -104 C 45 -117, 56 -125, 68 -120 C 81 -115, 89 -103, 89 -91 C 89 -80, 82 -72, 71 -71 C 58 -70, 47 -81, 46 -92 Z"
            fill={BODY}
            stroke={INK}
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* 口鼻 */}
          <ellipse
            cx="79"
            cy="-82"
            rx="13"
            ry="10"
            fill="#ddd0c0"
            stroke={INK}
            strokeWidth="2.8"
          />
          <circle cx="84.5" cy="-84.5" r="1.7" fill={INK} />
          <path
            d="M 79 -77 Q 83 -74.5 87 -77"
            fill="none"
            stroke={INK}
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* 眼睛 */}
          <path
            d="M 59 -100 Q 65 -95 71 -100"
            fill="none"
            stroke={INK}
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* 额前呆毛 */}
          <path
            d="M 58 -121 C 57 -128, 61 -132, 64 -128 C 63 -125, 64 -122, 66 -120"
            fill={MANE}
            stroke={INK}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          {/* 项圈 / 小铃铛 */}
          <path
            d="M 40 -75 C 47 -70, 54 -74, 57 -83"
            fill="none"
            stroke="#c9503c"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle
            cx="45"
            cy="-70"
            r="4.5"
            fill="#ecb441"
            stroke={INK}
            strokeWidth="2"
          />
          <path d="M 45 -66.5 v 2" stroke={INK} strokeWidth="1.6" />

          {/* 胡萝卜杆 */}
          <g className="carrot-rig">
            <path
              d="M 55 -119 C 53 -137, 53 -150, 57 -158 C 68 -163, 96 -160, 121 -157"
              fill="none"
              stroke="#8a5a2b"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 57 -158 C 70 -161, 96 -159, 121 -157"
              fill="none"
              stroke="#b07a41"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M 60 -150 L 66 -154 M 64 -144 L 71 -148"
              stroke="#6b431f"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M 121 -157 L 121 -135"
              stroke="#8a5a2b"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <g className="carrot-sway">
              <path
                d="M 121 -135 C 127 -135, 130 -128, 127 -121 L 121 -108 L 115 -121 C 112 -128, 115 -135, 121 -135 Z"
                fill="#ef8a2c"
                stroke={INK}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <path
                d="M 117 -128 L 119 -113 M 121 -130 L 121 -111 M 125 -128 L 123 -113"
                stroke="#c96a17"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M 121 -136 C 116 -142, 111 -142, 109 -138 M 121 -137 C 124 -144, 129 -145, 131 -141 M 121 -137 C 119 -145, 120 -149, 124 -150"
                fill="none"
                stroke="#3f5c43"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>
          </g>
        </g>
      </g>

      {/* 近侧腿 */}
      <Leg x={-18} phase="a" />
      <Leg x={43} phase="a" />
    </g>
  );
}

function Leg({
  x,
  dark = false,
  phase,
}: {
  x: number;
  dark?: boolean;
  phase: 'a' | 'b';
}) {
  return (
    <g className={`donkey-leg leg-${phase}${dark ? ' leg-dark' : ''}`}>
      <path
        d={`M ${x - 6} -32 L ${x + 6} -32 L ${x + 5} -5 Q ${x + 5} 0 ${x} 0 Q ${x - 5} 0 ${x - 5} -5 Z`}
        fill={dark ? BODY_DARK : BODY}
        stroke={INK}
        strokeWidth="3"
      />
      <rect
        x={x - 7}
        y={-6}
        width="14"
        height="6.5"
        rx="2.5"
        fill="#4a3b2e"
        stroke={INK}
        strokeWidth="2"
      />
    </g>
  );
}
