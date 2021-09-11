import { properties } from "../../consts.js";
import LectureEntity from "./LectureEntity.js";

export default class EventEntity {
  oddEvenWeek;
  dayOfTheWeek;
  scheduleNumber;
  length;
  lectureString;

  constructor(
    oddEvenWeek,
    dayOfTheWeek,
    scheduleNumber,
    length,
    lectureString,
  ) {
    this.oddEvenWeek = oddEvenWeek;
    this.dayOfTheWeek = dayOfTheWeek;
    this.scheduleNumber = scheduleNumber;
    this.length = length;
    this.lectureString = lectureString; 
  }

  static fromString(str) {
    let array = str.split('; ')
    const data = [];
    data[0] |= properties.oddEvenWeek[array[0]];
    data[1] |= properties.dayOfTheWeek[array[1].toUpperCase()];
    data[2] |= array[2] - 1;
    data[3] |= array[3];
    data[4] = array[4];

    

    const result = new EventEntity(
      data[0],
      data[1],
      data[2],
      data[3],
      LectureEntity.fromString(data[4])
    )
    return result
  }

  getDate() {
    const date = ({
      oddEvenWeek: offsetWeek, 
      dayOfTheWeek: offsetDay, 
      scheduleNumber: offsetSchedule, 
      length, ...restData}) => {
      const [indexDay, indexMonth, indexYear] = [
        properties.scheduleStart.getDate(),
        properties.scheduleStart.getMonth(),
        properties.scheduleStart.getFullYear(),
      ];

      const beginDate = new Date(
        indexYear, 
        indexMonth, 
        indexDay + (offsetWeek * 7) + offsetDay, 
        properties.schedule[offsetSchedule]?.hour, 
        properties.schedule[offsetSchedule]?.minute
      )

      const endDate = new Date(
        indexYear, 
        indexMonth, 
        indexDay + (offsetWeek * 7) + offsetDay,
        beginDate.getHours(),
        beginDate.getMinutes() + (
          properties.weekdays.shortBreak + 
          properties.weekdays.lectureDuration * 2) * length
          + ((length - 1) 
            ? properties.weekdays.longBreak
            : 0)
      );

      return ({
        beginDate,
        endDate
      })
    }

    return date(this)
  }
}
