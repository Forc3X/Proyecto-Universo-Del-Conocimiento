import { db } from './powersync';
// IMPORTANTE: Asegúrate de que la ruta de importación coincida con donde tienes tu cliente de supabase
import { supabase } from './powersync-connector'; 

// 1. Definimos los dos caminos posibles para que TypeScript no se confunda
type LoginResult = 
  | { success: true; usuario: any }
  | { success: false; message: string };

export const registrarUsuario = async (datos: {
  nombre: string;
  correo: string;
  usuario: string;
  contrasena: string;
  role: string;
}) => {
  try {
    // PASO NUEVO: 1. Registrar al usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: datos.correo,
      password: datos.contrasena,
    });

    if (authError) {
      console.error('❌ Error de Supabase Auth al registrar:', authError.message);
      return { success: false, message: 'Error en la nube: ' + authError.message };
    }

    if (!db) return { success: false, message: 'Base de datos no disponible.' };

    // 2. Guardar en la BD local de PowerSync
    await db.execute(
      'INSERT INTO usuarios (id, nombre, correo, usuario, contrasena, role) VALUES (uuid(), ?, ?, ?, ?, ?)',
      [
        datos.nombre,
        datos.correo,
        datos.usuario,
        datos.contrasena,
        datos.role || 'student'
      ]
    );
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// 2. Le asignamos el tipo : Promise<LoginResult> a la función de verificación
export const verificarCredenciales = async (usuario: string, contrasena: string): Promise<LoginResult> => {
  try {
    if (!db) return { success: false, message: 'Base de datos no disponible.' };
    // 1. Buscar en la BD local primero para obtener el correo del usuario
    const resultado = await db.get(
      'SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?',
      [usuario, contrasena]
    );

    if (resultado) {
      // PASO NUEVO: 2. Iniciar sesión silenciosamente en Supabase Auth usando el correo obtenido
      await supabase.auth.signInWithPassword({
        email: (resultado as any).correo, // <--- Aquí está el truco
        password: contrasena,
      });

      return { success: true, usuario: resultado };
    } else {
      return { success: false, message: 'Usuario o contraseña incorrectos.' };
    }
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};