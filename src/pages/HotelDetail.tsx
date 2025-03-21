import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, addDays, differenceInCalendarDays } from "date-fns";
import {
  Calendar as CalendarIcon,
  Users,
  Star,
  ArrowLeft,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { DateRangePicker } from "@/components/DateRangePicker";
import { GuestSelector } from "@/components/GuestSelector";
import { Button } from "@/components/ui/button";
import { getHotelById } from "@/lib/data";
import { useAuth } from "@/lib/authContext";
import { DateRange } from "react-day-picker";
import { Hotel } from "@/lib/types";

const HotelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 3),
  });
  const [guests, setGuests] = useState(1);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);

  const totalNights = dateRange.to
    ? differenceInCalendarDays(dateRange.to, dateRange.from)
    : 0;

  useEffect(() => {
    async function fetchHotelData() {
      if (!id) {
        navigate("/");
        return;
      }

      setLoading(true);
      try {
        const hotelData = await getHotelById(id);
        if (!hotelData) {
          toast.error("Không tìm thấy khách sạn");
          navigate("/");
          return;
        }
        setHotel(hotelData);
      } catch (error) {
        console.error("Error fetching hotel data:", error);
        toast.error("Có lỗi xảy ra khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    }

    fetchHotelData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!hotel) {
    return null;
  }

  const handleBookNow = () => {
    if (!dateRange.to) {
      toast.error("Vui lòng chọn ngày nhận và trả phòng");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để đặt phòng", {
        description: "Bạn sẽ được chuyển hướng đến trang đăng nhập",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }

    const bookingDetails = {
      hotelId: hotel.id,
      checkIn: dateRange.from,
      checkOut: dateRange.to,
      guests: guests,
      totalNights,
      totalPrice: hotel.price * totalNights,
    };

    navigate("/checkout", {
      state: {
        booking: bookingDetails,
        hotel: hotel,
      },
    });
  };

  // Get description and overview from the parsed description object
  const description =
    typeof hotel.description === "object"
      ? hotel.description.content || ""
      : "";
  const overview =
    typeof hotel.description === "object"
      ? hotel.description.overview || []
      : [];
  const amenities = Array.isArray(hotel.amenities) ? hotel.amenities : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        <div className="container mx-auto p-4">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg overflow-hidden h-80">
              <img
                src={
                  hotel.images && hotel.images.length > 0
                    ? hotel.images[0]
                    : "/placeholder-hotel.jpg"
                }
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {hotel.images &&
                hotel.images.slice(1, 5).map((image, index) => (
                  <div
                    key={index}
                    className="rounded-lg overflow-hidden h-[calc(40vh/2-0.5rem)]"
                  >
                    <img
                      src={image || "/placeholder-hotel.jpg"}
                      alt={`${hotel.name} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-2xl font-bold">{hotel.name}</h1>
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span>{hotel.rating}</span>
                <span className="mx-2">•</span>
                <span>
                  {hotel.location}, {hotel.city}
                </span>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Mô tả</h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {description}
                </p>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Tổng quan</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {overview.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      {item.icon && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <img src={item.icon} alt="" className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Tiện ích</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="border rounded-lg p-4 sticky top-24">
                <div className="text-xl font-semibold mb-4">
                  {new Intl.NumberFormat("vi-VN").format(hotel.price)}₫
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}
                    / đêm
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Ngày nhận - trả phòng
                    </label>
                    <DateRangePicker
                      dateRange={dateRange}
                      onDateRangeChange={setDateRange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Số lượng khách
                    </label>
                    <GuestSelector guests={guests} onGuestsChange={setGuests} />
                  </div>

                  {dateRange.to && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>
                            {new Intl.NumberFormat("vi-VN").format(hotel.price)}
                            ₫ x {totalNights} đêm
                          </span>
                          <span>
                            {new Intl.NumberFormat("vi-VN").format(
                              hotel.price * totalNights
                            )}
                            ₫
                          </span>
                        </div>
                        <div className="flex justify-between font-semibold pt-2 border-t">
                          <span>Tổng cộng</span>
                          <span>
                            {new Intl.NumberFormat("vi-VN").format(
                              hotel.price * totalNights
                            )}
                            ₫
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    disabled={!dateRange.to}
                    onClick={handleBookNow}
                  >
                    Đặt ngay
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Bạn chưa bị trừ tiền
                  </p>
                </div>
              </div>
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

export default HotelDetail;
