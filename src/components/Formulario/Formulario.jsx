import './Formulario.css';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ImagenEmpresa from "../../assets/icon-grupo-asd.png";
import { useEffect, useState } from 'react';
import { enviarDatos, enviarDatosPrueba, obtenerDatosCodigoSitio } from '../../services/api';
import jsPDF from 'jspdf';
import svgImageCamera from "../../assets/icon-camera.svg"
import svgImageUpload from "../../assets/icon-upload.svg"
import svgIconClose from "../../assets/icon-close.svg"

const Formulario = ({ stateModel, numerDocumentSelected, nameExaminated, fetcDataRefresh }) => {
	const [image, setImage] = useState(null);
	const [images, setImages] = useState([]);
	const [imagesUpload, setImagesUpload] = useState([]);
	const [loader, setloader] = useState(false)

	const handleImageChange = (e) => {
		const file = e.target.files;
		setImagesUpload(Array.from(e.target.files))
		setImages(file)
	};

	const handleFileChange = (e) => {
		const files = Array.from(e.target.files);

		// Cambiar los nombres de los archivos a PDF
		const renamedFiles = files.map((file, index) => {
			// Crear un nuevo nombre de archivo PDF
			const newFileName = `${numerDocumentSelected}.pdf`; // Cambia la extensión a .pdf
			return new File([file], newFileName, { type: 'application/pdf' }); // Establecer el tipo MIME a PDF
		});

		setImages(renamedFiles);
	};

	const handleSubmit = async () => {
		if (images.length > 0) {
			if (uploadFile == "cargarArchivo") {
				setloader(true)
				const formData = new FormData();
				images.forEach((file) => {
					formData.append('files', file); // Asegúrate de que el campo sea 'files'
				});
				const respuesta = await enviarDatos(formData)
				if (respuesta?.status == 200) {
					setloader(false)
					setImages([])
					Swal.fire({
						title: 'Registro exitoso!',
						text: 'El consentimiento ha sido cargado de forma exitosa.',
						icon: 'success',
						confirmButtonText: 'Aceptar'
					}).then(async () => {
						stateModel(false)
						await fetcDataRefresh()
					})
				}
				setImages([])
				return;
			}
			if (uploadFile == "TomarFotografia") {
				setloader(true)
				const doc = new jsPDF();
				for (let i = 0; i < images.length; i++) {
					const file = images[i];
					const img = new Image();

					const reader = new FileReader();
					reader.readAsDataURL(file);

					reader.onload = (event) => {
						img.src = event.target.result;

						img.onload = async () => {
							const imgWidth = 210;
							const imgHeight = (img.height * imgWidth) / img.width;

							// Agregar la imagen al PDF
							doc.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight);

							// Si no es la última imagen, agregar una nueva página
							if (i < images.length - 1) {
								doc.addPage();
							}


							// Si es la última imagen, enviar el PDF
							if (i === images.length - 1) {
								const pdfBlob = doc.output('blob');

								// // Crear FormData para enviar el PDF
								const formData = new FormData();
								formData.append('files', pdfBlob, `${numerDocumentSelected}.pdf`);

								// // Enviar el PDF al backend
								const respuesta = await enviarDatos(formData)
								if (respuesta?.status == 200) {
									setloader(false)
									setImages([])
									Swal.fire({
										title: 'Registro exitoso!',
										text: 'El consentimiento ha sido cargado de forma exitosa.',
										icon: 'success',
										confirmButtonText: 'Aceptar'
									}).then(async () => {
										stateModel(false)
										await fetcDataRefresh()
									})
								}
							}
						};
					};
				}
			}
		} else {
			Swal.fire({
				title: 'No hay Archivos Cargados',
				text: 'Seleccione por lo menos un archivo a cargar',
				icon: 'error',
				confirmButtonText: 'Aceptar'
			})
		}
	};

	const [uploadFile, setUploadFile] = useState("")

	return (
		<form className='formulario'>
			<div className="formulario-header">
				<img src={ImagenEmpresa} className='imageLogo' alt="" />
				<img src={svgIconClose} width={20} height={30} className='icon-close' onClick={() => stateModel(false)} alt="" />
			</div>
			<h3>Registrar Consentimiento de {nameExaminated}✨</h3>
			<div className="">
				<label htmlFor="tipoDocumento">Seleccionar opción: ({uploadFile})</label>
				<div className="opciones">
					<div className={uploadFile == "cargarArchivo" ? "opcion opcion-active" : "opcion"} onClick={(e) => setUploadFile("cargarArchivo")}>
						<img src={svgImageUpload} alt="" />
						<p >Cargar Documento (PDF)</p>
					</div>
					<div className={uploadFile == "TomarFotografia" ? "opcion opcion-active" : "opcion"} onClick={(e) => setUploadFile("TomarFotografia")}>
						<img src={svgImageCamera} alt="" />
						<p>Tomar una fotografía</p>
					</div>
				</div>
			</div>
			{uploadFile == "TomarFotografia" ? <div className="">
				<div className="file-upload-container">
					<label htmlFor="fileInput" className="file-upload-label">Da clic Aquí para tomar la fotografía</label>
					<input
						type="file"
						name="fileInput"
						id="fileInput"
						className="file-upload-input"
						capture="environment"
						accept="image/*"
						onChange={handleImageChange}
						multiple
					/>
				</div>
				{imagesUpload.length > 0 && (
					<div className="file-list">
						{imagesUpload.map((file, index) => (
							<p key={index} className="file-name">{file.name}</p>
						))}
					</div>
				)}
			</div> : <div className="">
				<label htmlFor="cargarArchivo">Cargar archivo:</label>
				<input type="file" name="cargarArchivo" id="cargarArchivo" accept="application/pdf" multiple onChange={handleFileChange} />
			</div>}
			{loader ? (
				<div className="cargando">
					<span className="texto-cargando">Cargando</span>
					<div className="pelotas"></div>
					<div className="pelotas"></div>
					<div className="pelotas"></div>
				</div>
			) : (
				<button type='button' onClick={handleSubmit} >Enviar</button>
			)}
		</form>
	);
};

export default Formulario;