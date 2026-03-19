import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import {
  Upload,
  Image as ImageIcon,
  AlignLeft,
  AlignRight,
  Save,
  Loader2,
} from "lucide-react";
import OwnerToast from "../../../Common/OwnerToast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const OwnerBlogEditor = ({ ownerName }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Form state
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imagePosition, setImagePosition] = useState("right");
  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchBlog();
  }, []);

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
  }, [content]);

  const fetchBlog = async () => {
    try {
      const response = await axiosInstance.get("/api/owner/blog");

      if (response.data.success && response.data.blog) {
        const blogData = response.data.blog;
        setBlog(blogData);
        setImagePreview(blogData.image);
        setImagePosition(blogData.imagePosition);
        setTitle(blogData.title);

        setContent(blogData.content);
      }
    } catch (err) {
      console.error("Fetch blog error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      setToast({
        type: "error",
        title: "Invalid File",
        message: "Please upload a valid image (JPG, PNG, GIF, WEBP)",
      });
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setToast({
        type: "error",
        title: "File Too Large",
        message: "Image must be less than 2MB",
      });
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    // Validation
    if (!imagePreview) {
      setToast({
        type: "error",
        title: "Image Required",
        message: "Please upload a blog image",
      });
      return;
    }
    if (!title.trim()) {
      setToast({
        type: "error",
        title: "Title Required",
        message: "Please enter a story title",
      });
      return;
    }

    if (!content.trim()) {
      setToast({
        type: "error",
        title: "Content Required",
        message: "Please write blog content",
      });
      return;
    }

    if (wordCount > 500) {
      setToast({
        type: "error",
        title: "Content Too Long",
        message: "Content cannot exceed 500 words",
      });
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      if (image) {
        formData.append("image", image);
      }
      formData.append("imagePosition", imagePosition);
      formData.append("content", content);
      formData.append("title", title);

      const endpoint = blog ? "/api/owner/blog" : "/api/owner/blog";
      const method = blog ? "put" : "post";

      const response = await axiosInstance[method](endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setBlog(response.data.blog);
        setImage(null);
        setToast({
          type: "success",
          title: blog ? "Blog Updated" : "Blog Created",
          message: response.data.message,
        });
      }
    } catch (err) {
      console.error("Save blog error:", err);
      setToast({
        type: "error",
        title: "Save Failed",
        message: err.response?.data?.message || "Failed to save blog",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-[#60519b]" />
          <p className="text-sm text-[#bfc0d1]">Loading your blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {toast && (
        <OwnerToast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="rounded-2xl border border-[#60519b]/20 bg-[#31323e] p-8 overflow-hidden">
        <h2 className="mb-6 text-2xl font-bold text-white">Blog Preview</h2>

        {imagePreview && content ? (
          <div
            className={`flex flex-col gap-8 ${
              imagePosition === "left" ? "lg:flex-row" : "lg:flex-row-reverse"
            } items-center max-w-full overflow-hidden`}
          >
            <div className="w-full lg:w-[45%] shrink-0">
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <img
                  src={imagePreview}
                  alt="Blog"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-4">
              <h3 className="text-3xl font-bold text-[#60519b] break-words">
                {title || "Your Story"}
              </h3>
              <p className="text-[#bfc0d1] text-base leading-relaxed whitespace-pre-wrap overflow-wrap-anywhere break-all">
                {content}
              </p>

              <div className="pt-4 border-t border-[#60519b]/20">
                <p className="text-sm text-[#bfc0d1]/80">
                  Written by{" "}
                  <span className="font-semibold text-white">{ownerName}</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-16 text-center">
            <div>
              <ImageIcon size={64} className="mx-auto mb-4 text-[#60519b]/40" />
              <p className="text-sm text-[#bfc0d1]">
                Upload an image and write content to see preview
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-[#60519b]/20 bg-[#31323e] p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">
          {blog ? "Update Your Blog" : "Create Your Blog"}
        </h2>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Blog Image *
            </label>
            <div className="flex items-center gap-4">
              <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#60519b]/20 px-6 py-3 text-sm font-semibold text-[#60519b] transition-all hover:bg-[#60519b]/30 hover:scale-105">
                <Upload size={18} />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {imagePreview && (
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 overflow-hidden rounded-lg border border-[#60519b]/30">
                    <img
                      src={imagePreview}
                      alt="Selected preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-sm text-[#bfc0d1]">Selected image</span>
                </div>
              )}
            </div>
            <p className="mt-2 text-xs text-[#bfc0d1]/60">
              Max size: 2MB | Formats: JPG, PNG, GIF, WEBP
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Image Position *
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setImagePosition("left")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                  imagePosition === "left"
                    ? "bg-[#60519b] text-white shadow-lg shadow-[#60519b]/40"
                    : "bg-[#60519b]/20 text-[#60519b] hover:bg-[#60519b]/30"
                }`}
              >
                <AlignLeft size={18} />
                Left
              </button>
              <button
                onClick={() => setImagePosition("right")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                  imagePosition === "right"
                    ? "bg-[#60519b] text-white shadow-lg shadow-[#60519b]/40"
                    : "bg-[#60519b]/20 text-[#60519b] hover:bg-[#60519b]/30"
                }`}
              >
                <AlignRight size={18} />
                Right
              </button>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Story Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              placeholder="Enter your story title..."
              className="w-full rounded-xl border border-[#60519b]/20 bg-[#1e202c] px-4 py-3 text-sm text-white placeholder-[#bfc0d1]/40 focus:border-[#60519b]/50 focus:outline-none focus:ring-2 focus:ring-[#60519b]/20"
            />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-white">
                Blog Content *
              </label>
              <span
                className={`text-xs font-medium ${
                  wordCount > 500 ? "text-red-400" : "text-[#bfc0d1]/60"
                }`}
              >
                {wordCount} / 500 words
              </span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your story here..."
              rows={12}
              className="w-full rounded-xl border border-[#60519b]/20 bg-[#1e202c] px-4 py-3 text-sm text-white placeholder-[#bfc0d1]/40 transition-all focus:border-[#60519b]/50 focus:outline-none focus:ring-2 focus:ring-[#60519b]/20"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={
              saving || !imagePreview || !content.trim() || wordCount > 500
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#60519b] to-[#7d6ab8] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#60519b]/40 transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                {blog ? "Update Blog" : "Create Blog"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerBlogEditor;
