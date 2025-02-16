import {
  FaBook,
  FaBriefcase,
  FaBookmark,
  FaFolder,
  FaArchive,
  FaBox,
} from "react-icons/fa";
import { RiHomeLine } from "react-icons/ri";

export const shelfICons = [
  { id: "home", icon: RiHomeLine, color: "text-indigo-500" },
  { id: "book", icon: FaBook, color: "text-emerald-500" },
  { id: "briefcase", icon: FaBriefcase, color: "text-amber-500" },
  { id: "bookmark", icon: FaBookmark, color: "text-rose-500" },
  { id: "folder", icon: FaFolder, color: "text-sky-500" },
  { id: "archive", icon: FaArchive, color: "text-violet-500" },
  { id: "box", icon: FaBox, color: "text-teal-500" },
];

export const icons = {
  home: { icon: RiHomeLine, color: "text-indigo-500" },
  book: { icon: FaBook, color: "text-emerald-500" },
  briefcase: { icon: FaBriefcase, color: "text-amber-500" },
  bookmark: { icon: FaBookmark, color: "text-rose-500" },
  folder: { icon: FaFolder, color: "text-sky-500" },
  archive: { icon: FaArchive, color: "text-violet-500" },
  box: { icon: FaBox, color: "text-teal-500" },
};
