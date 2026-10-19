import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { getServerSupabase, isSupabaseConfigured } from "@/lib/supabaseClient";

const LOCAL_DATA_DIR = path.join(process.cwd(), "data");
const LOCAL_GALLERY_FILE = path.join(LOCAL_DATA_DIR, "gallery.json");

interface LocalGalleryItem {
  id: string;
  storage_path: string;
  public_url: string;
  uploader_name?: string;
  caption?: string;
  function_name?: string;
  file_size?: number;
  original_file_size?: number;
  mime_type?: string;
  moderation_status?: string;
  delete_token_hash?: string;
  created_at?: string;
}

function getLocalGallery(): LocalGalleryItem[] {
  try {
    if (!fs.existsSync(LOCAL_GALLERY_FILE)) return [];
    const raw = fs.readFileSync(LOCAL_GALLERY_FILE, "utf8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

function saveLocalGallery(records: LocalGalleryItem[]) {
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing photo ID" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const headerToken = req.headers.get("x-delete-token") || "";
    const queryToken = searchParams.get("token") || "";
    const adminSecret = req.headers.get("x-admin-secret") || "";

    const candidateToken = (headerToken || queryToken).trim();
    const serverAdminSecret = process.env.ADMIN_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    const isAdmin = Boolean(
      adminSecret && serverAdminSecret && adminSecret === serverAdminSecret
    );

    if (!candidateToken && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Deletion token is required to remove this photo." },
        { status: 401 }
      );
    }

    const tokenHash = candidateToken ? hashToken(candidateToken) : null;

    if (isSupabaseConfigured()) {
      const supabase = getServerSupabase();
      if (!supabase) {
        throw new Error("Supabase client unavailable");
      }

      // 1. Fetch photo record from Supabase table or local index
      let photoStoragePath = "";
      let photoTokenHash = "";

      const { data: photo, error: fetchError } = await supabase
        .from("wedding_gallery")
        .select("id, storage_path, delete_token_hash")
        .eq("id", id)
        .single();

      if (photo && !fetchError) {
        photoStoragePath = photo.storage_path;
        photoTokenHash = photo.delete_token_hash || "";
      } else {
        // Fallback to local index
        const localList = getLocalGallery();
        const localPhoto = localList.find((p) => p.id === id);
        if (localPhoto) {
          photoStoragePath = localPhoto.storage_path;
          photoTokenHash = localPhoto.delete_token_hash || "";
        }
      }

      if (!photoStoragePath) {
        return NextResponse.json(
          { success: false, error: "Photo not found in gallery." },
          { status: 404 }
        );
      }

      // 2. Authorize deletion
      const isAuthorized =
        isAdmin ||
        (tokenHash && photoTokenHash && photoTokenHash === tokenHash);

      if (!isAuthorized) {
        return NextResponse.json(
          {
            success: false,
            error: "Unauthorized: You can only delete photos uploaded from your own device.",
          },
          { status: 403 }
        );
      }

      // 3. Delete from Supabase Storage
      if (photoStoragePath) {
        const { error: storageError } = await supabase.storage
          .from("wedding-photos")
          .remove([photoStoragePath]);

        if (storageError) {
          console.error("Storage delete warning:", storageError);
        }
      }

      // 4. Delete row from wedding_gallery table (if exists) & local index
      await supabase.from("wedding_gallery").delete().eq("id", id);

      const localList = getLocalGallery();
      const updated = localList.filter((p) => p.id !== id);
      saveLocalGallery(updated);

      return NextResponse.json({
        success: true,
        message: "Photo successfully deleted from Supabase Storage and gallery database.",
      });
    }

    // Local fallback deletion
    const records = getLocalGallery();
    const photo = records.find((p: LocalGalleryItem) => p.id === id);

    if (!photo) {
      return NextResponse.json(
        { success: false, error: "Photo not found in local gallery." },
        { status: 404 }
      );
    }

    const isAuthorized =
      isAdmin ||
      (tokenHash && photo.delete_token_hash && photo.delete_token_hash === tokenHash);

    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: You can only delete photos uploaded from your own device.",
        },
        { status: 403 }
      );
    }

    // Try to remove local file if exists
    try {
      if (photo.public_url && photo.public_url.startsWith("/uploads/")) {
        const filePath = path.join(process.cwd(), "public", photo.public_url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    } catch (e) {
      console.warn("Could not remove local file:", e);
    }

    const updated = records.filter((p: LocalGalleryItem) => p.id !== id);
    saveLocalGallery(updated);

    return NextResponse.json({
      success: true,
      message: "Photo removed from local gallery.",
    });
  } catch (err) {
    console.error("Error in DELETE /api/gallery/[id]:", err);
    return NextResponse.json(
      { success: false, error: "Failed to process photo deletion." },
      { status: 500 }
    );
  }
}
