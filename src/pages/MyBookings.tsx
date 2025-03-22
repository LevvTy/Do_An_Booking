import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Booking } from "@/lib/types";

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = localStorage.getItem("user");

    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để xem đơn đặt phòng");
      navigate("/login");
      return;
    }

    // Parse user data to get email
    const userData = JSON.parse(currentUser);
    const userEmail = userData.email;

    // Get bookings from localStorage
    const storedBookings = JSON.parse(localStorage.getItem("bookings") || "[]");

    // Filter bookings for current user
    const userBookings = storedBookings.filter(
      (booking: Booking) => booking.customerEmail === userEmail
    );

    setBookings(userBookings);
    setIsLoading(false);
  }, [navigate]);

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn đặt phòng này?")) {
      // Get all bookings from localStorage
      const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]");

      // Filter out the booking to cancel from all bookings
      const updatedAllBookings = allBookings.filter(
        (booking: Booking) => booking.id !== bookingId
      );

      // Update localStorage with all bookings
      localStorage.setItem("bookings", JSON.stringify(updatedAllBookings));

      // Update local state with filtered bookings for current user
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userEmail = currentUser.email;
      const updatedUserBookings = updatedAllBookings.filter(
        (booking: Booking) => booking.customerEmail === userEmail
      );

      setBookings(updatedUserBookings);
      toast.success("Đã hủy đơn đặt phòng thành công");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-16">
          <div className="container mx-auto p-4">
            <div className="text-center">Đang tải...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Đơn đặt phòng của tôi</h1>

          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                Bạn chưa có đơn đặt phòng nào
              </p>
              <Button onClick={() => navigate("/")}>Đặt phòng ngay</Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-48 h-48 rounded overflow-hidden">
                        <img
                          src={booking.hotelImage}
                          alt={booking.hotelName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {booking.hotelName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {booking.guests} khách · {booking.totalNights} đêm
                            </p>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Hủy đặt phòng
                          </Button>
                        </div>

                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Ngày nhận phòng:
                            </span>
                            <span>
                              {format(new Date(booking.checkIn), "dd/MM/yyyy")}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Ngày trả phòng:
                            </span>
                            <span>
                              {format(new Date(booking.checkOut), "dd/MM/yyyy")}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Tổng tiền:
                            </span>
                            <span className="font-semibold">
                              {new Intl.NumberFormat("vi-VN").format(
                                booking.totalPrice
                              )}
                              ₫
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} VietStay. Tất cả các quyền được bảo
            lưu.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MyBookings;
