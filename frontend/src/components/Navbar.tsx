import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white px-8 py-4 flex justify-between items-center border-b border-gray-300 shadow-sm">
      <div className="text-xl font-semibold text-gray-800">Dictionary Game</div>
        <div className="space-x-6">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 transition">
                Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-indigo-600 transition">
                About
            </Link>
        </div>
    </nav>
  );
}

export default Navbar;