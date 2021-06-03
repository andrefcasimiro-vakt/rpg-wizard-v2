export interface IGameStateSubscriber {
  subscriptionUuid: string;
  onGameStateUpdate: () => void;
}
