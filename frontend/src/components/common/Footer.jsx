import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white bg-opacity-80 backdrop-blur-lg border-t-4 border-gradient-to-r from-blue-300 via-purple-300 to-pink-300 text-gray-900 transition-all duration-500 animate-fadein">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent animate-gradientMove">EduNexus</h3>
            <p className="text-gray-500 text-sm">
              Your comprehensive learning management platform for online education.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-blue-400 hover:text-pink-500 transition-colors duration-300">Home</Link></li>
              <li><Link to="/courses" className="text-blue-400 hover:text-pink-500 transition-colors duration-300">Courses</Link></li>
              <li><Link to="/about" className="text-blue-400 hover:text-pink-500 transition-colors duration-300">About</Link></li>
              <li><Link to="/contact" className="text-blue-400 hover:text-pink-500 transition-colors duration-300">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help" className="text-gray-400 hover:text-white">Help Center</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: support@edunexus.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Learning St, Education City</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} EduNexus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
