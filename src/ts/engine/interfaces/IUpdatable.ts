export interface IUpdatable {
  updateOrder: number;
  update(timestep: number, unscaledTimestep: number): void;
}
