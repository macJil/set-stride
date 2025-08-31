import React from 'react';

const MinimalTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-black p-8">
      <h1 className="text-4xl font-bold mb-4">🧪 Minimal Test</h1>
      <p className="text-lg mb-4">If you can see this, basic rendering is working.</p>
      <div className="bg-blue-100 p-4 rounded border">
        <p className="text-blue-800">This is a test component to verify rendering.</p>
      </div>
    </div>
  );
};

export default MinimalTest;
