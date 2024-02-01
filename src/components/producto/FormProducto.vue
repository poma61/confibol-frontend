<template>
    <v-card class="as-flex-item animate__animated animate__zoomIn" elevation="20">
        <v-card-title class="bg-blue-grey-lighten-1">
            <span class="text-h6">Registrar Producto</span>
        </v-card-title>
        <v-card-text class="pa-3">
            <p class="text-warning text-subtitle-1">Los campos marcados con (*) son obligatorios.</p>
            <v-form>
                <v-row>
                    <!-- sm => es cuando en modo responsivo se aplica desde 600px aproximadamente-->
                    <!-- md=> es cuando en modo responsivo se aplica desde 800px aproximadamente   -->
                    <v-col cols="12" sm="6">
                        <v-text-field v-model="item_producto.nombre_producto" label="Producto (*)"
                            color="light-blue-accent-4" clearable :error-messages="showFieldsErrors('nombre_producto')" />
                    </v-col>

                    <v-col cols="12" sm="6">
                        <v-text-field v-model="item_producto.marca" label="Marca (*)" color="light-blue-accent-4" clearable
                            :error-messages="showFieldsErrors('marca')" />
                    </v-col>


                    <v-col cols="12">
                        <v-combobox v-model="item_producto.categoria" label="Categoria (*)" color="primary" clearable
                            :error-messages="showFieldsErrors('categoria')" :items="list_categoria" />
                    </v-col>

                    <v-col cols="12">
                        <v-file-input accept="image/*" label="Imagen del producto (*)" color="light-blue-darken-4"
                            :error-messages="showFieldsErrors('image_file')" v-model="file" @change="uploadImage"
                            :clearable="false">
                            <template v-slot:append>
                                <v-btn v-bind="props" icon="mdi-camera" color="success" @click="openCamera"></v-btn>
                            </template>
                        </v-file-input>

                    </v-col>

                    <v-col cols="12">
                        <div class="ma-1 image-content">
                            <v-img v-if="src_image != null" :src="src_image">
                            </v-img>
                        </div>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="light-blue-accent-4" variant="elevated" @click="save" :loading="loading_btn">
                <v-icon icon="mdi-content-save"></v-icon>&nbsp;Guardar
            </v-btn>
        </v-card-actions>

    </v-card>

    <v-dialog v-model="dialog_camera" persistent max-width="600px" max-height="600px">
        <v-card>
            <v-card-title class="bg-blue-grey-lighten-1 py-3">
                <span class="text-h6">
                    <v-icon icon="mdi-camera"></v-icon> Camara
                </span>
            </v-card-title>
            <v-card-text>
                <Camera ref="camera" :autoplay="false"></Camera>

                <v-select label="Dispositivos de camara" :items="devices_camera" item-value="deviceId" item-title="label"
                    color="light-blue-accent-4" @update:model-value="changeDeviceCamera($event)"
                    :error-messages="devices_camera.length == 0 ? 'No hay dispositivos de camara.' : ''">
                    <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props" :title="item.raw.label"></v-list-item>
                    </template>
                </v-select>

            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" variant="elevated" @click="closeCamera">
                    <v-icon icon="mdi-close"></v-icon>&nbsp;Cerrar
                </v-btn>

                <v-btn color="success" variant="elevated" @click="capturePhoto"
                    :disabled="devices_camera.length == 0 ? true : false">
                    <v-icon icon="mdi-camera"></v-icon>&nbsp;Tomar foto
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, watch, nextTick, onMounted } from 'vue';
import toastify from '@/composables/toastify';
import Producto from '@/http/services/Producto';
import { assignObjectNew } from '@/util/objectDyl';
import Camera from "simple-vue-camera";
import app from '@/config/app';

//props y emit
const props = defineProps(['is_item_producto']);
const emit = defineEmits(['toLocalUpdateDataIterator', 'toNewForm']);


//data
const fields_errors = ref({});
const item_producto = ref(props.is_item_producto);
const loading_btn = ref(false);
const dialog_camera = ref(false);
const devices_camera = ref([]);
const camera = ref(null);
const src_image = ref(null);
const file = ref([]);

const list_categoria = ref([
    'Pasteleria',
    'Cocina',
    'Confites',
    'Chocolates',
    'Cereales',
    'Bebidas calientes',
    'Galletas',
    'Miselaneos',
    'Enlatados (Frutas y conservados de pescado)',
]);


//si cambia el valor de props.is_item_producto significa que se ejecuto el metodo newForm
//entonces debemos actualizar el valor de  la variable item_producto
watch(() => props.is_item_producto, () => {
    item_producto.value = props.is_item_producto;
    clear();
});

const showFieldsErrors = computed(() => {
    return function (field) {
        if (fields_errors.value[field]) {
            return fields_errors.value[field][0];
        }
        return "";
    }
});

const clear = () => {
    fields_errors.value = {};
    src_image.value = null;
    file.value = [];
}

const uploadImage = () => {
    //Si el usuario carga la imagen desde el dispositvo entonces asignamos la imagen
    // a  item_producto.value.image_file y mostramos dicha imagen 
    const archivo = file.value[0];
    if (archivo) {
        item_producto.value.image_file = archivo;//cargamos el archivo
        const reader = new FileReader();
        reader.readAsDataURL(archivo);
        reader.onload = (e) => {
            src_image.value = e.target.result;
        };
    }
}

const openCamera = async () => {
    dialog_camera.value = true;
    // Esperar al próximo ciclo de renderización
    //espera que se renderize el componente <Camera></Camera>
    await nextTick();
    //espera que inicie la camara
    await camera.value.start();
    // lista otras camaras
    devices_camera.value = await camera.value.devices(["videoinput"]);
    //verificamos si se encontraron camaras
    if (devices_camera.value.length == 0) {
        toastify('danger', 'No hay dispositvos de camara.')
    }
}

const capturePhoto = async () => {
    //si el usuario decide tomar una foto con la camara
    //capturamos la foto/imagem y  asignamos la imagen
    // a  item_producto.value.image_file y mostramos dicha imagen 
    if (camera.value != null) {
        const blob = await camera.value.snapshot({ width: 800, height: 600 }, "image/jpeg");
        if (blob) {
            src_image.value = URL.createObjectURL(blob);
            const archivo = new File([blob], "fotografia", { type: blob.type });
            item_producto.value.image_file = archivo;//cargamos el archivo
        } else {
            toastify('warning', "Error al capturar foto!")
        }
    }
    closeCamera();
}

//para cerrar la camara
const closeCamera = () => {
    if (camera.value == null) {
        toastify('danger', 'No pudo detener la camara. El componente Camera es nulo.')
    } else {
        camera.value.stop();
    }
    devices_camera.value = [];
    dialog_camera.value = false;
}

//para cambiar de camara, si esque hay mas de una camara
const changeDeviceCamera = async (device_id) => {
    await camera.value.changeCamera(device_id);
}

const save = () => {
    loading_btn.value = true;
    setTimeout(async () => {
        const producto = new Producto(assignObjectNew(item_producto.value));

        if (producto.getAttributes().id > 0) {
            //cuando es update
            const response = await producto.update();
            loading_btn.value = false;
            if (response.status) {
                toastify('success', response.message);
                emit('toLocalUpdateDataIterator', 'edit', response.record)
                fields_errors.value = {};
            } else {
                if (response.validation_errors != undefined) {
                    fields_errors.value = assignObjectNew(response.validation_errors);
                }
                toastify('danger', response.message);
            }
        } else {
            //cuando es store o nuevo registro
            const response = await producto.store();
            loading_btn.value = false;

            if (response.status) {
                toastify('success', response.message);
                emit('toLocalUpdateDataIterator', 'new', response.record);
                emit('toNewForm');
            } else {
                if (response.validation_errors != undefined) {
                    fields_errors.value = assignObjectNew(response.validation_errors);
                }
                toastify('danger', response.message);
            }
        }
    }, 200);
}

onMounted(() => {
    //significa que es update entonces mostramos la imagen que 
    if (item_producto.value.id > 0) {
        src_image.value = app.BASE_URL + item_producto.value.image_path;
    }
});
</script> 


<style scoped>
.image-content {
    width: 350px;
    height: 350px;
    border: 1px dashed #000;
}

/* estos estilos solo se aplican para pantallas  hasta 600px */
@media only screen and (max-width:600px) {
    .image-content {
        width: 200px;
        height: 200px;
    }
}

/* estos estilos solo se aplican para pantallas  hasta 400px */
@media only screen and (max-width:400px) {
    .image-content {
        width: 100%;
    }
}
</style>
