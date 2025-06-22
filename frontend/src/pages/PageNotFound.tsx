import Base from '../components/Base';
import { Link } from 'react-router-dom';

function PageNotFound() {
  return (
    <Base>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
        <h1 className="text-6xl font-extrabold text-red-500 dark:text-red-400 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">That word isn't in our dictionary!</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          The page you're looking for doesn't exist or was moved.
        </p>
        <Link
          to="/"
          className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-200 shadow-lg"
        >
          Back to Home
        </Link>

        <div className="mt-12">
          <img
            src="/logo512.png"
            alt="Dictionary Game Logo"
            className="w-32 h-32 opacity-20 hover:opacity-40 transition"
          />
        </div>
      </div>
    </Base>
  );
}

export default PageNotFound;
