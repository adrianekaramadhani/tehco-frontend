// File: src/components/layout/Footer.tsx

const Footer = () => {
  return (
    <footer className="bg-gray-900/50 text-center p-4 mt-12">
      <div className="container mx-auto text-sm text-gray-400">
        © {new Date().getFullYear()} Teh Solo OCHA. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;