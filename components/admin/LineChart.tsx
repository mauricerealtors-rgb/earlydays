interface Row {
  day: string;
  views: number;
  contacts: number;
}

export function LineChart({ data }: { data: Row[] }) {
  const width = 620;
  const height = 220;
  const padding = { top: 20, right: 12, bottom: 24, left: 32 };
  const w = width - padding.left - padding.right;
  const h = height - padding.top - padding.bottom;

  const maxY = Math.max(
    1,
    ...data.map((d) => Math.max(d.views, d.contacts))
  );
  const xStep = data.length > 1 ? w / (data.length - 1) : w;

  const pointsViews = data
    .map((d, i) => `${padding.left + i * xStep},${padding.top + h - (d.views / maxY) * h}`)
    .join(" ");
  const pointsContacts = data
    .map((d, i) => `${padding.left + i * xStep},${padding.top + h - (d.contacts / maxY) * h}`)
    .join(" ");

  // Y-axis ticks (0, half, max)
  const ticks = [0, Math.round(maxY / 2), maxY];

  // X-axis: show ~6 labels evenly spaced
  const xLabels: { i: number; label: string }[] = [];
  const step = Math.max(1, Math.floor(data.length / 6));
  for (let i = 0; i < data.length; i += step) {
    const d = new Date(data[i].day);
    xLabels.push({ i, label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) });
  }

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[520px]">
        <defs>
          <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#66B7FF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#66B7FF" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid */}
        {ticks.map((t, i) => {
          const y = padding.top + h - (t / maxY) * h;
          return (
            <g key={i}>
              <line
                x1={padding.left}
                x2={padding.left + w}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
              <text
                x={padding.left - 6}
                y={y}
                fill="rgba(255,255,255,0.4)"
                fontSize="10"
                textAnchor="end"
                dominantBaseline="middle"
              >
                {t.toLocaleString()}
              </text>
            </g>
          );
        })}
        {/* X labels */}
        {xLabels.map((l, i) => (
          <text
            key={i}
            x={padding.left + l.i * xStep}
            y={height - 6}
            fill="rgba(255,255,255,0.4)"
            fontSize="9"
            textAnchor="middle"
          >
            {l.label}
          </text>
        ))}
        {/* Views area */}
        <polygon
          points={`${padding.left},${padding.top + h} ${pointsViews} ${padding.left + w},${padding.top + h}`}
          fill="url(#viewsFill)"
        />
        {/* Views line */}
        <polyline
          points={pointsViews}
          fill="none"
          stroke="#66B7FF"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Contacts line */}
        <polyline
          points={pointsContacts}
          fill="none"
          stroke="#FF7A59"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeDasharray="4 3"
        />
      </svg>
    </div>
  );
}
