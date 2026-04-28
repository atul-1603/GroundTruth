import googlemaps
from config import settings

gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)

def get_distance_matrix(origins: list, destinations: list):
    try:
        result = gmaps.distance_matrix(origins, destinations)
        return result
    except Exception as e:
        print(f"Google Maps Error: {e}")
        return None
