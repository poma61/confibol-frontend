<template>
    <v-card class="mt-4 animate__animated animate__bounceInDown" elevation="20">
        <v-card-title class="bg-primary">
            <v-icon icon="mdi-cart"></v-icon>&nbsp;<span class="text-h6">Registrar lote producto</span>
        </v-card-title>
        <v-card-text class="pa-3">
            <p class="text-warning text-subtitle-1 mb-3">Los campos marcados con (*) son obligatorios.</p>
            <!-- form para compras -->

            <!--  solo mostramos esta parte cuando es nuevo registro -->
            <v-select v-if="props.is_action_form == 'new'" label="Cantidad de registros:" v-model="number_of_lote_producto"
                :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" color="primary" @update:model-value="showNumberOfLoteProducto" />

            <v-row v-for="(lote_producto, i) in items_lote_producto" :key="i">
                <!-- sm => es cuando en modo responsivo se aplica desde 600px aproximadamente-->
                <!-- md=> es cuando en modo responsivo se aplica desde 800px aproximadamente   -->
                <v-col cols="12">
                    <p class="text-subtitle-1 text-secondary">Registro {{ i + 1 }}</p>
                    <v-divider class="border-opacity-25 mb-3" color="primary"></v-divider>
                </v-col>

                <v-col cols="12" sm="4">
                    <v-text-field v-model="lote_producto.fecha_vencimiento" label="Fecha vencimiento (*)" color="primary"
                        clearable :error-messages="showFieldsErrors(`lote_productos.${i}.fecha_vencimiento`)" type="date" />
                </v-col>

                <v-col cols="12" sm="4">
                    <v-text-field v-model="lote_producto.costo_unitario" label="Costo unitario (*)" color="primary"
                        clearable :error-messages="showFieldsErrors(`lote_productos.${i}.costo_unitario`)"
                        @input="asseptDoubleNumber($event, i, 'costo_unitario')" />
                </v-col>

                <v-col cols="12" sm="4">
                    <v-text-field v-model="lote_producto.cantidad" label="Cantidad (*)" color="primary" clearable
                        :error-messages="showFieldsErrors(`lote_productos.${i}.cantidad`)" type="number" />
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="lote_producto.peso_neto" label="Peso neto (*)" color="primary" clearable
                        :error-messages="showFieldsErrors(`lote_productos.${i}.peso_neto`)"
                        @input="asseptDoubleNumber($event, i, 'peso_neto')" />
                </v-col>

                <v-col cols="12" sm="6">
                    <v-combobox v-model="lote_producto.unidad_medida_peso_neto" label="Unidad de medida (*)" color="primary"
                        clearable :error-messages="showFieldsErrors(`lote_productos.${i}.unidad_medida_peso_neto`)"
                        :items="['kg (Kilogramo)', 'g (Gramo)', 'mg (Miligramo)', 'µg (Microgramo)', 't (Tonelada)', 'q (Quintal)', 'lb (Libra)', 'oz (Onza)']" />
                </v-col>

                <v-col cols="12" sm="6">
                    <v-autocomplete chips label="Deposito" v-model="lote_producto.id_deposito" :items="list_deposito"
                        item-value="id" item-title="text" color="primary" clearable
                        :error-messages="showFieldsErrors(`lote_productos.${i}.id_deposito`)">

                        <template v-slot:chip="{ props, item }">
                            <v-chip v-bind="props" :text="item.raw.text" />
                        </template>
                        <template v-slot:item="{ props, item }">
                            <v-list-item v-bind="props" :title="item.raw.text"></v-list-item>
                        </template>
                    </v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-autocomplete label="Producto" v-model="lote_producto.id_producto" :items="list_producto"
                        item-title="text" item-value="id" chip color="primary" clearable
                        :error-messages="showFieldsErrors(`lote_productos.${i}.id_producto`)">

                        <template v-slot:chip="{ props, item }">
                            <v-chip v-bind="props" :prepend-avatar="app.BASE_URL + item.raw.img" :text="item.raw.text" />
                        </template>
                        <template v-slot:item="{ props, item }">
                            <v-list-item v-bind="props" :prepend-avatar="app.BASE_URL + item.raw.img"
                                :title="item.raw.text"></v-list-item>
                        </template>

                    </v-autocomplete>
                </v-col>

                <v-col cols="12">
                    <v-textarea v-model="lote_producto.descripcion" label="Descripcion" color="primary" clearable
                        rows="2" />
                </v-col>

            </v-row>

        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="elevated" @click="save()" :loading="loading_btn">
                <v-icon icon="mdi-content-save"></v-icon>&nbsp;Guardar
            </v-btn>
        </v-card-actions>

    </v-card>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, onMounted, watch } from 'vue';
import LoteProducto from '@/http/services/LoteProducto';
import toastify from '@/composables/toastify';
import Deposito from '@/http/services/Deposito';
import Producto from '@/http/services/Producto';
import app from '@/config/app';
import { assignObjectExists, assignObjectNew } from '@/util/objectDyl';

//etmis y props
const props = defineProps(['is_item_lote_producto', 'is_compra', 'is_action_form']);
const emit = defineEmits(['toLocalUpdateDataTable']);

//watch
//este trozo de codigo ayuda a volver a resetear los valores para un nuevo registro
//entonces cuando se  ejecute el metodo newForm del componente ContentLoteProducto
//entonces los valores de item_lote_producto se volveran a reasignar y asi se ejecutara el  watch
watch(() => props.is_item_lote_producto, (new_value, old_value) => {
    assignRequiredDataForm();
});

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

const assignRequiredDataForm = () => {
    const lote_producto = new LoteProducto({ id_compra: props.is_compra.compra.id });
    for (let i = 0; i < items_lote_producto.value.length; i++) {
        assignObjectExists(items_lote_producto.value[i], lote_producto.getAttributes());
    }
    fields_errors.value = {};
}

const showNumberOfLoteProducto = () => {
    switch (props.is_action_form) {
        case "new":
            items_lote_producto.value = Array.from({ length: number_of_lote_producto.value }, () => assignObjectNew(props.is_item_lote_producto));
            assignRequiredDataForm();
            break;
        case "edit":
            items_lote_producto.value = [new LoteProducto(assignObjectNew(props.is_item_lote_producto)).getAttributes()];
            break;
        default:
            toastify("warning", "Error en el metodo showNumberOfLoteProducto!");
            break;
    }
}

const save = () => {
    loading_btn.value = true;
    setTimeout(async () => {
        const __lote_producto = items_lote_producto.value.map(item => new LoteProducto(assignObjectNew(item)));
        const lote_producto = new LoteProducto();
        lote_producto.setParameter({
            lote_productos: __lote_producto.map(item => item.getAttributes()),
        });
        let response;
        switch (props.is_action_form) {
            case 'new':
                //cuando es  nuevo registro
                response = await lote_producto.store();
                loading_btn.value = false;
                if (response.status) {
                    toastify('success', response.message);
                    emit('toLocalUpdateDataTable', 'new', response.records);
                    assignRequiredDataForm();
                } else {
                    if (response.validation_errors != undefined) {
                        fields_errors.value = Object.assign({}, response.validation_errors);
                    }
                    toastify('danger', response.message);
                }
                break;
            case 'edit':
                //cuando es edicion de registro
                response = await lote_producto.update();
                loading_btn.value = false;
                if (response.status) {
                    toastify('success', response.message);
                    emit('toLocalUpdateDataTable', 'edit', response.record);
                    fields_errors.value = {};
                } else {
                    if (response.validation_errors != undefined) {
                        fields_errors.value = Object.assign({}, response.validation_errors);
                    }
                    toastify('danger', response.message);
                }
                break;
            default:
                toastify('warning', "Error en el metodo save!");
                break;
        }
    }, 200);
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

const asseptDoubleNumber = (event, index, campo) => {
    let valor_campo = event.target.value;
    // Eliminar los caracteres no válidos, excepto números y un único "."
    valor_campo = valor_campo.replace(/[^\d.]/g, '');
    // Validar si hay más de un "." y limitar a dos decimales
    const partes = valor_campo.split('.');
    if (partes.length > 2) {
        valor_campo = partes[0] + '.' + partes[1];
    } else if (partes.length == 2) {
        partes[1] = partes[1].substring(0, 2);
        valor_campo = partes.join('.');
    }
    // Actualizar el valor en el campo de entrada
    items_lote_producto.value[index][campo] = valor_campo;
}

onMounted(async () => {
    showNumberOfLoteProducto();
    await initListDeposito();
    await initListProducto();
});
</script> 


