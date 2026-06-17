import type { Platform } from "../../lib/types";
import { PLATFORM_CONFIG } from "../../lib/types";

interface PlatformIconProps {
  platform: Platform;
  size?: number;
}

const ABBREV: Record<Platform, string> = {
  linkedin: "in",
  twitter: "𝕏",
  instagram: "IG",
  facebook: "fb",
};

export function PlatformIcon({ platform, size = 14 }: PlatformIconProps) {
  const color = PLATFORM_CONFIG[platform].color;
  const fontSize = Math.round(size * 0.6);
  return (
    <span
      className="inline-flex items-center justify-center rounded font-bold select-none shrink-0"
      style={{
        width: size + 2,
        height: size + 2,
        backgroundColor: color + "22",
        color,
        fontSize,
        lineHeight: 1,
      }}
    >
      {ABBREV[platform]}
    </span>
  );
}
