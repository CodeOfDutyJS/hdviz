import React, { useState, useEffect } from 'react';
import { useStore } from '../../../controller/ControllerProvider';

const Graph = () => {
  const store = useStore();
  return (store.getForceField());
};

export default Graph;
