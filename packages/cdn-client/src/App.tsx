import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { S3Explorer } from "./components";
import { AccessGate } from "./components/access-gate";

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Switch>
				<Route path="/login" component={AccessGate} />
				<Route path="/" component={S3Explorer} />
			</Switch>
		</QueryClientProvider>
	);
}

export default App;
