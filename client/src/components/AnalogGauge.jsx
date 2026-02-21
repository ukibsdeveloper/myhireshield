import React from 'react';

/**
 * AnalogGauge - An SVG-based analog speedometer for displaying 0–100 scores.
 * - Red zone:    0–33
 * - Yellow zone: 34–66
 * - Green zone:  67–100
 *
 * Props:
 *  score    {number}  0–100 value
 *  size     {number}  diameter in px (default 160)
 *  label    {string}  optional bottom label
 *  animate  {boolean} default true
 */
const AnalogGauge = ({ score = 0, size = 160, label = 'Trust Score', animate = true }) => {
    const clampedScore = Math.max(0, Math.min(100, score));
    const cx = size / 2;
    const cy = size / 2;
    const r = (size / 2) * 0.72; // radius of arc
    const strokeWidth = size * 0.12;

    // Arc from 210° to 330° (240° sweep, semi-circle style like a real gauge)
    const startAngle = 210;
    const endAngle = 330;
    const sweepAngle = 300; // 210 to 330 going clockwise (360-210+330=480, but we want 300 degrees)

    // Convert degree to radian
    const toRad = (deg) => (deg * Math.PI) / 180;

    // Arc path helper
    const describeArc = (fromDeg, toDeg) => {
        const start = {
            x: cx + r * Math.cos(toRad(fromDeg)),
            y: cy + r * Math.sin(toRad(fromDeg)),
        };
        const end = {
            x: cx + r * Math.cos(toRad(toDeg)),
            y: cy + r * Math.sin(toRad(toDeg)),
        };
        const largeArc = toDeg - fromDeg > 180 ? 1 : 0;
        return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
    };

    // Map score (0–100) to angle within the 300° sweep (starting at 210°)
    const scoreToAngle = (s) => startAngle + (s / 100) * sweepAngle;

    // Zone boundaries in degrees
    const redEnd = scoreToAngle(33);
    const yellowEnd = scoreToAngle(66);

    // Needle tip position
    const needleAngle = scoreToAngle(clampedScore);
    const needleLength = r - strokeWidth / 2 - size * 0.04;
    const needleTip = {
        x: cx + needleLength * Math.cos(toRad(needleAngle)),
        y: cy + needleLength * Math.sin(toRad(needleAngle)),
    };
    const needleBase1 = {
        x: cx + (strokeWidth * 0.18) * Math.cos(toRad(needleAngle + 90)),
        y: cy + (strokeWidth * 0.18) * Math.sin(toRad(needleAngle + 90)),
    };
    const needleBase2 = {
        x: cx + (strokeWidth * 0.18) * Math.cos(toRad(needleAngle - 90)),
        y: cy + (strokeWidth * 0.18) * Math.sin(toRad(needleAngle - 90)),
    };
    const needleTailLength = r * 0.22;
    const needleTail = {
        x: cx - needleTailLength * Math.cos(toRad(needleAngle)),
        y: cy - needleTailLength * Math.sin(toRad(needleAngle)),
    };

    // Color based on score
    const getColor = (s) => {
        if (s >= 67) return '#4c8051';
        if (s >= 34) return '#d4a017';
        return '#da8b86';
    };
    const scoreColor = getColor(clampedScore);

    // Score label
    const getLabel = (s) => {
        if (s >= 67) return 'Excellent';
        if (s >= 34) return 'Average';
        return 'Poor';
    };

    // Tick marks for the gauge
    const ticks = [];
    for (let i = 0; i <= 10; i++) {
        const angle = scoreToAngle(i * 10);
        const isMain = i % 5 === 0;
        const innerR = r - strokeWidth / 2 - (isMain ? size * 0.1 : size * 0.06);
        const outerR = r - strokeWidth / 2 - size * 0.02;
        ticks.push({
            x1: cx + innerR * Math.cos(toRad(angle)),
            y1: cy + innerR * Math.sin(toRad(angle)),
            x2: cx + outerR * Math.cos(toRad(angle)),
            y2: cy + outerR * Math.sin(toRad(angle)),
            isMain,
        });
    }

    return (
        <div className="flex flex-col items-center" style={{ width: size }}>
            <svg width={size} height={size * 0.82} viewBox={`0 0 ${size} ${size}`}>
                <defs>
                    <filter id="gauge-shadow" x="-5%" y="-5%" width="110%" height="110%">
                        <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.15" />
                    </filter>
                </defs>

                {/* Background track */}
                <path
                    d={describeArc(startAngle, startAngle + sweepAngle)}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />

                {/* Red zone: 0–33 */}
                <path
                    d={describeArc(startAngle, redEnd)}
                    fill="none"
                    stroke="#fca5a5"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />

                {/* Yellow zone: 33–66 */}
                <path
                    d={describeArc(redEnd, yellowEnd)}
                    fill="none"
                    stroke="#fde68a"
                    strokeWidth={strokeWidth}
                />

                {/* Green zone: 66–100 */}
                <path
                    d={describeArc(yellowEnd, startAngle + sweepAngle)}
                    fill="none"
                    stroke="#86efac"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />

                {/* Tick marks */}
                {ticks.map((tick, i) => (
                    <line
                        key={i}
                        x1={tick.x1}
                        y1={tick.y1}
                        x2={tick.x2}
                        y2={tick.y2}
                        stroke="#94a3b8"
                        strokeWidth={tick.isMain ? 2 : 1}
                    />
                ))}

                {/* Score "progress" overlay */}
                {clampedScore > 0 && (
                    <path
                        d={describeArc(startAngle, scoreToAngle(clampedScore))}
                        fill="none"
                        stroke={scoreColor}
                        strokeWidth={strokeWidth * 0.35}
                        strokeLinecap="round"
                        style={{
                            opacity: 0.9,
                            transition: animate ? 'all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
                        }}
                    />
                )}

                {/* Needle */}
                <polygon
                    points={`${needleTip.x},${needleTip.y} ${needleBase1.x},${needleBase1.y} ${needleTail.x},${needleTail.y} ${needleBase2.x},${needleBase2.y}`}
                    fill={scoreColor}
                    filter="url(#gauge-shadow)"
                    style={{ transition: animate ? 'all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none' }}
                />

                {/* Center hub */}
                <circle cx={cx} cy={cy} r={size * 0.07} fill="white" stroke={scoreColor} strokeWidth="3" filter="url(#gauge-shadow)" />
                <circle cx={cx} cy={cy} r={size * 0.035} fill={scoreColor} />

                {/* Score number */}
                <text
                    x={cx}
                    y={cy + r * 0.52}
                    textAnchor="middle"
                    fontSize={size * 0.2}
                    fontWeight="900"
                    fill={scoreColor}
                    fontFamily="'Outfit', sans-serif"
                >
                    {clampedScore}
                </text>

                {/* /100 */}
                <text
                    x={cx}
                    y={cy + r * 0.72}
                    textAnchor="middle"
                    fontSize={size * 0.08}
                    fontWeight="700"
                    fill="#94a3b8"
                    fontFamily="'Outfit', sans-serif"
                >
                    /100
                </text>
            </svg>

            {/* Status label */}
            <div
                className="mt-1 px-3 py-1 rounded-full text-xs font-black tracking-wider"
                style={{
                    backgroundColor: `${scoreColor}15`,
                    color: scoreColor,
                    border: `1.5px solid ${scoreColor}40`,
                }}
            >
                {getLabel(clampedScore)}
            </div>

            {label && (
                <p className="text-xs text-slate-400 font-semibold mt-1 text-center tracking-wide">{label}</p>
            )}
        </div>
    );
};

export default AnalogGauge;
