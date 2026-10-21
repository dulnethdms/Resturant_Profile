"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import ReservationModal from "./ReservationModal";

const ReserveContext = createContext<{ openReserve: () => void }>({ openReserve: () => {} });

export function useReserve() {
  return useContext(ReserveContext);
}

export default function ReserveProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openReserve = useCallback(() => setOpen(true), []);

  return (
    <ReserveContext.Provider value={{ openReserve }}>
      {children}
      <AnimatePresence>
        {open && <ReservationModal onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </ReserveContext.Provider>
  );
}
