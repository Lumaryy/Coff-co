// ** Toolkit imports
import { configureStore } from "@reduxjs/toolkit";

// ** Reducers
import { authApi } from "./api/auth";
import { docuentosApi } from "./api/documentos";
import { TipoDocumento } from "./api/TipoDocumentos";
import { VariablesApi } from "./api/variables";
import { TipoServicioApi } from "./api/TipoServicio";
import { logosApi } from "./api/logos";
import { ambientesApiSlice } from "./api/ambientes/ambientesSlice";
import { servicioApiSlice } from "./api/servicio/serviciosSlice";
import { preciosSlice } from "./api/precios/preciosSlice";
import { usuariosSlice } from "./api/users";
import { AlquilerApi } from "./api/alquilerLaboratorio";
import { muestraApiSlice } from "./api/muestra";
import { fincaApiSlice } from "./api/fincas";
import { facturasApi } from "./api/factura";
import { repotesApi } from "./api/reportes";


export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [docuentosApi.reducerPath]: docuentosApi.reducer,
    [TipoDocumento.reducerPath]: TipoDocumento.reducer,
    [VariablesApi.reducerPath]: VariablesApi.reducer,
    [TipoServicioApi.reducerPath]: TipoServicioApi.reducer,
    [logosApi.reducerPath]: logosApi.reducer,
    [ambientesApiSlice.reducerPath]: ambientesApiSlice.reducer,
    [servicioApiSlice.reducerPath]: servicioApiSlice.reducer,
    [preciosSlice.reducerPath]: preciosSlice.reducer,
    [AlquilerApi.reducerPath]: AlquilerApi.reducer,
    [usuariosSlice.reducerPath]: usuariosSlice.reducer,
    [muestraApiSlice.reducerPath]: muestraApiSlice.reducer,
    [fincaApiSlice.reducerPath]: fincaApiSlice.reducer,
    [facturasApi.reducerPath]: facturasApi.reducer,
    [repotesApi.reducerPath]: repotesApi.reducer,

  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      authApi.middleware,
      docuentosApi.middleware,
      TipoDocumento.middleware,
      VariablesApi.middleware,
      TipoServicioApi.middleware,
      logosApi.middleware,
      ambientesApiSlice.middleware,
      servicioApiSlice.middleware,
      preciosSlice.middleware,
      AlquilerApi.middleware,
      usuariosSlice.middleware,
      muestraApiSlice.middleware,
      fincaApiSlice.middleware,
      facturasApi.middleware,
      repotesApi.middleware,

    ),
});
