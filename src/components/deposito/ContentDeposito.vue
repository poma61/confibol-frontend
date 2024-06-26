<template>
    <div class="ma-3 d-flex animate__animated animate__bounceInLeft">
        <div class="d-flex flex-column">
            <v-tooltip text="Actualizar tablero">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" color="amber-darken-3" variant="tonal" class="ma-1" @click="loadDataTable()"
                        icon="mdi-refresh" />
                </template>
            </v-tooltip>
            <v-tooltip text="Nuevo deposito">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" color="amber-darken-3" variant="tonal" class="ma-1" @click="newForm"
                        icon="mdi-plus" />
                </template>
            </v-tooltip>
        </div>

        <v-card class="my-2 flex-grow-1">
            <v-text-field v-model="search_data" append-inner-icon="mdi-magnify" clearable label="Buscar Registros..."
                color="amber-darken-3 " />
            <v-data-table :hover="true" :items="data" :headers="columns" :search="search_data" :loading="loading_data_table"
                :items-per-page-options="items_per_page_options" :show-current-page="true" :fixed-header="true"
                :height="600" :sort-by="[{ key: 'id', order: 'desc' }]">

                <template v-slot:loading>
                    <v-skeleton-loader type="table-row@13"></v-skeleton-loader>
                </template>

                <template v-slot:item.actions="{ item }">
                    <div style="min-width: 150px;">
                        <v-btn @click="editForm(item)" class="ma-1" color="success" variant="tonal">
                            <v-icon icon="mdi-pencil"></v-icon>
                        </v-btn>
                        <v-btn @click="openDeleteData(item)" class="ma-1" color="red" variant="tonal">
                            <v-icon icon="mdi-delete"></v-icon>
                        </v-btn>
                    </div>

                </template>

            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog_form" persistent max-width="900px" scrollable>
            <FormDeposito :is_ciudad="ciudad" :is_item_deposito="item_deposito" @toCloseForm="closeForm"
                @toUpdateDataTable="updateDataTable" />
        </v-dialog>

    </div>

    <v-dialog v-model="dialog_delete" persistent max-width="500px">
        <v-card class="animate__animated animate__slideInDown pa-5" elevation="24">
            <v-card-text class="text-center">
                <v-icon icon="mdi-trash-can-outline" size="100" color="red"
                    class="animate__animated animate__infinite animate__bounce"></v-icon>
                <p class="text-h6">
                    ¿Esta seguro(a) de eliminar este registro?
                </p>
            </v-card-text>
            <v-card-actions>
                <div class="d-flex justify-center" style="width: 100%;">
                    <v-btn color="red" variant="tonal" @click="closeDeleteData" class="ma-1">
                        <v-icon icon="mdi-cancel"></v-icon>&nbsp;Cancelar
                    </v-btn>
                    <v-btn color="amber-darken-3 " variant="tonal" class="ma-1" @click="confirmDeleteData()">
                        <v-icon icon="mdi-check-circle"></v-icon>&nbsp;Si
                    </v-btn>
                </div>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup>
import FormDeposito from '@/components/deposito/FormDeposito.vue';
import Deposito from '@/http/services/Deposito';
import { ref, defineExpose } from 'vue';
import toastify from '@/composables/toastify';
import { assignObjectNew, assignObjectExists } from '@/util/objectDyl';

//data
const index_data_item = ref(-1);
const dialog_delete = ref(false);
const dialog_form = ref(false);
const item_deposito = ref({});
const search_data = ref("");
const loading_data_table = ref(null);
const ciudad = ref("");

const items_per_page_options = ref([
    { value: 10, title: '10' },
    { value: 25, title: '25' },
    { value: 50, title: '50' },
]);

const columns = ref([
    { title: 'Nombre deposito', key: 'nombre_deposito', },
    { title: 'Direccion', key: 'direccion', },
    { title: 'Acciones', key: 'actions', },
]);
const data = ref([]);
//methods

const loadDataTable = () => {
    const deposito = new Deposito(ciudad.value);
    loading_data_table.value = 'amber-darken-3 ';
    setTimeout(async () => {
        const response = await deposito.index();
        loading_data_table.value = null;
        if (response.status) {
            data.value = response.records;
        } else {
            toastify('danger', response.message);
        }
    }, 200);

}//loadDataTable

const clear = () => {
    item_deposito.value = {};
    index_data_item.value = -1;
}

const openDeleteData = (item) => {
    item_deposito.value = assignObjectNew(item);
    index_data_item.value = data.value.indexOf(item);
    dialog_delete.value = true;
}

const closeDeleteData = () => {
    clear();
    dialog_delete.value = false;
}
const closeForm = () => {
    clear();
    dialog_form.value = false;
}

const confirmDeleteData = async () => {
    const deposito = new Deposito(ciudad.value, assignObjectNew(item_deposito.value));
    const response = await deposito.destroy();
    if (response.status) {
        data.value.splice(index_data_item.value, 1);
        toastify('success', response.message);
    } else {
        toastify('danger', response.message)
    }
    closeDeleteData();
}


const newForm = () => {
    const deposito = new Deposito();
    item_deposito.value = assignObjectNew(deposito.getAttributes());
    dialog_form.value = true;
}

const editForm = (item) => {
    item_deposito.value = assignObjectNew(item);
    index_data_item.value = data.value.indexOf(item);
    dialog_form.value = true;
}

const updateDataTable = (type, item) => {
    switch (type) {
        case 'new':
            data.value.push(assignObjectNew(item));
            break;
        case 'edit':
            assignObjectExists(data.value[index_data_item.value], item);
            break;
        default:
            toastify('danger', 'No se puede reconocer la accion al registrar.');
            break;
    }
}

const witchParamsRoute = (item) => {
    ciudad.value = item;
}

//mantenemos visible la funcion 
defineExpose({
    loadDataTable,
    witchParamsRoute,
});


</script>
