// The brand mark: four quarter shapes on a 2×2 grid, each rounded on a
// different side. Shared by the header, footer, favicon, app icons and OG
// images — change it here and every surface follows.
export const MARK_PATHS = [
  'M40 40.0005H88.5597C115.378 40.0005 137.119 61.7414 137.119 88.5602C137.119 115.379 115.378 137.12 88.5597 137.12H40V40.0005Z',
  'M40 195.556C40 166.464 63.5833 142.881 92.6749 142.881H137.119V240H40V195.556Z',
  'M142.881 191.441C142.881 164.622 164.622 142.881 191.44 142.881H240V240H191.44C164.622 240 142.881 218.26 142.881 191.441Z',
  'M142.881 40.0005H240V84.445C240 113.536 216.417 137.12 187.325 137.12H142.881V40.0005Z',
];

// The paths sit in a 280 box with a 40 margin; the tight box crops it.
export const MARK_VIEWBOX = '0 0 280 280';
export const MARK_VIEWBOX_TIGHT = '40 40 200 200';

export function LogoMark({ size = 15, tight = false, className, ...props }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox={tight ? MARK_VIEWBOX_TIGHT : MARK_VIEWBOX}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {MARK_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

/** "sam" with the mark riding top-right, as in the header. Inherits colour. */
export function Logo({ className = '', textClassName = 'text-3xl font-bold', markSize = 15 }) {
  return (
    <span className={`relative inline-flex ${className}`}>
      <span className={textClassName}>sam</span>
      <LogoMark size={markSize} />
    </span>
  );
}
