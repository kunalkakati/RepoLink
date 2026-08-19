// app/components/CoverImage.tsx
import Image from "next/image";

interface CoverImageProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export default function CoverImage({
  src,
  alt,
  width = 800,
  height = 538,
}: CoverImageProps) {
  return (
    <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden bg-slate-900 p-5 sm:p-8 lg:min-h-[520px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(124,147,255,0.25),transparent_55%)]" />
      {typeof src === "string" ? (
        <Image
          src={src}
          alt={alt || "Cover Image"}
          width={width}
          height={height}
          priority
          unoptimized
          className="relative z-10 max-h-[520px] w-full max-w-md rounded-2xl object-contain shadow-2xl shadow-black/40"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <p className="text-sm text-gray-500">Cover image unavailable</p>
      )}
    </div>
  );
}
