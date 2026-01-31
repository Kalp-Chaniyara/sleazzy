import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GradientBackground } from '../components/gradient-background';
import { 
  LayoutDashboard, 
  CalendarPlus, 
  CalendarDays, 
  FileText, 
  ShieldCheck,
  Menu,
  Bell,
  LogOut,
  ClipboardList,
  Layers,
} from 'lucide-react';
import { User } from '../types';
import { Button } from '../components/ui/button';
import { ThemeToggle } from '../components/theme-toggle';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../components/ui/sheet';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium active:scale-[0.98] touch-manipulation",
      isActive
        ? "bg-brand text-white"
        : "text-textMuted hover:bg-hoverSoft hover:text-textPrimary"
    );

  const renderNavLinks = () => {
    if (user.role === 'club') {
      return (
        <>
          <div className="px-4 py-2 text-xs font-semibold text-textMuted uppercase tracking-wider">
            Club Menu
          </div>
          <NavLink to="/" className={navClass} end>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/book" className={navClass}>
            <CalendarPlus size={20} />
            <span>Book a Slot</span>
          </NavLink>
          <NavLink to="/my-bookings" className={navClass}>
            <CalendarDays size={20} />
            <span>My Bookings</span>
          </NavLink>
          <NavLink to="/policy" className={navClass}>
            <FileText size={20} />
            <span>Policy</span>
          </NavLink>
        </>
      );
    } else {
      return (
        <>
          <div className="px-4 py-2 text-xs font-semibold text-textMuted uppercase tracking-wider">
            Admin Controls
          </div>
          <NavLink to="/" className={navClass} end>
            <ShieldCheck size={20} />
            <span>Admin Dashboard</span>
          </NavLink>
          <NavLink to="/admin/requests" className={navClass}>
            <ClipboardList size={20} />
            <span>Pending Requests</span>
          </NavLink>
          <NavLink to="/admin/schedule" className={navClass}>
            <Layers size={20} />
            <span>Master Schedule</span>
          </NavLink>
        </>
      );
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex bg-bgMain dark:bg-transparent relative">
      <GradientBackground />
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 glass border-r border-borderSoft dark:border-white/10 fixed h-full z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="p-5 lg:p-6 border-b border-borderSoft dark:border-white/10 flex items-center gap-3"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center text-white font-bold text-lg"
          >
            S
          </motion.div>
          <span className="text-xl font-semibold text-textPrimary tracking-tight">Sleazzy</span>
        </motion.div>
        
        <motion.nav 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto overscroll-contain"
        >
          {renderNavLinks()}
        </motion.nav>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="p-4 border-t border-borderSoft dark:border-white/10"
        >
          <div className="flex items-center gap-3 p-3 rounded-xl glass-subtle border border-borderSoft dark:border-white/10">
            <Avatar className="h-10 w-10 border border-borderSoft dark:border-white/20 shrink-0">
              <AvatarFallback className="bg-brand/10 text-brand font-semibold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-textPrimary truncate">
                {user.name}
              </p>
              <p className="text-xs text-textMuted truncate">
                {user.role === 'club' ? `Group ${user.group}` : 'Administrator'}
              </p>
            </div>
          </div>
        </motion.div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 lg:ml-72 flex flex-col min-h-screen min-h-[100dvh]">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass border-b border-borderSoft dark:border-white/10 sticky top-0 z-20 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between safe-area-inset-top"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Button 
              variant="ghost"
              size="icon"
              className="md:hidden shrink-0 h-10 w-10 rounded-lg active:scale-95"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={22} />
            </Button>
            <h1 className="text-lg sm:text-xl font-semibold text-textPrimary truncate tracking-tight">
              {user.role === 'club' ? 'Club Portal' : 'Administration'}
            </h1>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-lg text-textSecondary">
              <Bell size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 bg-error rounded-full border-2 border-card" />
            </Button>
            <Button 
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="flex items-center gap-2 text-textMuted hover:text-error rounded-lg"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline text-sm">Logout</span>
            </Button>
          </div>
        </motion.header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto overscroll-contain pb-safe bg-transparent dark:bg-transparent">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent 
          side="left" 
          className="w-[min(85vw,320px)] sm:w-72 p-0 flex flex-col glass-dark border-r border-borderSoft dark:border-white/10 rounded-r-xl"
        >
          <SheetHeader className="p-5 sm:p-6 border-b border-borderSoft">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center text-white font-bold text-lg">
                S
              </div>
              <SheetTitle className="text-xl font-semibold text-textPrimary">Sleazzy</SheetTitle>
            </div>
          </SheetHeader>
          
          <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto overscroll-contain">
            {renderNavLinks()}
          </nav>
          
          <div className="p-4 border-t border-borderSoft">
            <div className="flex items-center gap-3 p-3 rounded-xl glass-subtle border border-borderSoft dark:border-white/10">
              <Avatar className="h-10 w-10 border border-borderSoft shrink-0">
                <AvatarFallback className="bg-brand/10 text-brand font-semibold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-textPrimary truncate">
                  {user.name}
                </p>
                <p className="text-xs text-textMuted truncate">
                  {user.role === 'club' ? `Group ${user.group}` : 'Administrator'}
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Layout;
