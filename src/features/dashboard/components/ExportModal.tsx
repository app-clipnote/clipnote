import { useState } from 'react';
import { X, FileText, FileJson, Download, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../../App';

interface ExportModalProps {
  summaryId: string;
  onClose: () => void;
}

export function ExportModal({ summaryId, onClose }: ExportModalProps) {
  const { summaries } = useApp();
  const [selectedFormat, setSelectedFormat] = useState<'txt' | 'pdf' | 'json' | 'md'>('txt');
  const [exporting, setExporting] = useState(false);

  const summary = summaries.find((s) => s.id === summaryId);

  const formats = [
    {
      id: 'txt' as const,
      name: 'Plain Text',
      description: 'Simple text file (.txt)',
      icon: FileText,
    },
    {
      id: 'pdf' as const,
      name: 'PDF Document',
      description: 'Formatted PDF file (.pdf)',
      icon: FileText,
    },
    {
      id: 'json' as const,
      name: 'JSON',
      description: 'Structured data (.json)',
      icon: FileJson,
    },
    {
      id: 'md' as const,
      name: 'Markdown',
      description: 'Markdown format (.md)',
      icon: FileText,
    },
  ];

  const handleExport = async () => {
    if (!summary) return;

    setExporting(true);

    // Simulate export
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Create blob and download
    let content = '';
    let mimeType = 'text/plain';
    let extension = selectedFormat;

    switch (selectedFormat) {
      case 'txt':
        content = `${summary.title}\n\n${summary.url}\n\n${summary.summary}`;
        mimeType = 'text/plain';
        break;
      case 'json':
        content = JSON.stringify(summary, null, 2);
        mimeType = 'application/json';
        break;
      case 'md':
        content = `# ${summary.title}\n\n**URL:** ${summary.url}\n\n## Summary\n\n${summary.summary}`;
        mimeType = 'text/markdown';
        break;
      case 'pdf':
        // In a real app, this would generate a PDF
        content = `${summary.title}\n\n${summary.url}\n\n${summary.summary}`;
        mimeType = 'application/pdf';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summary-${summary.id}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExporting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-semibold">Export Summary</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-semibold mb-1">{summary?.title}</h3>
            <p className="text-sm text-muted-foreground">{summary?.url}</p>
          </div>

          <div className="space-y-3 mb-6">
            <label className="block text-sm font-medium mb-3">Select Format</label>
            {formats.map((format) => {
              const Icon = format.icon;
              return (
                <button
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors text-left ${
                    selectedFormat === format.id
                      ? 'border-primary bg-accent'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedFormat === format.id ? 'bg-primary text-white' : 'bg-secondary'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{format.name}</h4>
                    <p className="text-sm text-muted-foreground">{format.description}</p>
                  </div>
                  {selectedFormat === format.id && (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="bg-accent border border-accent-foreground/20 rounded-xl p-4">
            <p className="text-sm text-accent-foreground">
              Your summary will be downloaded as a .{selectedFormat} file
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-border rounded-xl hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            {exporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>
    </div>
  );
}
