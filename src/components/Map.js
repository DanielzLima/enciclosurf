export default function Map({ lat, lng }) {
  if (!lat || !lng) {
    return <p>Localização não disponível</p>;
  }

  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`;

  return (
    <div style={{ marginTop: "20px" }}>
      <iframe
        src={src}
        width="100%"
        height="300"
        style={{ borderRadius: "12px", border: "none" }}
        loading="lazy"
      />
    </div>
  );
}