<template>
    <v-card class="animate__animated animate__flipInX" elevation="24">
        <v-card-title class="bg-deep-purple-lighten-1">
            <v-icon icon="mdi-cart"></v-icon>&nbsp;<span class="text-h6">Registrar producto_lote</span>
        </v-card-title>
        <v-card-text class="pa-3">
            <p class="text-warning text-subtitle-1 mb-3">Los campos marcados con (*) son obligatorios.</p>
            <!-- form para compras -->
            <v-row>
                <!-- sm => es cuando en modo responsivo se aplica desde 600px aproximadamente-->
                <!-- md=> es cuando en modo responsivo se aplica desde 800px aproximadamente   -->
                <v-col cols="12">
                    <v-text-field v-model="item_compra.fecha_compra" label="Fecha producto_lote (*)" color="deep-purple-lighten-1"
                        clearable :error-messages="showFieldsErrors('producto_lote.fecha_compra')" variant="outlined"
                        type="date" />
                </v-col>

                <v-col cols="12">
                    <v-textarea v-model="item_compra.nota" label="Nota" color="deep-purple-lighten-1" clearable
                        variant="outlined" rows="3" />
                </v-col>

                <v-radio-group label="Tipo de producto_lote" inline v-model="item_producto_lote.tipo_compra"
                    :error-messages="showFieldsErrors('documento_compra.tipo_compra')">
                    <v-radio label="Nacional" value="Nacional" color="secondary"></v-radio>
                    <v-radio label="Importacion" value="Importacion" color="secondary"></v-radio>
                </v-radio-group>
            </v-row>
            <!-- form para documentos compras -->
            <!--  cuando es producto_lote nacional -->
            <v-row v-if="item_producto_lote.tipo_compra == 'Nacional'">
                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_producto_lote.recibo" label="Recibo" color="deep-purple-lighten-1"
                        clearable variant="outlined" />
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_producto_lote.factura" label="Factura" color="deep-purple-lighten-1"
                        clearable variant="outlined" />
                </v-col>
            </v-row>

            <!--  cuando es producto_lote de importacion -->
            <v-row v-if="item_producto_lote.tipo_compra == 'Importacion'">
                <v-col cols="12" sm="4">
                    <v-text-field v-model="item_producto_lote.lista_empaque" label="Lista de empaque"
                        color="deep-purple-lighten-1" clearable variant="outlined" />
                </v-col>

                <v-col cols="12" sm="4">
                    <v-text-field v-model="item_producto_lote.poliza" label="Poliza" color="deep-purple-lighten-1"
                        clearable variant="outlined" />
                </v-col>

                <v-col cols="12" sm="4">
                    <v-text-field v-model="item_producto_lote.factura_importacion" label="Factura de importacion"
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
import { ref, defineProps, defineEmits, computed, watch } from 'vue';
import ProductoLote from '@/http/services/ProductoLote';
import toastify from '@/composables/toastify';


//etmis y props
const props = defineProps(['is_compra', 'is_ciudad', 'is_item_producto_lote']);
const emit = defineEmits(['toCloseForm', 'toLocalUpdateDataTable']);

//data
const fields_errors = ref({});
const item_producto_lote = ref(props.is_item_producto_lote);
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
        const producto_lote = new ProductoLote(Object.assign({}, item_producto_lote.value));
        if (producto_lote.getAttributes("producto_lote").id > 0) {
            //cuando es update
            const response = await producto_lote.update();
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
            const response = await producto_lote.store();
            loading_btn.value = false;
            if (response.status) {
                toastify('success', response.message);
                emit('toLocalUpdateDataTable', 'new', response.record);
                emit('toCloseForm');
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


