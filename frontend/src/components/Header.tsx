import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav className="px-5 py-3 flex justify-between items-center border-b border-[#c4c7ca] shadow-md bg-white dark:bg-[#353738] dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <img src="/logo.png" alt="Logo" className="h-10 w-10" />
        <div className="text-xl font-semibold text-[#18191a] dark:text-white">Dictionary Game</div>
      </div>

      <div className="space-x-6">
        <Link to="/" className="text-[#353738] hover:text-[#437fb2] transition dark:text-white">
          Home
        </Link>
        <Link to="/about" className="text-[#353738] hover:text-[#437fb2] transition dark:text-white">
          About
        </Link>
      </div>
    </nav>
  );
}

export default Header;
