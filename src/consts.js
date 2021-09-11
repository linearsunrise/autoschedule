class Day {
  lectureDuration;
  shortBreak;
  longBreak;
  lunch;

  constructor(
    lectureDuration,
    shortBreak,
    longBreak,
    lunch,
  ) {
    this.lectureDuration = lectureDuration;
    this.shortBreak = shortBreak;
    this.longBreak = longBreak;
    this.lunch = lunch;
  }
}

const weekdays = new Day(
  45,
  5,
  10,
  50,
)

const holidays = new Day(
  45,
  5,
  40
)

class Time {
  hour;
  minute;
  constructor(hour, minute) {
    this.hour = hour;
    this.minute = minute;
  }

  static fromString(str) {
    const [total, hour, minute] = str.match(/(\d?\d):?(\d\d)/).map(Number);
    return new Time(hour, minute);
  }
}

export const properties = {
  timezone: '+04:00',
  tzid: "Europe/Samara",
  scheduleStart: new Date('2021-08-30'),
  scheduleEnd: new Date('2021-06-31'),
  schedule: {
    0: Time.fromString("08:30"),
    1: Time.fromString("10:15"),
    2: Time.fromString("12:50"),
    3: Time.fromString("14:35"),
    4: Time.fromString("16:20"),
  },
  dayOfTheWeek: {
    0: "ПОНЕДЕЛЬНИК",
    1: "ВТОРНИК",
    2: "СРЕДА",
    3: "ЧЕТВЕРГ",
    4: "ПЯТНИЦА",
    5: "СУББОТА",
    6: "ВОСКРЕСЕНИЕ",
    "ПОНЕДЕЛЬНИК": 0,
    "ВТОРНИК": 1,
    "СРЕДА": 2,
    "ЧЕТВЕРГ": 3,
    "ПЯТНИЦА": 4,
    "СУББОТА": 5,
    "ВОСКРЕСЕНИЕ": 6,
  },
  oddEvenWeek: {
    0: "НЕЧЕТНАЯ НЕДЕЛЯ",
    1: "ЧЕТНАЯ НЕДЕЛЯ",
    "НЕЧЕТНАЯ НЕДЕЛЯ": 0,
    "ЧЕТНАЯ НЕДЕЛЯ": 1,
  },
  weekdays,
}
/*
class Week {
  monday: Day;
  tuesday: Day;
  wednesday: Day;
  thursday: Day;
  friday: Day;
  saturday?: Day;
  sunday?: Day;

  constructor(
    monday: Day,
    tuesday: Day,
    wednesday: Day,
    thursday: Day,
    friday: Day,
    saturday?: Day,
    sunday?: Day, 
  ) {
    this.monday = monday;
    this.tuesday = tuesday;
    this.wednesday = wednesday;
    this.thursday = thursday;
    this.friday = friday;
    this.saturday = saturday;
    this.sunday = sunday;
  }
}

const WEEK = new Week(
  MON,
  MON,
  MON,
  MON,
  MON,
  holidays,
)

*/