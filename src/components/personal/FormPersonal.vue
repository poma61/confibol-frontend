<template>
    <v-card class="animate__animated animate__rotateInDownLeft">
        <v-card-title class="bg-indigo-lighten-1 py-3">
            <span class="text-h6">Registrar personal</span>
        </v-card-title>
        <v-card-text class="pa-5">
            <p class="text-warning text-subtitle-1">Los campos marcados con (*) son obligatorios.</p>
            <v-row>
                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_personal.nombres" label="Nombres (*)" color="indigo-lighten-1" clearable
                        :error-messages="showFieldsErrors('nombres')"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_personal.apellido_paterno" label="Apellido paterno (*)"
                        color="indigo-lighten-1" clearable
                        :error-messages="showFieldsErrors('apellido_paterno')"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_personal.apellido_materno" label="Apellido materno (*)"
                        color="indigo-lighten-1" clearable
                        :error-messages="showFieldsErrors('apellido_materno')"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_personal.cargo" label="Cargo (*)" color="indigo-lighten-1" clearable
                        :error-messages="showFieldsErrors('cargo')"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_personal.ci" label="C.I. (*)" color="indigo-lighten-1" clearable
                        :error-messages="showFieldsErrors('ci')"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-autocomplete v-model="item_personal.ci_expedido" label="Expedido (*)"
                        :items="['SC', 'CH', 'CB', 'PT', 'BN', 'LP', 'PA', 'TJ', 'OR', 'SinExp']" color="indigo-lighten-1"
                        clearable :error-messages="showFieldsErrors('ci_expedido')"></v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_personal.n_de_contacto" label="N° de contacto" color="indigo-lighten-1"
                        :error-messages="showFieldsErrors('n_de_contacto')" type="number"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_personal.correo_electronico" label="Correo electronico"
                        color="indigo-lighten-1" clearable :error-messages="showFieldsErrors('correo_electronico')"
                        type="email"></v-text-field>
                </v-col>

                <v-col cols="12">
                    <v-textarea v-model="item_personal.direccion" label="Dirección" color="indigo-lighten-1" clearable
                        :error-messages="showFieldsErrors('direccion')" rows="2"></v-textarea>
                </v-col>

                <v-col cols="12">
                    <v-file-input accept="image/*" label="Foto (*)" color="indigo-lighten-1"
                        :error-messages="showFieldsErrors('image_file')" v-model="file" @change="uploadImage"
                        :clearable="false">
                        <template v-slot:append>
                            <v-btn v-bind="props" icon="mdi-camera" color="success" @click="openCamera"></v-btn>
                        </template>
                    </v-file-input>
                </v-col>

                <v-col cols="12">
                    <div class="ma-1 image-content">
                        <v-img v-if="src_image != null" :width="280" :height="280" :src="src_image">
                        </v-img>
                    </div>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="indigo-lighten-1" variant="elevated" @click="save" :loading="loading_btn">
                <v-icon icon="mdi-content-save-outline"></v-icon>&nbsp;Guardar
            </v-btn>
        </v-card-actions>
    </v-card>

    <v-dialog v-model="dialog_camera" persistent max-width="600px" max-height="600px">
        <v-card>
            <v-card-title class="bg-indigo-lighten-1 py-3">
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
                <v-btn color="indigo-lighten-1" variant="elevated" @click="capturePhoto"
                    :disabled="devices_camera.length == 0 ? true : false">
                    <v-icon icon="mdi-camera"></v-icon>&nbsp;Tomar foto
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import app from '@/config/app';
import { onMounted } from 'vue';
import { ref, defineProps, defineEmits, computed, nextTick, watch } from 'vue';
import Camera from "simple-vue-camera";
import toastify from '@/composables/toastify';
import Personal from '@/http/services/Personal';
import { assignObjectNew } from '@/util/objectDyl';

const props = defineProps(['is_item_personal', 'is_ciudad']);
const emit = defineEmits(['toLocalUpdateDataTable', 'toNewForm']);

const devices_camera = ref([]);
const dialog_camera = ref(false);
const item_personal = ref(props.is_item_personal);
const camera = ref(null);
const src_image = ref(null);
const loading_btn = ref(false);
const file = ref([]);
const fields_errors = ref({});

//cuando  cambia props.p_item_personal  por los botones nuevo personal y por el boton de 'clear'
///entonces tambien debemos actualizar las variables
watch(() => props.is_item_personal, () => {
    item_personal.value = props.is_item_personal;
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

const uploadImage = () => {
    //Si el usuario carga la imagen desde el dispositvo entonces asignamos la imagen
    // a  item_personal.value.image_file y mostramos dicha imagen 
    const archivo = file.value[0];
    if (archivo) {
        item_personal.value.image_file = archivo;//cargamos el archivo
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
    // a  item_personal.value.image_file y mostramos dicha imagen 
    if (camera.value != null) {
        const blob = await camera.value.snapshot({ width: 800, height: 600 }, "image/jpeg");
        if (blob) {
            src_image.value = URL.createObjectURL(blob);
            const archivo = new File([blob], "fotografia", { type: blob.type });
            item_personal.value.image_file = archivo;//cargamos el archivo
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
        const personal = new Personal(props.is_ciudad, assignObjectNew(item_personal.value));
        if (personal.getAttributes().id > 0) {
            //cuando es update
            const response = await personal.update();
            loading_btn.value = false;
            if (response.status) {
                toastify('success', response.message);
                emit('toLocalUpdateDataTable', 'edit', response.record)
                fields_errors.value = {};
            } else {
                if (response.validation_errors != undefined) {
                    fields_errors.value = response.validation_errors;
                }
                toastify('danger', response.message);
            }
        } else {
            //cuando es store
            const response = await personal.store();
            loading_btn.value = false;
            if (response.status) {
                toastify('success', response.message);
                emit('toLocalUpdateDataTable', 'new', response.record);
                clear();
                emit('toNewForm');
            } else {
                if (response.validation_errors != undefined) {
                    fields_errors.value = response.validation_errors;
                }
                toastify('danger', response.message);
            }
        }
    }, 200);
}

const clear = () => {
    fields_errors.value = {};
    file.value = [];
    src_image.value = null;
}

onMounted(() => {
    if (item_personal.value.id > 0) {
        //significa que es edicion de registro entonces mostramos la imagen
        src_image.value = app.BASE_URL + item_personal.value.foto_image_path;
    }
});
</script> 


<style scoped>
.image-content {
    width: 280px;
    height: 280px;
    border: 1px dashed #000;
}
</style>