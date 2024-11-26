import React from "react";
import { useAdForm } from "../hooks/useAdForm";
import PlaceholderImage from "../components/PlaceholderImage";

const AdFormPage: React.FC = () => {
  const {
    title,
    description,
    previewImages,
    coverImageIndex,
    isEditing,
    setTitle,
    setDescription,
    handleImageSelection,
    handleRemoveImage,
    handleSubmit,
    handleCancel,
    setCoverImageIndex,
  } = useAdForm();

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">{isEditing ? "Edit Ad" : "Create Ad"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered w-full"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-bordered w-full"
          required
        ></textarea>
        <div>
          <label>Images (max 6):</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelection}
            disabled={previewImages.length >= 6}
          />
          <div className="grid grid-cols-3 gap-2 mt-2">
            {previewImages.length === 0 ? (
              <PlaceholderImage />
            ) : (
              previewImages.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img.url}
                    alt={`Preview ${index}`}
                    className="w-full h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setCoverImageIndex(index)} // Establecer portada
                    className={`absolute bottom-0 left-0 p-1 ${
                      coverImageIndex === index ? "bg-green-500 text-white" : "bg-gray-200"
                    }`}
                  >
                    Portada
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index, index >= previewImages.length - 6)}
                    className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded"
                  >
                    X
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button type="button" onClick={handleCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEditing ? "Update Ad" : "Create Ad"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdFormPage;
