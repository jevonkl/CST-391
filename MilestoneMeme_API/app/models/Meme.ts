export class Meme
{
  private id: number = -1;
  private memename: string ="";
  private memequality: number = -1;

  constructor(id:number, memename:string, memequality:number)
  {
    this.id = id;
    this.memename = memename;
    this.memequality = memequality;
  }

  get Id():number
  {
    return this.id
  }

  set Id(id:number)
  {
    this.id = id;
  }

  get MemeName():string
  {
    return this.memename;
  }
  set MemeName(Meme:string)
  {
    this.memename = this.memename;
  }

  get MemeQuality():number
  {
    return this.memequality;
  }
  set MemeQuality(memequality:number)
  {
    this.memequality = memequality;
  }
}
