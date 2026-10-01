import React from "react";

interface IconProps {
  className?: string;
}

// Shared by the pin toggle and the Favourites tab, so "star = favourite" is one metaphor everywhere.
// The thick round-joined stroke softens the points into a rounded, modern star.
export const StarIcon: React.FC<IconProps & { filled?: boolean }> = ({ filled = false, className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    aria-hidden="true"
    focusable="false"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={2}
    strokeLinejoin="round"
    strokeLinecap="round"
  >
    <path d="M12 3.2l2.63 5.33 5.88.86-4.25 4.15 1 5.86L12 16.63 6.74 19.4l1-5.86L3.49 9.39l5.88-.86L12 3.2z" />
  </svg>
);

// "All items": a 2x2 grid of rounded tiles.
export const GridIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    aria-hidden="true"
    focusable="false"
    fill="currentColor"
  >
    <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2" />
    <rect x="13" y="3.5" width="7.5" height="7.5" rx="2" />
    <rect x="3.5" y="13" width="7.5" height="7.5" rx="2" />
    <rect x="13" y="13" width="7.5" height="7.5" rx="2" />
  </svg>
);
