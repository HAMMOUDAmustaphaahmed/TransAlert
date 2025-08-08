import { Report } from '../types';

interface ReportCardProps {
  report: Report;
}

export default function ReportCard({ report }: ReportCardProps) {
  const date = new Date(report.createdAt).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {report.imageUrl && (
        <div className="relative h-48">
          <img
            src={report.imageUrl}
            alt="Infraction photo"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-900">
            {report.driverFirstName || 'Inconnu'} {report.driverLastName || ''}
          </h3>
          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
            Signalé
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-600">
          <span className="font-semibold">Plaque:</span> {report.licensePlate}
        </p>

        <p className="mt-2 text-sm text-gray-600">
          <span className="font-semibold">Trajet:</span> {report.route.start} → {report.route.end}
        </p>

        <p className="mt-2 text-sm text-gray-600">
          <span className="font-semibold">Position:</span> {report.position[0].toFixed(4)}, {report.position[1].toFixed(4)}
        </p>

        <p className="mt-3 text-gray-700">
          {report.comment}
        </p>

        <p className="mt-4 text-xs text-gray-500">
          Signalé le {date}
        </p>
      </div>
    </div>
  );
}