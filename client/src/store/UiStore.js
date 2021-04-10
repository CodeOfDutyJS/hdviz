import { makeAutoObservable } from 'mobx';

class UiStore {
  rootStore;

  _maxFeatures = false;
  _maxTargets = false;

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
}

export default UiStore;
