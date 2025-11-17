export const sanitize = async (data, extraFields = []) => {
  const defaultFields = ["password", "token", "SSN"];
  const fieldsToRemove = [...new Set([...defaultFields, ...extraFields])];

  if (Array.isArray(data)) {
    return Promise.all(data.map((item) => sanitize(item, extraFields)));
  }

  if (typeof data !== "object" || data === null) return data;

  const sanitizedData = { ...data };
  for (const field of fieldsToRemove) delete sanitizedData[field];

  return sanitizedData;
};


// export const sanitize = async (data) => {

//     if (Array.isArray(data)) {
//     return data.map((item) => sanitize(item)); // recursively sanitize each
//     }

//     const {password, SSN, ...sanitizedData} = data;

//     return sanitizedData;
    
// };