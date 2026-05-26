import { useState, useEffect } from 'react';

export function LocationMap({ active }: { active: boolean }) {
  const [loc, setLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (active && !loc && !error) {
      if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && navigator && 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          pos => setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => setError('Unable to retrieve location.')
        );
      } else {
        setError('Geolocation is not supported by your browser or connection.');
      }
    }
  }, [active, loc, error]);

  if (error) {
    return <div style={{ padding: 20 }}>{error}</div>;
  }

  if (!loc) {
    return <div style={{ padding: 20, textAlign: 'center' }}>Locating...</div>;
  }

  const delta = 0.05;
  const bbox = `${loc.lng - delta},${loc.lat - delta},${loc.lng + delta},${loc.lat + delta}`;
  const iframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${loc.lat},${loc.lng}`;

  return (
    <>
      <iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen src={iframeSrc} />
      <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', backgroundColor: 'var(--surface-color)', padding: '16px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', border: '1px solid var(--border-color)' }}>
        <div style={{ fontWeight: 600, fontSize: 16 }}>Location Context</div>
        <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Lat: {loc.lat.toFixed(4)}, Lng: {loc.lng.toFixed(4)}</div>
      </div>
    </>
  );
}
