import type { ItineraryDay } from "@/types/event";

export function EventItinerary({ itineraire }: { itineraire: ItineraryDay[] }) {
  const sortedDays = [...itineraire].sort((a, b) => (a.jour || 0) - (b.jour || 0));

  return (
    <div>
      {sortedDays.map((jour) => (
        <div className="itinerary-day" key={jour.jour}>
          <div className="day-header">
            <div className="day-number">{jour.jour ?? "?"}</div>
            <h3 className="day-title">{jour.titre || `Jour ${jour.jour ?? "?"}`}</h3>
          </div>
          {jour.description && <p>{jour.description}</p>}
          {jour.activites && jour.activites.length > 0 && (
            <div className="itinerary-activities">
              <ul>
                {jour.activites.map((activite) => (
                  <li key={activite}>{activite}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
