import { Folder, FileText, FileCode, FileImage, FilePdf, FileArchive, FileAudio, FileVideo, type Icon } from "@phosphor-icons/react";
import type { Entry } from "@/lib/fs";
import { humanSize, relativeTime } from "@/lib/format";
const ICONS: Record<string, Icon> = {
  pdf: FilePdf,
  png: FileImage, jpg: FileImage, jpeg: FileImage, gif: FileImage, webp: FileImage, svg: FileImage,
  txt: FileText, md: FileText, docx: FileText, doc: FileText, rtf: FileText,
  rs: FileCode, ts: FileCode, tsx: FileCode, js: FileCode, jsx: FileCode, py: FileCode,
  json: FileCode, toml: FileCode, yaml: FileCode, yml: FileCode, html: FileCode, css: FileCode,
  zip: FileArchive, tar: FileArchive, gz: FileArchive, rar: FileArchive,
  mp3: FileAudio, wav: FileAudio, flac: FileAudio, m4a: FileAudio,
  mp4: FileVideo, mov: FileVideo, mkv: FileVideo, webm: FileVideo,
};
export function FileRow({ entry, selected, onClick, onDoubleClick, onContextMenu }: {
  entry: Entry; selected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDoubleClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}) {
  const Ico = entry.is_dir ? Folder : (entry.extension && ICONS[entry.extension]) || FileText;
  return (
    <button onClick={onClick} onDoubleClick={onDoubleClick} onContextMenu={onContextMenu}
      className="flex w-full items-center gap-3 px-4 transition-colors"
      style={{ height: 34, background: selected ? "var(--accent-soft)" : "transparent",
               color: selected ? "var(--accent)" : "var(--text)", textAlign: "left" }}
      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = "var(--hover)"; }}
      onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = "transparent"; }}>
      <Ico size={16} weight={entry.is_dir ? "fill" : "regular"}
        style={{ color: entry.is_dir ? "var(--accent)" : "var(--text-3)", flexShrink: 0 }} />
      <span className="min-w-0 flex-1 truncate" style={{ fontSize: "var(--text-base)" }}>{entry.name}</span>
      <span style={{ fontSize: "var(--text-xs)", color: "var(--text-3)", width: 70, textAlign: "right" }}>
        {entry.is_dir ? "" : humanSize(entry.size)}
      </span>
      <span style={{ fontSize: "var(--text-xs)", color: "var(--text-3)", width: 90, textAlign: "right" }}>
        {relativeTime(entry.modified)}
      </span>
    </button>
  );
}
