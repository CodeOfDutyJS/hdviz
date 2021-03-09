import { createContext, useContext } from 'react';
import Controller from './Controller';

export const ControllerContext = createContext(Controller);
export const ControllerProvider = ControllerContext.Provider;
export const useStore = () => useContext(ControllerContext);
