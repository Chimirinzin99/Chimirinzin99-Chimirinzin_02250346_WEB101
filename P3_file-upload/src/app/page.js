"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useDropzone } from "react-dropzone";

// ✅ Moved OUTSIDE of FileUploadForm to avoid hydration mismatch
const Dropzone = ({ onDrop, maxSize, accept, setFilePreview }) => {
  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop: (acceptedFiles) => {
        onDrop(acceptedFiles);

        if (acceptedFiles.length > 0) {
          const file = acceptedFiles[0];

          if (file.type.startsWith("image/")) {
            const previewUrl = URL.createObjectURL(file);
            setFilePreview({
              url: previewUrl,
              name: file.name,
              type: file.type,
            });
          } else {
            setFilePreview({
              name: file.name,
              type: file.type,
            });
          }
        }
      },
      maxSize,
      accept,
      multiple: false,
    });

  return (
    <div className="mt-1">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer text-center transition ${
          isDragActive
            ? "border-blue-500 bg-blue-100 text-black"
            : "border-gray-600 bg-gray-800 hover:border-blue-400"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here...</p>
        ) : (
          <div>
            <p>Drag &amp; drop or click to upload</p>
            <p className="text-sm text-gray-400 mt-1">
              JPEG, PNG, PDF (max 5MB)
            </p>
          </div>
        )}
      </div>

      {fileRejections.length > 0 && (
        <p className="text-red-500 mt-2 text-sm">Invalid file type or size</p>
      )}
    </div>
  );
};

export default function FileUploadForm() {
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const onSubmit = async (data) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", data.file[0]);
      formData.append("name", data.name);

      const res = await axios.post("/api/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentage);
        },
      });

      if (res.data.success) {
        setUploadResult({
          success: true,
          message: res.data.message,
        });
      } else {
        throw new Error(res.data.message || "Upload failed");
      }
    } catch (error) {
      setUploadResult({
        success: false,
        message: error.message || "Upload failed",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md bg-gray-900 p-6 rounded-xl shadow-lg text-white">
        <h1 className="text-2xl font-bold mb-6 text-center">
          File Upload Form
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* NAME */}
          <div className="mb-4">
            <label className="block mb-1">Your Name:</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* FILE */}
          <div className="mb-4">
            <label className="block mb-1">Upload File:</label>
            <Controller
              name="file"
              control={control}
              rules={{
                required: "File is required",
                validate: {
                  fileSize: (files) =>
                    !files?.[0] ||
                    files[0].size <= MAX_FILE_SIZE ||
                    "Max 5MB allowed",
                  fileType: (files) =>
                    !files?.[0] ||
                    ACCEPTED_FILE_TYPES.includes(files[0].type) ||
                    "Invalid file type",
                },
              }}
              render={({ field: { onChange } }) => (
                <Dropzone
                  onDrop={(files) => onChange(files)}
                  maxSize={MAX_FILE_SIZE}
                  setFilePreview={setFilePreview}
                  accept={{
                    "image/jpeg": [".jpg", ".jpeg"],
                    "image/png": [".png"],
                    "application/pdf": [".pdf"],
                  }}
                />
              )}
            />
            {errors.file && (
              <p className="text-red-500 text-sm">{errors.file.message}</p>
            )}
          </div>

          {/* PREVIEW */}
          {filePreview && (
            <div className="mb-4">
              <p className="mb-1">Preview:</p>
              <div className="border p-2 rounded bg-gray-800">
                {filePreview.type?.startsWith("image/") ? (
                  <img
                    src={filePreview.url}
                    alt="preview"
                    className="max-h-40 mx-auto"
                  />
                ) : (
                  <p>{filePreview.name}</p>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isUploading}
            className="w-full p-2 bg-blue-500 rounded hover:bg-blue-600"
          >
            {isUploading ? "Uploading..." : "Upload File"}
          </button>

          {/* PROGRESS */}
          {isUploading && (
            <div className="mt-3">
              <div className="w-full bg-gray-700 h-2 rounded">
                <div
                  className="bg-blue-500 h-2 rounded"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-center text-sm mt-1">{uploadProgress}%</p>
            </div>
          )}

          {/* RESULT */}
          {uploadResult && (
            <div
              className={`mt-4 p-2 rounded ${
                uploadResult.success ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {uploadResult.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}