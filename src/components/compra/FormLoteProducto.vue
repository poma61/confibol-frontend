<template>
    <v-card class="mt-4 animate__animated animate__bounceInDown" elevation="20">
        <v-card-title class="bg-primary">
            <v-icon icon="mdi-cart"></v-icon>&nbsp;<span class="text-h6">Registrar lote producto</span>
        </v-card-title>
        <v-card-text class="pa-3">
            <p class="text-warning text-subtitle-1 mb-3">Los campos marcados con (*) son obligatorios.</p>
            <!-- form para compras -->

            <v-select label="Cantidad de registros:" v-model="number_of_lote_producto"
                :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" color="primary" @update:model-value="showNumberOfLoteProducto" />

            <v-row v-for="(lote_producto, i) in items_lote_producto" :key="i">
                <!-- sm => es cuando en modo responsivo se aplica desde 600px aproximadamente-->
                <!-- md=> es cuando en modo responsivo se aplica desde 800px aproximadamente   -->
                <v-col cols="12">
                    <p class="text-subtitle-1 text-secondary">Registro {{ i + 1 }}</p>
                    <v-divider class="border-opacity-25 mb-3" color="primary"></v-divider>
                </v-col>

                <v-col cols="12" sm="4">
                    <v-text-field v-model="lote_producto.fecha_vencimiento" label="Fecha vencimiento (*)"
                        color="primary" clearable :error-messages="showFieldsErrors('fecha_vencimiento')"
                        type="date" />
                </v-col>

                <v-col cols="12" sm="4">
                    <v-text-field v-model="lote_producto.costo_unitario" label="Costo unitario (*)"
                        color="primary" clearable :error-messages="showFieldsErrors('costo_unitario')" />
                </v-col>

                <v-col cols="12" sm="4">
                    <v-text-field v-model="lote_producto.cantidad" label="Cantidad (*)"
                        color="primary" clearable :error-messages="showFieldsErrors('cantidad')" />
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="lote_producto.peso_neto" label="Peso neto (*)"
                        color="primary" clearable :error-messages="showFieldsErrors('peso_neto')" />
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="lote_producto.unidad_medida_peso_neto" label="Unidad de  medida (*)"
                        color="primary" clearable :error-messages="showFieldsErrors('unidad_medida_peso_neto')" />
                </v-col>

                <v-col cols="12" sm="6">
                    <v-autocomplete chips label="Deposito" v-model="lote_producto.id_deposito" :items="list_deposito"
                        item-value="id" item-title="text" color="primary"
                        @update:model-value="assingByIdDespito($event)" clearable>
                        <!-- v-if="lote_producto.id_producto!=''" hacemos esto porque cuando es un registro nuevo -->
                        <template v-slot:chip="{ props, item }">
                            <v-chip v-if="lote_producto.id_producto != ''" v-bind="props" :text="item.raw.text" />
                        </template>
                        <template v-slot:item="{ props, item }">
                            <v-list-item v-bind="props" :title="item.raw.text"></v-list-item>
                        </template>
                    </v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-autocomplete label="Producto" v-model="lote_producto.id_producto" :items="list_producto"
                        item-title="text" item-value="id" chip color="primary"
                        @update:model-value="assingByIdProducto($event)" clearable>

                        <template v-slot:chip="{ props, item }">
                            <v-chip v-if="lote_producto.id_producto != ''" v-bind="props"
                                :prepend-avatar="app.BASE_URL + item.raw.img" :text="item.raw.text" />
                        </template>
                        <template v-slot:item="{ props, item }">
                            <v-list-item v-bind="props" :prepend-avatar="app.BASE_URL + item.raw.img"
                                :title="item.raw.text"></v-list-item>
                        </template>
                    </v-autocomplete>
                </v-col>

                <v-col cols="12">
                    <v-textarea v-model="lote_producto.descripcion" label="Descripcion" color="primary" clearable rows="2" />
                </v-col>

            </v-row>

        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" variant="elevated" @click="emit('toCloseForm')">
                <v-icon icon="mdi-close-circle"></v-icon>&nbsp;Cancelar
            </v-btn>
            <v-btn color="primary" variant="elevated" @click="save()" :loading="loading_btn">
                <v-icon icon="mdi-content-save"></v-icon>&nbsp;Guardar
            </v-btn>
        </v-card-actions>

    </v-card>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, onMounted } from 'vue';
import LoteProducto from '@/http/services/LoteProducto';
import toastify from '@/composables/toastify';
import Deposito from '@/http/services/Deposito';
import Producto from '@/http/services/Producto';
import app from '@/config/app';

//etmis y props
const props = defineProps(['is_item_lote_producto']);
const emit = defineEmits(['toCloseForm', 'toLocalUpdateDataTable']);


//data
const fields_errors = ref({});
const items_lote_producto = ref([]);
const loading_btn = ref(false);
const list_deposito = ref([]);
const list_producto = ref([]);
const number_of_lote_producto = ref(1);

const showFieldsErrors = computed(() => {
    return function (field) {
        if (fields_errors.value[field]) {
            return fields_errors.value[field][0];
        }
        return "";
    }
});

const showNumberOfLoteProducto = () => {
    items_lote_producto.value = Array.from({ length: number_of_lote_producto.value }, () => new LoteProducto().getAttributes());
}

const save = () => {
    loading_btn.value = true;
    // setTimeout(async () => {
    //     const lote_producto = new LoteProducto(Object.assign({}, items_lote_producto.value));
    //     if (lote_producto.getAttributes().id > 0) {
    //         //cuando es update
    //         const response = await lote_producto.update();
    //         loading_btn.value = false;
    //         if (response.status) {
    //             toastify('success', response.message);
    //             emit('toLocalUpdateDataTable', 'edit', response.record);
    //             emit('toCloseForm');
    //         } else {
    //             if (response.validation_errors != undefined) {
    //                 fields_errors.value = Object.assign({}, response.validation_errors);
    //             }
    //             toastify('danger', response.message);
    //         }
    //     } else {
    //         //cuando es create
    //         const response = await lote_producto.store();
    //         loading_btn.value = false;
    //         if (response.status) {
    //             toastify('success', response.message);
    //             emit('toLocalUpdateDataTable', 'new', response.record);
    //             emit('toCloseForm');
    //         } else {
    //             if (response.validation_errors != undefined) {
    //                 fields_errors.value = Object.assign({}, response.validation_errors);
    //             }
    //             toastify('danger', response.message);
    //         }
    //     }
    // }, 200);
}

const initListDeposito = async () => {
    const deposito = new Deposito();
    const response = await deposito.list();

    if (response.status) {
        const list = response.records;
        list_deposito.value = list.map(item => ({
            text: `${item.deposito}, ${item.ciudad}`,
            id: item.id
        }));
    } else {
        toastify('danger', response.message);
    }
}

const initListProducto = async () => {
    const producto = new Producto();
    const response = await producto.list();

    if (response.status) {
        const list = response.records;
        list_producto.value = list.map(item => ({
            text: `${item.nombre_producto}, ${item.marca}`,
            img: item.imagen,
            id: item.id
        }));
    } else {
        toastify('danger', response.message);
    }
}

const assingByIdDespito = (id_deposito) => {
    items_lote_producto.value.id_deposito = id_deposito;
};

const assingByIdProducto = (id_producto) => {
    items_lote_producto.value.id_producto = id_producto;
};

onMounted(async () => {
    showNumberOfLoteProducto();
    await initListDeposito();
    await initListProducto();
});
</script> 


