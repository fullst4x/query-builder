import { QueryBuilderProvider } from "../../providers/query-builder/query-builder.provider";
import { DragTest } from "../drag-test/drag-test.component";
import { QueryBuilder } from "../query-builder/query-builder.component";

import "./App.css";

function App() {
  return (
    <QueryBuilderProvider>
      <QueryBuilder />
      {/* <DragTest /> */}
    </QueryBuilderProvider>
  );
}

export default App;
