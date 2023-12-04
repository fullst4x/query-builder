import config from "../../../config/default-values.config.json";

import { useCallback, useRef, useState } from "react";
import {
  QueryBuilderContext,
  QueryBuilderContextProps,
} from "./query-builder.context";

import { Item } from "../../components/query-builder/query-builder.definition";

interface QueryBuilderProviderProps {
  children: React.ReactNode;
}
interface QueryBuilderProviderState
  extends Pick<QueryBuilderContextProps, "components" | "query"> {}

export const QueryBuilderProvider = ({
  children,
}: QueryBuilderProviderProps) => {
  const localStorageKey = "query-builder-items";

  const isEditingItem = useRef(false);

  const setIsEditingItem = (isEditing: boolean) => {
    isEditingItem.current = isEditing;
  };

  const getItemsFromLocalStorage = useCallback(() => {
    let values: Item[] = [];

    try {
      const storage = localStorage.getItem(localStorageKey);
      if (storage) {
        values = storage ? JSON.parse(storage) : [];
      }
    } catch (e) {
      console.error(e);
    }

    return values;
  }, []);

  const saveQueryLocalStorage = (query: Item[]) => {
    try {
      // REVIEW: Create storage hook to use fetch & local or "inject" storage?
      localStorage.setItem(localStorageKey, JSON.stringify(query));
      setState((prev) => ({
        ...prev,
        query,
      }));
    } catch (e) {
      // TODO: Error state/snackbox
      console.error(e);
    }
  };

  const [state, setState] = useState<QueryBuilderProviderState>({
    components: [...config.functions, ...config.operators, ...config.variables],
    query: getItemsFromLocalStorage(),
  });

  // REVIEW: Move create logic here

  const addItem = (item: Item) => {
    saveQueryLocalStorage([...state.query, item]);
  };

  function updateItem(item: Item, index: number) {
    const query = [...state.query];
    query[index] = item;

    saveQueryLocalStorage(query);
  }

  const saveItem = (item: Item) => {
    const index = state.query.findIndex((_item) => _item.id === item.id);
    ~index ? updateItem(item, index) : addItem(item);
  };

  const removeItem = (item: Item) => {
    const index = state.query.findIndex((_item) => _item.id === item.id);
    if (~index) {
      const query = [...state.query];
      query.splice(index, 1);

      saveQueryLocalStorage(query);
    }
  };

  const clearQuery = () => {
    localStorage.removeItem(localStorageKey);
    setState((prev) => ({
      ...prev,
      query: [],
    }));
  };

  return (
    <QueryBuilderContext.Provider
      value={{
        ...state,
        isEditingItem: isEditingItem.current,
        setIsEditingItem,
        saveItem,
        removeItem,
        clearQuery,
      }}
    >
      {children}
    </QueryBuilderContext.Provider>
  );
};
