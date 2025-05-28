import { ArrowLeft, Plus, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import BottomNavigation from '../components/BottomNavigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: 'happy' | 'sad' | 'stressed' | 'calm' | 'angry' | 'excited';
}

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: '2025-01-20',
      content: 'Had an amazing workout today! Feeling really energized and motivated to keep going with my fitness goals.',
      mood: 'happy'
    },
    {
      id: '2',
      date: '2025-01-19',
      content: 'Feeling a bit overwhelmed with work lately. Need to focus more on self-care and relaxation.',
      mood: 'stressed'
    },
    {
      id: '3',
      date: '2025-01-18',
      content: 'Peaceful yoga session this morning. Found my center and feeling much more balanced.',
      mood: 'calm'
    }
  ]);

  const [isWriting, setIsWriting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [newEntry, setNewEntry] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<JournalEntry | null>(null);

  const moodEmojis = {
    happy: '😊',
    sad: '😢',
    stressed: '😰',
    calm: '😌',
    angry: '😠',
    excited: '🤩'
  };

  const moodColors = {
    happy: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    sad: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    stressed: 'bg-red-500/20 text-red-400 border-red-500/30',
    calm: 'bg-green-500/20 text-green-400 border-green-500/30',
    angry: 'bg-red-600/20 text-red-500 border-red-600/30',
    excited: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  };

  const detectMood = (content: string): JournalEntry['mood'] => {
    // Simple mood detection based on keywords
    const text = content.toLowerCase();
    if (text.includes('amazing') || text.includes('great') || text.includes('happy') || text.includes('energized')) return 'happy';
    if (text.includes('overwhelmed') || text.includes('stressed') || text.includes('anxious')) return 'stressed';
    if (text.includes('peaceful') || text.includes('calm') || text.includes('balanced')) return 'calm';
    if (text.includes('excited') || text.includes('motivated')) return 'excited';
    if (text.includes('sad') || text.includes('down')) return 'sad';
    if (text.includes('angry') || text.includes('frustrated')) return 'angry';
    return 'calm'; // default
  };

  const handleSaveEntry = () => {
    if (!newEntry.trim()) return;
    
    const mood = detectMood(newEntry);
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      content: newEntry,
      mood
    };
    
    setEntries([entry, ...entries]);
    setNewEntry('');
    setIsWriting(false);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setNewEntry(entry.content);
    setIsEditing(true);
  };

  const handleUpdateEntry = () => {
    if (!editingEntry || !newEntry.trim()) return;

    const updatedEntries = entries.map(entry => {
      if (entry.id === editingEntry.id) {
        return {
          ...entry,
          content: newEntry,
          mood: detectMood(newEntry)
        };
      }
      return entry;
    });

    setEntries(updatedEntries);
    setNewEntry('');
    setIsEditing(false);
    setEditingEntry(null);
    toast.success('Journal entry updated successfully!');
  };

  const handleDeleteEntry = (entry: JournalEntry) => {
    setEntryToDelete(entry);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (!entryToDelete) return;

    const updatedEntries = entries.filter(entry => entry.id !== entryToDelete.id);
    setEntries(updatedEntries);
    setShowDeleteConfirm(false);
    setEntryToDelete(null);
    toast.success('Journal entry deleted successfully!');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Calculate mood trends
  const moodCounts = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCommonMood = Object.entries(moodCounts).sort(([,a], [,b]) => b - a)[0];

  if (isWriting || isEditing) {
    return (
      <div className="min-h-screen bg-dark-bg pb-24">
        <div className="flex items-center p-6 pb-4">
          <button onClick={() => {
            setIsWriting(false);
            setIsEditing(false);
            setNewEntry('');
            setEditingEntry(null);
          }} className="mr-4">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">
            {isEditing ? 'Edit Entry' : 'New Entry'}
          </h1>
        </div>

        <div className="px-6">
          <div className="glass-card p-6">
            <div className="mb-4">
              <p className="text-gray-400 mb-2">How are you feeling today?</p>
              <p className="text-white font-medium">
                {isEditing && editingEntry 
                  ? formatDate(editingEntry.date)
                  : formatDate(new Date().toISOString().split('T')[0])}
              </p>
            </div>

            <Textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="Write about your day, thoughts, or feelings..."
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 min-h-[200px] mb-6"
            />

            <div className="flex space-x-3">
              <Button 
                onClick={isEditing ? handleUpdateEntry : handleSaveEntry}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                {isEditing ? 'Update Entry' : 'Save Entry'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsWriting(false);
                  setIsEditing(false);
                  setNewEntry('');
                  setEditingEntry(null);
                }}
                className="border-gray-600 text-gray-400 hover:bg-gray-800/50"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg pb-24">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4">
        <div className="flex items-center">
          <Link to="/" className="mr-4">
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Journal</h1>
        </div>
        <Button
          onClick={() => setIsWriting(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full p-3"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* AI Mood Insights - Moved to top */}
      {entries.length > 0 && mostCommonMood && (
        <div className="px-6 mb-8">
          <div className="glass-card p-6 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/30">
            <div className="flex items-center mb-3">
              <div className="bg-emerald-600 text-white text-xs px-3 py-1 rounded-full mr-3 font-semibold">
                🧠 AI MOOD INSIGHTS
              </div>
            </div>
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">{moodEmojis[mostCommonMood[0] as keyof typeof moodEmojis]}</span>
              <div>
                <p className="text-white text-lg font-medium">
                  Your recent mood: <span className="text-emerald-400 capitalize">{mostCommonMood[0]}</span>
                </p>
                <p className="text-emerald-300 text-sm">
                  Based on {entries.length} journal entries analyzed
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Streak Counter */}
      <div className="px-6 mb-8">
        <div className="glass-card p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">12 Day Streak</h3>
              <p className="text-gray-400">Keep writing to maintain your streak!</p>
            </div>
            <div className="text-4xl">🔥</div>
          </div>
        </div>
      </div>

      {/* Journal Entries */}
      <div className="px-6 space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm">{formatDate(entry.date)}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`px-3 py-1 rounded-full border flex items-center space-x-2 ${moodColors[entry.mood]}`}>
                  <div className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                    AI
                  </div>
                  <span>{moodEmojis[entry.mood]}</span>
                  <span className="text-sm capitalize font-medium">{entry.mood}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditEntry(entry)}
                    className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEntry(entry)}
                    className="text-red-400 hover:text-red-300 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed">{entry.content}</p>
          </div>
        ))}

        {entries.length === 0 && (
          <div className="glass-card p-8 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-white mb-2">Start Your Journal</h3>
            <p className="text-gray-400 mb-6">Begin your journey of self-reflection and mindfulness.</p>
            <Button
              onClick={() => setIsWriting(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              Write First Entry
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Delete Journal Entry</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300">Are you sure you want to delete this journal entry? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteConfirm(false);
                setEntryToDelete(null);
              }}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNavigation />
    </div>
  );
};

export default Journal;
