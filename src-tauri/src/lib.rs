mod fs;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            fs::list_directory,
            fs::home_directory,
            fs::open_path,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
