import {
  ClipboardList, BookOpen, BookCheck, Gamepad2, Sparkles, Youtube, FileText, Image, PenLine, Headphones, File,
  CalendarDays, Users, ClipboardCheck, House, Clapperboard, Facebook, Folder, FolderOpen, Link as LinkIcon, Video, Puzzle,
} from 'lucide-react'

// Icons available by name in resources.js → folder.icon
const icons = {
  ClipboardList, BookOpen, BookCheck, Gamepad2, Sparkles, Youtube, FileText, Image, PenLine, Headphones,
  CalendarDays, Users, ClipboardCheck, House, Clapperboard, Facebook, Folder, FolderOpen, Link: LinkIcon, Video, Puzzle,
}

/** Render a lucide icon by name, e.g. <Icon name="BookOpen" /> */
export default function Icon({ name, ...props }) {
  const C = icons[name] || Folder
  return <C aria-hidden="true" {...props} />
}
