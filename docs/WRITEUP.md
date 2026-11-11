# GRIT Interview Scheduling: Write-up

Student state is derived from skills, the latest interview and the clock. It is never stored, so it cannot drift.

## 1. States
| State | Moves in | Moves out |
|---|---|---|
| Skills pending | Registered | Last skill cleared |
| Ready to book | Skills done; cooldown, retake date or lock ended; reinstated | Student books |
| Slot booked | Booking or reschedule | Slot starts; student cancels (back to Ready); interviewer cancels (Rebook) |
| Interview live | Slot start reached | Outcome recorded or no-show |
| Result pending | Slot ended, no outcome | Outcome recorded (team alerted after 24h) |
| Badge earned | Pass recorded | Malpractice upheld |
| Cooling off | Fail recorded, 7 days | Date reached |
| Retake later | Retake recorded, 3 days | Date reached |
| Rebook needed | Interviewer cancelled or day off; no attempt used | Student rebooks with priority |
| Booking paused | No-show, 24h lock, not an attempt | Lock ends |
| Badge withdrawn | Malpractice upheld, Miles reversed | Team reinstates |

## 2. Edge cases and assumptions
- Two students pick one slot: re-check at confirm; DB unique index on (interviewer, start).
- Interviewer day off: bookings cancelled, students told, rebook first, no attempt used.
- Availability edits affect only future, unbooked slots.
- Cancel or reschedule closes 2h before start; max 2 reschedules per attempt; one active booking.
- Fail: 7-day cooldown, different interviewer when free. Retake: 3 days, interviewer sets focus areas.
- No-show: 24h lock, not an attempt (assumed). Outcome unrecorded: shown as Result pending, team alerted after 24h (assumed).
- Malpractice after pass: badge and Miles reversed, leaderboard recalculated, team can reinstate.
- Interviewers record outcomes; the team can record, correct and reassign. Every change is audit logged.
- All times IST, stored in UTC.

## 3. Data model
See docs/schema.sql: students, skill_clearances, badge_requirements, interviewers, availability_rules, availability_overrides, interviews, interview_outcomes, badges, integrity_flags, notifications, audit_log.

## 4. Three key student messages
**Interview booked for Tue, 18 Nov, 4:00 PM IST.**
You are set with Ravi Kumar. Join from your dashboard 10 minutes early with your college ID and a quiet, well-lit room. You can reschedule or cancel free until 2 hours before the start.

**Cleared for takeoff. The Novice badge is yours.**
You passed your AI Product Mastery interview. The Miles waiting at this layover are now in your account, and you have entered the Qualiflyers leaderboard.

**Not this time, and that's okay.**
Your skills and Miles on hold are safe, and your interviewer's feedback is on your dashboard. Your next attempt opens on Tue, 18 Nov, with a new interviewer.
