export default class LectureEntity {
  subject;
  subjectType;
  instructor;
  room;
  weeks;
  constructor(
    subject,
    subjectType,
    instructor,
    room,
    weeks,
  ) {
    this.subject = subject
    this.subjectType = subjectType
    this.instructor = instructor
    this.room = room
    this.weeks = weeks
  }

  static fromString(dataString) {
    const data = new LectureEntity();

    const fstCap = (str) => {
      if (typeof str !== 'string') return str;
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    data.subject = fstCap(dataString.match(/^(.*?)((лекция|практика|лабораторные работы)|(доцент|ассистент|профессор|старший преподаватель))/)[1].trim());

    data.subjectType = fstCap(
      dataString.match(/(лекция|практика|лабораторные работы)/i)[0]
    );

    data.instructor = fstCap(
      dataString.match(/(доцент|ассистент|профессор|старший преподаватель) .*? \W\.\W\./gi)[0]
    );

    data.weeks = ((str) => {
      let matches = str.match(/(недели)(\:?\s?)((\d+\,?)+)/i) || undefined;

      return matches && matches[0]
        ?.replace(/(.*?)((\d+\s?\,?)+)/, "$2")
        .split(',');
    })(dataString);

    data.room = dataString.match(/(ауд.(.*?\d+)|спортивный зал)/i)[0]
      .replace(/(ауд.\s?)(.*?)/, "Аудитория $2");

    return new LectureEntity(
      data?.subject,
      data?.subjectType,
      data?.instructor,
      data?.room,
      data?.weeks
    );
  }
}