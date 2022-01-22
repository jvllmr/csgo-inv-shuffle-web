import { configureStore } from "@reduxjs/toolkit";
import mapReducer, {
  getBackwardMaps as DBgetBackwardMaps,
  getForwardMaps as DBgetForwardMaps,
  getMap as DBgetMap,
  setAll,
} from "./slices/map";
import invReducer, { DBgetInv, setInv, setInvDBReady } from "./slices/inv";
const store = configureStore({
  reducer: {
    map: mapReducer,
    inv: invReducer,
  },
});

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
