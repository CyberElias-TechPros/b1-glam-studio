import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/lib/authContext";
import { AdminRoute } from "@/components/admin/AdminRoute";

// Public Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Booking from "./pages/Booking";
import BookingLookup from "./pages/BookingLookup";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";

// Admin Portal Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminInquiries from "./pages/admin/AdminInquiries";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminSubscribers from "./pages/admin/AdminSubscribers";
import AdminSettings from "./pages/admin/AdminSettings";

import PageTransition, { LogoTransition } from "./components/PageTransition";
import ScrollProgress from "./components/ScrollProgress";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <LogoTransition />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Client Routes */}
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
            path="/booking/lookup" 
            element={
              <PageTransition location={location.pathname}>
                <BookingLookup />
              </PageTransition>
            } 
          />
          <Route 
            path="/booking/status/:code" 
            element={
              <PageTransition location={location.pathname}>
                <BookingLookup />
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

          {/* Admin Authentication & Management Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/bookings" 
            element={
              <AdminRoute>
                <AdminBookings />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/inquiries" 
            element={
              <AdminRoute>
                <AdminInquiries />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/reviews" 
            element={
              <AdminRoute>
                <AdminReviews />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/blog" 
            element={
              <AdminRoute>
                <AdminBlog />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/subscribers" 
            element={
              <AdminRoute>
                <AdminSubscribers />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <AdminRoute>
                <AdminSettings />
              </AdminRoute>
            } 
          />

          {/* 404 Catch-All */}
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
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ScrollProgress />
        <BrowserRouter>
          <ScrollToTop />
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
