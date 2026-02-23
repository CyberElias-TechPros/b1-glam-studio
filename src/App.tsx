import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Booking from "./pages/Booking";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
import PageTransition, { LogoTransition } from "./components/PageTransition";
import ScrollProgress from "./components/ScrollProgress";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <>
      <LogoTransition />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <PageTransition location={location.pathname}>
              <Index />
            </PageTransition>
          } 
        />
        <Route 
          path="/about" 
          element={
            <PageTransition location={location.pathname}>
              <About />
            </PageTransition>
          } 
        />
        <Route 
          path="/services" 
          element={
            <PageTransition location={location.pathname}>
              <Services />
            </PageTransition>
          } 
        />
        <Route 
          path="/portfolio" 
          element={
            <PageTransition location={location.pathname}>
              <Portfolio />
            </PageTransition>
          } 
        />
        <Route 
          path="/booking" 
          element={
            <PageTransition location={location.pathname}>
              <Booking />
            </PageTransition>
          } 
        />
        <Route 
          path="/testimonials" 
          element={
            <PageTransition location={location.pathname}>
              <Testimonials />
            </PageTransition>
          } 
        />
        <Route 
          path="/contact" 
          element={
            <PageTransition location={location.pathname}>
              <Contact />
            </PageTransition>
          } 
        />
        <Route 
          path="/blog" 
          element={
            <PageTransition location={location.pathname}>
              <Blog />
            </PageTransition>
          } 
        />
        <Route 
          path="/blog/:slug" 
          element={
            <PageTransition location={location.pathname}>
              <Blog />
            </PageTransition>
          } 
        />
        <Route 
          path="*" 
          element={
            <PageTransition location={location.pathname}>
              <NotFound />
            </PageTransition>
          } 
        />
      </Routes>
    </AnimatePresence>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ScrollProgress />
      <BrowserRouter>
        <ScrollToTop />
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
