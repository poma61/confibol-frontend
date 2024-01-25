export const emptyObject = (__object) => {
     //devolvera true si el objeto esta vacio
     return Object.keys(__object).length == 0;
}


export const assignObjectExists = (__old_object, __add_object) => {
     return Object.assign(__old_object, __add_object);
}

export const assignObjectNew = (__object) => {
     return Object.assign({}, __object);
}

export const assignObjectPropertyStrict = (__object_properties_strict, __object_properties_values) => {
     let __object = assignObjectNew(__object_properties_strict);
     for (const key in __object) {
          if (Object.prototype.hasOwnProperty.call(__object, key) && __object_properties_values[key] != undefined) {
               __object[key] = __object_properties_values[key];
          }
     }
     return __object;
}

