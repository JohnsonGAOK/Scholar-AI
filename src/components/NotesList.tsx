'use client';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NotesListProps {
  notes: Note[];
  selectedNoteId?: string;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

export default function NotesList({ notes, selectedNoteId, onSelectNote, onDeleteNote }: NotesListProps) {
  return (
    <div className="space-y-2 p-2">
      {notes.map(note => (
        <div
          key={note.id}
          onClick={() => onSelectNote(note.id)}
          className={`p-3 rounded-lg cursor-pointer transition-colors ${
            selectedNoteId === note.id ? 'bg-blue-100' : 'hover:bg-gray-100'
          }`}
        >
          <h3 className="font-semibold text-gray-800 truncate">{note.title || '无标题笔记'}</h3>
          <p className="text-sm text-gray-500 truncate">{note.content || '没有额外内容'}</p>
          <div className="text-xs text-gray-400 mt-1">{note.updatedAt.toLocaleDateString()}</div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteNote(note.id);
            }}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-200"
            style={{ display: 'none' }} // Simple hide for now
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
}
