import { useState } from "react";

const MIN = 0;
const MAX = 5000;

// UI-only for now — the /marketplace endpoint has no price query params yet.
// Wire this up once that lands: onChange already isolates the chosen value.
export default function PriceRangeCard() {
  const [value, setValue] = useState(MAX);

  return (
    <div className="mp-left-section">
      <h3 className="mp-left-title">Price Range</h3>
      <input
        type="range"
        min={MIN}
        max={MAX}
        step={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="mp-price-slider"
        aria-label="Maximum price"
      />
      <div className="mp-price-labels">
        <span>${MIN.toLocaleString()}</span>
        <span>{value >= MAX ? `$${MAX.toLocaleString()}+` : `$${value.toLocaleString()}`}</span>
      </div>
    </div>
  );
}
