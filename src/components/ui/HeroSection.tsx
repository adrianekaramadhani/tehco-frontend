// File: src/components/ui/HeroSection.tsx

const HeroSection = () => {
  // Fungsi untuk scroll ke bagian menu
  const handleScrollToMenu = () => {
    const menuElement = document.getElementById('menu-section');
    if (menuElement) {
      menuElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    // --- PERUBAHAN DI SINI: Gunakan h-[90vh] ---
    <div className="relative h-[90vh] w-full flex items-center justify-center text-center overflow-hidden">
      {/* Video Latar Belakang */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute z-0 w-full h-full object-cover"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay Gelap */}
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

      {/* Konten Teks */}
      <div className="relative z-20 text-white px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-sora leading-tight mb-4">
          Rasa Segar, <br /> Satu Klik Jauhnya.
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Nikmati kesegaran Teh Solo OCHA di mana pun Anda berada.
        </p>
        <button
          onClick={handleScrollToMenu}
          className="bg-teal-500 text-black font-bold py-3 px-8 rounded-full text-lg hover:bg-teal-400 transition-transform hover:scale-105"
        >
          Lihat Menu
        </button>
      </div>
    </div>
  );
};

export default HeroSection;