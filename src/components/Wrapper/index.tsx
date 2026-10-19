import type { ReactNode } from 'react';

const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative z-20 flex h-full w-full flex-col overflow-x-clip rounded-b-[50px] rounded-t-[50px] bg-[#000] px-10  py-16">
      {children}
    </div>
  );
};

export default Wrapper;
