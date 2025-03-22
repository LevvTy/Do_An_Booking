import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { toast } from "sonner";

interface Booking {
  id: string;
  hotelId: string;
  hotelName: string;
  hotelImage: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalNights: number;
  totalPrice: number;
  bookingDate: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Check if already authenticated
    const adminAuth = localStorage.getItem("adminAuth");
    if (adminAuth === "true") {
      setIsAuthenticated(true);
      loadBookings();
    }
  }, []);

  const loadBookings = () => {
    const storedBookings = localStorage.getItem("bookings");
    if (storedBookings) {
      try {
        const parsedBookings = JSON.parse(storedBookings);
        // Parse dates
        const formattedBookings = parsedBookings.map((booking: any) => ({
          ...booking,
          checkIn: new Date(booking.checkIn),
          checkOut: new Date(booking.checkOut),
          bookingDate: new Date(booking.bookingDate),
        }));
        setBookings(formattedBookings);
      } catch (error) {
        console.error("Failed to parse bookings:", error);
      }
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "1234") {
      setIsAuthenticated(true);
      localStorage.setItem("adminAuth", "true");
      loadBookings();
      toast.success("Đăng nhập thành công!");
    } else {
      toast.error("Sai tên đăng nhập hoặc mật khẩu!");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuth");
    toast.success("Đã đăng xuất!");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-16">
          <div className="container mx-auto p-4">
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Đăng nhập Admin</CardTitle>
                  <CardDescription>
                    Vui lòng đăng nhập để quản lý đơn đặt phòng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="username">Tên đăng nhập</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Mật khẩu</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Đăng nhập
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Quản lý đơn đặt phòng</h1>
            <Button variant="outline" onClick={handleLogout}>
              Đăng xuất
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Khách sạn</TableHead>
                      <TableHead>Thông tin khách hàng</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Tổng tiền</TableHead>
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
                              <div className="text-sm text-muted-foreground">
                                {booking.guests} khách · {booking.totalNights}{" "}
                                đêm
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {booking.customerName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {booking.customerEmail}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {booking.customerPhone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>
                              {format(booking.checkIn, "dd/MM/yyyy")} →{" "}
                              {format(booking.checkOut, "dd/MM/yyyy")}
                            </div>
                            <div className="text-muted-foreground">
                              Đặt ngày:{" "}
                              {format(booking.bookingDate, "dd/MM/yyyy")}
                            </div>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Admin;
