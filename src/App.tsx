import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PlayerProvider } from "@/context/PlayerContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/components/Layout";

// Eager import for critical pages (homepage, player, auth)
import Index from "./pages/Index";
import NowPlaying from "./pages/NowPlaying";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Lazy import for secondary pages
import {
  withSuspense,
  LazySchedule,
  LazyParticipate,
  LazyCommunity,
  LazyDonate,
  LazyAbout,
  LazyTerms,
  LazyPrograms,
  LazyHistory,
  LazyHowToParticipate,
  LazySupport,
  LazyTeam,
  LazyContact,
  LazyPortal,
  LazyProfileSettings,
  LazyAdminDashboard,
  LazyAdminEventsPage,
  LazyAdminNewsPage,
  LazyAdminProductsPage,
  LazyAdminUsersPage,
  LazyAdminDonationsPage,
  LazyAdminSettingsPage,
  LazyAdminCreateEventPage,
  LazyAdminEditEventPage,
  LazyAdminCreateNewsPage,
  LazyAdminEditNewsPage,
  LazyAdminCreateProductPage,
  LazyAdminEditProductPage,
  LazyPortalOrders,
  LazyPortalEvents,
  LazyPortalFavorites,
  LazyResetPassword,
  LazyBlog,
  LazyBlogDetail,
  LazyNews,
  LazyNewsDetail,
  LazyEvents,
  LazyEventDetail,
  LazyShop,
  LazyProductDetail,
  LazyCart,
  LazyDashboard,
  LazyNowPlayingPageModule,
  LazyPlaylistsPage,
  LazyPodcasts,
  LazyOnDemand,
} from "@/lib/lazy-routes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <PlayerProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  {/* Critical pages - eager loaded */}
                  <Route path="/" element={<Index />} />
                  <Route path="/now-playing" element={<NowPlaying />} />
                  <Route path="/web/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Secondary pages - lazy loaded */}
                  <Route path="/schedule" element={withSuspense(LazySchedule)()} />
                  <Route path="/programacion" element={withSuspense(LazySchedule)()} />
                  <Route path="/participate" element={withSuspense(LazyParticipate)()} />
                  <Route path="/community" element={withSuspense(LazyCommunity)()} />
                  <Route path="/donate" element={withSuspense(LazyDonate)()} />
                  <Route path="/about" element={withSuspense(LazyAbout)()} />
                  <Route path="/terms" element={withSuspense(LazyTerms)()} />
                  <Route path="/programas" element={withSuspense(LazyPrograms)()} />

                  {/* Info pages - lazy loaded */}
                  <Route path="/historia" element={withSuspense(LazyHistory)()} />
                  <Route path="/como-participar" element={withSuspense(LazyHowToParticipate)()} />
                  <Route path="/apoyanos" element={withSuspense(LazySupport)()} />
                  <Route path="/about-us" element={withSuspense(LazyTeam)()} />
                  <Route path="/contactus" element={withSuspense(LazyContact)()} />

                   {/* User pages - lazy loaded */}
                   <Route path="/portal" element={withSuspense(LazyPortal)()} />
                   <Route path="/portal/settings" element={withSuspense(LazyProfileSettings)()} />
                   <Route path="/portal/orders" element={withSuspense(LazyPortalOrders)()} />
                   <Route path="/portal/events" element={withSuspense(LazyPortalEvents)()} />
                   <Route path="/portal/favorites" element={withSuspense(LazyPortalFavorites)()} />
                   
                    {/* Admin pages - lazy loaded */}
                    <Route path="/admin" element={withSuspense(LazyAdminDashboard)()} />
                    <Route path="/admin/events" element={withSuspense(LazyAdminEventsPage)()} />
                    <Route path="/admin/events/create" element={withSuspense(LazyAdminCreateEventPage)()} />
                    <Route path="/admin/events/:id" element={withSuspense(LazyAdminEditEventPage)()} />
                    <Route path="/admin/news" element={withSuspense(LazyAdminNewsPage)()} />
                    <Route path="/admin/news/create" element={withSuspense(LazyAdminCreateNewsPage)()} />
                    <Route path="/admin/news/:id" element={withSuspense(LazyAdminEditNewsPage)()} />
                    <Route path="/admin/products" element={withSuspense(LazyAdminProductsPage)()} />
                    <Route path="/admin/products/create" element={withSuspense(LazyAdminCreateProductPage)()} />
                    <Route path="/admin/products/:id" element={withSuspense(LazyAdminEditProductPage)()} />
                    <Route path="/admin/users" element={withSuspense(LazyAdminUsersPage)()} />
                    <Route path="/admin/donations" element={withSuspense(LazyAdminDonationsPage)()} />
                    <Route path="/admin/settings" element={withSuspense(LazyAdminSettingsPage)()} />
                   
                   <Route path="/reset-password" element={withSuspense(LazyResetPassword)()} />

                  {/* Content pages - lazy loaded */}
                  <Route path="/event" element={withSuspense(LazyEvents)()} />
                  <Route path="/event/:id" element={withSuspense(LazyEventDetail)()} />
                  <Route path="/shop" element={withSuspense(LazyShop)()} />
                  <Route path="/shop/:id" element={withSuspense(LazyProductDetail)()} />
                  <Route path="/shop/cart" element={withSuspense(LazyCart)()} />
                  <Route path="/blog" element={withSuspense(LazyBlog)()} />
                  <Route path="/blog/:slug" element={withSuspense(LazyBlogDetail)()} />
                  <Route path="/news" element={withSuspense(LazyNews)()} />
                  <Route path="/news/:id" element={withSuspense(LazyNewsDetail)()} />

                  {/* AzuraCast modules - lazy loaded */}
                  <Route path="/stream-dashboard" element={withSuspense(LazyDashboard)()} />
                  <Route path="/stream-now-playing" element={withSuspense(LazyNowPlayingPageModule)()} />
                  <Route path="/playlists" element={withSuspense(LazyPlaylistsPage)()} />
                  <Route path="/podcasts" element={withSuspense(LazyPodcasts)()} />
                  <Route path="/ondemand" element={withSuspense(LazyOnDemand)()} />
                </Route>

                {/* Not found - eager loaded */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </PlayerProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
