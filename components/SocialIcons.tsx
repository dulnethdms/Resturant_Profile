import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2.5 17a24.1 24.1 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.5 49.5 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.1 24.1 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.5 49.5 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}
