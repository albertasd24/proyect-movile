import { useState } from 'react';
import './FormularioExaminando.css';
import { useForm } from "react-hook-form"
import ImagenEmpresa from "../../assets/icon-grupo-asd.png";
import svgIconClose from "../../assets/icon-close.svg";
import Swal from 'sweetalert2';
import { enviarDatosPrueba } from '../../services/api';

const FormularioExaminando = ({ numeroSitio, stateModel }) => {
	const [loader, setloader] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm()

	const onSubmit = async (data) => {
		let dataForm = {}
		setloader(true)
			dataForm = {
				"Codigo_DANE_SEDE": numeroSitio,
				"Presentes": data.numeroExaminandosPresentes,
				"Ausentes": data.numeroExaminandosAusentes,
				"Digito_en_App_Icfes": data.digitoAppIcfesIMCEIC,
				"Inicio_aplicacion": data.HoraInicio,
				"Fin_aplicacion": data.HoraFin,
				"Asistencia": data?.asistencia,
				"Fecha_Aplicacion_Ejecutada": data?.fechaAplicacion
			}
			let respuesta = await enviarDatosPrueba(dataForm);
			if (respuesta?.status == 200) {
				reset()
				setloader(false)
				Swal.fire({
					title: 'Registro exitoso!',
					text: 'La información fue registrada de forma exitosa.',
					icon: 'success',
					confirmButtonText: 'Aceptar'
				}).then(async () => {
					stateModel(false)
				})
			}
			return
	}
	return (
		<form onSubmit={handleSubmit(onSubmit)} className='FormularioExaminando'>
			<div className="formulario-header">
				<img src={ImagenEmpresa} className='imageLogo' alt="" />
				<img src={svgIconClose} width={20} height={30} className='icon-close' onClick={() => stateModel(false)} alt="" />
			</div>
			<h2>Formulario Examinando </h2>
			<div className="">
				<label htmlFor="input">Nombre Completo Examinando <small className='error'>{errors.nombreExaminando && errors.nombreExaminando.message && (errors.nombreExaminando.message)}</small> </label>
				<input type="text" {...register("nombreExaminando", {
					required: "El nombre del examinando esta vacío o no es valido"
				})} id="input" />
			</div>
			<div className="">
				<label htmlFor="input">Número de documento <small className='error'>{errors.numeroDocumento && errors.numeroDocumento.message && (errors.numeroDocumento.message)}</small> </label>
				<input type="number" {...register("numeroDocumento", {
					required: "El número de documento esta vacío o no es valido",
					pattern: /^[0-9]{1,15}$/
				})} id="input" />
			</div>
			<div className="">
				<label htmlFor="input">Tipo de Muestra <small className='error'>{errors.tipoMuestra && errors.tipoMuestra.message && (errors.tipoMuestra.message)}</small> </label>
				<select name="" id="" {...register("tipoMuestra", {
					required: "Debe seleccionar una opción valida"
				})}>
					<option value="" disabled selected>Seleccionar</option>
					<option value="SI">Si</option>
					<option value="NO">No</option>
				</select>
			</div>
			<div className="">
				<label htmlFor="input">Aplico <small className='error'>{errors.aplico && errors.aplico.message && (errors.aplico.message)}</small> </label>
				<select name="" id="" {...register("aplico", {
					required: "Debe seleccionar una opción valida"
				})}>
					<option value="" disabled selected>Seleccionar</option>
					<option value="SI">Si</option>
					<option value="NO">No</option>
				</select>
			</div>
			<div className="">
				<label htmlFor="input">Consentimiento Cargado <small className='error'>{errors.consentimiento && errors.consentimiento.message && (errors.consentimiento.message)}</small> </label>
				<select name="" id="" {...register("consentimiento", {
					required: "Debe seleccionar una opción valida"
				})}>
					<option value="" disabled selected>Seleccionar</option>
					<option value="SI">Si</option>
					<option value="NO">No</option>
				</select>
			</div>

			{loader == true && (
				<div className="cargando">
					<span className="texto-cargando">Cargando</span>
					<div className="pelotas"></div>
					<div className="pelotas"></div>
					<div className="pelotas"></div>
				</div>
			)}
			{loader == false && (<button type='submit'>Enviar</button>)}
		</form>
	);
};

FormularioExaminando.propTypes = {};

export default FormularioExaminando;