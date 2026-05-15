import "./App.css";
import { Route, Switch } from "wouter";
import { Button } from "./components/Button/Button.tsx";
import { FileView } from "./routes/FileView/FileView.tsx";
import { TreeView } from "./routes/TreeView/TreeView.tsx";

function App() {
	return (
		<Switch>
			<Route path="/">
				<Button> Upload </Button>
				<TreeView />
			</Route>
			<Route path="/*">
				<FileView />
			</Route>
		</Switch>
	);
}

export default App;
