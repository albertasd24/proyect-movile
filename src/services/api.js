import axios from "axios";

export const enviarDatos = async (body) => {
    try {
        const response = await axios.post('https://whatsapp.asdcloud.co/upload-pdfs-formulario/', body, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        console.log(response);

        return response;

    } catch (error) {
        console.log(error.response);
        return error.response;

    }
}

export const enviarDatosImceicYIdela = async (data) => {
    try {
        const response = await axios.put('https://whatsapp.asdcloud.co/update-data/', data)
        return response;

    } catch (error) {
        console.log(error.response);
        return error.response;

    }
}

export const enviarDatosCuestionarios = async (data) => {
    try {
        const response = await axios.put('https://whatsapp.asdcloud.co/update-cuestionarios/', data)
        return response;

    } catch (error) {
        console.log(error.response);
        return error.response;

    }
}

export const obtenerDatosCodigoSitio = async (codigoSitio) => {
    try {
        const informacionSitio = await axios.get(`https://whatsapp.asdcloud.co/search-moduloprimerainfancia/?name=${codigoSitio}`);
        return informacionSitio.data;
    } catch (error) {
        return error.response;
    }
}

export const obtenerDatosNombreSitio = async (codigoSitio) => {
    try {
        const informacionSitio = await axios.get(`https://whatsapp.asdcloud.co/search-by-site-name/?site_name=${codigoSitio}`);
        return informacionSitio.data;
    } catch (error) {
        return error.response;
    }
}

export const obtenerDatosDocumentoExaminando = async (codigoSitio) => {
    try {
        const informacionSitio = await axios.get(`https://whatsapp.asdcloud.co/search-moduloprimerainfancia/?name=${codigoSitio}`);
        return informacionSitio.data;
    } catch (error) {
        return error.response;
    }
}

export const enviarDatosPrueba = (formData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 200,
          data: formData,
          message: `Datos enviados correctamente`,
        });
      }, 5000); // 5 segundos de retraso
    });
  };
