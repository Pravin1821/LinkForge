import { QRCodeSVG } from "qrcode.react";
import { cn } from "../../lib/utils";

export function QRCard({
  value,
  imageSrc,
  size = 48,
  label,
  className,
  compact = false,
}) {
  return (
    <div className={cn("shrink-0", className)}>
      <div
        className={cn(
          "overflow-hidden rounded border border-[var(--border)] bg-white",
          compact ? "p-0.5" : "p-1",
        )}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="QR"
            width={size}
            height={size}
            className="block"
          />
        ) : (
          <QRCodeSVG
            value={value || "https://forge.ly"}
            size={size}
            level="M"
            bgColor="#ffffff"
            fgColor="#1a1a18"
          />
        )}
      </div>
      {label ? (
        <span className="mt-1 block text-center text-[10px] text-tertiary">
          {label}
        </span>
      ) : null}
    </div>
  );
}
