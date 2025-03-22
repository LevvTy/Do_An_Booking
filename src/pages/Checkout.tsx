import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookingDetails, Hotel } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, hotel } = location.state || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  if (!booking || !hotel) {
    navigate("/");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate payment processing
    setTimeout(() => {
      // Create a new booking with additional details
      const newBooking = {
        ...booking,
        id: uuidv4(),
        bookingDate: new Date(),
        hotelName: hotel.name,
        hotelImage: hotel.images[0],
        customerName,
        customerEmail,
        customerPhone,
      };

      // Save to localStorage
      const existingBookings = JSON.parse(
        localStorage.getItem("bookings") || "[]"
      );
      localStorage.setItem(
        "bookings",
        JSON.stringify([...existingBookings, newBooking])
      );

      // Show success message
      toast.success("Đặt phòng thành công!", {
        description:
          "Bạn có thể xem lại thông tin đặt phòng trong mục đặt phòng của tôi",
      });

      // Redirect to bookings page
      navigate("/my-bookings");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-lg font-semibold mb-4">
                        Thông tin khách hàng
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="fullName">Họ và tên</Label>
                          <Input
                            id="fullName"
                            required
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Số điện thoại</Label>
                          <Input
                            id="phone"
                            required
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-lg font-semibold mb-4">
                        Thông tin thanh toán
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">Số thẻ</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Ngày hết hạn</Label>
                            <Input id="expiry" placeholder="MM/YY" required />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" required />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="cardName">Tên trên thẻ</Label>
                          <Input id="cardName" required />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang xử lý..." : "Hoàn tất đặt phòng"}
                  </Button>
                </div>
              </form>
            </div>

            <div>
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Chi tiết đặt phòng
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-20 h-20 rounded overflow-hidden">
                        <img
                          src={hotel.images[0]}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{hotel.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {hotel.location}, {hotel.city}
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="text-sm text-muted-foreground">
                        {booking.guests} khách · {booking.totalNights} đêm
                      </div>
                      <div className="text-sm mt-2">
                        <div className="flex justify-between py-1">
                          <span>Nhận phòng:</span>
                          <span>{format(booking.checkIn, "dd/MM/yyyy")}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span>Trả phòng:</span>
                          <span>{format(booking.checkOut, "dd/MM/yyyy")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>
                            {new Intl.NumberFormat("vi-VN").format(hotel.price)}
                            ₫ x {booking.totalNights} đêm
                          </span>
                          <span>
                            {new Intl.NumberFormat("vi-VN").format(
                              booking.totalPrice
                            )}
                            ₫
                          </span>
                        </div>
                        <div className="flex justify-between font-semibold pt-2 border-t">
                          <span>Tổng cộng</span>
                          <span>
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
            </div>
          </div>
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

export default Checkout;
