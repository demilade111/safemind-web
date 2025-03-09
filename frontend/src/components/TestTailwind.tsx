import React from "react";

const TestTailwind = () => {
  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        Tailwind CSS Test
      </h1>

      <div className="bg-green-100 p-4 rounded-lg shadow mb-6">
        <p className="text-green-800">
          This is a green background with green text.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-red-200 p-4 rounded">Grid item 1</div>
        <div className="bg-blue-200 p-4 rounded">Grid item 2</div>
      </div>

      <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
        Hover Me
      </button>
    </div>
  );
};

export default TestTailwind;
