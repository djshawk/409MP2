import React, { createContext, useContext, useMemo, useState } from "react";

type Ctx = {
  orderedIds: number[];
  setOrderedIds: (ids: number[]) => void;
};

const SelectionContext = createContext<Ctx | null>(null);

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orderedIds, setOrderedIds] = useState<number[]>([]);
  const value = useMemo(() => ({ orderedIds, setOrderedIds }), [orderedIds]);
  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
};

export const useSelection = () => {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("useSelection must be used within SelectionProvider");
  return ctx;
};
