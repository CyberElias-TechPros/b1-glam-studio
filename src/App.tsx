import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/lib/authContext";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { SmoothScrollProvider } from "@/components/motion/SmoothScroll";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { Preloader } from "@/components/motion/Preloader";
import PageTransition from "@/components/PageTransition";
import ScrollProgress from "@/components/ScrollProgress";
import ScrollToTop from "@/components/ScrollToTop";
import heroImage from "@/assets/hero-beauty.jpg";

// First paint: home is bundled, everything else is split and warmed in idle time.
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Booking = lazy(() => import("./pages/Booking"));
const BookingLookup = lazy(() => import("./pages/BookingLookup"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminBookings = lazy(() => import("./pages/admin/AdminBookings"));
const AdminInquiries = lazy(() => import("./pages/admin/AdminInquiries"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminSubscribers = lazy(() => import("./pages/admin/AdminSubscribers"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
});

/** Warms the routes a visitor is most likely to open next. */
function useRoutePrefetch() {
  useEffect(() => {
    const warm = () => {
      void import("./pages/Portfolio");
      void import("./pages/Booking");
      void import("./pages/Services");
      void import("./pages/About");
    };
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    if (typeof idle === "function") {
      const handle = idle(warm);
      return () => {
        const cancel = (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
        if (typeof cancel === "function") cancel(handle);
      };
    }
    const timer = window.setTimeout(warm, 2200);
    return () => window.clearTimeout(timer);
  }, []);
}

function RouteFallback() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <span className="absolute inset-0 rounded-full border border-gold/20" />
          <span className="absolute inset-0 animate-spin rounded-full border-t border-gold [animation-duration:1.1s]" />
        </div>
        <span className="eyebrow-muted">Setting the light</span>
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useRoutePrefetch();

  return (
    <PageTransition location={location.pathname} withCurtain={!isAdminRoute}>
      <Suspense fallback={<RouteFallback />}>
        <Routes location={location}>
          {/* Client experience */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking/lookup" element={<BookingLookup />} />
          <Route path="/booking/status/:code" element={<BookingLookup />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Blog />} />

          {/* Staff portal */}
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

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </PageTransition>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <SmoothScrollProvider>
          <Toaster />
          <Sonner />
          <Preloader imageSources={[heroImage]} />
          <CustomCursor />
          <ScrollProgress />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ScrollToTop />
            <AnimatedRoutes />
          </BrowserRouter>
        </SmoothScrollProvider>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
