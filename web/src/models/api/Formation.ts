export class Formation {

  public Positions: number[];
  public Barres: number[];

  constructor(positions: number[], barres?: number[]) {
    this.Positions = positions;
    this.Barres = barres;
  }
  
}