export class MemeQuality
{
  private id: number = -1;
  private rank: string = "";


  constructor(id:number, rank:string)
  {
    this.id = id;
    this.rank = rank;
  }

  get Id():number
  {
    return this.id;
  }
  set Id(id:number)
  {
    this.id = id;
  }

  get Rank():string
  {
    return this.rank;
  }
  set Rank(MemeQuality:string)
  {
    this.rank = this.rank;
  }
}
