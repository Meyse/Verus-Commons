/**
 * VerusFeatureTag component
 * Colored pill displaying a Verus feature with auto-generated colors
 * 
 * Updated: Colors are now automatically generated from the feature name using
 * a hash function. This allows adding new features without defining colors.
 * Each feature gets a consistent, deterministic color based on its name.
 */

/**
 * Generate a deterministic hue (0-360) from a string using a simple hash
 */
function stringToHue(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) % 360;
}

/**
 * Generate HSL color styles for a feature tag
 */
function getFeatureColors(feature: string): { light: React.CSSProperties; dark: React.CSSProperties } {
  const hue = stringToHue(feature);
  
  return {
    light: {
      backgroundColor: `hsl(${hue}, 70%, 92%)`,
      color: `hsl(${hue}, 70%, 35%)`,
    },
    dark: {
      backgroundColor: `hsla(${hue}, 70%, 50%, 0.15)`,
      color: `hsl(${hue}, 70%, 65%)`,
    },
  };
}

export function VerusFeatureTag({ feature }: { feature: string }) {
  const colors = getFeatureColors(feature);
  
  return (
    <>
      {/* Light mode version */}
      <span 
        className="show-light inline-block px-2 py-0.5 text-xs font-medium rounded-full"
        style={colors.light}
      >
        {feature}
      </span>
      {/* Dark mode version */}
      <span 
        className="show-dark inline-block px-2 py-0.5 text-xs font-medium rounded-full"
        style={colors.dark}
      >
        {feature}
      </span>
    </>
  );
}
