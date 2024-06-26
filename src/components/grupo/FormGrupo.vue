<template>
    <v-card class="animate__animated animate__slideInDown" elevation="24">
        <v-card-title class="bg-deep-purple-lighten-1">
            <v-icon icon="mdi-select-group"></v-icon>&nbsp;<span class="text-h6">Registrar grupo</span>
        </v-card-title>
        <v-card-text class="pa-3">
            <p class="text-warning text-subtitle-1">Los campos marcados con (*) son obligatorios.</p>
            <v-row>
                <!-- sm => es cuando en modo responsivo se aplica desde 600px aproximadamente-->
                <!-- md=> es cuando en modo responsivo se aplica desde 800px aproximadamente   -->
                <v-col cols="12">
                    <v-text-field v-model="item_grupo.nombre_grupo" label="Nombre grupo (*)" color="deep-purple-lighten-1"
                        clearable :error-messages="showFieldsErrors('nombre_grupo')" />
                </v-col>

                <v-col cols="12">
                    <v-textarea v-model="item_grupo.descripcion" label="Descripcion (*)" color="deep-purple-lighten-1"
                        clearable :error-messages="showFieldsErrors('descripcion')" rows="3" />
                </v-col>
            </v-row>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" variant="outlined" @click="emit('toCloseForm')">
                <v-icon icon="mdi-close-circle"></v-icon>&nbsp;Cancelar
            </v-btn>
            <v-btn color="deep-purple-lighten-1" variant="outlined" @click="save()" :loading="loading_btn">
                <v-icon icon="mdi-content-save"></v-icon>&nbsp;Guardar
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue';
import Grupo from '@/http/services/Grupo';
import toastify from '@/composables/toastify';
import { assignObjectNew } from '@/util/objectDyl';

//etmis y props
const props = defineProps(['is_item_grupo', 'is_ciudad']);
const emit = defineEmits(['toCloseForm', 'toUpdateDataTable']);

//data
const fields_errors = ref({});
const item_grupo = ref(props.is_item_grupo);
const loading_btn = ref(false);

const showFieldsErrors = computed(() => {
    return function (field) {
        if (fields_errors.value[field]) {
            return fields_errors.value[field][0];
        }
        return "";
    }
});

const save = () => {
    loading_btn.value = true;
    setTimeout(async () => {
        const grupo = new Grupo(props.is_ciudad, assignObjectNew(item_grupo.value));
        if (grupo.getAttributes().id > 0) {
            //cuando es update
            const response = await grupo.update();
            loading_btn.value = false;
            if (response.status) {
                toastify('success', response.message);
                emit('toUpdateDataTable', 'edit', response.record);
                emit('toCloseForm');
            } else {
                if (response.validation_errors != undefined) {
                    fields_errors.value = assignObjectNew(response.validation_errors);
                }
                toastify('danger', response.message);
            }
        } else {
            //cuando es create
            const response = await grupo.store();
            loading_btn.value = false;
            if (response.status) {
                toastify('success', response.message);
                emit('toUpdateDataTable', 'new', response.record);
                emit('toCloseForm');
            } else {
                if (response.validation_errors != undefined) {
                    fields_errors.value = assignObjectNew(response.validation_errors);
                }
                toastify('danger', response.message);
            }
        }
    }, 200);
}//save
</script> 


