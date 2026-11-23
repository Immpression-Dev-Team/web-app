// Line icons for the artwork page's info card (badges + Artwork Details).

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const EyeIcon = () => (
  <svg {...base}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const HeartIcon = () => (
  <svg {...base}>
    <path d="M12 20s-7.5-4.6-9.2-9.3C1.7 7.6 3.8 4.5 7 4.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.2 0 5.3 3.1 4.2 6.2C19.5 15.4 12 20 12 20z" />
  </svg>
);

export const LayersIcon = () => (
  <svg {...base}>
    <path d="M12 3l9 5-9 5-9-5 9-5z" />
    <path d="M3 13l9 5 9-5" />
    <path d="M3 17.5l9 5 9-5" opacity="0.55" />
  </svg>
);

export const PenIcon = () => (
  <svg {...base}>
    <path d="M15.5 4.5l4 4L9 19H5v-4z" />
    <path d="M13.5 6.5l4 4" />
  </svg>
);

export const FrameIcon = () => (
  <svg {...base}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="9" cy="9.5" r="1.6" />
    <path d="M21 16l-5-5-8 8" />
  </svg>
);

export const CalendarIcon = () => (
  <svg {...base}>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
);

export const PhoneIcon = () => (
  <svg {...base}>
    <rect x="7" y="2.5" width="10" height="19" rx="2.2" />
    <path d="M11 18h2" />
  </svg>
);

export const RulerIcon = () => (
  <svg {...base}>
    <path d="M3 16.5L16.5 3 21 7.5 7.5 21z" />
    <path d="M7 12.5l1.5 1.5M10 9.5l2 2M13 6.5l1.5 1.5" />
  </svg>
);

export const WeightIcon = () => (
  <svg {...base}>
    <path d="M6.5 8h11l2.5 12H4z" />
    <circle cx="12" cy="5.5" r="2.2" />
  </svg>
);
