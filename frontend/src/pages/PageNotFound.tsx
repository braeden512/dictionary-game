import Base from '../components/Base';

function PageNotFound() {
  return (
    <Base>
      <h1 className="text-3xl font-bold text-center mt-8">Page Not Found...</h1>
      <p className="text-center text-gray-600 mt-4">This is awkward.</p>
    </Base>
  );
}

export default PageNotFound;