export const getUserInfo = async (dni: string) => {
    const response = await fetch(`${process.env.RENIEC_API_URL}/${dni}?token=${process.env.RENIEC_API_KEY}`);
    const data = await response.json();
    if (!data.success) {
        return {
            success: false,
            message: 'DNI no encontrado',
            data: null
        };
    }
    return data
}