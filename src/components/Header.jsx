import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, User, Globe, X, LogOut, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/authContext";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 lg:px-8 py-4",
        isScrolled ? "bg-white/90 shadow-md backdrop-blur-md" : "bg-white"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-xl font-semibold bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">
            VietStay
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
          >
            Trang chủ
          </Link>
          <Link
            to="/hotels"
            className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
          >
            Khách sạn
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
          >
            Giới thiệu
          </Link>
          {isAuthenticated && (
            <Link
              to="/my-bookings"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors flex items-center gap-1"
            >
              <Calendar className="h-4 w-4" />
              Lịch sử đặt phòng
            </Link>
          )}
        </nav>

        {/* User Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-700 hover:text-primary hover:bg-gray-100"
          >
            <Globe className="mr-2 h-4 w-4" />
            <span>VN</span>
          </Button>

          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                Xin chào, {user?.name}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border border-gray-300 text-gray-700 hover:border-primary hover:text-primary"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border border-gray-300 text-gray-700 hover:border-primary hover:text-primary"
            >
              <Link to="/login">
                <User className="mr-2 h-4 w-4" />
                <span>Đăng nhập</span>
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X size={24} className="text-gray-700" />
          ) : (
            <Menu size={24} className="text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg animate-fade-in">
          <div className="flex flex-col p-4 space-y-3">
            <Link
              to="/"
              className="px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              to="/hotels"
              className="px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Khách sạn
            </Link>
            <Link
              to="/about"
              className="px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Giới thiệu
            </Link>
            {isAuthenticated && (
              <Link
                to="/my-bookings"
                className="px-4 py-2 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Calendar className="h-4 w-4" />
                Lịch sử đặt phòng
              </Link>
            )}
            <div className="border-t border-gray-100 my-2"></div>

            {isAuthenticated ? (
              <>
                <div className="px-4 py-2">
                  <p className="text-sm font-medium">Xin chào, {user?.name}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center border border-gray-300"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full justify-center border border-gray-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link to="/login">
                  <User className="mr-2 h-4 w-4" />
                  <span>Đăng nhập</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
