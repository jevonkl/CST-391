export class Caption
{
  private id: number = -1;
  private title: string = "";

  constructor(id:number, title:string)
  {
    this.id = id;
    this.title = title;
  }
//For the number of the caption. Caption 1-20 for ex.
  get Id():number
  {
    return this.id
  }
  set Id(id:number)
  {
    this.id = id;
  }
//For the title of the caption, i.e. This caption is called ___
  get Title():string
  {
    return this.title;
  }
  set Title(Caption:string)
  {
    this.title = this.title;
  }


}
