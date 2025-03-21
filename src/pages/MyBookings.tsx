import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Header } from "@/components/Header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Receipt,
  Hotel as HotelIcon,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { Booking, Hotel } from "@/lib/types";
import { getHotelById } from "@/lib/data";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const MyBookings = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hotelCities, setHotelCities] = useState<Record<string, string>>({});
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Get bookings from localStorage
    const storedBookings = localStorage.getItem("bookings");
    if (storedBookings) {
      try {
        const parsedBookings = JSON.parse(storedBookings);
        // Parse dates (they come as strings from localStorage)
        const formattedBookings = parsedBookings.map((booking: any) => ({
          ...booking,
          checkIn: new Date(booking.checkIn),
          checkOut: new Date(booking.checkOut),
          bookingDate: new Date(booking.bookingDate),
        }));
        setBookings(formattedBookings);

        // Load hotel cities asynchronously
        const loadHotelCities = async () => {
          const citiesMap: Record<string, string> = {};
          for (const booking of formattedBookings) {
            try {
              const hotel = await getHotelById(booking.hotelId);
              if (hotel && hotel.city) {
                citiesMap[booking.hotelId] = hotel.city;
              }
            } catch (error) {
              console.error(
                `Failed to load hotel details for ${booking.hotelId}:`,
                error
              );
            }
          }
          setHotelCities(citiesMap);
        };

        loadHotelCities();
      } catch (error) {
        console.error("Failed to parse bookings:", error);
      }
    }
  }, [isAuthenticated, navigate]);

  const handleViewHotel = (hotelId: string) => {
    navigate(`/hotel/${hotelId}`);
  };

  const handleCancelClick = (booking: Booking) => {
    setBookingToCancel(booking);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    if (!bookingToCancel) return;

    // Get current bookings
    const storedBookings = localStorage.getItem("bookings");
    if (!storedBookings) return;

    try {
      const parsedBookings = JSON.parse(storedBookings);
      // Filter out the booking to cancel
      const updatedBookings = parsedBookings.filter(
        (booking: Booking) => booking.id !== bookingToCancel.id
      );

      // Update localStorage
      localStorage.setItem("bookings", JSON.stringify(updatedBookings));

      // Update state
      setBookings(updatedBookings);

      // Close dialog
      setCancelDialogOpen(false);
      setBookingToCancel(null);

      // Show success message
      toast.success("Hủy đặt phòng thành công!", {
        description: "Đơn đặt phòng đã được hủy",
      });
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      toast.error("Có lỗi xảy ra khi hủy đặt phòng");
    }
  };

  if (!isAuthenticated) {
    return null; // This will redirect in the useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6">Đặt phòng của tôi</h1>

          {bookings.length === 0 ? (
            <Card className="text-center p-8">
              <CardHeader>
                <CardTitle>Bạn chưa có đặt phòng nào</CardTitle>
                <CardDescription>
                  Hãy tìm kiếm và đặt phòng khách sạn tại VietStay
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate("/hotels")} className="mt-4">
                  <HotelIcon className="mr-2 h-4 w-4" />
                  Tìm khách sạn
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lịch sử đặt phòng</CardTitle>
                  <CardDescription>
                    Xem lại tất cả các lần đặt phòng của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Khách sạn</TableHead>
                          <TableHead>Thông tin phòng</TableHead>
                          <TableHead>Ngày nhận/trả phòng</TableHead>
                          <TableHead>Tổng tiền</TableHead>
                          <TableHead>Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-16 h-16 rounded overflow-hidden">
                                  <img
                                    src={booking.hotelImage}
                                    alt={booking.hotelName}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {booking.hotelName}
                                  </div>
                                  <div className="text-sm text-muted-foreground flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {hotelCities[booking.hotelId] || ""}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {booking.roomName}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {booking.guests} khách · {booking.totalNights}{" "}
                                  đêm
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>
                                  {format(booking.checkIn, "dd/MM/yyyy")}
                                </span>
                                <span className="mx-1">→</span>
                                <span>
                                  {format(booking.checkOut, "dd/MM/yyyy")}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Đặt ngày:{" "}
                                {format(booking.bookingDate, "dd/MM/yyyy")}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {new Intl.NumberFormat("vi-VN").format(
                                  booking.totalPrice
                                )}
                                ₫
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleViewHotel(booking.hotelId)
                                  }
                                >
                                  Xem chi tiết
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleCancelClick(booking)}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Hủy
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
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

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hủy đặt phòng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn hủy đặt phòng tại{" "}
              <span className="font-medium">{bookingToCancel?.hotelName}</span>{" "}
              không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCancelDialogOpen(false);
                setBookingToCancel(null);
              }}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleConfirmCancel}>
              Xác nhận hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyBookings;
