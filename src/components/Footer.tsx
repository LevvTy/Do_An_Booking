import { Facebook, Instagram, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">VietStay</h3>
            <p className="text-gray-400">
              Đặt phòng khách sạn trực tuyến với giá tốt nhất. Hỗ trợ 24/7.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="/hotels" className="text-gray-400 hover:text-white">
                  Khách sạn
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-white">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@vietstay.com</li>
              <li>Điện thoại: +84 123 456 789</li>
              <li>Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">
              Kết nối với chúng tôi
            </h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            © {new Date().getFullYear()} VietStay. Tất cả các quyền được bảo
            lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};
