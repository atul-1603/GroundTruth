def calculate_priority_score(
    urgency_score: float,        # from Gemini (1-10)
    people_affected: int,        # from Gemini extraction
    hours_since_reported: float, # calculated from createdAt
    trust_weight: float = 1.0    # 1.0 verified NGO, 0.7 community, 0.4 anonymous
) -> float:
    """
    Formula:
    normalized_people = min(people_affected / 50, 1.0) * 10
    time_factor = min(hours_since_reported / 72, 1.0) * 10
    raw = (urgency_score * 0.4) + (normalized_people * 0.3) + (time_factor * 0.3)
    final = raw * trust_weight
    return round(min(final, 10.0), 2)
    """
    normalized_people = min(people_affected / 50, 1.0) * 10
    time_factor = min(hours_since_reported / 72, 1.0) * 10
    raw = (urgency_score * 0.4) + (normalized_people * 0.3) + (time_factor * 0.3)
    final = raw * trust_weight
    return round(min(final, 10.0), 2)
