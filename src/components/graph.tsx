export function MyLineGraph({
  values,
  noShade = false,
}: {
  values: number[];
  noShade?: boolean;
}) {
  const w = 1000;
  const h = 220;
  const v = values;
  let p = "";
  for (let i = 0; i < v.length; i++)
    p += `${i * (w / (v.length - 1))},${h - v[i] * h} `;

  let pPoly = p + `${w},${h} 0,${h}`;

  const svg = `<svg width="${w}" height="${h}" view-box="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <polygon fill="url(#areaGradient)" points="${pPoly}" />
      <polyline fill="none" stroke="#256DC9CC" stroke-width="2" points="${p}" />
      ${
        noShade
          ? ""
          : `<defs>
        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#256DC9" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#4F8FE1" stop-opacity="0" />
        </linearGradient>
      </defs>`
      }
    </svg>`;

  return (
    <img
      className="w-full h-full object-full"
      src={"data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg)}
    />
  );
}
