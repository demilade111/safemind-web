import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto">
      <header className="py-12 text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Welcome to SafeMind
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your comprehensive mental health platform for therapy, mood tracking,
          and community support.
        </p>
        <div className="mt-8">
          {user ? (
            <Link
              to="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="space-x-4">
              <Link
                to="/auth/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md"
              >
                Sign In
              </Link>
              <Link
                to="/auth/register"
                className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 font-semibold py-3 px-8 rounded-lg shadow-md"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>

      <section className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-blue-600 mb-4">
              Video Therapy
            </h2>
            <p className="text-gray-600">
              Connect with licensed therapists through secure video calls. Get
              professional support from the comfort of your home.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-blue-600 mb-4">
              Mood Tracking
            </h2>
            <p className="text-gray-600">
              Monitor your emotional well-being over time with our intuitive
              mood tracking tools. Identify patterns and triggers.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-blue-600 mb-4">
              Community Support
            </h2>
            <p className="text-gray-600">
              Join supportive communities of people with similar experiences.
              Share, learn, and grow together.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-blue-50 rounded-lg p-8 mt-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          How SafeMind Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4">
              1
            </div>
            <h3 className="text-lg font-semibold mb-2">Create an Account</h3>
            <p className="text-gray-600">
              Sign up and complete your profile to get personalized
              recommendations.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4">
              2
            </div>
            <h3 className="text-lg font-semibold mb-2">Find Support</h3>
            <p className="text-gray-600">
              Browse therapists, join communities, or explore self-help
              resources.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4">
              3
            </div>
            <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Use our tools to monitor your journey and celebrate improvements.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
