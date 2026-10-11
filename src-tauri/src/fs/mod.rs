use serde::Serialize;
use std::fs;
use std::path::PathBuf;
use std::time::UNIX_EPOCH;

#[derive(Serialize)]
pub struct Entry {
    name: String,
    path: String,
    is_dir: bool,
    size: u64,
    modified: Option<u64>,
    extension: Option<String>,
}

#[derive(Serialize)]
pub struct Listing {
    path: String,
    parent: Option<String>,
    entries: Vec<Entry>,
}

fn entry_from(entry_path: PathBuf) -> Option<Entry> {
    let name = entry_path.file_name()?.to_string_lossy().to_string();
    if name.starts_with('.') { return None; }
    let meta = fs::symlink_metadata(&entry_path).ok()?;
    let is_dir = meta.is_dir();
    let size = if is_dir { 0 } else { meta.len() };
    let modified = meta.modified().ok()
        .and_then(|t| t.duration_since(UNIX_EPOCH).ok())
        .map(|d| d.as_secs());
    let extension = entry_path.extension()
        .map(|s| s.to_string_lossy().to_ascii_lowercase());
    Some(Entry {
        name,
        path: entry_path.to_string_lossy().to_string(),
        is_dir, size, modified, extension,
    })
}

#[tauri::command]
pub fn list_directory(path: String) -> Result<Listing, String> {
    let p = PathBuf::from(&path);
    let md = fs::metadata(&p).map_err(|e| e.to_string())?;
    if !md.is_dir() { return Err(format!("not a directory: {path}")); }

    let read = fs::read_dir(&p).map_err(|e| e.to_string())?;
    let mut entries: Vec<Entry> = read.flatten().filter_map(|i| entry_from(i.path())).collect();

    entries.sort_by(|a, b| {
        b.is_dir.cmp(&a.is_dir)
            .then_with(|| a.name.to_lowercase().cmp(&b.name.to_lowercase()))
    });

    let parent = p.parent().map(|pp| pp.to_string_lossy().to_string());
    Ok(Listing { path: p.to_string_lossy().to_string(), parent, entries })
}

#[tauri::command]
pub fn home_directory() -> Result<String, String> {
    std::env::var("HOME").or_else(|_| std::env::var("USERPROFILE"))
        .map_err(|_| "no HOME/USERPROFILE".into())
}

#[tauri::command]
pub fn open_path(path: String) -> Result<(), String> {
    if !std::path::Path::new(&path).exists() {
        return Err(format!("does not exist: {path}"));
    }
    open_native(&path)
}

#[cfg(target_os = "linux")]
fn open_native(p: &str) -> Result<(), String> {
    std::process::Command::new("xdg-open").arg(p).spawn().map(|_| ()).map_err(|e| e.to_string())
}
#[cfg(target_os = "windows")]
fn open_native(p: &str) -> Result<(), String> {
    std::process::Command::new("cmd").args(["/C", "start", "", p]).spawn().map(|_| ()).map_err(|e| e.to_string())
}
#[cfg(target_os = "macos")]
fn open_native(p: &str) -> Result<(), String> {
    std::process::Command::new("open").arg(p).spawn().map(|_| ()).map_err(|e| e.to_string())
}
