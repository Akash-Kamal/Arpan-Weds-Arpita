import imageCompression from "browser-image-compression";

export interface PendingPhoto {
  id: string;
  file: File;
  compressedFile: File | null;
  previewUrl: string;
  originalSize: number;
  compressedSize: number | null;
  compressionRatio: number | null;
  status: "validating" | "compressing" | "ready" | "error";
  progress: number;
  error?: string;
  mimeType: string;
}

export const MAX_ORIGINAL_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB
export const TARGET_MAX_SIZE_MB = 1.5;
export const TARGET_MAX_WIDTH_OR_HEIGHT = 1920;
export const TARGET_INITIAL_QUALITY = 0.85;

/**
 * Inspect first bytes of file to verify true file signature (magic numbers)
 */
export async function detectFileSignature(file: File): Promise<{
  isValidImage: boolean;
  isHeic: boolean;
  detectedType: "jpeg" | "png" | "webp" | "heic" | "unknown";
}> {
  try {
    const slice = file.slice(0, 32);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const hex = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();

    // JPEG: FFD8FF
    if (hex.startsWith("FFD8FF")) {
      return { isValidImage: true, isHeic: false, detectedType: "jpeg" };
    }

    // PNG: 89504E470D0A1A0A
    if (hex.startsWith("89504E470D0A1A0A")) {
      return { isValidImage: true, isHeic: false, detectedType: "png" };
    }

    // WebP: RIFF (52494646) ... WEBP (57454250 at offset 8)
    if (hex.startsWith("52494646") && hex.substring(16, 24) === "57454250") {
      return { isValidImage: true, isHeic: false, detectedType: "webp" };
    }

    // HEIC / HEIF signatures: contains 'ftypheic', 'ftypmif1', 'ftypmsf1', 'ftyphevc', etc.
    // ASCII 'ftyp' = 66747970 at offset 4
    const asciiText = Array.from(bytes)
      .map((b) => String.fromCharCode(b))
      .join("");
    if (
      asciiText.includes("ftypheic") ||
      asciiText.includes("ftypmif1") ||
      asciiText.includes("ftypmsf1") ||
      asciiText.includes("ftyphevc") ||
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      file.name.toLowerCase().endsWith(".heic") ||
      file.name.toLowerCase().endsWith(".heif")
    ) {
      return { isValidImage: false, isHeic: true, detectedType: "heic" };
    }

    // Fallback MIME check if signature is not strictly caught but browser typed it
    if (["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
      return {
        isValidImage: true,
        isHeic: false,
        detectedType: file.type.includes("png")
          ? "png"
          : file.type.includes("webp")
          ? "webp"
          : "jpeg",
      };
    }

    return { isValidImage: false, isHeic: false, detectedType: "unknown" };
  } catch (err) {
    console.error("Signature check error:", err);
    return { isValidImage: false, isHeic: false, detectedType: "unknown" };
  }
}

/**
 * Validate image file before compression
 */
export async function validateImageFile(file: File): Promise<{
  valid: boolean;
  error?: string;
  isHeic?: boolean;
}> {
  if (file.size > MAX_ORIGINAL_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File is too large (${(file.size / (1024 * 1024)).toFixed(
        1
      )} MB). Maximum allowed size is 20 MB.`,
    };
  }

  const { isValidImage, isHeic, detectedType } = await detectFileSignature(file);

  if (isHeic) {
    return {
      valid: false,
      isHeic: true,
      error:
        "Apple HEIC/HEIF photo detected. Please export or share as JPEG (iPhone: Settings > Camera > Formats > Most Compatible, or take a screenshot).",
    };
  }

  if (!isValidImage) {
    return {
      valid: false,
      error: `Unsupported image format (${detectedType || "unknown"}). Only JPEG, PNG, and WebP photos are permitted.`,
    };
  }

  return { valid: true };
}

/**
 * Compress a single image using browser-image-compression with non-blocking WebWorker
 */
export async function compressImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<File> {
  const options = {
    maxSizeMB: TARGET_MAX_SIZE_MB,
    maxWidthOrHeight: TARGET_MAX_WIDTH_OR_HEIGHT,
    useWebWorker: true,
    initialQuality: TARGET_INITIAL_QUALITY,
    fileType: file.type === "image/png" ? "image/png" : "image/jpeg",
    onProgress: (p: number) => {
      if (onProgress) onProgress(Math.round(p));
    },
  };

  try {
    const compressed = await imageCompression(file, options);
    return compressed;
  } catch (err) {
    console.error("Compression failed:", err);
    throw err;
  }
}

/**
 * Helper to format bytes into readable KB / MB
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Controlled concurrency executor to process a queue of tasks without overloading browser RAM
 */
export async function runWithControlledConcurrency<T, R>(
  items: T[],
  limit: number,
  task: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let currentIndex = 0;

  async function worker() {
    while (currentIndex < items.length) {
      const idx = currentIndex++;
      results[idx] = await task(items[idx], idx);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () =>
    worker()
  );
  await Promise.all(workers);
  return results;
}
