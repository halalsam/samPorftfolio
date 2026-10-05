const WIPE = 'transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.2,1)] motion-reduce:transition-none';

/**
 * Text that a second colour wipes across, left to right, when an ancestor
 * `group` is hovered or keyboard-focused. The coloured copy counter-moves
 * inside a sliding window, so it stays in place while the window passes
 * over it. Transform-only. The box is padded (and pulled back) vertically
 * so tight display leading never clips the copy's ascenders.
 */
export default function WipeText({ children, color, className = '' }) {
  return (
    <span className={`relative -my-[0.14em] block py-[0.14em] ${className}`}>
      {children}
      <span aria-hidden className="absolute inset-0 overflow-hidden">
        <span className={`block h-full -translate-x-full overflow-hidden ${WIPE} group-hover:translate-x-0 group-focus-visible:translate-x-0`}>
          <span className={`block translate-x-full py-[0.14em] ${WIPE} group-hover:translate-x-0 group-focus-visible:translate-x-0`} style={{ color }}>
            {children}
          </span>
        </span>
      </span>
    </span>
  );
}
