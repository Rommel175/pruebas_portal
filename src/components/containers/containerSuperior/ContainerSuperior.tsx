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

    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            const date3 = new Date();
            const day = String(date3.getDate()).padStart(2, '0');
            const mounth = String(date3.getMonth() + 1).padStart(2, '0');
            const year = date3.getFullYear();

            const { data, error } = await supabase
                .from('historialFichajes')
                .select('estado, localizacionFichaje')
                .eq('created_at', `${year}-${mounth}-${day}`)
                .eq('user_id', user.id);

            if (error) {
                console.error('Error fetching fichaje:', error);
                return;
            }

            if (data && data.length > 0) {
                setEstado(data[0].estado);
                setLocalizacion(data[0].localizacionFichaje);
            } else {
                console.log('undefined')
            };
        }

        fetchData();
    }, []);

    return (
        <div className={styles.containerSuperior}>
            <ContainerDatos2 user={user} estado={estado} localizacion={localizacion} setLocalizacion={setLocalizacion}/>
            <ContainerFichaje2 user={user} estado={estado} setEstado={setEstado}/>
        </div>
    );
}
