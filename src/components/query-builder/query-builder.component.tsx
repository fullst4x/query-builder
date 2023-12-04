import config from "../../../config/default-values.config.json";

import React, { useCallback, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

import { DraggableItem } from "../draggable-item/draggable-item.component";

import { Item } from "./query-builder.definition";
import { useQueryBuilder } from "../../providers/query-builder/query-builder.context";

export const QueryBuilder: React.FC = () => {
  const {
    components,
    query,
    saveItem,
    clearQuery,
    isEditingItem,
    setIsEditingItem,
  } = useQueryBuilder();

  const [isDragging, setIsDragging] = useState(false);

  const draggedItem = useRef<string | null>(null);

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, itemId: string) => {
      e.dataTransfer.setData("text/plain", itemId);
      e.dataTransfer.effectAllowed = "move";
      draggedItem.current = itemId;
    },
    [],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (draggedItem.current) {
      setIsDragging(true);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();

      if (draggedItem.current) {
        const dataId = e.dataTransfer.getData("text/plain");
        const found = components.find((item) => item.id === dataId);
        if (found) {
          saveItem(found);
        }

        draggedItem.current = null;
        setIsDragging(false);
      }
    },
    [draggedItem, components, saveItem],
  );

  const handleDroppableAreaClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      // REVIEW: isEditing logic feels very messy!
      if (!isEditingItem) {
        const newItem: Item = {
          id: uuid(),
          label: "",
          value: "",
          isEditing: true,
        };
        saveItem(newItem);
        setIsEditingItem(true);
      } else {
        // REVIEW: Clicking Droppable Area when isEditingItem, blurs to false, then true onClick.
        //         Annoying flash when clicking droppable with empty Editable active!
        setIsEditingItem(false);
      }
    },
    [isEditingItem, saveItem, setIsEditingItem],
  );

  const editItem = (item: Item) => {
    const isComponent = components.find(
      (component) => component.id === item.id,
    );
    if (!isComponent) {
      saveItem({
        ...item,
        isEditing: true,
      });
      setIsEditingItem(true);
    }
  };

  // const moveItem = useCallback(
  //   (draggedItemId: string, targetItemId: string) => {
  //     const dragIndex = queryComponents.findIndex(
  //       (item) => item.id === draggedItemId,
  //     );
  //     const hoverIndex = queryComponents.findIndex(
  //       (item) => item.id === targetItemId,
  //     );
  //     if (dragIndex !== hoverIndex && dragIndex !== -1 && hoverIndex !== -1) {
  //       const newQueryComponents = [...queryComponents];
  //       const dragItem = newQueryComponents[dragIndex];
  //       newQueryComponents.splice(dragIndex, 1);
  //       newQueryComponents.splice(hoverIndex, 0, dragItem);
  //       setQueryComponents(newQueryComponents);
  //     }
  //   },
  //   [queryComponents],
  // );

  const handleClearOnClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    clearQuery();
    setIsEditingItem(false);
  };

  // TODO: Fix editing state
  // TODO: Add move logic
  //       Show Lines between bubbles onDragOver
  //       and Show faded out empty bubble to show user can add new

  return (
    <main className="w-full">
      <div className="container mx-auto p-4">
        <div className="mb-4 flex flex-wrap rounded-lg bg-white p-4 shadow-lg">
          <div className="w-full p-2 md:w-1/3">
            <div className="mb-2 text-left text-lg font-semibold">
              Variables
            </div>
            <div className="flex flex-col space-y-2">
              {config.variables.map((item: Item, index: number) => (
                <DraggableItem
                  key={`${item.id}-${index}`}
                  item={item}
                  onDragStart={handleDragStart}
                  onClick={() => saveItem(item)}
                />
              ))}
            </div>
          </div>
          <div className="w-full p-2 md:w-2/3">
            <div className="mb-2 text-left text-lg font-semibold">
              Operators
            </div>
            <div className="mb-2 flex space-x-2">
              {config.operators.map((item: Item, index: number) => (
                <DraggableItem
                  key={`${item.id}-${index}`}
                  item={item}
                  onDragStart={handleDragStart}
                  onClick={() => saveItem(item)}
                />
              ))}
            </div>
            <div
              className={`droppable relative m-1 min-h-[128px] cursor-pointer rounded-lg border-2 border-gray-300 bg-gray-50 px-3 py-2 transition-colors ${
                query.length === 0 ? "hover:bg-gray-400" : ""
              } ${isDragging ? "border-dashed opacity-80" : ""} box-content`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleDroppableAreaClick}
            >
              <span
                onClick={handleClearOnClick}
                className="absolute right-1 top-1 cursor-pointer rounded-lg bg-slate-300 px-2 py-1 text-xs text-white hover:opacity-70"
              >
                clear
              </span>
              <p className="mb-4 text-left text-gray-400">
                Drag variables and operators to query...
              </p>
              {query.length === 0 && (
                <p className="mb-4 text-center text-gray-50">
                  Click to add a new value...
                </p>
              )}
              <div className="flex flex-row flex-wrap content-center items-center justify-center">
                {query.map((item: Item, index: number) => (
                  <DraggableItem
                    key={`${item.id}-${index}`}
                    item={item}
                    onDragStart={handleDragStart}
                    onClick={() => editItem(item)}
                    isInQuery={true}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
