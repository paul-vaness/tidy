import { invoke } from "@tauri-apps/api/core";
export type Entry = { name: string; path: string; is_dir: boolean; size: number; modified: number | null; extension: string | null; };
export type Listing = { path: string; parent: string | null; entries: Entry[]; };
export const fs = {
  home: () => invoke<string>("home_directory"),
  list: (path: string) => invoke<Listing>("list_directory", { path }),
  open: (path: string) => invoke<void>("open_path", { path }),
};
