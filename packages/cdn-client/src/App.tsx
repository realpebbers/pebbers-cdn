import { Route } from "wouter";
import { TreeView } from "./routes/TreeView/TreeView.tsx";

function App() {
	return (
		<Route path="/">
			<TreeView />
		</Route>
	);
}

export default App;
