"use client";

import { useState, useEffect, useRef } from "react";
import { useGlobalContext } from "@/components/providers/global-context-provider";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function UserAvatar({
  isChangeable = false,
  size = "small",
}: {
  isChangeable?: boolean;
  size?: "small" | "medium" | "large";
}) {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);

  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-32 h-32",
  };

  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [previewSrc]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        toast.error("You must select an image to upload.");
        return;
      }

      const file = event.target.files[0];

      // Check file size
      if (file.size > 1024 * 1024) {
        toast.error("File size exceeds 1 MB. Please choose a smaller file.");
        return;
      }

      setFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrc(reader.result as string);
        setShowPreview(true);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while processing the image.");
    }
  };

  const uploadAvatar = async () => {
    setUploading(true);
    const uploadPromise = async () => {
      if (!file) {
        throw new Error("No file selected.");
      }

      const fileExt = file.name.split(".").pop();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileExt", fileExt ?? "");

      const response = await fetch("/api/auth/changeAvatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update avatar");
      }

      const data = await response.json();

      // Update local avatar URL with the new public URL
      setLocalAvatarUrl(data.data.avatar_url);

      setShowPreview(false);
      return data;
    };

    toast.promise(uploadPromise, {
      loading: "Uploading avatar...",
      success: (data) => {
        setUploading(false);
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return `Avatar updated successfully`;
      },
      error: (error) => {
        setUploading(false);
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return error instanceof Error
          ? error.message
          : "Failed to update avatar";
      },
    });
  };

  const src = localAvatarUrl || user?.avatar_url;

  if (isChangeable) {
    return (
      <>
        <div
          className={`relative w-fit hover:cursor-pointer rounded-full hover:opacity-50 transition-opacity ${
            uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <input
            ref={fileInputRef}
            className="absolute w-full h-full inset-0 opacity-0 cursor-pointer rounded-full"
            type="file"
            id="single"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
          />
          <Avatar
            className={cn("w-24 h-24 pointer-events-none", sizeClasses[size])}
          >
            <AvatarImage src={src} />
            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          </Avatar>
        </div>
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="sm:max-w-md space-y-4">
            <DialogHeader>
              <DialogTitle>Preview Avatar</DialogTitle>
              <DialogDescription>
                Confirm if you want to use this image as your new avatar.
              </DialogDescription>
            </DialogHeader>
            {previewSrc && (
              <div className="flex justify-center items-center rounded-full overflow-hidden w-64 h-64 mx-auto">
                <div className="relative w-full h-full">
                  {!imageError ? (
                    <Image
                      src={previewSrc}
                      alt="Preview"
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-full"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      Failed to load image
                    </div>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Cancel
              </Button>
              <Button onClick={uploadAvatar} disabled={uploading}>
                {uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Avatar className={cn("w-24 h-24", sizeClasses[size])}>
      <AvatarImage src={src} />
      <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
    </Avatar>
  );
}
