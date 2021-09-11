export default class IcalEvent {
  BEGIN;
  DTSTART;
  DTEND;
  SUMMARY;
  RRULE;
  DESCRIPTION;
  LOCATION;
  END;

  constructor(
    BEGIN,
    DTSTART,
    DTEND,
    SUMMARY,
    RRULE,
    DESCRIPTION,
    LOCATION,
    END,
  ) {
    this.BEGIN = BEGIN;
    this.DTSTART = DTSTART;
    this.DTEND = DTEND;
    this.SUMMARY = SUMMARY;
    this.RRULE = RRULE;
    this.DESCRIPTION = DESCRIPTION;;
    this.LOCATION = LOCATION;;
    this.END = END;
  }

  static fromEventEntity(entity) {
    const data = new IcalEvent();
    const date = entity.getDate();

    data.BEGIN = "VEVENT";
    data.DTSTART = date.beginDate.toISOString();
    data.DTEND = date.endDate.toISOString();
    data.SUMMARY = `${entity.lectureString.subject}. ${entity.lectureString.subjectType}`;
    data.DESCRIPTION = [
      entity.lectureString.subjectType,
      entity.lectureString.instructor,
      entity.lectureString.room
    ].join('\\n');
    data.LOCATION = entity.lectureString.room.replace(/Аудитория (.*?)/, "$1");
    data.END = "VEVENT";

    const result = Object.entries(data)
    .filter(([key, value]) => value !== undefined)
    .flatMap(([key, value]) => `${key}:${value}`)
    .join('\n');

    return result
  }
}