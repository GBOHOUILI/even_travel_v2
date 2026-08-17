import type { ItineraryDay } from "@/types/event";

export function EventItinerary({ itineraire }: { itineraire: ItineraryDay[] }) {
  const sortedDays = [...itineraire].sort((a, b) => (a.jour || 0) - (b.jour || 0));

  return (
    <div>
      {sortedDays.map((jour, index) => {
        const dayNumber = jour.jour ?? index + 1;

        return (
          <div className="itinerary-day" key={jour.jour ?? `day-${index}`}>
            <div className="day-header">
              <div className="day-number">{dayNumber}</div>
              <h3 className="day-title">{jour.titre || `Jour ${dayNumber}`}</h3>
            </div>
            {jour.description && <p>{jour.description}</p>}
            {jour.activites && jour.activites.length > 0 && (
              <div className="itinerary-activities">
                <ul>
                  {jour.activites.map((activite, activiteIndex) => (
                    <li key={`${activiteIndex}-${activite}`}>{activite}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
