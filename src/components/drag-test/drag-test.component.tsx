// DragDropComponent.tsx
import React, { useRef } from "react";
import "./Styles.css";

export const DragTest: React.FC = () => {
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dropzoneRef.current) {
      const targetRect = dropzoneRef.current.getBoundingClientRect();
      const halfWidth = targetRect.width / 2;
      const overLeftHalf = e.clientX - targetRect.left < halfWidth;

      // Remove any previous position class
      dropzoneRef.current.classList.remove("blue-line-left", "blue-line-right");

      // Add the appropriate class based on cursor position
      dropzoneRef.current.classList.add(
        overLeftHalf ? "blue-line-left" : "blue-line-right",
      );
    }
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("blue-line-left", "blue-line-right");
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("blue-line-left", "blue-line-right");
    // Handle the drop event here
  };

  return (
    <div>
      <div className="draggable" draggable={true}>
        Drag me
      </div>

      <div
        className="dropzone"
        ref={dropzoneRef}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        Drop here
      </div>
    </div>
  );
};
