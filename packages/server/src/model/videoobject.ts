export class VideoObject {
  title = "";
  link = "";
  index = 0;

  constructor(
    index: number,
    title: string | undefined,
    link: string | undefined
  ) {
    this.index = index;
    this.title = title ?? "";
    this.link = link;
  }
}
