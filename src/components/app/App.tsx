import { QueryBuilderProvider } from "../../providers/query-builder/query-builder.provider";
import { QueryBuilder } from "../query-builder/query-builder.component";

import "./App.css";

function App() {
  return (
    <QueryBuilderProvider>
      <QueryBuilder />
    </QueryBuilderProvider>
  );
}

export default App;
