<template>
    <v-card class="animate__animated animate__flipInX" elevation="24">
        <v-card-title class="bg-deep-purple-lighten-1">
            <v-icon icon="mdi-cart"></v-icon>&nbsp;<span class="text-h6">Registrar compra</span>
        </v-card-title>
        <v-card-text class="pa-3">
            <p class="text-warning text-subtitle-1 mb-3">Los campos marcados con (*) son obligatorios.</p>
            <!-- form para compras -->
            <v-row>
                <!-- sm => es cuando en modo responsivo se aplica desde 600px aproximadamente-->
                <!-- md=> es cuando en modo responsivo se aplica desde 800px aproximadamente   -->
                <v-col cols="12">
                    <v-text-field v-model="item_compra.compra.fecha_compra" label="Fecha compra (*)"
                        color="deep-purple-lighten-1" clearable :error-messages="showFieldsErrors('compra.fecha_compra')"
                        variant="outlined" type="date" />
                </v-col>

                <v-col cols="12">
                    <v-textarea v-model="item_compra.compra.nota" label="Nota" color="deep-purple-lighten-1" clearable
                        variant="outlined" rows="3" />
                </v-col>

                <v-radio-group label="Tipo de compra" inline v-model="item_compra.documento_compra.tipo_compra"
                    :error-messages="showFieldsErrors('documento_compra.tipo_compra')">
                    <v-radio label="Nacional" value="Nacional" color="secondary"></v-radio>
                    <v-radio label="Importacion" value="Importacion" color="secondary"></v-radio>
                </v-radio-group>
            </v-row>
            <!-- form para documentos compras -->
            <!--  cuando es compra nacional -->
            <v-row v-if="item_compra.documento_compra.tipo_compra == 'Nacional'">
                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_compra.documento_compra.recibo" label="Recibo" color="deep-purple-lighten-1"
                        clearable variant="outlined" />
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_compra.documento_compra.factura" label="Factura"
                        color="deep-purple-lighten-1" clearable variant="outlined" />
                </v-col>
            </v-row>

            <!--  cuando es compra de importacion -->
            <v-row v-if="item_compra.documento_compra.tipo_compra == 'Importacion'">
                <v-col cols="12" sm="4">
                    <v-text-field v-model="item_compra.documento_compra.lista_empaque" label="Lista de empaque"
                        color="deep-purple-lighten-1" clearable variant="outlined" />
                </v-col>

                <v-col cols="12" sm="4">
                    <v-text-field v-model="item_compra.documento_compra.poliza" label="Poliza" color="deep-purple-lighten-1"
                        clearable variant="outlined" />
                </v-col>

                <v-col cols="12" sm="4">
                    <v-text-field v-model="item_compra.documento_compra.factura_importacion" label="Factura de importacion"
                        color="deep-purple-lighten-1" clearable variant="outlined" />
                </v-col>
            </v-row>

        </v-card-text>

        <v-card-actions>

            <v-spacer></v-spacer>
            <v-btn color="red" variant="elevated" @click="emit('toCloseForm')">
                <v-icon icon="mdi-close-circle"></v-icon>&nbsp;Cancelar
            </v-btn>
            <v-btn color="deep-purple-lighten-1" variant="elevated" @click="save()" :loading="loading_btn">
                <v-icon icon="mdi-content-save"></v-icon>&nbsp;Guardar
            </v-btn>
        </v-card-actions>

    </v-card>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue';
import Compra from '@/http/services/Compra';
import toastify from '@/composables/toastify';

//etmis y props
const props = defineProps(['is_item_compra', 'is_ciudad']);
const emit = defineEmits(['toCloseForm', 'toLocalUpdateDataTable', 'toHandleElement']);

//data
const fields_errors = ref({});
const item_compra = ref(props.is_item_compra);
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
        const compra = new Compra(props.is_ciudad, Object.assign({}, item_compra.value));
        if (compra.getAttributes().compra.id > 0) {
            //cuando es update
            const response = await compra.update();
            loading_btn.value = false;
            if (response.status) {
                toastify('success', response.message);
                emit('toLocalUpdateDataTable', 'edit', response.record);
                emit('toCloseForm');
            } else {
                if (response.validation_errors != undefined) {
                    fields_errors.value = Object.assign({}, response.validation_errors);
                }
                toastify('danger', response.message);
            }

        } else {
            //cuando es create
            const response = await compra.store();
            loading_btn.value = false;
            if (response.status) {
                toastify('success', response.message);
                emit('toLocalUpdateDataTable', 'new', response.record);
                emit('toCloseForm');
                emit('toHandleElement', 'product-lot', response.record)
            } else {
                if (response.validation_errors != undefined) {
                    fields_errors.value = Object.assign({}, response.validation_errors);
                }
                toastify('danger', response.message);
            }
        }
    }, 200);
}

</script> 


