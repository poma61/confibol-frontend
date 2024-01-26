export const emptyObject = (__object) => {
     //devolvera true si el objeto esta vacio
     return Object.keys(__object).length == 0;
}


export const assignObjectExists = (__old_object, __add_object) => {
     return Object.assign(__old_object, __add_object);
}

// crea un objeto vacio y copia las propiedades
export const assignObjectNew = (__object) => {
     return Object.assign({}, __object);
}


export const assignObjectStrict = (__object_properties_strict, __object_properties_values) => {
     for (const key in __object_properties_strict) {
          if (Object.prototype.hasOwnProperty.call(__object_properties_strict, key) && __object_properties_values[key] != undefined) {
               __object_properties_strict[key] = __object_properties_values[key];
          }
     }
     return __object_properties_strict;
}

// Función para verificar si al menos una de las propiedades (excluyendo id) tiene valor
// devolve true si al menos una propieda tiene un  valor
export const objectPropertyWithValue = (__object) => {
     for (let __property in __object) {
          if (__property != 'id' && __object[__property] != "" && __object[__property] != null) {
               return true;
          }
     }
     return false;
}