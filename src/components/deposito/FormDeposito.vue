<template>
    <v-card class="animate__animated animate__slideInDown" elevation="24">
        <v-card-title class="bg-teal-accent-4">
            <v-icon icon="mdi-store"></v-icon>&nbsp;<span class="text-h6">Registrar deposito</span>
        </v-card-title>
        <v-card-text class="pa-3">
            <p class="text-warning text-subtitle-1">Los campos marcados con (*) son obligatorios.</p>
            <v-row>
                <!-- sm => es cuando en modo responsivo se aplica desde 600px aproximadamente-->
                <!-- md=> es cuando en modo responsivo se aplica desde 800px aproximadamente   -->
                <v-col cols="12">
                    <v-text-field v-model="item_deposito.nombre_deposito" label="Nombre deposito (*)" color="teal-accent-4"
                        clearable :error-messages="showFieldsErrors('nombre_deposito')" variant="outlined" />
                </v-col>

                <v-col cols="12">
                    <v-textarea v-model="item_deposito.direccion" label="Direccion (*)" color="teal-accent-4" clearable
                        :error-messages="showFieldsErrors('direccion')" variant="outlined" rows="3" />
                </v-col>
            </v-row>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" variant="elevated" @click="emit('toCloseForm')">
                <v-icon icon="mdi-close-circle"></v-icon>&nbsp;Cancelar
            </v-btn>
            <v-btn color="teal-accent-4" variant="elevated" @click="save()" :loading="loading_btn">
                <v-icon icon="mdi-content-save"></v-icon>&nbsp;Guardar
            </v-btn>
        </v-card-actions>

    </v-card>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue';
import { useRoute } from 'vue-router';
import Deposito from '@/http/services/Deposito';
import toastify from '@/composables/toastify';
import { assignObjectNew } from '@/util/objectDyl';

//etmis y props
const props = defineProps(['is_item_deposito', 'is_ciudad']);
const emit = defineEmits(['toCloseForm', 'toUpdateDataTable']);

//data
const route = useRoute();
const fields_errors = ref({});
const item_deposito = ref(props.is_item_deposito);
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
        const deposito = new Deposito(props.is_ciudad, assignObjectNew(item_deposito.value));
        if (deposito.getAttributes().id > 0) {
            //cuando es update
            const response = await deposito.update();
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
            const response = await deposito.store();
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
}
</script> 


