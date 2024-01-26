<template>
    <v-card class="as-flex-item animate__animated animate__zoomIn">
        <v-card-title class="bg-light-blue-accent-4">
            <span class="text-h6">Registrar Usuario</span>
        </v-card-title>
        <v-card-text class="pa-3">
            <p class="text-warning text-subtitle-1">Los campos marcados con (*) son obligatorios.</p>
            <v-form>
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="item_usuario.user" label="Usuario (*)" color="light-blue-accent-4" clearable
                            :error-messages="showFieldsErrors('user')" variant="underlined" />
                    </v-col>

                    <v-col cols="12">
                        <v-text-field v-model="item_usuario.password" label="Contraseña (*)" color="light-blue-accent-4"
                            clearable :error-messages="showFieldsErrors('password')" variant="underlined" 
                            :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :type="show ? 'text' : 'password'"
                            autocomplete="off" @click:append-inner="show = !show" />
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" variant="elevated" @click="clear">
                <v-icon icon="mdi-delete-sweep"></v-icon>&nbsp;
            </v-btn>
            <v-btn color="light-blue-accent-4" variant="elevated" @click="save" :loading="loading_btn">
                <v-icon icon="mdi-content-save"></v-icon>&nbsp;Guardar
            </v-btn>
        </v-card-actions>

    </v-card>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, watch } from 'vue';
import toastify from '@/composables/toastify';
import Usuario from '@/http/services/Usuario';

const props = defineProps(['p_item_usuario', 'p_selected_desarrolladora']);
const emit = defineEmits(['toLocalUpdateDataTable', 'toNewForm']);
const fields_errors = ref({});
const item_usuario = ref(props.p_item_usuario);
const loading_btn = ref(false);
const src_image = ref("");
const show = ref(false);

watch(() => props.p_item_usuario, () => {
    item_usuario.value = props.p_item_usuario;
    fields_errors.value = {};
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
    src_image.value = "";
    emit('toNewForm');
}

const save = () => {
    loading_btn.value = true;
    setTimeout(async () => {
        const usuario = new Usuario(props.p_selected_desarrolladora, Object.assign({}, item_usuario.value));
        if (usuario.getAttributes().id > 0) {
            //cuando es update
            const response = await usuario.update();
            loading_btn.value = false;
            if (response.status) {
                toastify('success', response.message);
                emit('toLocalUpdateDataTable', 'edit', response.record)
                clear();
            } else {
                if (response.message_errors != undefined) {
                    fields_errors.value = Object.assign({}, response.message_errors);
                }
                toastify('danger', response.message);
            }
        } else {
            //cuando es store o nuevo registro
            const response = await usuario.store();
            loading_btn.value = false;
            if (response.status) {
                toastify('success', response.message);
                emit('toLocalUpdateDataTable', 'new', response.record);
                clear();
            } else {
                if (response.message_errors != undefined) {
                    fields_errors.value = Object.assign({}, response.message_errors);
                }
                toastify('danger', response.message);
            }
        }
    }, 200);
}

</script> 
