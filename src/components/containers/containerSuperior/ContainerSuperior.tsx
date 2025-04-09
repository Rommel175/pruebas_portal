'use client'

import { User } from '@supabase/supabase-js';
import styles from './containerSuperior.module.css';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import ContainerDatos2 from './containers/ContainerDatos2';
import ContainerFichaje2 from './containers/ContainerFichaje2';

export default function ContainerSuperior({ user }: { user: User }) {
    const [estado, setEstado] = useState('');
    const [localizacion, setLocalizacion] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFinalAprox, setHoraFinalAprox] = useState('');

    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            const date = new Date();
            const day = String(date.getDate()).padStart(2, '0');
            const mounth = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();

            const { data, error } = await supabase
                .from('historialFichajes')
                .select('estado, localizacionFichaje, horaEntrada, horaAproxSalida')
                .eq('created_at', `${year}-${mounth}-${day}`)
                .eq('user_id', user.id);

            if (error) {
                console.error('Error fetching fichaje:', error);
                return;
            }

            if (data && data.length > 0) {
                setEstado(data[0].estado);
                setLocalizacion(data[0].localizacionFichaje);
                
                const horaEntradaSplit = data[0].horaEntrada.split(':');
                setHoraInicio(`${horaEntradaSplit[0]}:${horaEntradaSplit[1]}`);

                const horaAproxSalidaSplit = data[0].horaAproxSalida.split(':');
                setHoraFinalAprox(`${horaAproxSalidaSplit[0]}:${horaAproxSalidaSplit[1]}`)

                /*setHoraInicio(data[0].horaEntrada);
                setHoraFinalAprox(data[0].horaAproxSalida);*/
                
            } else {
                console.log('undefined')
            };
        }

        fetchData();
    }, []);

    return (
        <div className={styles.containerSuperior}>
            <ContainerDatos2 user={user} estado={estado} localizacion={localizacion} setLocalizacion={setLocalizacion} horaInicio={horaInicio} horaFinalAprox={horaFinalAprox} />
            <ContainerFichaje2 user={user} estado={estado} setEstado={setEstado}/>
        </div>
    );
}
