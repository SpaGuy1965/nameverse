import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import Home from "@/pages/Home";
import Favorites from "@/pages/Favorites";
import History from "@/pages/History";
import NotFound from "@/pages/not-found";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router hook={useHashLocation}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/favorites" component={Favorites} />
            <Route path="/history" component={History} />
            <Route component={NotFound} />
          </Switch>
        </Router>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
