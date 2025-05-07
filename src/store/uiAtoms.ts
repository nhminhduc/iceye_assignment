import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const sideMenuCollapsedAtom = atom<boolean>(false);
export const isDarkModeAtom = atomWithStorage<boolean>("theme", false);
