import useSessionHeartbeat from '@ui/hooks/useSessionHeartbeat';
import React from 'react';


const DashboardPage: React.FC = () => {
  // Usar la nueva API basada en opciones
  useSessionHeartbeat({
    intervalMs: 5 * 60 * 1000, // 5 minutos
    redirectTo: '/login',
    replaceHistory: true
  });

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Panel de Usuario</h1>
      <p className="lead">Bienvenido. Esta es tu área privada.</p>
    </div>
  );
};

export default DashboardPage;
