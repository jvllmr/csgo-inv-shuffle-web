import { combineReducers, createStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import authReducer, { authPersistConfig } from "./slices/auth";
import invReducer, { DBgetInv, setInv, setInvDBReady } from "./slices/inv";
import mapReducer, {
  getBackwardMaps as DBgetBackwardMaps,
  getForwardMaps as DBgetForwardMaps,
  getMap as DBgetMap,
  setAll,
} from "./slices/map";

const rootReducer = combineReducers({
  inv: invReducer,
  map: mapReducer,
  auth: persistReducer(authPersistConfig, authReducer),
});

const store = createStore(rootReducer);
export const persistor = persistStore(store);
document.addEventListener("mapDBReady", async () => {
  store.dispatch(
    setAll({
      map: await DBgetMap(),
      forward_maps: await DBgetForwardMaps(),
      backward_maps: await DBgetBackwardMaps(),
      DBready: true,
    })
  );
});

document.addEventListener("invDBReady", async () => {
  store.dispatch(setInv(await DBgetInv()));
  store.dispatch(setInvDBReady());
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
