import { useState } from 'react';
import './FormularioEncuesta.css';
import { useForm } from "react-hook-form"
import ImagenEmpresa from "../../assets/icon-grupo-asd.png";
import svgIconClose from "../../assets/icon-close.svg";
import { enviarDatosImceicYIdela, enviarDatosPrueba } from '../../services/api';
import Swal from 'sweetalert2';

const FormularioEncuesta = ({ numeroSitio, stateModel }) => {
	const [tipoPrueba, settipoPrueba] = useState("");
	const [loader, setloader] = useState(false)

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
		reset
	} = useForm()

	const onSubmit = async (data) => {
		let dataForm = {}
		setloader(true)
		if (tipoPrueba == "IMCEIC") {
			dataForm = {
				"Codigo_DANE_SEDE": numeroSitio,
				"Presentes": data.numeroExaminandosPresentes,
				"Ausentes": data.numeroExaminandosAusentes,
				"Digito_en_App_Icfes": data.digitoAppIcfesIMCEIC,
				"Inicio_aplicacion": data.HoraInicio,
				"Fin_aplicacion": data.HoraFin,
				"Asistencia": data?.asistencia,
				"Fecha_Aplicacion_Ejecutada": data?.fechaAplicacion,
				"tipo": tipoPrueba
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

		if (tipoPrueba == "IDELA") {
			dataForm = {
				"Codigo_DANE_SEDE": numeroSitio,
				"Presentes": data.numeroExaminandosPresentesIdela,
				"Ausentes": data.numeroExaminandosAusentesIdela,
				"Digito_en_App_Icfes": data.digitoIdela,
				"Inicio_aplicacion": data.HoraInicioIdela,
				"Fin_aplicacion": data.HoraFinIdela,
				"Asistencia": data.asistenciaIdela,
				"Fecha_Aplicacion_Ejecutada": data.fechaAplicacionIdela,
				"tipo": tipoPrueba
			}
			let respuesta = await enviarDatosImceicYIdela(dataForm);
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

		if (tipoPrueba == "cuestionarios") {
			dataForm = {
				"Codigo_DANE_SEDE": numeroSitio,
				"Presentes_cuestionarios": data.numeroPresentesCuestionarios,
				"Ausentes_cuestionarios": data.numeroAusentesCuestionarios,
				"Digito_en_App_Icfes_Cuestionario": data.digitoCuestionarios,
				"Inicio_aplicacion_cuestionarios": data.numeroPresentesInicioCuestionarios,
				"Fin_Cuestionarios": data.HoraFinCuestionarios,
				"Asistencia_cuestionarios": data.asistenciaCuestionarios,
				"Fecha_Aplicacion_Ejecutada_Cuestionarios": data.fechaAplicacionCuestionarios,
				"Cantidad_Cuestionarios_Aplicados_a_Directivos": data.cantidadCuetionariosDirectivos,
				"Cantidad_Cuestionarios_Aplicados_a_Docentes": data.cantidadCuetionariosDocente,
				"Cantidad_Cuestionarios_Aplicados_a_Padres_Cuida": data.cantidadCuetionariosPadres
			}
			let respuesta = await enviarDatosImceicYIdela(dataForm);
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

		if (tipoPrueba == "") {
			Swal.fire({
				title: 'Error',
				text: 'No hay una opción seleccionada',
				icon: 'error',
				confirmButtonText: 'Aceptar'
			})
		}
	}
	return (
		<form onSubmit={handleSubmit(onSubmit)} className='formularioencuesta'>
			<div className="formulario-header">
				<img src={ImagenEmpresa} className='imageLogo' alt="" />
				<img src={svgIconClose} width={20} height={30} className='icon-close' onClick={() => stateModel(false)} alt="" />
			</div>
			<h2>Formulario Tipo Prueba Cod. Sitio {numeroSitio} </h2>
			<div className="">
				<label htmlFor="input">Seleccione Tipo de Prueba: </label>
				<select name="" id="" onChange={(e) => settipoPrueba(e.target.value)}>
					<option value="" disabled selected>Seleccionar</option>
					<option value="IMCEIC">IMCEIC</option>
					<option value="IDELA">IDELA</option>
					<option value="cuestionarios">Cuestionarios</option>
				</select>
			</div>
			<hr />
			{tipoPrueba == "IMCEIC" && (
				<>
					<div className="">
						<label htmlFor="input">Asistencia IMCEIC:<small className='error'>{errors.asistencia && errors.asistencia.message && (errors.asistencia.message)}</small> </label>
						<select name="" id="" {...register("asistencia", {
							required: "La asistencia es obligatoria"
						})}>
							<option value="" disabled selected>Seleccionar</option>
							<option value="SI">Si</option>
							<option value="NO">No</option>
						</select>
					</div>
					<div className="">
						<label htmlFor="input">Fecha Aplicación Ejecucion IMCEIC <small className='error'>{errors.fechaAplicacion && errors.fechaAplicacion.message && (errors.fechaAplicacion.message)}</small> </label>
						<input type="date" {...register("fechaAplicacion", {
							required: "La fecha de aplicación es obligatoria"
						})} id="input" />
					</div>
					<div className="">
						<label htmlFor="input">Hora Inicio Aplicación<small className='error'>{errors.HoraInicio && errors.HoraInicio.message && (errors.HoraInicio.message)}</small> </label>
						<input type="time" {...register("HoraInicio", {
							required: "La hora de iniocio es obligatoria"
						})} id="input" />
					</div>
					<div className="">
						<label htmlFor="input">Número examinandos ausentes IMCEIC <small className='error'>{errors.numeroExaminandosAusentes && errors.numeroExaminandosAusentes.message && (errors.numeroExaminandosAusentes.message)}</small> </label>
						<input type="number" {...register("numeroExaminandosAusentes", {
							required: "El número ausentes IMCEIC es obligatorio"
						})} id="input" />
					</div>
					<div className="">
						<label htmlFor="input">Número examinandos presentes IMCEIC <small className='error'>{errors.numeroExaminandosPresentes && errors.numeroExaminandosPresentes.message && (errors.numeroExaminandosPresentes.message)}</small> </label>
						<input type="number" {...register("numeroExaminandosPresentes", {
							required: "El número examinandos presentes IMCEIC es obligatorio"
						})} id="input" />
					</div>

					<div className="">
						<label htmlFor="input">Hora Fin Aplicación IMCEIC <small className='error'>{errors.HoraFin && errors.HoraFin.message && (errors.HoraFin.message)}</small> </label>
						<input type="time" {...register("HoraFin", {
							required: "La hora fin es obligatoria"
						})} id="input" />
					</div>
					<div className="">
						<label htmlFor="input">Digito en App Icfes IMCEIC:<small className='error'>{errors.digitoAppIcfesIMCEIC && errors.digitoAppIcfesIMCEIC.message && (errors.digitoAppIcfesIMCEIC.message)}</small></label>
						<select name="" id="" {...register("digitoAppIcfesIMCEIC", {
							required: "La hora fin es obligatoria"
						})}>
							<option value="" disabled selected>Seleccionar</option>
							<option value="SI">Si</option>
							<option value="NO">No</option>
						</select>
					</div>
				</>
			)}

			{tipoPrueba == "IDELA" && (
				<>
					<div className="">
						<label htmlFor="input">Asistencia: <small className='error'>{errors.asistenciaIdela && errors.asistenciaIdela.message && (errors.asistenciaIdela.message)}</small></label>
						<select name="" id="" {...register("asistenciaIdela", {
							required: "La asistencia es obligatoria es obligatoria"
						})}>
							<option value="" disabled selected>Seleccionar</option>
							<option value="SI">Si</option>
							<option value="NO">No</option>
						</select>
					</div>
					<div className="">
						<label htmlFor="input">Fecha Aplicación Ejecucion<small className='error'>{errors.fechaAplicacionIdela && errors.fechaAplicacionIdela.message && (errors.fechaAplicacionIdela.message)}</small> </label>
						<input type="date" {...register("fechaAplicacionIdela", {
							required: "La fecha de aplicación ejecución es obligatoria"
						})} id="input" />
					</div>
					<div className="">
						<label htmlFor="input">Hora Inicio Aplicación<small className='error'>{errors.HoraInicioIdela && errors.HoraInicioIdela.message && (errors.HoraInicioIdela.message)}</small> </label>
						<input type="time" {...register("HoraInicioIdela", {
							required: "La hora de iniocio es obligatoria"
						})} id="input" />
					</div>
					<div className="">
						<label htmlFor="input">Número examinandos ausentes<small className='error'>{errors.numeroExaminandosAusentesIdela && errors.numeroExaminandosAusentesIdela.message && (errors.numeroExaminandosAusentesIdela.message)}</small> </label>
						<input type="number" {...register("numeroExaminandosAusentesIdela", {
							required: "El número ausentes IMCEIC es obligatorio"
						})} id="input" />
					</div>
					<div className="">
						<label htmlFor="input">Número examinandos presentes<small className='error'>{errors.numeroExaminandosPresentesIdela && errors.numeroExaminandosPresentesIdela.message && (errors.numeroExaminandosPresentesIdela.message)}</small> </label>
						<input type="number" {...register("numeroExaminandosPresentesIdela", {
							required: "El número ausentes IMCEIC es obligatorio"
						})} id="input" />
					</div>

					<div className="">
						<label htmlFor="input">Hora Fin Aplicación <small className='error'>{errors.HoraFinIdela && errors.HoraFinIdela.message && (errors.HoraFinIdela.message)}</small> </label>
						<input type="time" {...register("HoraFinIdela", {
							required: "La hora fin es obligatoria"
						})} id="input" />
					</div>
					<div className="">
						<label htmlFor="input">Digitó en App Icfes: <small className='error'>{errors.digitoIdela && errors.digitoIdela.message && (errors.digitoIdela.message)}</small></label>
						<select id="" {...register("digitoIdela", {
							required: "Este campo es obligatoio"
						})}>
							<option value="" disabled selected>Seleccionar</option>
							<option value="SI">Si</option>
							<option value="NO">No</option>
						</select>
					</div>
				</>
			)}

			{tipoPrueba == "cuestionarios" && (
				<>
					<div className="">
						<label htmlFor="input">Asistencia: <small className='error'>{errors.asistenciaCuestionarios && errors.asistenciaCuestionarios.message && (errors.asistenciaCuestionarios.message)}</small></label>
						<select name="" id="" {...register("asistenciaCuestionarios", {
							required: "La asistencia es obligatoria"
						})}>
							<option value="" disabled selected>Seleccionar</option>
							<option value="SI">Si</option>
							<option value="NO">No</option>
						</select>
					</div>
					<div className="">
						<label htmlFor="input">Fecha Aplicación Ejecucion Cuestionarios: <small className='error'>{errors.fechaAplicacionCuestionarios && errors.fechaAplicacionCuestionarios.message && (errors.fechaAplicacionCuestionarios.message)}</small> </label>
						<input type="date" {...register("fechaAplicacionCuestionarios", {
							required: "La fecha de aplicación es obligatoria"
						})} id="input" />
					</div>
					<div className="">
						<label htmlFor="input">Número presentes al inicio aplicación Cuestionario: <small className='error'>{errors.numeroPresentesInicioCuestionarios && errors.numeroPresentesInicioCuestionarios.message && (errors.numeroPresentesInicioCuestionarios.message)}</small> </label>
						<input type="number" {...register("numeroPresentesInicioCuestionarios", {
							required: "El número presente de examinandos es obligatoria"
						})} id="input" />
					</div>

					<div className="">
						<label htmlFor="input">Número ausentes Cuestionario<small className='error'>{errors.numeroAusentesCuestionarios && errors.numeroAusentesCuestionarios.message && (errors.numeroAusentesCuestionarios.message)}</small> </label>
						<input type="number" {...register("numeroAusentesCuestionarios", {
							required: "El número ausente de examinandos es obligatoria"
						})} id="input" />
					</div>

					<div className="">
						<label htmlFor="input">Número presentes Cuestionario<small className='error'>{errors.numeroPresentesCuestionarios && errors.numeroPresentesCuestionarios.message && (errors.numeroPresentesCuestionarios.message)}</small> </label>
						<input type="number" {...register("numeroPresentesCuestionarios", {
							required: "El número presente de examinandos es obligatoria"
						})} id="input" />
					</div>

					<div className="">
						<label htmlFor="input">Cantidad de Cuestionario Aplicados a Directivos<small className='error'>{errors.cantidadCuetionariosDirectivos && errors.cantidadCuetionariosDirectivos.message && (errors.cantidadCuetionariosDirectivos.message)}</small> </label>
						<input type="number" {...register("cantidadCuetionariosDirectivos", {
							required: "La cantidad de cuestionarios es obligatorio"
						})} id="input" />
					</div>

					<div className="">
						<label htmlFor="input">Cantidad de Cuestionario Aplicados a Padres<small className='error'>{errors.cantidadCuetionariosPadres && errors.cantidadCuetionariosPadres.message && (errors.cantidadCuetionariosPadres.message)}</small> </label>
						<input type="number" {...register("cantidadCuetionariosPadres", {
							required: "La cantidad de cuestionarios es obligatorio"
						})} id="input" />
					</div>

					<div className="">
						<label htmlFor="input">Cantidad de Cuestionario Aplicados a Docentes<small className='error'>{errors.cantidadCuetionariosDocente && errors.cantidadCuetionariosDocente.message && (errors.cantidadCuetionariosDocente.message)}</small> </label>
						<input type="number" {...register("cantidadCuetionariosDocente", {
							required: "La cantidad de cuestionarios es obligatorio"
						})} id="input" />
					</div>

					<div className="">
						<label htmlFor="input">Hora Fin Aplicación: <small className='error'>{errors.HoraFinCuestionarios && errors.HoraFinCuestionarios.message && (errors.HoraFinCuestionarios.message)}</small> </label>
						<input type="time" {...register("HoraFinCuestionarios", {
							required: "La hora de finalización es obligatoria"
						})} id="input" />
					</div>

					<div className="">
						<label htmlFor="input">Digito en App Icfes: <small className='error'>{errors.digitoCuestionarios && errors.digitoCuestionarios.message && (errors.digitoCuestionarios.message)}</small></label>
						<select name="" id="" {...register("digitoCuestionarios", {
							required: "Este campo es obligatorio"
						})}>
							<option value="" disabled selected>Seleccionar</option>
							<option value="SI">Si</option>
							<option value="NO">No</option>
						</select>
					</div>
				</>
			)}
			{loader == true && (
				<div className="cargando">
					<span className="texto-cargando">Cargando</span>
					<div className="pelotas"></div>
					<div className="pelotas"></div>
					<div className="pelotas"></div>
				</div>
			)}
			{tipoPrueba != "" && loader == false && (<button type='submit'>Enviar</button>)}

		</form>
	);
};

FormularioEncuesta.propTypes = {};

export default FormularioEncuesta;