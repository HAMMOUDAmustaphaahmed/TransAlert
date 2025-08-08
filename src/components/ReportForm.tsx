'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import { v4 } from 'uuid';
import dynamic from 'next/dynamic';
import ImageUpload from './ImageUpload';
import { MAX_COMMENT_LENGTH, TUNISIA_CENTER } from '../utils/constants';
import { Report } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Chargement dynamique de MapSelector
const MapSelector = dynamic(() => import('./MapSelector'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
});

interface ReportFormProps {
  onSubmit: (report: Report) => void;
}

export default function ReportForm({ onSubmit }: ReportFormProps) {
  const [driverFirstName, setDriverFirstName] = useState('');
  const [driverLastName, setDriverLastName] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [position, setPosition] = useState<[number, number]>(TUNISIA_CENTER);
  const [comment, setComment] = useState('');
  const [routeStart, setRouteStart] = useState('');
  const [routeEnd, setRouteEnd] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  // Utilisation du hook useLocalStorage côté client uniquement
  const [reports, setReports] = useLocalStorage<Report[]>('reports', []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!licensePlate || !comment || !routeStart || !routeEnd) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = '';
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Échec du téléchargement de l\'image');
        }

        const data = await response.json();
        imageUrl = `/uploads/${data.filename}`;
      }

      const newReport: Report = {
        id: v4(),
        driverFirstName: driverFirstName || undefined,
        driverLastName: driverLastName || undefined,
        licensePlate,
        position,
        comment,
        route: {
          start: routeStart,
          end: routeEnd,
        },
        imageUrl: imageUrl || undefined,
        createdAt: new Date().toISOString(),
      };

      // Mettre à jour le stockage local
      const updatedReports = [...reports, newReport];
      setReports(updatedReports);

      // Appeler la fonction onSubmit
      onSubmit(newReport);

      // Réinitialiser le formulaire
      setDriverFirstName('');
      setDriverLastName('');
      setLicensePlate('');
      setPosition(TUNISIA_CENTER);
      setComment('');
      setRouteStart('');
      setRouteEnd('');
      setImageFile(null);
      
      // Réinitialiser le formulaire DOM
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (err) {
      console.error(err);
      setError('Une erreur est survenue lors de la soumission du signalement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="driverFirstName" className="block text-sm font-medium text-gray-700">
            Prénom du chauffeur (optionnel)
          </label>
          <input
            type="text"
            id="driverFirstName"
            value={driverFirstName}
            onChange={(e) => setDriverFirstName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label htmlFor="driverLastName" className="block text-sm font-medium text-gray-700">
            Nom du chauffeur (optionnel)
          </label>
          <input
            type="text"
            id="driverLastName"
            value={driverLastName}
            onChange={(e) => setDriverLastName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
      </div>

      <div>
        <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">
          Plaque d'immatriculation *
        </label>
        <input
          type="text"
          id="licensePlate"
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="Ex: TN 1234 AB"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Position sur la carte *
        </label>
        <div className="h-64">
          <MapSelector
            onPositionChange={setPosition}
            initialPosition={position}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Cliquez sur la carte pour sélectionner la position
        </p>
        <p className="text-xs text-gray-400">
          Coordonnées: {position[0].toFixed(4)}, {position[1].toFixed(4)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="routeStart" className="block text-sm font-medium text-gray-700">
            Départ *
          </label>
          <input
            type="text"
            id="routeStart"
            value={routeStart}
            onChange={(e) => setRouteStart(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Point de départ"
          />
        </div>

        <div>
          <label htmlFor="routeEnd" className="block text-sm font-medium text-gray-700">
            Arrivée *
          </label>
          <input
            type="text"
            id="routeEnd"
            value={routeEnd}
            onChange={(e) => setRouteEnd(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Point d'arrivée"
          />
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
          Description de l'infraction *
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          maxLength={MAX_COMMENT_LENGTH}
          rows={4}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="Décrivez l'infraction commise par le chauffeur..."
        />
        <p className="text-xs text-gray-500 text-right">
          {comment.length}/{MAX_COMMENT_LENGTH} caractères
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photo (optionnel)
        </label>
        <ImageUpload
          onImageUpload={setImageFile}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-primary-600 text-white py-3 px-4 rounded-md shadow hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Envoi en cours...' : 'Signaler l\'infraction'}
        </button>
      </div>
    </form>
  );
}