export const sanitize = async (data) => {

    if (Array.isArray(data)) {
    return data.map((item) => sanitize(item)); // recursively sanitize each
    }

    const {password, SSN, ...sanitizedData} = data;

    return sanitizedData;
    
};