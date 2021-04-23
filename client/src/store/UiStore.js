import { makeAutoObservable } from 'mobx';

class UiStore {
  rootStore;

  _maxFeatures = false;
  _maxTargets = false;

  _loadingDataCompleted = false;

  constructor(rootStore) {
    this.rootStore = rootStore;

    makeAutoObservable(this, { rootStore: false }, { autoBind: true });
  }

  // GETTER / SETTER
  get maxTargets() {
    return this._maxTargets;
  }

  set maxTargets(value) {
    this._maxTargets = value;
  }

  get maxFeatures() {
    return this._maxFeatures;
  }

  set maxFeatures(value) {
    this._maxFeatures = value;
  }

  get loadingDataCompleted() {
    return this._loadingDataCompleted;
  }

  set loadingDataCompleted(value) {
    this._loadingDataCompleted = value;
  }
}

export default UiStore;
