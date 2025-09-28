'use client';

import { useState, useEffect } from 'react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NoteEditorProps {
  note?: Note;
  onSave: (noteData: { title: string; content: string }) => void;
  onCancel: () => void;
}

export default function NoteEditor({ note, onSave, onCancel }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  const handleSave = () => {
    onSave({ title, content });
  };

  return (
    <div className="h-full flex flex-col p-4 bg-white">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="笔记标题"
        className="text-2xl font-bold mb-4 p-2 border-b focus:outline-none"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="开始写作..."
        className="flex-1 w-full text-base p-2 resize-none focus:outline-none"
      />
      <div className="flex justify-end space-x-2 mt-4">
        <button onClick={onCancel} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
          取消
        </button>
        <button onClick={handleSave} className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          保存
        </button>
      </div>
    </div>
  );
}
