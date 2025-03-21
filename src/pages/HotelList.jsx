
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { SearchForm } from '@/components/SearchForm';
import { HotelList as HotelListComponent } from '@/components/HotelList';
import { filterHotels } from '@/lib/data';

const HotelList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    location: '',
    checkIn: undefined,
    checkOut: undefined,
    guests: 2
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    
    // Parse search parameters from URL
    const searchLocation = queryParams.get('location') || '';
    const checkInParam = queryParams.get('checkIn');
    const checkOutParam = queryParams.get('checkOut');
    const guestsParam = queryParams.get('guests');
    
    const params = {
      location: searchLocation,
      checkIn: checkInParam ? new Date(checkInParam) : undefined,
      checkOut: checkOutParam ? new Date(checkOutParam) : undefined,
      guests: guestsParam ? parseInt(guestsParam, 10) : 2
    };
    
    setSearchParams(params);
    
    // Filter hotels based on location
    setLoading(true);
    
    const fetchData = async () => {
      try {
        const hotels = await filterHotels(params.location);
        setFilteredHotels(hotels);
      } catch (error) {
        console.error('Error fetching hotels:', error);
        setFilteredHotels([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [location.search]);

  const handleSearch = (params) => {
    // Build query string for navigation
    const queryParams = new URLSearchParams();
    if (params.location) queryParams.append('location', params.location);
    if (params.checkIn) queryParams.append('checkIn', params.checkIn.toISOString());
    if (params.checkOut) queryParams.append('checkOut', params.checkOut.toISOString());
    queryParams.append('guests', params.guests.toString());

    navigate(`/hotels?${queryParams.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        <div className="bg-gray-50 border-b py-4">
          <div className="container mx-auto px-4">
            <SearchForm 
              variant="compact" 
              onSearch={handleSearch} 
              initialParams={searchParams}
            />
          </div>
        </div>
        
        <section className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold">
                {searchParams.location 
                  ? `Khách sạn tại ${searchParams.location}` 
                  : 'Tất cả khách sạn'}
              </h1>
              <p className="text-muted-foreground">
                {filteredHotels.length} khách sạn tìm thấy
                {searchParams.checkIn && searchParams.checkOut && 
                  ` · ${new Date(searchParams.checkIn).toLocaleDateString('vi-VN')} - ${new Date(searchParams.checkOut).toLocaleDateString('vi-VN')}`}
                {` · ${searchParams.guests} khách`}
              </p>
            </div>
          </div>
          
          <HotelListComponent 
            hotels={filteredHotels} 
            loading={loading}
            emptyMessage={`Không tìm thấy khách sạn${searchParams.location ? ` tại ${searchParams.location}` : ''}.`}
          />
        </section>
      </main>
      
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} VietStay. Tất cả các quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
};

export default HotelList;
