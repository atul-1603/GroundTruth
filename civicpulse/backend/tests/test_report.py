import pytest
from services.priority import calculate_priority_score

def test_priority_score_calculation_high_urgency():
    score = calculate_priority_score(urgency_score=9.0, people_affected=100, hours_since_reported=1)
    assert score > 7.0

def test_priority_score_calculation_low_urgency():
    score = calculate_priority_score(urgency_score=2.0, people_affected=5, hours_since_reported=1)
    assert score < 5.0
