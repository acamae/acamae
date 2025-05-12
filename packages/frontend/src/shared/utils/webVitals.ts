import { type Metric, onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

interface WebVitalsReport {
  CLS: number;
  FID: number;
  LCP: number;
  FCP: number;
  TTFB: number;
  timestamp: string;
}

// Función para determinar si estamos en desarrollo
const isDevelopment = (): boolean => {
  // Verificar si estamos en localhost
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

const shouldReportWebVitals = (): boolean => {
  // Siempre reportar en desarrollo
  if (isDevelopment()) {
    console.log('Web Vitals: Modo desarrollo detectado, reportando métricas');
    return true;
  }

  // En producción, no reportar por defecto
  console.log('Web Vitals: No se reportarán métricas en producción');
  return false;
};

const formatMetricValue = (metric: Metric): string => {
  const value = metric.value.toFixed(2);
  const delta = metric.delta ? ` (${metric.delta > 0 ? '+' : ''}${metric.delta.toFixed(2)})` : '';
  return `${value}${delta}`;
};

// Nota: Función eliminada ya que no se utiliza actualmente
// Si se necesita en el futuro, descomentar:
// const getRatingColor = (rating: string): string => {
//   switch (rating) {
//     case 'good':
//       return '#4CAF50'; // Verde
//     case 'needs-improvement':
//       return '#FFC107'; // Amarillo
//     case 'poor':
//       return '#F44336'; // Rojo
//     default:
//       return '#9E9E9E'; // Gris
//   }
// };

const reportWebVitals = (onPerfEntry?: (metric: Metric) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry);
    onFID(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
};

export const generateWebVitalsReport = (): WebVitalsReport => {
  const report: WebVitalsReport = {
    CLS: 0,
    FID: 0,
    LCP: 0,
    FCP: 0,
    TTFB: 0,
    timestamp: new Date().toISOString(),
  };

  const handleMetric = (metric: unknown) => {
    if (typeof metric === 'object' && metric !== null && 'name' in metric && 'value' in metric) {
      const m = metric as Metric;
      switch (m.name) {
        case 'CLS':
          report.CLS = m.value;
          break;
        case 'FID':
          report.FID = m.value;
          break;
        case 'LCP':
          report.LCP = m.value;
          break;
        case 'FCP':
          report.FCP = m.value;
          break;
        case 'TTFB':
          report.TTFB = m.value;
          break;
      }
    }
  };

  reportWebVitals(handleMetric);
  return report;
};

export const logWebVitalsReport = () => {
  console.log('Web Vitals: Iniciando reporte de métricas');
  console.log('Web Vitals: Entorno =', isDevelopment() ? 'Desarrollo' : 'Producción');

  if (!shouldReportWebVitals()) return;

  reportWebVitals((report: Metric) => {
    const formattedValue = formatMetricValue(report);
    const environment = isDevelopment() ? '🛠️ Development' : '🚀 Production';

    console.log(
      `%cWeb Vitals [${environment}]%c ${report.name}: ${formattedValue} (${report.rating})`,
      'color: #4CAF50; font-weight: bold;',
      'color: inherit;'
    );
  });
};

export default reportWebVitals;
