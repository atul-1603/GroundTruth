
from firebase_admin import firestore
from datetime import datetime, timezone

db = firestore.client()

# NGO operations
async def create_ngo(data: dict, ngo_id: str = None) -> str:
    if ngo_id:
        ngo_ref = db.collection('ngos').document(ngo_id)
    else:
        ngo_ref = db.collection('ngos').document()
    
    data['id'] = ngo_ref.id
    data['createdAt'] = datetime.now(timezone.utc)
    ngo_ref.set(data)
    return ngo_ref.id


async def get_ngo(ngo_id: str) -> dict:
    doc = db.collection('ngos').document(ngo_id).get()
    return doc.to_dict() if doc.exists else None

async def update_ngo(ngo_id: str, data: dict) -> None:
    db.collection('ngos').document(ngo_id).update(data)

async def get_ngo_by_email(email: str) -> dict | None:
    docs = db.collection('ngos').where('email', '==', email).limit(1).stream()
    for doc in docs:
        return doc.to_dict()
    return None

# Volunteer operations
async def create_volunteer(data: dict) -> str:
    db.collection('users').document(data['userId']).set({
        **data,
        'createdAt': datetime.now(timezone.utc)
    })
    return data['userId']

async def get_volunteer(user_id: str) -> dict:
    doc = db.collection('users').document(user_id).get()
    return doc.to_dict() if doc.exists else None

async def get_volunteers_by_ngo(ngo_id: str) -> list[dict]:
    docs = db.collection('users').where('ngoId', '==', ngo_id).stream()
    return [doc.to_dict() for doc in docs]

async def update_volunteer(user_id: str, data: dict) -> None:
    db.collection('users').document(user_id).update(data)

async def update_volunteer_fatigue(user_id: str, score: float) -> None:

    db.collection('users').document(user_id).update({'fatigueScore': score})

async def delete_volunteer(user_id: str) -> None:
    db.collection('users').document(user_id).delete()


# Activity operations
async def create_activity(data: dict) -> str:
    act_ref = db.collection('activities').document()
    data['activityId'] = act_ref.id
    data['createdAt'] = datetime.now(timezone.utc)
    data['resolvedAt'] = None
    act_ref.set(data)
    return act_ref.id

async def get_activity(activity_id: str) -> dict:
    doc = db.collection('activities').document(activity_id).get()
    return doc.to_dict() if doc.exists else None

async def get_activities_by_ngo(ngo_id: str) -> list[dict]:
    docs = db.collection('activities').where('ngoId', '==', ngo_id).stream()
    return [doc.to_dict() for doc in docs]

async def update_activity_status(activity_id: str, status: str) -> None:
    update_data = {'status': status}
    if status == 'resolved':
        update_data['resolvedAt'] = datetime.now(timezone.utc)
    db.collection('activities').document(activity_id).update(update_data)

async def update_activity_details(activity_id: str, data: dict) -> None:
    db.collection('activities').document(activity_id).update(data)

async def assign_volunteer_to_activity(activity_id: str, user_id: str) -> None:
    act_ref = db.collection('activities').document(activity_id)
    act_ref.update({'volunteersAssigned': firestore.ArrayUnion([user_id])})
    
    user_ref = db.collection('users').document(user_id)
    user_ref.update({'assignedActivityIds': firestore.ArrayUnion([activity_id])})

# Report operations
async def create_report(data: dict) -> str:
    rep_ref = db.collection('reports').document()
    data['reportId'] = rep_ref.id
    data['createdAt'] = datetime.now(timezone.utc)
    rep_ref.set(data)
    return rep_ref.id

async def get_reports_by_activity(activity_id: str) -> list[dict]:
    docs = db.collection('reports').where('activityId', '==', activity_id).stream()
    return [doc.to_dict() for doc in docs]

async def get_reports_by_ngo(ngo_id: str) -> list[dict]:
    docs = db.collection('reports').where('ngoId', '==', ngo_id).stream()
    return [doc.to_dict() for doc in docs]

async def get_reports_by_user(user_id: str) -> list[dict]:
    docs = db.collection('reports').where('userId', '==', user_id).stream()
    return [doc.to_dict() for doc in docs]

# Assignment operations
async def create_assignment(activity_id: str, user_id: str) -> str:
    # Check if already assigned
    existing = db.collection('assignments').where('activityId', '==', activity_id).where('userId', '==', user_id).stream()
    for doc in existing:
        return doc.id
    
    ass_ref = db.collection('assignments').document()
    data = {
        'id': ass_ref.id,
        'activityId': activity_id,
        'userId': user_id,
        'status': 'pending',
        'assignedAt': datetime.now(timezone.utc)
    }
    ass_ref.set(data)
    return ass_ref.id

async def get_assignments_by_volunteer(user_id: str) -> list[dict]:
    docs = db.collection('assignments').where('userId', '==', user_id).stream()
    results = []
    for doc in docs:
        ass = doc.to_dict()
        # Join with activity details
        act = await get_activity(ass['activityId'])
        if act:
            results.append({**act, **ass}) # Merge activity data into assignment
    return results

async def update_assignment_status(assignment_id: str, status: str) -> None:
    db.collection('assignments').document(assignment_id).update({'status': status})


# Dashboard operations
async def get_dashboard_stats(ngo_id: str) -> dict:
    vols = len(await get_volunteers_by_ngo(ngo_id))
    acts = await get_activities_by_ngo(ngo_id)
    resolved = len([a for a in acts if a.get('status') == 'resolved'])
    return {
        "total_volunteers": vols,
        "total_activities": len(acts),
        "resolved_activities": resolved
    }

async def get_priority_needs(ngo_id: str, limit: int = 10) -> list[dict]:
    acts = await get_activities_by_ngo(ngo_id)
    acts.sort(key=lambda x: x.get('priorityScore', 0), reverse=True)
    return acts[:limit]
