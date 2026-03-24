from datetime import datetime, timezone

def update_completed_bookings(app):
    with app.app_context():
        from app import db
        from app.models.cf_models import Bookings

        now = datetime.now(timezone.utc)

        approved = Bookings.query.filter(
            Bookings.booking_status == "confirmed"
        ).all()

        updated = 0
        print("approved",approved)

        for b in approved:
            # Combine booking_date + end_time → full datetime
            end_dt = datetime.combine(b.booking_date, b.end_time).replace(tzinfo=timezone.utc)

            if end_dt < now:
                b.booking_status = "completed"
                updated += 1

        if updated > 0:
            db.session.commit()
            print(f"[Scheduler] Updated {updated} bookings → completed")
        else:
            print("[Scheduler] No bookings to update.")
