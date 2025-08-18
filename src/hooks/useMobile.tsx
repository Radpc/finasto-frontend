import { useEffect, useState } from "react";

const isMobile = (value: number) => window.innerWidth < value;
//  1024 tablet
//  700 mobile

export enum MobileType {
  Tablet = 1024,
  Mobile = 700,
}

export const useMobile = (type: MobileType = MobileType.Tablet) => {
  const breakpoint = type;

  const [mobile, setMobile] = useState<boolean>(isMobile(breakpoint));

  useEffect(() => {
    function handleResize() {
      setMobile(isMobile(breakpoint));
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [setMobile]);

  return mobile;
};
