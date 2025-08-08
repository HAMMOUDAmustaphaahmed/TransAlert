import { useState, useEffect } from 'react';
import ReportCard from './ReportCard';
import { Report } from '../types';

interface ReportsListProps {
  reports: Report[];
}

export default function ReportsList({ reports }: ReportsListProps) {
  const [filteredReports, setFilteredReports] = useState<Report[]>(reports);

  // Mise à jour lorsque les reports changent
  useEffect(() => {
    setFilteredReports([...reports].reverse());
  }, [reports]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Derniers signalements</h2>
      
      {filteredReports.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun signalement pour le moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}