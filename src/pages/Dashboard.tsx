import { useState } from 'react';
import { DashboardSidebar } from '../components/layout/DashboardSidebar';
import { DashboardContent } from '../features/dashboard/components/DashboardContent';
import { SettingsModal } from '../components/shared/SettingsModal';
import { ExportModal } from '../features/dashboard/components/ExportModal';

export function Dashboard() {
  const [selectedSummaryId, setSelectedSummaryId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showExport, setShowExport] = useState(false);

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <DashboardSidebar
        selectedSummaryId={selectedSummaryId}
        onSelectSummary={setSelectedSummaryId}
        onShowSettings={() => setShowSettings(true)}
      />
      <DashboardContent
        selectedSummaryId={selectedSummaryId}
        onShowExport={() => setShowExport(true)}
        onSummaryCreated={setSelectedSummaryId}
      />

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showExport && selectedSummaryId && (
        <ExportModal summaryId={selectedSummaryId} onClose={() => setShowExport(false)} />
      )}
    </div>
  );
}