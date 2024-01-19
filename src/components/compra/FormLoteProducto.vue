<template>
    <v-card class="animate__animated animate__flipInX" elevation="24">
        <v-card-title class="bg-deep-purple-lighten-1">
            <v-icon icon="mdi-cart"></v-icon>&nbsp;<span class="text-h6">Registrar lote producto</span>
        </v-card-title>
        <v-card-text class="pa-3">
            <p class="text-warning text-subtitle-1 mb-3">Los campos marcados con (*) son obligatorios.</p>
            <!-- form para compras -->
            <v-row>
                <!-- sm => es cuando en modo responsivo se aplica desde 600px aproximadamente-->
                <!-- md=> es cuando en modo responsivo se aplica desde 800px aproximadamente   -->
                <v-col cols="12">
                    <v-text-field v-model="item_lote_producto.fecha_compra" label="Fecha lote_producto (*)"
                        color="deep-purple-lighten-1" clearable
                        :error-messages="showFieldsErrors('lote_producto.fecha_compra')" variant="outlined" type="date" />
                </v-col>

                <v-col cols="12">
                    <v-textarea v-model="item_lote_producto.nota" label="Nota" color="deep-purple-lighten-1" clearable
                        variant="outlined" rows="3" />
                </v-col>

                <v-col cols="12">
                    <v-autocomplete chips label="Depositos" :items="list_deposito.map(item => item.label)"
                        @update:model-value="assingByIdDespito($event)" />
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
import { ref, defineProps, defineEmits, computed, onMounted } from 'vue';
import LoteProducto from '@/http/services/LoteProducto';
import toastify from '@/composables/toastify';
import Deposito from '@/http/services/Deposito';
import Producto from '@/http/services/Producto';

//etmis y props
const props = defineProps(['is_item_lote_producto']);
const emit = defineEmits(['toCloseForm', 'toLocalUpdateDataTable']);

//data
const fields_errors = ref({});
const item_lote_producto = ref(props.is_item_lote_producto);
const loading_btn = ref(false);
const list_deposito = ref([]);
const list_producto = ref([]);

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
        const lote_producto = new LoteProducto(Object.assign({}, item_lote_producto.value));
        if (lote_producto.getAttributes().id > 0) {
            //cuando es update
            const response = await lote_producto.update();
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
            const response = await lote_producto.store();
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


const initListDeposito = async () => {
    const deposito = new Deposito();
    const response = await deposito.list();

    if (response.status) {
        const list = response.records;
        list_deposito.value = list.map(item => ({
            label: `${item.deposito}, ${item.ciudad}`,
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
        list_producto.value = list.map(item => item.nombres);
    } else {
        toastify('danger', response.message);
    }
}

const assingByIdDespito = (item) => {
     list_deposito.value.forEach(element => {
        if(element.label==item){
            item_lote_producto.value.id_deposito=element.id;
            console.log("ok");
        }
     });       
};  

onMounted(async () => {
    await initListDeposito();
})

</script> 


