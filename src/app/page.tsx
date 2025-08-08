'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ReportForm from '@/components/ReportForm';
import ReportsList from '@/components/ReportsList';
import { Report } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function Home() {
  // Utilisation du hook useLocalStorage côté client uniquement
  const [reports, setReports] = useLocalStorage<Report[]>('reports', []);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleSubmit = (newReport: Report) => {
    setShowSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {showSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            Votre signalement a été enregistré avec succès !
          </div>
        )}

        <section id="signaler" className="mb-16">
          <h1 className="text-3xl font-bold mb-2">Signaler une infraction</h1>
          <p className="text-gray-600 mb-8">
            Aidez-nous à améliorer le transport public en signalant les infractions commises par les chauffeurs.
          </p>
          <ReportForm onSubmit={handleSubmit} />
        </section>

        <section id="signalements" className="pt-8 border-t border-gray-200">
          <ReportsList reports={reports} />
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} TransAlert - Tous droits réservés</p>
          <p className="text-gray-400 mt-2">
            Application citoyenne pour un transport public plus sûr en Tunisie
          </p>
          <div className="mt-4">
            <p className="text-sm text-gray-400">
              Made with ❤️ by{" "}
              <a 
                href="https://www.linkedin.com/in/hammouda-ahmed-mustapha-a55270195/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-200 transition-colors"
              >
                Hammouda Ahmed Mustapha
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}