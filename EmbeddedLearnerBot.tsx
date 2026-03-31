import React, { Suspense } from 'react';

// Lazy load the Plant Doctor App from the local project
const PlantDoctorApp = React.lazy(() => import('./src/App'));

const EmbeddedPlantDoctor: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Plant Doctor...</p>
          </div>
        </div>
      }
    >
      <PlantDoctorApp />
    </Suspense>
  );
};

export default EmbeddedPlantDoctor;
