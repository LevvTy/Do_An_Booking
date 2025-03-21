
import { SearchForm } from "./SearchForm";

export function Hero() {
  return (
    <div className="relative w-full h-[600px] sm:h-[650px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1513415564515-4a81450347d6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80')" 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 flex flex-col items-center">
        <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12 animate-slide-up">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Khám phá những khách sạn tốt nhất tại Việt Nam
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Tìm kiếm và đặt phòng tại những khách sạn tuyệt vời với giá cả phải chăng trên khắp Việt Nam
          </p>
        </div>

        {/* Search Form */}
        <SearchForm 
          className="w-full max-w-5xl mx-auto mb-12" 
          variant="hero"
        />
      </div>
    </div>
  );
}
