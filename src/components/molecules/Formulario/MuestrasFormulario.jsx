import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import InputAtomo from "../../atoms/Input";
import SelectAtomo from "../../atoms/Select";
import Mybutton from "../../atoms/Mybutton";
import { toast } from "react-toastify";
import {
  usePostMuestraMutation,
  usePutMuestraMutation,
} from "../../../store/api/muestra";
import { useGetFincasQuery } from "../../../store/api/fincas";
import { useGetUsuarioQuery } from "../../../store/api/users";

const MuestrasFormulario = ({ closeModal, dataValue }) => {
  const { data: dataUsuarios, isLoading: isLoadingUsuarios, isError: UsuarioError } = useGetUsuarioQuery();
  const { data: dataFincas, isLoading: isLoadingFincas, isError: FincaError } = useGetFincasQuery();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const [crearMuestra, { isLoading, isError, data: dataResponse, isSuccess }] = usePostMuestraMutation();
  const [editarMuestra, { isLoading: isLoadingEdit, isError: isErrorEdit, data: dataResponseEdit, isSuccess: isSuccessEdit }] = usePutMuestraMutation();
  
  // Ref para asegurar que el efecto solo se ejecute una vez
  const hasNotified = useRef(false);

  useEffect(() => {
    if (dataValue) {
      // Reset form with initial values from dataValue
      reset({
        codigo_muestra: dataValue.codigo_muestra,
        cantidadEntrada: dataValue.cantidadEntrada,
        fecha_muestra: dataValue.fecha_muestra,
        fk_id_finca: dataValue.fk_id_finca,
        fk_id_usuarios: dataValue.fk_id_usuarios,
        estado: dataValue.estado,
      });

      // Asegurarse de que los valores de los selectores se inicialicen correctamente
      setValue("fk_id_finca", dataValue.fk_id_finca);
      setValue("fk_id_usuarios", dataValue.fk_id_usuarios);
    } else {
      reset();
    }

    if ((isSuccess || isSuccessEdit) && !hasNotified.current) {
      toast.success(`${dataResponse?.message || dataResponseEdit?.message}`);
      hasNotified.current = true; // Marcar como notificado
      closeModal();
    } else if ((isError || isErrorEdit) && !hasNotified.current) {
      toast.error("Error al procesar la muestra");
      hasNotified.current = true; // Marcar como notificado
    }
  }, [dataValue, isSuccess, isSuccessEdit, isError, isErrorEdit, reset, closeModal, dataResponse, dataResponseEdit, setValue]);

  const onSubmit = async (data) => {
    try {
      if (dataValue) {
        await editarMuestra({
          id: dataValue.id_muestra,
          ...data
        });
      } else {
        await crearMuestra(data);
      }
    } catch (error) {
      toast.error("Error al guardar la muestra");
      console.log(error);
    }
  };

  if (isLoading || isLoadingEdit || isLoadingUsuarios || isLoadingFincas) {
    return <div>Loading...</div>;
  }

  return (
    <section className="w-full flex justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full max-w-lg p-4">
        {/* Inputs */}
        <div className="flex flex-col gap-4">
          <InputAtomo
            type="text"
            id="codigo_muestra"
            name="codigo_muestra"
            placeholder="Código de la muestra"
            register={register}
            erros={errors}
          />
          <InputAtomo
            type="number"
            id="cantidadEntrada"
            name="cantidadEntrada"
            placeholder="Cantidad de entrada"
            register={register}
            erros={errors}
          />
          <InputAtomo
            type="date"
            id="fecha_muestra"
            name="fecha_muestra"
            placeholder="Fecha Muestra"
            register={register}
            erros={errors}
          />
        </div>

        {/* Selects (Usuario y Finca) en una fila */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Select para Usuarios (fk_id_usuarios) */}
          <SelectAtomo
            label="Selecciona un Usuario"
            data={dataUsuarios}
            onChange={(e) => setValue("fk_id_usuarios", e.target.value)}
            items="id_usuario"
            ValueItem="nombre"
            value={watch("fk_id_usuarios")} // Use `watch` to ensure value is synced
          />

          {/* Select para Fincas (fk_id_finca) */}
          <SelectAtomo
            label="Selecciona una Finca"
            data={dataFincas}
            onChange={(e) => setValue("fk_id_finca", e.target.value)}
            items="id_finca"
            ValueItem="nombre_finca"
            value={watch("fk_id_finca")} // Use `watch` to ensure value is synced
          />
        </div>

        {/* Botón debajo de los selects */}
        <div className="flex justify-center mt-4">
          <Mybutton type="submit" color="primary">
            {dataValue ? "Actualizar" : "Registrar"}
          </Mybutton>
        </div>
      </form>
    </section>
  );
};

export default MuestrasFormulario;
