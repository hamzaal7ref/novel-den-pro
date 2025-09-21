import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Layout/AppSidebar";
import { LibraryProvider } from "@/contexts/LibraryContext";
import { ReaderProvider } from "@/contexts/ReaderContext";
import Library from "./pages/Library";
import Browse from "./pages/Browse";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LibraryProvider>
        <ReaderProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SidebarProvider>
              <div className="min-h-screen flex w-full">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                  <header className="h-12 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <SidebarTrigger className="ml-2" />
                    <div className="flex-1 flex items-center justify-center">
                      <h1 className="text-lg font-semibold">LNReader PC</h1>
                    </div>
                  </header>
                  <main className="flex-1 overflow-hidden">
                    <Routes>
                      <Route path="/" element={<Library />} />
                      <Route path="/browse" element={<Browse />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </BrowserRouter>
        </ReaderProvider>
      </LibraryProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
