import { useRef, useState } from "react";
import { EditableItem } from "../editable-item/editable-item.component";
import { Item } from "../query-builder/query-builder.definition";

interface DraggableItemProps {
  item: Item;
  isInQuery?: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  onClick?: () => void;
}

export const DraggableItem: React.FC<DraggableItemProps> = ({
  item,
  onDragStart,
  onClick,
  isInQuery = false,
}) => {
  const draggableItem = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [borderSide, setBorderSide] = useState<"left" | "right" | null>(null);

  if (item.isEditing) {
    return <EditableItem item={item} />;
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // REVIEW: Doesn't change cursor every time, state race condition?
    setIsDragging(true);
    onDragStart(e, item.id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (draggableItem.current && isInQuery) {
      const targetRect = draggableItem.current.getBoundingClientRect();
      const halfWidth = targetRect.width / 2;
      const overLeftHalf = e.clientX - targetRect.left < halfWidth;

      // TODO: Set side in Ref, get this Index in provider, left -1, right +1
      overLeftHalf ? setBorderSide("left") : setBorderSide("right");
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (typeof onClick === "function") {
      onClick();
    }
  };

  const Draggable = (
    <div
      ref={draggableItem}
      className={`draggable translate-0 m-1 inline-block min-h-[40px] min-w-[40px] transform ${
        isDragging ? "cursor-grabbing" : "cursor-pointer"
      } rounded border-2 border-solid bg-gray-200 p-2`}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={() => {
        setIsDragging(false);

        // REVIEW: Don't null if drag target is blue divider?
        setBorderSide(null);
      }}
      onDragLeave={() => setBorderSide(null)}
      onClick={handleClick}
      draggable
    >
      {item.label}
    </div>
  );

  // REVIEW: Might be better to create a new Item in query and colour it blue. Can then track index
  // REVIEW: Blue div hides when dragged over
  if (isInQuery) {
    return (
      <div className="relative">
        <div
          className={`absolute left-[-0.125rem] top-2 h-9 w-1 rounded-full ${
            borderSide === "left" ? "bg-blue-700" : ""
          }`}
        ></div>
        {Draggable}
        <div
          className={`absolute right-[-0.125rem] top-2 h-9 w-1 rounded-full ${
            borderSide === "right" ? "bg-blue-700" : ""
          }`}
        ></div>
      </div>
    );
  }

  return Draggable;
};
