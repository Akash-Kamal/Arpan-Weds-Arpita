import React from "react";

interface ChristianCrossProps {
  className?: string;
  size?: number;
  color?: string;
  variant?: "simple" | "ornate";
}

export default function ChristianCross({
  className = "",
  size = 28,
  color = "currentColor",
  variant = "ornate",
}: ChristianCrossProps) {
  if (variant === "simple") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="5" y1="8" x2="19" y2="8" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size * 1.25}
      viewBox="0 0 40 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Vertical beam */}
      <path
        d="M20 2V48M18 4H22M18 46H22"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Horizontal beam */}
      <path
        d="M6 16H34M8 14V18M32 14V18"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Central delicate diamond */}
      <polygon
        points="20,12 24,16 20,20 16,16"
        fill="none"
        stroke={color}
        strokeWidth="1.2"
      />
      {/* Subtle radiating light rays */}
      <line x1="20" y1="10" x2="20" y2="7" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <line x1="26" y1="16" x2="29" y2="16" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <line x1="20" y1="22" x2="20" y2="25" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <line x1="14" y1="16" x2="11" y2="16" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}
