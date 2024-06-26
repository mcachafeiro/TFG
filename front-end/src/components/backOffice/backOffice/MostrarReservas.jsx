import { useState, useEffect } from 'react';
import "../../../styles/backOffice/MostrarReservas.css";
import {ReservaTurno} from './ReservaTurno';

export default function MostrarReservas({fechaSeleccionada}) {

    const [reservas, setReservas] = useState([]);
    const [turno, setTurno] = useState('comida');

    const formatearFecha = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1; 
        const day = date.getDate();
        return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    };

    const eliminarReserva = async (id) => {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');  
        await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/reserva/cancelar/${id}`,{
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token, 
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        // Actualiza las reservas después de eliminar una
        fetchReservas();
    }

    const fetchReservas = () => {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');  
        fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/reserva/reservasDia`,{
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token, 
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fecha: formatearFecha(fechaSeleccionada),
                turno: turno,
            }),
        })
            .then(response => {
                // Si la respuesta no es ok, lanzamos el error
                if (!response.ok) {
                    return response.json().then(err => {throw err;});
                }
                // Si la respuesta es ok, devolvemos los datos de la respuesta
                return response.json()
            })
            .then(reservas => {
                // Si todo ha ido bien, guardamos las reservas en el estado
                setReservas(reservas)
            })
            .catch(error => {
                // Si ha habido un error, lo mostramos por consola
                console.log(error);
            });
    }
    
    useEffect(() => {
        fetchReservas();
    }, [fechaSeleccionada, turno]);

    return(
        <>
            <h3 className='titulo-turnos'>Seleccione un turno</h3>
            <div className="botones-turno">
                <button onClick={()=>setTurno('comida')} className={turno=="comida"?'boton-turno turno-selected':'boton-turno'}> Comida </button>
                <button onClick={()=>setTurno('cena')} className={turno=="cena"?'boton-turno turno-selected':'boton-turno'}> Cena </button>
            </div>
            <div className="mostrar-reservas">
                <h2 className='titulo-mostrar-reservas'>Listado de Reservas</h2>
                {/*aqui un mapeo de las reservas en un nuevo componente*/}
                {reservas.map(reserva => (
                    <ReservaTurno key={reserva.id} reserva={reserva} handleConfirm={eliminarReserva}/>
                ))}
                {reservas.length==0 && <p style={{color:"var(--color-5)"}}>Aún no hay reservas para este turno.</p>}
            </div>
        </>
    )
}