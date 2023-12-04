import { useRef, useEffect, useState } from "react";

import { useQueryBuilder } from "../../providers/query-builder/query-builder.context";

import { Item } from "../query-builder/query-builder.definition";

interface EditableItemProps {
  item: Item;
}

export const EditableItem: React.FC<EditableItemProps> = ({
  item: initialItem,
}) => {
  const { saveItem, removeItem, setIsEditingItem } = useQueryBuilder();
  const [item, setItem] = useState(initialItem);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleBlur = () => {
    if (inputRef.current) {
      if (item.value) {
        saveItem({ ...item, isEditing: false });
      } else {
        removeItem(item);
      }
    }

    // REVIEW: Needed to close on blur, but current onClick in droppable brings it back!!
    setIsEditingItem(false);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      (["Backspace", "Delete", "Escape"].includes(e.key) &&
        item.value.length === 0) ||
      e.key === "Enter"
    ) {
      inputRef.current?.blur();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem((prev) => ({
      ...prev,
      label: e.target.value,
      value: e.target.value,
      isEditing: true,
    }));
  };

  return (
    <input
      ref={inputRef}
      defaultValue={item.label}
      onClick={(e) => e.stopPropagation()}
      onKeyUp={handleKeyUp}
      onChange={handleChange}
      onBlur={handleBlur}
      className="m-1 inline-block rounded bg-gray-200 p-2"
    />
  );
};
