import { useEffect, useState } from 'react';

/**
 * Hook สำหรับตรวจว่า viewport เป็น mobile หรือไม่
 * ใช้ breakpoint 768px เป็นเกณฑ์
 */
const useMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

export default useMobile;
