import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-blue-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">SafeMind</h1>
          <p className="text-gray-600 mt-2">Your mental health companion</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
