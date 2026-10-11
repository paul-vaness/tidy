# Tidy — Architecture

## Stack
- Tauri 2 (desktop shell)
- Rust (backend, indexing, algorithms)
- React + TypeScript (UI)
- SQLite (metadata, feedback, undo log)
- Tantivy (full-text index)
- fastembed-rs (BGE-small-en-v1.5, 384-d embeddings)
- Tesseract + poppler (OCR)

## Modules
- `src-tauri/src/fs/`         — filesystem operations
- `src-tauri/src/index/`      — SQLite + Tantivy indexer
- `src-tauri/src/extract/`    — PDF / OOXML / OCR text extraction
- `src-tauri/src/embed/`      — embeddings + vector store
- `src-tauri/src/ai/`         — optional Ollama summaries
- `src-tauri/src/place/`      — folder placement algorithm (phase 2)
- `src-tauri/src/versions/`   — near-duplicate detection (phase 3)
- `src-tauri/src/journal/`    — safe move log + recovery

## Data flow
scan → extract → embed → index → search → rank → act
