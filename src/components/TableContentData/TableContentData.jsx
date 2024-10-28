import React, { useEffect, useMemo, useState } from 'react';
import './TableContentData.css';
import DataTable from 'react-data-table-component';
import { obtenerDatosCodigoSitio, obtenerDatosNombreSitio } from '../../services/api';
import Formulario from '../Formulario/Formulario';
import Swal from 'sweetalert2';
import FormularioEncuesta from '../FormularioEncuesta/FormularioEncuesta';
const TableContentData = ({ }) => {
	const [informacion, setInformacion] = useState([])
	const [showModal, setshowModal] = useState(false)
	const [showModalEncuesta, setshowModalEncuesta] = useState(false)
	const [numerDocumentSelected, setnumerDocumentSelected] = useState(null)
	const [numeroSitio, setnumeroSitio] = useState(null)
	const [nameSelected, setnameSelected] = useState(null)
	const [informacionFiltrada, setInformacionFiltrada] = useState([])
	const [typeFilter, setTypeFilter] = useState('')
	const [filterData, setfilterData] = useState('')
	const [filterText, setFilterText] = useState(''); // Estado para el texto de filtrado
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

	// Definir las columnas
	const columns = [
		{
			name: 'Código Dane Sede',
			selector: row => row.contactospicf_details.cf_1438,
			sortable: true,
			right: false,
			ignoreRowClick: true,
			width: '150px',
			omit: false,
			center: true
		},
		{
			name: 'Nombre Sede',
			selector: row => row.contactospicf_details.cf_1436,
			sortable: true,
			center: true,
			width: '350px',
		},
		{
			name: 'N°. Documento ',
			selector: row => row.contactospicf_details.cf_1454,
			sortable: true,
			// width: '180px',
			grow: 1
		},
		{
			name: 'Nombre Examinando',
			selector: row => row.name,
			sortable: true,
			grow: 3,
		},
		{
			name: 'Tipo de Muestra',
			selector: row => row.contactospicf_details.cf_1466,
			sortable: true,
			width: '140px',
		},
		{
			name: 'Aplicó',
			selector: row => row.contactospicf_details.cf_1482,
			sortable: true,
			// grow: 2,
		},
		{
			name: 'Cargado',
			selector: row => row.contactospicf_details.cf_1468,
			sortable: true,
			width: '95px',
		},
		{
			name: 'Accion',
			cell: row => (
				<div>
					{row.contactospicf_details.cf_1468 == "" && (
						<div className='buttons'>
							<button type='button' className='button-small' title='Cargar Consentimiento' onClick={() => toogleModal(row)} >Cargar</button>
							<button type='button' className='button-small button-success' title='Formulario' onClick={() => toogleModalEncuesta(row)} >Formulario</button>
						</div>
					)}
				</div>
			),
			sortable: true,
			width: '195px',
		},
	];

	const toogleModal = (row) => {
		setnumerDocumentSelected(row.contactospicf_details.cf_1454)
		setnameSelected(row.name)
		setshowModal(true)
	}
	const toogleModalEncuesta = (row) => {
		setnumeroSitio(row.contactospicf_details.cf_1438)
		setshowModalEncuesta(true)
	}

	const getInformation = async () => {
		if (typeFilter == "codigoSitio" && filterData != "") {
			const data = await obtenerDatosCodigoSitio(filterData);
			if (data?.site_name != null) {
				setInformacion(data.contactos)
				setInformacionFiltrada(data.contactos)
			}
			if (data?.status == 500) {
				Swal.fire({
					title: 'Consulta Error',
					text: `No se encontro información con el código del sitio`,
					icon: 'error',
					confirmButtonText: 'Aceptar'
				})
			}
			return;
		}
		if (typeFilter == "nombreSitio" && filterData != "") {
			const data = await obtenerDatosNombreSitio(filterData)
			if (data?.site_name != null) {
				setInformacion(data.contactos)
				setInformacionFiltrada(data.contactos)
			}
			if (data?.status == 500) {
				Swal.fire({
					title: 'Consulta Error',
					text: `No se encontro información con el nombre del sitio`,
					icon: 'error',
					confirmButtonText: 'Aceptar'
				})
			}
			return;
		}
		Swal.fire({
			title: 'Consulta Error',
			text: `Opción no valida o dato vacío`,
			icon: 'error',
			confirmButtonText: 'Aceptar'
		})
	}
	// Filtrar los datos según el texto del filtro (filterText)
	const filteredItems = informacionFiltrada.filter(
		item => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()) || item.contactospicf_details.cf_1454 && item.contactospicf_details.cf_1454.toLowerCase().includes(filterText.toLowerCase())
	);

	// Componente de subencabezado para el filtrado
	const subHeaderComponentMemo = useMemo(() => {
		const handleClear = () => {
			if (filterText) {
				setResetPaginationToggle(!resetPaginationToggle);
				setFilterText('');
			}
		};

		return (
			<div><input
				type="text"
				placeholder="Filtrar Información Tabla"
				value={filterText}
				onChange={e => setFilterText(e.target.value)}
			/>
				<button className='button-small' onClick={handleClear}>Limpiar</button></div>
		);
	}, [filterText, resetPaginationToggle]);

	const paginationComponentOptions = {
		rowsPerPageText: 'Filas por página',
		rangeSeparatorText: 'de',
		selectAllRowsItem: true,
		selectAllRowsItemText: 'Todos',
	};

	return (
		<div className='container-table'>
			{showModal && (<Formulario stateModel={setshowModal} numerDocumentSelected={numerDocumentSelected} nameExaminated={nameSelected} fetcDataRefresh={getInformation} />)}
			{showModalEncuesta && (<FormularioEncuesta stateModel={setshowModalEncuesta} numeroSitio={numeroSitio} fetcDataRefresh={getInformation} />)}
			<h2>Cargue de Consentimientos Informados Examinandos</h2>
			<div className="filtros">
				<div className="">
					<label htmlFor="">Filtrar Por: </label>
					<select name="" id="" onChange={(e) => setTypeFilter(e.target.value)}>
						<option value="" selected disabled>Seleccionar</option>
						<option value="codigoSitio">Código del sitio</option>
						<option value="nombreSitio">Nombre del sitio</option>
					</select>
				</div>
				<div className="">
					<input
						type="text"
						placeholder={`Ingrese el ${typeFilter == "codigoSitio" ? "Código del sitio" : "Nombre del sitio"}`}
						name="role"
						value={filterData}
						onChange={(e) => setfilterData(e.target.value)}
					/>
				</div>
				<button type='button' onClick={getInformation} className='button-small-light'>Buscar</button>
			</div>

			{/* Tabla con react-data-table-component */}
			<div className="container-data-table">
				<DataTable
					columns={columns}
					data={filteredItems}
					pagination
					subHeader
					subHeaderComponent={subHeaderComponentMemo}
					paginationComponentOptions={paginationComponentOptions}
					selectableRows={false}
					noDataComponent="No hay información, ingresa el código del sitio o el nombre del sitio"
				/>
			</div>
		</div>
	);
};

TableContentData.propTypes = {};

export default TableContentData;