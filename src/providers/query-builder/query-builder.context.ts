import { createContext, useContext } from "react";
import { Item } from "../../components/query-builder/query-builder.definition";

export interface QueryBuilderContextProps {
  components: Item[];
  query: Item[];
  isEditingItem: boolean;
  setIsEditingItem: (isEditing: boolean) => void;
  saveItem: (item: Item) => void;
  removeItem: (item: Item) => void;
  clearQuery: () => void;
}

export const QueryBuilderContext = createContext<QueryBuilderContextProps>({
  components: [],
  query: [],
  isEditingItem: false,
  setIsEditingItem() {
    throw new Error(`setIsEditingItem function not implemented.`);
  },
  saveItem: () => {
    throw new Error(`saveItem function not implemented.`);
  },
  removeItem: () => {
    throw new Error(`removeItem function not implemented.`);
  },
  clearQuery: () => {
    throw new Error("clearQuery function not implemented.");
  },
});

export const useQueryBuilder = () => {
  return useContext(QueryBuilderContext);
};
