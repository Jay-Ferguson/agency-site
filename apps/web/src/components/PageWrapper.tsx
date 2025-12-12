import { cubicBezier, motion } from "motion/react";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

const transition = {
  duration: 0.3,
  ease: cubicBezier(0.42, 0, 0.58, 1), // ease-in-out cubic bezier
};

export default function PageWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transition}
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
  );
}
