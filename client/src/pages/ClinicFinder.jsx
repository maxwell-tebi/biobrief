import { useState } from "react";

const TYPE_LABEL = {
  hospital: "Hospital",
  clinic: "Clinic",
  health_centre: "Health Centre",
  doctors: "Doctor's Office",
  pharmacy: "Pharmacy",
};

const TYPE_COLOR = {
  hospital: "#dc2626",
  clinic: "#2563eb",
  health_centre: "#16a34a",
  doctors: "#7c3aed",
  pharmacy: "#d97706",
};

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function ClinicFinder() {
  const [status, setStatus] = useState("idle"); // idle | locating | loading | ready | error
  const [pos, setPos] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  async function findClinics() {
    setStatus("locating");
    setErrorMsg("");
    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 12000 })
      );
      const { latitude: lat, longitude: lng } = position.coords;
      setPos({ lat, lng });
      setStatus("loading");

      const query = `[out:json][timeout:25];(node["amenity"~"hospital|clinic|health_centre|doctors"](around:10000,${lat},${lng});way["amenity"~"hospital|clinic|health_centre|doctors"](around:10000,${lat},${lng}););out center;`;
      const res = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      const results = data.elements
        .map((el) => {
          const elLat = el.type === "node" ? el.lat : el.center?.lat;
          const elLng = el.type === "node" ? el.lon : el.center?.lon;
          if (!elLat || !elLng || !el.tags?.name) return null;
          return {
            id: el.id,
            name: el.tags.name,
            type: el.tags.amenity,
            lat: elLat,
            lng: elLng,
            distance: haversine(lat, lng, elLat, elLng),
            phone: el.tags.phone || el.tags["contact:phone"] || null,
            address: el.tags["addr:street"] || null,
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.distance - b.distance);

      setClinics(results);
      setStatus("ready");
    } catch (err) {
      setErrorMsg(
        err.code === 1
          ? "Location access was denied. Please allow location permission in your browser and try again."
          : "Could not load clinics. Please check your connection and try again."
      );
      setStatus("error");
    }
  }

  return (
    <div className="clinic-page">
      <div className="clinic-page-header">
        <div>
          <h1 className="hero-title" style={{ fontSize: "1.75rem" }}>Clinics Near You</h1>
          <p style={{ color: "var(--text)", fontSize: "0.9rem", marginTop: "0.35rem" }}>
            Find hospitals, clinics, and health centres in your area.
          </p>
        </div>
        {status === "ready" && (
          <button className="submit-btn" style={{ width: "auto", padding: "0.6rem 1.25rem" }} onClick={findClinics}>
            Refresh
          </button>
        )}
      </div>

      {/* Idle */}
      {status === "idle" && (
        <div className="clinic-idle">
          <div className="empty-icon" style={{ width: 80, height: 80, margin: "0 auto 1.5rem" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 36, height: 36, color: "#9ca3af" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </div>
          <h2 style={{ marginBottom: "0.5rem" }}>Find health facilities near you</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", maxWidth: 320, margin: "0 auto 1.5rem" }}>
            We&apos;ll use your location to show nearby hospitals, clinics, and health centres. No data is stored.
          </p>
          <button className="submit-btn" style={{ maxWidth: 300, margin: "0 auto" }} onClick={findClinics}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            Find Clinics Near Me
          </button>
        </div>
      )}

      {/* Locating / Loading */}
      {(status === "locating" || status === "loading") && (
        <div className="clinic-idle">
          <div className="loading-anim-icon" style={{ margin: "0 auto 1.5rem" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 36, height: 36, color: "var(--teal)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </div>
          <h2 style={{ marginBottom: "0.5rem" }}>
            {status === "locating" ? "Getting your location…" : "Searching for nearby clinics…"}
          </h2>
          <p style={{ color: "var(--text-muted)" }}>
            {status === "locating" ? "Please allow location access when prompted." : "Querying health facilities in your area."}
          </p>
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div className="clinic-idle">
          <div className="error-box" style={{ maxWidth: 420, margin: "0 auto 1.5rem" }}>{errorMsg}</div>
          <button className="submit-btn" style={{ maxWidth: 240, margin: "0 auto" }} onClick={findClinics}>
            Try Again
          </button>
        </div>
      )}

      {/* Results */}
      {status === "ready" && (
        <div className="clinic-layout">
          {/* Map */}
          <div className="clinic-map-wrapper">
            <iframe
              title="Nearby Clinics"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${pos.lng - 0.08},${pos.lat - 0.08},${pos.lng + 0.08},${pos.lat + 0.08}&layer=mapnik&marker=${pos.lat},${pos.lng}`}
              className="clinic-map"
            />
            <a
              href={`https://www.google.com/maps/search/hospital+clinic+health+center/@${pos.lat},${pos.lng},14z`}
              target="_blank"
              rel="noopener noreferrer"
              className="open-gmaps"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Open in Google Maps
            </a>
          </div>

          {/* List */}
          <div className="clinic-list">
            <div className="clinic-list-header">
              <strong>{clinics.length} facilities found</strong>
              <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>within 10 km</span>
            </div>

            {clinics.length === 0 ? (
              <p style={{ color: "var(--text-muted)", padding: "1rem", fontSize: "0.9rem" }}>
                No named facilities found within 10 km. Try opening Google Maps for a broader search.
              </p>
            ) : (
              <div className="clinic-cards">
                {clinics.map((clinic) => (
                  <div key={clinic.id} className="clinic-card">
                    <div className="clinic-card-top">
                      <span
                        className="clinic-type-badge"
                        style={{ background: TYPE_COLOR[clinic.type] || "var(--teal)" }}
                      >
                        {TYPE_LABEL[clinic.type] || clinic.type}
                      </span>
                      <span className="clinic-distance">{clinic.distance.toFixed(1)} km</span>
                    </div>
                    <div className="clinic-name">{clinic.name}</div>
                    {clinic.address && (
                      <div className="clinic-address">{clinic.address}</div>
                    )}
                    {clinic.phone && (
                      <a href={`tel:${clinic.phone}`} className="clinic-phone">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                        {clinic.phone}
                      </a>
                    )}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="clinic-directions"
                    >
                      Get Directions
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
