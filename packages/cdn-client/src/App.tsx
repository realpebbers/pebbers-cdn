import "./App.css";
import { Route, Switch } from "wouter";
import { FileView } from "./routes/FileView/FileView.tsx";
import { TreeView } from "./routes/TreeView/TreeView.tsx";

function App() {
	return (
		<Switch>
			<Route path="/" component={TreeView} />
			<Route path="/*">
				<FileView />
			</Route>
		</Switch>
	);
}

export default App;
