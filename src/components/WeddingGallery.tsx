"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import ChristianCross from "./ChristianCross";
import {
  UploadCloud,
  Camera,
  CheckCircle2,
  Calendar,
  Clock,
  X,
  Maximize2,
  Trash2,
  AlertCircle,
  Loader2,
  ArrowDownCircle,
  FileCheck2,
  RefreshCw,
  ImageIcon,
} from "lucide-react";
import {
  validateImageFile,
  compressImage,
  formatBytes,
  runWithControlledConcurrency,
  PendingPhoto,
} from "@/lib/imageCompression";

interface GalleryPhoto {
  id: string;
  storage_path: string;
  public_url: string;
  uploader_name: string;
  caption: string;
  function_name: string;
  file_size: number;
  original_file_size?: number;
  mime_type: string;
  created_at: string;
}

const STORAGE_TOKENS_KEY = "arpan_arpita_photo_tokens";

export default function WeddingGallery() {
  const [activeTab, setActiveTab] = useState<"upload" | "schedule">("upload");
  const [selectedFunction, setSelectedFunction] = useState("Holy Matrimony & Dinner");
  const [guestName, setGuestName] = useState("");
  const [caption, setCaption] = useState("");

  // Pending queue of files being compressed / ready to upload
  const [pendingQueue, setPendingQueue] = useState<PendingPhoto[]>([]);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Gallery state loaded from Supabase / API
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [galleryTotal, setGalleryTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Uploading state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Deletion ownership tokens stored in browser localStorage { [photoId]: token }
  const [ownedTokens, setOwnedTokens] = useState<Record<string, string>>(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_TOKENS_KEY);
        if (stored) return JSON.parse(stored);
      }
    } catch {
      // quiet fallback
    }
    return {};
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Lightbox Modal
  const [selectedLightboxPhoto, setSelectedLightboxPhoto] = useState<{
    url: string;
    title: string;
    caption: string;
    id?: string;
    uploader?: string;
    date?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const functionOptions = [
    "Holy Matrimony & Dinner (11 Nov)",
    "Haldi Ceremony (9 Nov)",
    "Mehendi Ceremony (9 Nov)",
    "Grand Wedding Reception (14 Nov)",
    "Candid Moments & Selfies",
  ];

  // Prevent background scroll when lightbox modal is open
  useEffect(() => {
    if (selectedLightboxPhoto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedLightboxPhoto]);

  const saveTokenForPhoto = (photoId: string, token: string) => {
    setOwnedTokens((prev) => {
      const updated = { ...prev, [photoId]: token };
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_TOKENS_KEY, JSON.stringify(updated));
        }
      } catch {
        // storage quota handled
      }
      return updated;
    });
  };

  const removeTokenForPhoto = (photoId: string) => {
    setOwnedTokens((prev) => {
      const updated = { ...prev };
      delete updated[photoId];
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_TOKENS_KEY, JSON.stringify(updated));
        }
      } catch {
        // quiet fallback
      }
      return updated;
    });
  };

  // Initial photos fetch from API
  useEffect(() => {
    let ignore = false;
    async function loadInitial() {
      try {
        const res = await fetch("/api/gallery?page=1&limit=12", {
          cache: "no-store",
        });
        const data = await res.json();
        if (!ignore && res.ok && data.success) {
          setGalleryTotal(data.total || 0);
          setHasMore(Boolean(data.hasMore));
          setCurrentPage(1);
          setGalleryPhotos(data.photos || []);
          setGalleryError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          console.error("Gallery fetch error:", err);
          setGalleryError("Could not connect to wedding photo archive. Tap refresh to retry.");
        }
      } finally {
        if (!ignore) {
          setIsLoadingGallery(false);
        }
      }
    }
    loadInitial();
    return () => {
      ignore = true;
    };
  }, []);

  // Pagination / Load more helper
  const fetchGalleryPhotos = useCallback(async (page: number, append = false) => {
    if (page === 1) {
      setIsLoadingGallery(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const res = await fetch(`/api/gallery?page=${page}&limit=12`, {
        cache: "no-store",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load photos");
      }

      setGalleryError(null);
      setGalleryTotal(data.total || 0);
      setHasMore(Boolean(data.hasMore));
      setCurrentPage(page);

      if (append) {
        setGalleryPhotos((prev) => [...prev, ...data.photos]);
      } else {
        setGalleryPhotos(data.photos || []);
      }
    } catch (err: unknown) {
      console.error("Gallery fetch error:", err);
      setGalleryError("Could not connect to wedding photo archive. Tap refresh to retry.");
    } finally {
      setIsLoadingGallery(false);
      setIsLoadingMore(false);
    }
  }, []);

  // Handle file selection with validation and asynchronous compression
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setValidationError(null);

    const rawFiles = Array.from(e.target.files);
    e.target.value = ""; // reset file input

    setIsProcessingFiles(true);

    const newPendingItems: PendingPhoto[] = [];

    for (const file of rawFiles) {
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const validation = await validateImageFile(file);

      if (!validation.valid) {
        setValidationError(validation.error || "Unsupported file format.");
        continue;
      }

      // Generate instant preview blob
      const previewUrl = URL.createObjectURL(file);

      newPendingItems.push({
        id: tempId,
        file,
        compressedFile: null,
        previewUrl,
        originalSize: file.size,
        compressedSize: null,
        compressionRatio: null,
        status: "validating",
        progress: 0,
        mimeType: file.type,
      });
    }

    if (newPendingItems.length === 0) {
      setIsProcessingFiles(false);
      return;
    }

    // Add to pending queue in "compressing" state
    setPendingQueue((prev) => [...prev, ...newPendingItems]);

    // Compress with controlled concurrency (max 2 at a time to prevent mobile lag)
    await runWithControlledConcurrency(newPendingItems, 2, async (item) => {
      setPendingQueue((prev) =>
        prev.map((p) =>
          p.id === item.id ? { ...p, status: "compressing", progress: 15 } : p
        )
      );

      try {
        const compressed = await compressImage(item.file, (progressPercent) => {
          setPendingQueue((prev) =>
            prev.map((p) =>
              p.id === item.id ? { ...p, progress: Math.max(15, progressPercent) } : p
            )
          );
        });

        const ratio = Math.max(
          0,
          Math.round(((item.file.size - compressed.size) / item.file.size) * 100)
        );

        setPendingQueue((prev) =>
          prev.map((p) =>
            p.id === item.id
              ? {
                  ...p,
                  compressedFile: compressed,
                  compressedSize: compressed.size,
                  compressionRatio: ratio,
                  status: "ready",
                  progress: 100,
                }
              : p
          )
        );
      } catch (err) {
        console.error("Compression error on item:", err);
        setPendingQueue((prev) =>
          prev.map((p) =>
            p.id === item.id
              ? {
                  ...p,
                  status: "error",
                  error: "Compression failed. Please try a different photo.",
                }
              : p
          )
        );
      }
    });

    setIsProcessingFiles(false);
  };

  const removePendingPhoto = (idToRemove: string) => {
    setPendingQueue((prev) => {
      const item = prev.find((p) => p.id === idToRemove);
      if (item && item.previewUrl) {
        try {
          URL.revokeObjectURL(item.previewUrl);
        } catch {
          // ignore
        }
      }
      return prev.filter((p) => p.id !== idToRemove);
    });
  };

  // Submit all ready photos to Supabase Storage and Postgres
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const readyItems = pendingQueue.filter((p) => p.status === "ready" && p.compressedFile);
    if (readyItems.length === 0) return;

    setIsUploading(true);
    setValidationError(null);

    let successCount = 0;
    const failedItems: string[] = [];
    let lastUploadErrorMessage = "";

    for (let i = 0; i < readyItems.length; i++) {
      const item = readyItems[i];
      setUploadProgressText(`Uploading photo ${i + 1} of ${readyItems.length}...`);

      try {
        const formData = new FormData();
        formData.append("file", item.compressedFile!, item.compressedFile!.name);
        formData.append("uploaderName", guestName.trim() || "Cherished Guest");
        formData.append("caption", caption.trim() || "Wedding Joy with Arpan & Arpita");
        formData.append("functionName", selectedFunction);
        formData.append("originalFileSize", item.originalSize.toString());

        const res = await fetch("/api/gallery", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Upload failed");
        }

        successCount++;
        // Save deletion token in localStorage for ownership
        if (data.photo?.id && data.deleteToken) {
          saveTokenForPhoto(data.photo.id, data.deleteToken);
        }

        // Clean up object URL
        try {
          URL.revokeObjectURL(item.previewUrl);
        } catch {
          // ignore
        }
      } catch (err: unknown) {
        console.error("Upload error on item:", err);
        failedItems.push(item.file.name);
        if (err instanceof Error) {
          lastUploadErrorMessage = err.message;
        }
      }
    }

    setIsUploading(false);
    setUploadProgressText("");

    if (successCount > 0) {
      setUploadSuccess(true);
      setPendingQueue([]);
      setCaption("");
      // Refresh gallery list to include newly added photos from Supabase
      fetchGalleryPhotos(1);
      setTimeout(() => setUploadSuccess(false), 5000);
    }

    if (failedItems.length > 0) {
      setValidationError(
        lastUploadErrorMessage
          ? `${lastUploadErrorMessage}`
          : `Failed to upload ${failedItems.length} photo(s). Please check your connection and try again.`
      );
    }
  };

  // Delete an uploaded photo from Supabase Storage & Database
  const handleDeletePhoto = async (photoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const deleteToken = ownedTokens[photoId];
    if (!deleteToken) {
      alert("Only the guest who uploaded this photo can remove it.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to remove this photo from the wedding archive?");
    if (!confirmDelete) return;

    setDeletingId(photoId);

    try {
      const res = await fetch(`/api/gallery/${photoId}`, {
        method: "DELETE",
        headers: {
          "x-delete-token": deleteToken,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete photo");
      }

      // Remove from client state & token store
      setGalleryPhotos((prev) => prev.filter((p) => p.id !== photoId));
      setGalleryTotal((prev) => Math.max(0, prev - 1));
      removeTokenForPhoto(photoId);

      if (selectedLightboxPhoto?.id === photoId) {
        closeLightbox();
      }
    } catch (err: unknown) {
      console.error("Delete error:", err);
      const msg = err instanceof Error ? err.message : "Could not delete photo. Please try again.";
      alert(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const openLightbox = (
    url: string,
    title: string,
    cap: string,
    id?: string,
    uploader?: string,
    date?: string
  ) => {
    setSelectedLightboxPhoto({ url, title, caption: cap, id, uploader, date });
  };

  const closeLightbox = () => {
    setSelectedLightboxPhoto(null);
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Recent";
    }
  };

  return (
    <section id="gallery" className="section section-cream gallery-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-center">
          <div className="pre-title">WEDDING MEMORIES &amp; ARCHIVE</div>
          <h2 className="section-title font-serif">Wedding Photos &amp; Moments</h2>
          <div className="ornament-container">
            <div className="ornament-line" />
            <ChristianCross size={20} color="#C5A46D" />
            <div className="ornament-line" />
          </div>

          {/* Celebration Photo Archive Banner */}
          <div className="gallery-status-banner">
            <Clock size={16} className="banner-icon" />
            <p className="banner-text">
              <strong>Celebration Photo Archive:</strong> All official high-resolution photographs will be unveiled here after each wedding function concludes.
            </p>
          </div>

          {/* Switcher Tabs */}
          <div className="gallery-mode-tabs">
            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={`mode-tab-btn ${activeTab === "upload" ? "active" : ""}`}
            >
              <UploadCloud size={15} />
              <span>Upload Photos</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("schedule")}
              className={`mode-tab-btn ${activeTab === "schedule" ? "active" : ""}`}
            >
              <Calendar size={15} />
              <span>Photo Schedule</span>
            </button>
          </div>
        </div>

        {/* TAB 1: GUEST PHOTO UPLOAD WITH BROWSER COMPRESSION & SUPABASE STORAGE */}
        {activeTab === "upload" && (
          <div className="tab-content-fade">
            {/* Upload Box Card */}
            <div className="upload-card-root">
              <div className="upload-card-header">
                <div className="upload-badge">
                  <Camera size={14} />
                  <span>COMMUNITY MEMORY VAULT</span>
                </div>
                <h3 className="upload-title font-serif">
                  Upload Your Wedding Snaps
                </h3>
                <p className="upload-subtitle">
                  Captured special smiles, candids, or selfies during the celebrations? Photos are compressed automatically in your browser and securely preserved in Arpan &amp; Arpita’s Supabase archive.
                </p>
              </div>

              <form onSubmit={handleUploadSubmit} className="upload-form">
                {validationError && (
                  <div className="validation-error-box animate-fade-in" role="alert">
                    <AlertCircle size={16} className="error-icon" />
                    <span>{validationError}</span>
                  </div>
                )}

                {/* Select Wedding Function */}
                <div className="form-field-group">
                  <label className="field-label">Select Wedding Function</label>
                  <select
                    value={selectedFunction}
                    onChange={(e) => setSelectedFunction(e.target.value)}
                    className="select-dropdown"
                  >
                    {functionOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Guest Name & Wishes */}
                <div className="form-row-stacked">
                  <div className="form-field-group">
                    <label className="field-label">Your Name / Family</label>
                    <input
                      type="text"
                      placeholder="e.g. Samuel &amp; Priya / Akash Masih"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="input-text"
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Short Blessing / Note (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Joyful congratulations to Arpan &amp; Arpita!"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="input-text"
                    />
                  </div>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/*"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  id="guest-photo-file-input"
                />

                {/* Choose Photos Button */}
                <button
                  type="button"
                  disabled={isProcessingFiles || isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-select-files"
                >
                  {isProcessingFiles ? (
                    <>
                      <Loader2 size={18} className="spin-icon" />
                      <span>Optimizing Photos...</span>
                    </>
                  ) : (
                    <>
                      <Camera size={18} />
                      <span>Choose Photos / Camera Drop (Up to 20 MB each)</span>
                    </>
                  )}
                </button>

                {/* Pending Photos Queue with Compression Metrics */}
                {pendingQueue.length > 0 && (
                  <div className="selected-preview-section animate-fade-in">
                    <div className="preview-header">
                      <span className="queue-title font-semibold">
                        {pendingQueue.length} Photo{pendingQueue.length > 1 ? "s" : ""} Selected:
                      </span>
                      <span className="queue-hint">Review compressed sizes before upload</span>
                    </div>

                    <div className="pending-photos-list">
                      {pendingQueue.map((item) => (
                        <div key={item.id} className="pending-item-card">
                          <div className="pending-thumb-wrapper">
                            <img
                              src={item.previewUrl}
                              alt="Upload preview"
                              className="pending-thumb-img"
                            />
                            <button
                              type="button"
                              onClick={() => removePendingPhoto(item.id)}
                              className="btn-remove-pending"
                              title="Remove photo from upload queue"
                              aria-label="Remove image"
                              disabled={isUploading}
                            >
                              <X size={13} />
                            </button>
                          </div>

                          <div className="pending-details">
                            <div className="pending-name-row">
                              <span className="file-name" title={item.file.name}>
                                {item.file.name}
                              </span>
                              {item.status === "ready" && (
                                <span className="status-badge ready">
                                  <FileCheck2 size={12} />
                                  <span>Ready</span>
                                </span>
                              )}
                              {item.status === "compressing" && (
                                <span className="status-badge compressing">
                                  <Loader2 size={12} className="spin-icon" />
                                  <span>Compressing</span>
                                </span>
                              )}
                              {item.status === "error" && (
                                <span className="status-badge error">
                                  <AlertCircle size={12} />
                                  <span>Failed</span>
                                </span>
                              )}
                            </div>

                            {/* Compression Size Reduction Display */}
                            <div className="size-metric-row">
                              <span className="size-orig">
                                Original: {formatBytes(item.originalSize)}
                              </span>
                              {item.compressedSize && (
                                <>
                                  <span className="size-arrow">→</span>
                                  <span className="size-comp">
                                    Optimized: {formatBytes(item.compressedSize)}
                                  </span>
                                  {item.compressionRatio !== null && item.compressionRatio > 0 && (
                                    <span className="savings-badge">
                                      {item.compressionRatio}% smaller
                                    </span>
                                  )}
                                </>
                              )}
                            </div>

                            {/* Progress bar */}
                            {item.status === "compressing" && (
                              <div className="progress-bar-track">
                                <div
                                  className="progress-bar-fill"
                                  style={{ width: `${item.progress}%` }}
                                />
                              </div>
                            )}

                            {item.error && <p className="item-error-text">{item.error}</p>}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={
                        isUploading ||
                        isProcessingFiles ||
                        pendingQueue.filter((p) => p.status === "ready").length === 0
                      }
                      className="btn-submit-upload"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 size={16} className="spin-icon" />
                          <span>{uploadProgressText || "Preserving Photos in Supabase..."}</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud size={16} />
                          <span>
                            Upload {pendingQueue.filter((p) => p.status === "ready").length} Photo(s) to Archive
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {uploadSuccess && (
                  <div className="upload-success-toast animate-fade-in">
                    <CheckCircle2 size={18} className="toast-icon" />
                    <span>Thank you! Your photos have been safely compressed and archived in Supabase.</span>
                  </div>
                )}
              </form>
            </div>

            {/* Display Uploaded Community Photos */}
            <div className="uploaded-gallery-section">
              <div className="sub-header-center">
                <div className="pre-title-gold">COMMUNITY MEMORIES</div>
                <h4 className="sub-title font-serif">
                  Wedding Snaps Archive {galleryTotal > 0 ? `(${galleryTotal})` : ""}
                </h4>
                <p className="archive-caption">
                  Cherished guest memories captured across all wedding festivities.
                </p>
              </div>

              {isLoadingGallery ? (
                <div className="gallery-loading-box">
                  <Loader2 size={32} className="spin-icon text-gold" />
                  <p className="loading-text">Loading community memories from Supabase...</p>
                </div>
              ) : galleryError ? (
                <div className="gallery-error-box">
                  <AlertCircle size={24} className="text-red" />
                  <p>{galleryError}</p>
                  <button
                    type="button"
                    onClick={() => fetchGalleryPhotos(1)}
                    className="btn-retry"
                  >
                    <RefreshCw size={14} />
                    <span>Retry Loading</span>
                  </button>
                </div>
              ) : galleryPhotos.length === 0 ? (
                <div className="gallery-empty-card">
                  <ImageIcon size={40} className="empty-icon" />
                  <h5 className="empty-title font-serif">Be the First to Share a Memory!</h5>
                  <p className="empty-desc">
                    No guest photos uploaded yet. Snap a golden smile or candid moment above and be part of Arpan &amp; Arpita’s official keepsake vault.
                  </p>
                </div>
              ) : (
                <>
                  <div className="uploaded-photos-grid">
                    {galleryPhotos.map((photo) => {
                      const isOwner = Boolean(ownedTokens[photo.id]);
                      const isDeletingThis = deletingId === photo.id;

                      return (
                        <div
                          key={photo.id}
                          className="uploaded-card"
                          onClick={() =>
                            openLightbox(
                              photo.public_url,
                              photo.function_name,
                              photo.caption,
                              photo.id,
                              photo.uploader_name,
                              formatDate(photo.created_at)
                            )
                          }
                        >
                          <div className="uploaded-img-wrapper">
                            <img
                              src={photo.public_url}
                              alt={photo.caption || "Wedding community photo"}
                              className="uploaded-img"
                              loading="lazy"
                            />

                            {/* Secure Individual Delete Control (Visible if uploaded from this device) */}
                            {isOwner && (
                              <button
                                type="button"
                                className="btn-delete-card-badge"
                                title="Remove your photo from vault"
                                onClick={(e) => handleDeletePhoto(photo.id, e)}
                                disabled={isDeletingThis}
                                aria-label="Remove photo from vault"
                              >
                                {isDeletingThis ? (
                                  <Loader2 size={12} className="spin-icon" />
                                ) : (
                                  <Trash2 size={12} />
                                )}
                                <span>{isDeletingThis ? "Removing..." : "Delete"}</span>
                              </button>
                            )}

                            <div className="card-hover-overlay">
                              <Maximize2 size={16} />
                            </div>
                          </div>

                          <div className="uploaded-card-info">
                            <div className="card-func-row">
                              <span className="card-func-tag">{photo.function_name}</span>
                              <span className="card-timestamp">{formatDate(photo.created_at)}</span>
                            </div>

                            <p className="card-caption">&ldquo;{photo.caption}&rdquo;</p>

                            <div className="card-uploader-row">
                              <span className="card-uploader-name font-serif">
                                — {photo.uploader_name}
                              </span>

                              {isOwner && (
                                <button
                                  type="button"
                                  className="btn-delete-card-text"
                                  onClick={(e) => handleDeletePhoto(photo.id, e)}
                                  disabled={isDeletingThis}
                                  title="Remove your photo"
                                >
                                  <Trash2 size={12} />
                                  <span>Remove</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Load More Pagination */}
                  {hasMore && (
                    <div className="load-more-container">
                      <button
                        type="button"
                        onClick={() => fetchGalleryPhotos(currentPage + 1, true)}
                        disabled={isLoadingMore}
                        className="btn-load-more"
                      >
                        {isLoadingMore ? (
                          <>
                            <Loader2 size={16} className="spin-icon" />
                            <span>Loading more memories...</span>
                          </>
                        ) : (
                          <>
                            <ArrowDownCircle size={16} />
                            <span>Load More Memories</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: FUNCTION PHOTO REVEAL SCHEDULE */}
        {activeTab === "schedule" && (
          <div className="tab-content-fade">
            <div className="schedule-cards-stack">
              {/* Haldi & Mehendi */}
              <div className="schedule-card">
                <div className="schedule-card-top">
                  <span className="schedule-date-badge">MON, 9 NOV 2026</span>
                  <span className="status-pill pending">Uploading Post-Function</span>
                </div>
                <h3 className="schedule-function-title font-serif">
                  Haldi &amp; Mehendi Ceremonies
                </h3>
                <p className="schedule-location">A-1702, Green Fields Colony, Faridabad</p>
                <p className="schedule-details">
                  Vibrant turmeric blessings, golden smiles, and intricate bridal henna celebration captures will be uploaded here following the festivities on 9th November.
                </p>
              </div>

              {/* Holy Matrimony */}
              <div className="schedule-card highlight-card">
                <div className="schedule-card-top">
                  <span className="schedule-date-badge">WED, 11 NOV 2026</span>
                  <span className="status-pill highlight">Main Ceremony Album</span>
                </div>
                <h3 className="schedule-function-title font-serif">
                  Holy Matrimony, Cake Cutting &amp; Dinner
                </h3>
                <p className="schedule-location">
                  The Epiphany Church Zahur Bux &amp; The Railway Club, Lucknow
                </p>
                <p className="schedule-details">
                  Full ceremonial high-resolution album of the solemn church service, wedding vows, exchange of rings, choir hymns, ceremonial cake cutting, and fellowship dinner will be unveiled post-service.
                </p>
              </div>

              {/* Reception */}
              <div className="schedule-card">
                <div className="schedule-card-top">
                  <span className="schedule-date-badge">SAT, 14 NOV 2026</span>
                  <span className="status-pill pending">Uploading Post-Function</span>
                </div>
                <h3 className="schedule-function-title font-serif">
                  Grand Wedding Reception
                </h3>
                <p className="schedule-location">
                  Devansh Greens, Ballabhgarh, Faridabad
                </p>
                <p className="schedule-details">
                  Grand evening banquet, stage congratulations, family portraits, and closing feast photographs will be published following the reception.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Accessible Lightbox Modal */}
      {selectedLightboxPhoto && (
        <div
          className="lightbox-overlay"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="lightbox-close-btn"
            onClick={closeLightbox}
            aria-label="Close Lightbox"
          >
            <X size={24} />
          </button>

          <div className="lightbox-content-box" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-image-wrapper">
              <img
                src={selectedLightboxPhoto.url}
                alt={selectedLightboxPhoto.title}
                className="lightbox-full-img"
              />
            </div>

            <div className="lightbox-details-panel">
              <div className="lightbox-meta-row">
                <h4 className="lightbox-title font-serif">{selectedLightboxPhoto.title}</h4>
                {selectedLightboxPhoto.date && (
                  <span className="lightbox-date">{selectedLightboxPhoto.date}</span>
                )}
              </div>

              <p className="lightbox-caption">&ldquo;{selectedLightboxPhoto.caption}&rdquo;</p>

              {selectedLightboxPhoto.uploader && (
                <p className="lightbox-uploader font-serif">
                  Uploaded by: {selectedLightboxPhoto.uploader}
                </p>
              )}

              {selectedLightboxPhoto.id && ownedTokens[selectedLightboxPhoto.id] && (
                <button
                  type="button"
                  className="btn-lightbox-delete"
                  disabled={deletingId === selectedLightboxPhoto.id}
                  onClick={() => handleDeletePhoto(selectedLightboxPhoto.id!)}
                >
                  <Trash2 size={14} />
                  <span>
                    {deletingId === selectedLightboxPhoto.id
                      ? "Removing..."
                      : "Remove My Photo from Archive"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .gallery-section {
          background-color: var(--color-ivory);
          position: relative;
        }

        .gallery-status-banner {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: #FAF7F0;
          border: 1px solid rgba(197, 164, 109, 0.45);
          border-left: 3px solid var(--color-gold);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          margin: 1.25rem 0 1.5rem;
          text-align: left;
        }

        .banner-icon {
          color: var(--color-gold-deep);
          flex-shrink: 0;
        }

        .banner-text {
          font-size: 0.85rem;
          color: var(--color-forest);
          line-height: 1.45;
          margin: 0;
        }

        .banner-text strong {
          color: var(--color-gold-deep);
        }

        /* Mode Tabs */
        .gallery-mode-tabs {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
          max-width: 440px;
          margin: 0 auto 1.5rem auto;
          width: 100%;
        }

        .mode-tab-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          background: #FAF7F0;
          border: 1px solid rgba(197, 164, 109, 0.35);
          color: var(--color-forest);
          padding: 0.6rem 0.4rem;
          border-radius: 24px;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          transition: all 0.2s ease;
        }

        .mode-tab-btn.active {
          background: var(--color-forest);
          color: #FFFFFF;
          border-color: var(--color-forest);
          box-shadow: 0 4px 14px rgba(32, 61, 50, 0.16);
        }

        .tab-content-fade {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Upload Card */
        .upload-card-root {
          background: #FFFFFF;
          border: 1px solid rgba(197, 164, 109, 0.4);
          border-radius: 20px;
          padding: 1.4rem 1.15rem;
          box-shadow: 0 8px 30px rgba(32, 61, 50, 0.06);
          margin-bottom: 2rem;
        }

        .upload-card-header {
          text-align: center;
          margin-bottom: 1.25rem;
        }

        .upload-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(197, 164, 109, 0.15);
          color: var(--color-gold-deep);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        .upload-title {
          font-size: 1.45rem;
          color: var(--color-forest);
          margin-bottom: 0.35rem;
        }

        .upload-subtitle {
          font-size: 0.86rem;
          color: var(--color-charcoal-muted);
          line-height: 1.5;
        }

        .upload-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .validation-error-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #FFEBEE;
          border-left: 3px solid #D32F2F;
          color: #C62828;
          padding: 0.75rem 0.9rem;
          border-radius: 8px;
          font-size: 0.82rem;
          text-align: left;
        }

        .error-icon {
          flex-shrink: 0;
        }

        .form-field-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          text-align: left;
        }

        .field-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-forest);
        }

        .select-dropdown,
        .input-text {
          width: 100%;
          background: #FAF8F3;
          border: 1px solid rgba(197, 164, 109, 0.4);
          border-radius: 10px;
          padding: 0.75rem 0.9rem;
          font-size: 0.92rem;
          color: var(--color-charcoal);
          font-family: inherit;
          min-height: 46px;
        }

        .select-dropdown:focus,
        .input-text:focus {
          outline: none;
          border-color: var(--color-gold);
          background: #FFFFFF;
        }

        .form-row-stacked {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .btn-select-files {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: #FAF7F0;
          border: 1.5px dashed var(--color-gold);
          color: var(--color-forest);
          padding: 0.95rem 1rem;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-select-files:hover:not(:disabled) {
          background: #F4EFE6;
          border-color: var(--color-gold-deep);
        }

        .btn-select-files:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Pending Photos Queue with Compression Metrics */
        .selected-preview-section {
          background: #FAF8F3;
          border-radius: 14px;
          padding: 1rem;
          border: 1px solid rgba(197, 164, 109, 0.35);
        }

        .preview-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          text-align: left;
        }

        .queue-title {
          font-size: 0.85rem;
          color: var(--color-forest);
        }

        .queue-hint {
          font-size: 0.72rem;
          color: var(--color-gold-deep);
          font-weight: 600;
        }

        .pending-photos-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin-bottom: 1rem;
        }

        .pending-item-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #FFFFFF;
          border: 1px solid rgba(197, 164, 109, 0.25);
          border-radius: 10px;
          padding: 0.6rem;
          box-shadow: 0 2px 8px rgba(32, 61, 50, 0.03);
        }

        .pending-thumb-wrapper {
          position: relative;
          width: 54px;
          height: 54px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
          border: 1px solid rgba(197, 164, 109, 0.3);
        }

        .pending-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .btn-remove-pending {
          position: absolute;
          top: 2px;
          right: 2px;
          background: rgba(0, 0, 0, 0.7);
          color: #FFFFFF;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
        }

        .btn-remove-pending:hover {
          background: #C62828;
        }

        .pending-details {
          flex: 1;
          min-width: 0;
          text-align: left;
        }

        .pending-name-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.2rem;
        }

        .file-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-forest);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.15rem 0.45rem;
          border-radius: 12px;
          flex-shrink: 0;
        }

        .status-badge.ready {
          background: #E8F5E9;
          color: #2E7D32;
        }

        .status-badge.compressing {
          background: #FFF8E1;
          color: #B78103;
        }

        .status-badge.error {
          background: #FFEBEE;
          color: #C62828;
        }

        .size-metric-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.72rem;
          color: var(--color-charcoal-muted);
        }

        .size-arrow {
          color: var(--color-gold-deep);
          font-weight: bold;
        }

        .size-comp {
          color: var(--color-forest);
          font-weight: 600;
        }

        .savings-badge {
          background: rgba(197, 164, 109, 0.2);
          color: var(--color-forest);
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.1rem 0.4rem;
          border-radius: 10px;
        }

        .progress-bar-track {
          width: 100%;
          height: 4px;
          background: #E8E5DD;
          border-radius: 2px;
          overflow: hidden;
          margin-top: 0.35rem;
        }

        .progress-bar-fill {
          height: 100%;
          background: var(--color-gold);
          transition: width 0.2s ease;
        }

        .item-error-text {
          font-size: 0.7rem;
          color: #C62828;
          margin-top: 0.2rem;
        }

        .btn-submit-upload {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: var(--color-forest);
          color: #FFFFFF;
          padding: 0.85rem 1rem;
          border-radius: 30px;
          font-size: 0.9rem;
          font-weight: 600;
          box-shadow: 0 4px 16px rgba(32, 61, 50, 0.18);
          border: none;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .btn-submit-upload:hover:not(:disabled) {
          background: #172D24;
          transform: translateY(-1px);
        }

        .btn-submit-upload:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .upload-success-toast {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #E8F5E9;
          border: 1px solid #A5D6A7;
          color: #2E7D32;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 0.85rem;
          font-weight: 500;
          text-align: left;
        }

        .toast-icon {
          flex-shrink: 0;
        }

        /* Uploaded Photos Section */
        .uploaded-gallery-section {
          margin-top: 1.5rem;
        }

        .sub-header-center {
          text-align: center;
          margin-bottom: 1.25rem;
        }

        .pre-title-gold {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--color-gold-deep);
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .sub-title {
          font-size: 1.35rem;
          color: var(--color-forest);
          margin: 0.2rem 0;
        }

        .archive-caption {
          font-size: 0.85rem;
          color: var(--color-charcoal-muted);
          margin: 0;
        }

        .gallery-loading-box,
        .gallery-error-box,
        .gallery-empty-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1.5rem;
          background: #FFFFFF;
          border: 1px solid rgba(197, 164, 109, 0.3);
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 4px 14px rgba(32, 61, 50, 0.04);
        }

        .text-gold {
          color: var(--color-gold-deep);
        }

        .text-red {
          color: #C62828;
        }

        .loading-text {
          font-size: 0.9rem;
          color: var(--color-forest);
          margin-top: 0.75rem;
        }

        .btn-retry {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 0.85rem;
          background: #FAF7F0;
          border: 1px solid var(--color-gold);
          color: var(--color-forest);
          padding: 0.45rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
        }

        .empty-icon {
          color: var(--color-gold-deep);
          opacity: 0.7;
          margin-bottom: 0.6rem;
        }

        .empty-title {
          font-size: 1.2rem;
          color: var(--color-forest);
          margin-bottom: 0.35rem;
        }

        .empty-desc {
          font-size: 0.86rem;
          color: var(--color-charcoal-muted);
          max-width: 420px;
          line-height: 1.5;
          margin: 0;
        }

        .uploaded-photos-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .uploaded-photos-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .uploaded-photos-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .uploaded-card {
          background: #FFFFFF;
          border: 1px solid rgba(197, 164, 109, 0.35);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(32, 61, 50, 0.05);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .uploaded-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(32, 61, 50, 0.1);
        }

        .uploaded-img-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background: #EDEAE1;
        }

        .uploaded-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .btn-delete-card-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 5;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: rgba(30, 20, 20, 0.85);
          backdrop-filter: blur(4px);
          color: #FFCDD2;
          border: 1px solid rgba(255, 100, 100, 0.4);
          padding: 0.25rem 0.6rem;
          border-radius: 16px;
          font-size: 0.7rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-delete-card-badge:hover:not(:disabled) {
          background: #C62828;
          color: #FFFFFF;
          border-color: #C62828;
          transform: scale(1.05);
        }

        .card-hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(32, 61, 50, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .uploaded-card:hover .card-hover-overlay {
          opacity: 1;
        }

        .uploaded-card-info {
          padding: 0.75rem 0.95rem;
          text-align: left;
        }

        .card-func-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.2rem;
        }

        .card-func-tag {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--color-gold-deep);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .card-timestamp {
          font-size: 0.68rem;
          color: var(--color-charcoal-muted);
        }

        .card-caption {
          font-size: 0.88rem;
          color: var(--color-charcoal);
          margin: 0.2rem 0;
          font-style: italic;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .card-uploader-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.35rem;
          padding-top: 0.35rem;
          border-top: 1px solid rgba(197, 164, 109, 0.15);
        }

        .card-uploader-name {
          font-size: 0.82rem;
          color: var(--color-forest);
          font-weight: 600;
        }

        .btn-delete-card-text {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: transparent;
          border: none;
          color: #B71C1C;
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0.2rem 0.4rem;
          border-radius: 6px;
          transition: background 0.2s ease;
        }

        .btn-delete-card-text:hover:not(:disabled) {
          background: rgba(183, 28, 28, 0.08);
        }

        .load-more-container {
          margin-top: 1.5rem;
          display: flex;
          justify-content: center;
        }

        .btn-load-more {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: #FAF7F0;
          border: 1.5px solid var(--color-gold);
          color: var(--color-forest);
          padding: 0.7rem 1.6rem;
          border-radius: 30px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-load-more:hover:not(:disabled) {
          background: var(--color-forest);
          color: #FFFFFF;
          border-color: var(--color-forest);
        }

        /* Schedule Stack */
        .schedule-cards-stack {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .schedule-card {
          background: #FFFFFF;
          border: 1px solid rgba(197, 164, 109, 0.35);
          border-radius: 14px;
          padding: 1.15rem;
          box-shadow: 0 4px 14px rgba(32, 61, 50, 0.04);
          text-align: left;
        }

        .schedule-card.highlight-card {
          border-color: var(--color-gold);
          border-left: 4px solid var(--color-gold);
          background: #FAF8F3;
        }

        .schedule-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.45rem;
        }

        .schedule-date-badge {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-gold-deep);
          letter-spacing: 0.1em;
        }

        .status-pill {
          font-size: 0.65rem;
          font-weight: 600;
          padding: 0.2rem 0.55rem;
          border-radius: 20px;
        }

        .status-pill.pending {
          background: #FFF8E1;
          color: #B78103;
        }

        .status-pill.highlight {
          background: var(--color-forest);
          color: #FFFFFF;
        }

        .schedule-function-title {
          font-size: 1.25rem;
          color: var(--color-forest);
          margin-bottom: 0.2rem;
        }

        .schedule-location {
          font-size: 0.78rem;
          color: var(--color-charcoal-light);
          margin-bottom: 0.5rem;
        }

        .schedule-details {
          font-size: 0.88rem;
          color: var(--color-charcoal-muted);
          line-height: 1.5;
          margin: 0;
        }

        /* Sneak Peek Preview */
        .preview-curated-intro {
          text-align: center;
          margin-bottom: 1.25rem;
        }

        .intro-text {
          font-size: 1.05rem;
          font-style: italic;
          color: var(--color-forest);
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }

        .gallery-card {
          border-radius: 14px;
          overflow: hidden;
          background: #FFFFFF;
          border: 1px solid rgba(197, 164, 109, 0.3);
          box-shadow: 0 4px 18px rgba(32, 61, 50, 0.05);
          cursor: pointer;
        }

        .gallery-thumbnail-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          overflow: hidden;
        }

        .gallery-img {
          object-fit: cover;
        }

        .gallery-hover-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.1) 0%,
            rgba(32, 61, 50, 0.8) 100%
          );
          opacity: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.2rem;
          transition: opacity 0.3s ease;
        }

        .gallery-card:hover .gallery-hover-overlay {
          opacity: 1;
        }

        .overlay-badge {
          align-self: flex-end;
          background: rgba(255, 255, 255, 0.9);
          color: var(--color-forest);
          padding: 0.3rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        .overlay-text {
          color: #FFFFFF;
          text-align: left;
        }

        .overlay-title {
          font-size: 1.2rem;
          margin-bottom: 0.2rem;
        }

        .overlay-caption {
          font-size: 0.82rem;
          color: rgba(255, 255, 255, 0.85);
          margin: 0;
        }

        /* Lightbox */
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.88);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .lightbox-close-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
        }

        .lightbox-content-box {
          max-width: 520px;
          width: 100%;
          background: #FFFFFF;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
        }

        .lightbox-image-wrapper {
          width: 100%;
          aspect-ratio: 16 / 10;
          background: #000;
        }

        .lightbox-full-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .lightbox-details-panel {
          padding: 1.1rem 1.3rem;
          background: #FAF7F0;
          text-align: left;
        }

        .lightbox-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }

        .lightbox-title {
          font-size: 1.25rem;
          color: var(--color-forest);
          margin: 0;
        }

        .lightbox-date {
          font-size: 0.75rem;
          color: var(--color-gold-deep);
          font-weight: 600;
        }

        .lightbox-caption {
          font-size: 0.9rem;
          color: var(--color-charcoal);
          margin: 0.35rem 0;
          font-style: italic;
        }

        .lightbox-uploader {
          font-size: 0.8rem;
          color: var(--color-forest);
          font-weight: 600;
          margin: 0.2rem 0 0;
        }

        .btn-lightbox-delete {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 0.85rem;
          background: rgba(183, 28, 28, 0.1);
          border: 1px solid rgba(183, 28, 28, 0.3);
          color: #C62828;
          padding: 0.45rem 1rem;
          border-radius: 25px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-lightbox-delete:hover:not(:disabled) {
          background: #C62828;
          color: #FFFFFF;
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
