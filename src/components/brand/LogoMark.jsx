import atlasLogo from "../../../assets/brand/atlas-logo.webp";

export const ATLAS_BLUE = "#0a84ff";

// Chrome "A" emblem on a transparent background (ratio 1080:740);
// master file: assets/brand/atlas-emblem.png.
export function LogoMark({ height = 40, className = "", title = "Atlas Academy" }) {
  return (
    <img
      src={atlasLogo}
      height={height}
      width={Math.round((height * 1080) / 740)}
      alt={title}
      draggable="false"
      className={`logo-mark ${className}`}
    />
  );
}
