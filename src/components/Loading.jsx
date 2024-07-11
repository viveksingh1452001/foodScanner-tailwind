import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
        <div className='absolute font-body font-semibold text-amber-800'>NS</div>
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-l-amber-800"></div>
    </div>
  );
};

export default Loading;
