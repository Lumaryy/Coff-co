import React, { useContext, useState } from "react";
import ModalOrganismo from "../Modal/ModalOrganismo";
import {
  useObtenerIdTipoServicioMutation,
  useObtenerMuestrasParaServicioQuery,
  useObtenerPrecioSegunTipoServicioMutation,
  useObtenerVariablesParaServicioMutation,
  useRegistrarServicioMutation,
} from "../../../store/api/servicio/serviciosSlice";
import { useGetAmbientesQuery } from "../../../store/api/ambientes/ambientesSlice";
import { useForm } from "react-hook-form";
import SelectAtomo from "../../atoms/Select";
import InputAtomo from "../../atoms/Input";
import Mybutton from "../../atoms/Mybutton";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import SelectSearch from "../../atoms/SelectSearch";

const RegistrarServicio = ({ visible, closeModal }) => {
  const {
    setValue,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [obtenerVariables] = useObtenerVariablesParaServicioMutation();
  const [obtenerPrecio] = useObtenerPrecioSegunTipoServicioMutation();
  const [registrarServicio] = useRegistrarServicioMutation();
  const [obtenerTipoServicio] = useObtenerIdTipoServicioMutation();
  const { authData } = useContext(AuthContext);
  const { data: dataAmbientes } = useGetAmbientesQuery();
  const { data: dataMuestras } = useObtenerMuestrasParaServicioQuery();

  const [muestraSeleccionada, setMuestraSeleccionada] = useState("");
  console.log("muestra seleccionada: ", muestraSeleccionada);
  const [precios, setPrecios] = useState([]);
  const [precioActual, setPrecioActual] = useState("");
  const [ambienteActual, setAmbienteActual] = useState("");
  const [variables, setVariables] = useState([]);
  const [tipoServicioSeleccionado, setTipoServicioSeleccionado] =
    useState(null);
  console.log("id tipo servicio: ", tipoServicioSeleccionado);

  const manejadorobtenerVariables = async (id_muestra) => {
    manejadorObtencionPrecioParaTipoServicio(id_muestra);
    try {
      const respuesta = await obtenerVariables({ id_muestra }).unwrap();

      // Verificar si hay al menos una respuesta y si el nombre del documento existe
      if (respuesta.length === 0 || !respuesta[0].documento_nombre) {
        alert("No se encontró un documento asociado. No puede continuar.");
        return; // Detener el proceso
      }
      setVariables(respuesta);

      const tipoServicio = await obtenerTipoServicio({ id_muestra }).unwrap();
      const fk_idTipoServicio = tipoServicio[0].fk_idTipoServicio;
      setTipoServicioSeleccionado(fk_idTipoServicio);
    } catch (error) {
      console.error("Error al obtener las variables: " + error.message);
    }
  };

  const manejadorObtencionPrecioParaTipoServicio = async (id_muestra) => {
    try {
      const respuesta = await obtenerPrecio({ id_muestra }).unwrap();
      setPrecios(respuesta);
    } catch (error) {
      console.error("Error al obtener los precios: " + error.message);
    }
  };

  const cerrarModal = () => {
    reset(); // Limpia los campos del formulario
    setMuestraSeleccionada("");
    setPrecioActual("");
    setAmbienteActual("");
    setVariables([]);
    setTipoServicioSeleccionado(null);
    closeModal(); // Cierra el modal
  };

  const onSubmitRegistro = async (datosNuevoRegistro) => {
    try {
      // Verifica si las variables tienen un documento asociado
      if (!variables.length || !variables[0].documento_nombre) {
        toast.error(
          "No se puede registrar el servicio sin un documento asociado."
        );
        return; // Detiene el envío del formulario si no hay documento
      }

      const valoresVariables = {};
      variables.forEach((variable) => {
        const valor = datosNuevoRegistro[`variable_${variable.idVariable}`];
        if (valor !== undefined && valor !== "") {
          valoresVariables[variable.idVariable] = valor;
        }
      });

      const payload = {
        fk_idTipoServicio: tipoServicioSeleccionado,
        fk_id_precio: datosNuevoRegistro.fk_idPrecio,
        fk_idAmbiente: datosNuevoRegistro.idAmbiente,
        fk_idMuestra: datosNuevoRegistro.id_muestra,
        fk_idUsuarios: authData.usuario.id,
        valoresVariables,
      };
      await registrarServicio(payload).unwrap();
      toast.success("Servicio registrado con exito!.");
      cerrarModal();
    } catch (error) {
      toast.error("Error al procesar el servicio: " + error.message);
    }
  };

  return (
    <>
      <div>
        <ModalOrganismo
          visible={visible}
          closeModal={cerrarModal}
          title="Nuevo Servicio"
        >
          <form onSubmit={handleSubmit(onSubmitRegistro)}>
            <div className="mb-10 space-y-6 ">
              <SelectSearch
                label="Ingresar muestra"
                valueCampos={[
                  {
                    value: "codigo_muestra",
                    label: "codigo muestra",
                  },
                ]}
                data={dataMuestras}
                idKey="id_muestra"
                labelKey="codigo_muestra"
                onChange={(value) => {
                  setMuestraSeleccionada(value); // Establece la muestra seleccionada
                  setValue("id_muestra", value); // Establece el id_muestra en el formulario
                  manejadorobtenerVariables(value); // Llama a la función con el id_muestra seleccionado
                }}
              />

              <SelectAtomo
                data={precios}
                label="Selecciona la Presentación"
                items="idPrecio"
                ValueItem="presentacion"
                value={precioActual}
                onChange={(e) => {
                  const idPrecio = e.target.value;
                  setPrecioActual(idPrecio);
                  manejadorObtencionPrecioParaTipoServicio(e);
                  setValue("fk_idPrecio", idPrecio);
                }}
              />
              <SelectAtomo
                data={dataAmbientes}
                label="Selecciona el Ambiente"
                items="idAmbiente"
                ValueItem="nombre_ambiente"
                value={ambienteActual}
                onChange={(e) => {
                  setValue("idAmbiente", e.target.value);
                  setAmbienteActual(e.target.value);
                }}
              />
            </div>
            {/* contenedor del select y el mapeo para mostrar variables */}
            <div>
              {variables.length > 0 && (
                <div className="mt-4">
                  <div>
                    <h2>Variables del servicio:</h2>
                  </div>
                  {variables.map((variable) => {
                    return (
                      <div
                        key={`variable_${variable.idVariable}`}
                        className="mb-10"
                      >
                        <InputAtomo
                          type={
                            variable.variable_tipo_dato === "number"
                              ? "number"
                              : "text"
                          }
                          placeholder={`Ingrese ${variable.variable_nombre}`}
                          id={`variable_${variable.idVariable}`}
                          name={`variable_${variable.idVariable}`}
                          register={register}
                          erros={errors}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="flex justify-center mt-6">
              <Mybutton color={"primary"} type="submit">
                Enviar
              </Mybutton>
            </div>
          </form>
        </ModalOrganismo>
      </div>
    </>
  );
};

export default RegistrarServicio;