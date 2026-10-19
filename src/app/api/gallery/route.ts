import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import {
  getServerSupabase,
  isSupabaseConfigured,
} from "@/lib/supabaseClient";

export interface GalleryPhotoRecord {
  id: string;
  storage_path: string;
  public_url: string;
  uploader_name: string;
  caption: string;
  function_name: string;
  file_size: number;
  original_file_size?: number;
  mime_type: string;
  moderation_status: "approved" | "pending" | "rejected";
  delete_token_hash?: string;
  created_at: string;
}

const LOCAL_DATA_DIR = path.join(process.cwd(), "data");
const LOCAL_GALLERY_FILE = path.join(LOCAL_DATA_DIR, "gallery.json");

function getLocalGallery(): GalleryPhotoRecord[] {
  try {
    if (!fs.existsSync(LOCAL_DATA_DIR)) {
      fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(LOCAL_GALLERY_FILE)) {
      fs.writeFileSync(LOCAL_GALLERY_FILE, JSON.stringify([], null, 2), "utf8");
      return [];
    }
    const raw = fs.readFileSync(LOCAL_GALLERY_FILE, "utf8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    console.error("Local gallery read error:", err);
    return [];
  }
}

function saveLocalGallery(records: GalleryPhotoRecord[]) {
  try {
    if (!fs.existsSync(LOCAL_DATA_DIR)) {
      fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(LOCAL_GALLERY_FILE, JSON.stringify(records, null, 2), "utf8");
  } catch (err) {
    console.error("Local gallery save error:", err);
  }
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * GET /api/gallery
 * Query params: page (1-based), limit (default 12), function (optional filter)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
    const functionFilter = searchParams.get("function");

    if (isSupabaseConfigured()) {
      const supabase = getServerSupabase();
      if (!supabase) {
        throw new Error("Supabase client unavailable");
      }

      let query = supabase
        .from("wedding_gallery")
        .select(
          "id, storage_path, public_url, uploader_name, caption, function_name, file_size, original_file_size, mime_type, moderation_status, created_at",
          { count: "exact" }
        )
        .eq("moderation_status", "approved")
        .order("created_at", { ascending: false });

      if (functionFilter && functionFilter !== "all") {
        query = query.eq("function_name", functionFilter);
      }

      const offset = (page - 1) * limit;
      const { data, count, error } = await query.range(offset, offset + limit - 1);

      if (error) {
        console.warn("Supabase gallery table query error (fallback to local index):", error.message);
        // Fall back to local file metadata if table is not yet migrated
        const local = getLocalGallery().filter(
          (p) => p.moderation_status === "approved"
        );
        const filtered =
          functionFilter && functionFilter !== "all"
            ? local.filter((p) => p.function_name === functionFilter)
            : local;

        const offsetFallback = (page - 1) * limit;
        const paginated = filtered.slice(offsetFallback, offsetFallback + limit);
        const totalFallback = filtered.length;
        const hasMoreFallback = offsetFallback + paginated.length < totalFallback;

        const sanitized = paginated.map((item) => {
          const copy = { ...item };
          delete copy.delete_token_hash;
          return copy;
        });

        return NextResponse.json({
          success: true,
          source: "supabase-storage-local-index",
          photos: sanitized,
          total: totalFallback,
          page,
          limit,
          hasMore: hasMoreFallback,
        });
      }

      const total = count || 0;
      const hasMore = offset + (data?.length || 0) < total;

      return NextResponse.json({
        success: true,
        source: "supabase",
        photos: data || [],
        total,
        page,
        limit,
        hasMore,
      });
    }

    // Local file fallback when Supabase keys are not set
    const local = getLocalGallery().filter(
      (p) => p.moderation_status === "approved"
    );
    const filtered =
      functionFilter && functionFilter !== "all"
        ? local.filter((p) => p.function_name === functionFilter)
        : local;

    const offset = (page - 1) * limit;
    const paginated = filtered.slice(offset, offset + limit);
    const total = filtered.length;
    const hasMore = offset + paginated.length < total;

    // strip delete_token_hash for public response
    const sanitized = paginated.map((item) => {
      const copy = { ...item };
      delete copy.delete_token_hash;
      return copy;
    });

    return NextResponse.json({
      success: true,
      source: "local-fallback",
      photos: sanitized,
      total,
      page,
      limit,
      hasMore,
      notice: "Operating in local dev fallback mode. Add Supabase keys to .env.local to activate cloud storage.",
    });
  } catch (err) {
    console.error("Error in GET /api/gallery:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load gallery photos." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/gallery
 * Uploads a compressed image to Supabase Storage and records metadata in wedding_gallery table.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const uploaderName = ((formData.get("uploaderName") as string) || "Cherished Guest").trim();
    const caption = ((formData.get("caption") as string) || "Wedding Joy with Arpan & Arpita").trim();
    const functionName = ((formData.get("functionName") as string) || "Holy Matrimony & Dinner").trim();
    const originalFileSize = parseInt((formData.get("originalFileSize") as string) || "0", 10) || undefined;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file provided." },
        { status: 400 }
      );
    }

    // 1. Validate file size (max 5 MB for compressed file)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Compressed file exceeds 5 MB limit." },
        { status: 400 }
      );
    }

    // 2. Read first bytes to verify magic numbers
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const headerHex = buffer.subarray(0, 16).toString("hex").toUpperCase();

    let detectedMime = "image/jpeg";
    let fileExt = "jpg";

    if (headerHex.startsWith("FFD8FF")) {
      detectedMime = "image/jpeg";
      fileExt = "jpg";
    } else if (headerHex.startsWith("89504E470D0A1A0A")) {
      detectedMime = "image/png";
      fileExt = "png";
    } else if (headerHex.startsWith("52494646") && headerHex.substring(16, 24) === "57454250") {
      detectedMime = "image/webp";
      fileExt = "webp";
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid file signature. Only JPEG, PNG, or WebP images are accepted." },
        { status: 400 }
      );
    }

    // 3. Generate unique collision-resistant storage path and delete token
    const uniqueId = crypto.randomUUID();
    const storagePath = `guest-uploads/${uniqueId}.${fileExt}`;
    const rawDeleteToken = crypto.randomBytes(24).toString("hex");
    const tokenHash = hashToken(rawDeleteToken);

    // 4. Cloud Supabase Storage & DB
    if (isSupabaseConfigured()) {
      const supabase = getServerSupabase();
      if (!supabase) {
        throw new Error("Supabase client unavailable");
      }

      // Step A: Upload to Supabase Storage bucket 'wedding-photos'
      let { error: uploadError } = await supabase.storage
        .from("wedding-photos")
        .upload(storagePath, buffer, {
          contentType: detectedMime,
          cacheControl: "public, max-age=31536000, immutable",
          upsert: false,
        });

      if (uploadError && uploadError.message?.toLowerCase().includes("not found")) {
        console.log("Bucket wedding-photos not found. Attempting auto-creation...");
        await supabase.storage.createBucket("wedding-photos", {
          public: true,
          fileSizeLimit: 20971520,
          allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
        });
        const retry = await supabase.storage
          .from("wedding-photos")
          .upload(storagePath, buffer, {
            contentType: detectedMime,
            cacheControl: "public, max-age=31536000, immutable",
            upsert: false,
          });
        uploadError = retry.error;
      }

      if (uploadError) {
        console.error("Supabase storage upload error:", uploadError);
        return NextResponse.json(
          { success: false, error: `Storage upload failed: ${uploadError.message}` },
          { status: 502 }
        );
      }

      // Compute public URL from Supabase Storage
      const { data: publicUrlData } = supabase.storage
        .from("wedding-photos")
        .getPublicUrl(storagePath);

      const publicUrl = publicUrlData.publicUrl;

      // Step B: Insert into wedding_gallery table
      const { data: dbData, error: dbError } = await supabase
        .from("wedding_gallery")
        .insert({
          storage_path: storagePath,
          public_url: publicUrl,
          uploader_name: uploaderName,
          caption: caption,
          function_name: functionName,
          file_size: file.size,
          original_file_size: originalFileSize,
          mime_type: detectedMime,
          moderation_status: "approved",
          delete_token_hash: tokenHash,
        })
        .select()
        .single();

      // Step C: Fallback to local index if table is not yet created in Supabase database
      if (dbError) {
        console.warn("Supabase DB table insert error (saving to local index):", dbError.message);
        const hybridRecord: GalleryPhotoRecord = {
          id: uniqueId,
          storage_path: storagePath,
          public_url: publicUrl,
          uploader_name: uploaderName,
          caption: caption,
          function_name: functionName,
          file_size: file.size,
          original_file_size: originalFileSize,
          mime_type: detectedMime,
          moderation_status: "approved",
          delete_token_hash: tokenHash,
          created_at: new Date().toISOString(),
        };

        const localList = getLocalGallery();
        localList.unshift(hybridRecord);
        saveLocalGallery(localList);

        return NextResponse.json({
          success: true,
          source: "supabase-storage-hybrid",
          message: "Photo uploaded to Supabase Cloud Storage successfully!",
          photo: {
            id: hybridRecord.id,
            storage_path: hybridRecord.storage_path,
            public_url: hybridRecord.public_url,
            uploader_name: hybridRecord.uploader_name,
            caption: hybridRecord.caption,
            function_name: hybridRecord.function_name,
            file_size: hybridRecord.file_size,
            original_file_size: hybridRecord.original_file_size,
            mime_type: hybridRecord.mime_type,
            created_at: hybridRecord.created_at,
          },
          deleteToken: rawDeleteToken,
        });
      }

      return NextResponse.json({
        success: true,
        source: "supabase",
        message: "Photo uploaded and saved to Supabase successfully!",
        photo: {
          id: dbData.id,
          storage_path: dbData.storage_path,
          public_url: dbData.public_url,
          uploader_name: dbData.uploader_name,
          caption: dbData.caption,
          function_name: dbData.function_name,
          file_size: dbData.file_size,
          original_file_size: dbData.original_file_size,
          mime_type: dbData.mime_type,
          created_at: dbData.created_at,
        },
        deleteToken: rawDeleteToken,
      });
    }

    // 5. Local development fallback (stores in data/uploads and data/gallery.json)
    const localUploadsDir = path.join(process.cwd(), "public", "uploads", "guest-uploads");
    if (!fs.existsSync(localUploadsDir)) {
      fs.mkdirSync(localUploadsDir, { recursive: true });
    }
    const localFilePath = path.join(localUploadsDir, `${uniqueId}.${fileExt}`);
    fs.writeFileSync(localFilePath, buffer);

    const publicUrl = `/uploads/guest-uploads/${uniqueId}.${fileExt}`;
    const newRecord: GalleryPhotoRecord = {
      id: uniqueId,
      storage_path: storagePath,
      public_url: publicUrl,
      uploader_name: uploaderName,
      caption: caption,
      function_name: functionName,
      file_size: file.size,
      original_file_size: originalFileSize,
      mime_type: detectedMime,
      moderation_status: "approved",
      delete_token_hash: tokenHash,
      created_at: new Date().toISOString(),
    };

    const localList = getLocalGallery();
    localList.unshift(newRecord);
    saveLocalGallery(localList);

    return NextResponse.json({
      success: true,
      source: "local-fallback",
      message: "Photo saved to local storage (Supabase keys not yet provided).",
      photo: {
        id: newRecord.id,
        storage_path: newRecord.storage_path,
        public_url: newRecord.public_url,
        uploader_name: newRecord.uploader_name,
        caption: newRecord.caption,
        function_name: newRecord.function_name,
        file_size: newRecord.file_size,
        original_file_size: newRecord.original_file_size,
        mime_type: newRecord.mime_type,
        created_at: newRecord.created_at,
      },
      deleteToken: rawDeleteToken,
    });
  } catch (err) {
    console.error("Error in POST /api/gallery:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while uploading the photo." },
      { status: 500 }
    );
  }
}
