<template>
    <div class="mt-3 d-flex flex-wrap animate__animated animate__bounceInLeft">
        <v-btn color="light-blue-darken-3" variant="tonal" class="ma-1" @click="loadDataTable()">
            <v-icon icon="mdi-refresh" />&nbsp;actualizar tablero
        </v-btn>
        <v-btn color="light-blue-darken-3" variant="tonal" class="ma-1" @click="clear()">
            <v-icon icon="mdi-delete" />&nbsp;Limpiar
        </v-btn>
        <v-btn color="light-blue-darken-3" variant="tonal" class="ma-1" @click="newForm">
            <v-icon icon="mdi-plus" />&nbsp; nuevo registro
        </v-btn>
    </div>

    <div class="pa-1 animate__animated animate__bounceInLeft">
        <p class="text-secondary">Detalles del cliente</p>
        <v-row>
            <!-- sm => es cuando en modo responsivo se aplica desde 600px aproximadamente-->
            <!-- md=> es cuando en modo responsivo se aplica desde 800px aproximadamente   -->
            <v-col cols="12" sm="3">
                <v-textarea :model-value="nombreCompletoCliente" label="Nombre completo" color="light-blue-darken-3"
                    readonly rows="2" />
            </v-col>
            <v-col cols="12" sm="3">
                <v-textarea :model-value="item_cliente.nombre_grupo" label="Grupo" color="light-blue-darken-3" readonly
                    rows="2" />
            </v-col>

            <v-col cols="12" sm="3">
                <v-textarea :model-value="item_cliente.direccion" label="Direccion" color="light-blue-darken-3" readonly
                    rows="2" />
            </v-col>

            <v-col cols="12" sm="3">
                <v-textarea :model-value="item_cliente.descripcion" label="Descripcion" color="light-blue-darken-3" readonly
                    rows="2" />
            </v-col>

        </v-row>
    </div>

    <v-card class="animate__animated animate__bounceInLeft">
        <v-text-field v-model="search_data" append-inner-icon="mdi-magnify" clearable label="Buscar Registros..."
            color="light-blue-darken-3" />
        <v-data-table :hover="true" :items="data" :headers="columns" :search="search_data" :loading="loading_data_table"
            :items-per-page-options="items_per_page_options" :show-current-page="true" :fixed-header="true" :height="450"
            :sort-by="[{ key: 'id', order: 'desc' }]">

            <template v-slot:loading>
                <v-skeleton-loader type="table-row@13"></v-skeleton-loader>
            </template>

            <template v-slot:item.correo_electronico="{ item }">
                <p class="text-warning" v-if="item.correo_electronico == null || item.correo_electronico == ''">Sin correo
                    electronico!</p>
                <p v-else>{{ item.correo_electronico }}</p>
            </template>

            <template v-slot:item.actions="{ item }">
                <div style="min-width: 200px;">
                    <v-btn @click="showDetailsCliente(item)" class="ma-1" color="light-blue-darken-3"
                        icon="mdi-card-text-outline" variant="tonal" />
                    <v-btn @click="editForm(item)" class="ma-1" color="secondary" icon="mdi-pencil" variant="tonal" />
                    <v-btn @click="openDeleteData(item)" class="ma-1" color="red" icon="mdi-delete" variant="tonal" />
                </div>
            </template>
        </v-data-table>
    </v-card>
    <v-dialog v-model="dialog_form" persistent max-width="1200px" scrollable>
        <FormCliente :is_ciudad="ciudad" :is_item_cliente="item_cliente" @toCloseForm="closeForm"
            @toLocalUpdateDataTable="localUpdateDataTable" />
    </v-dialog>

    <v-dialog v-model="dialog_delete" persistent max-width="500px">
        <v-card class="animate__animated animate__flipInX pa-5" elevation="24">
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
                    <v-btn color="light-blue-darken-3 " variant="tonal" class="ma-1" @click="confirmDeleteData()">
                        <v-icon icon="mdi-check-circle"></v-icon>&nbsp;Si
                    </v-btn>
                </div>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup>
import FormCliente from '@/components/cliente/FormCliente.vue';
import Cliente from '@/http/services/Cliente';
import { ref, defineExpose, computed } from 'vue';
import toastify from '@/composables/toastify';
import { assignObjectNew, assignObjectExists } from '@/util/objectDyl';

//data
const index_data_item = ref(-1);
const dialog_delete = ref(false);
const dialog_form = ref(false);
const item_cliente = ref({});
const search_data = ref("");
const loading_data_table = ref(null);
const ciudad = ref("");
const items_per_page_options = ref([
    { value: 10, title: '10' },
    { value: 25, title: '25' },
    { value: 50, title: '50' },
]);
const columns = ref([
    { title: 'Nombres', key: 'nombres', },
    { title: 'Apellido paterno', key: 'apellido_paterno', },
    { title: 'Apellido materno', key: 'apellido_materno', },
    { title: 'N° de contacto', key: 'n_de_contacto', },
    { title: 'Correo electronico', key: 'correo_electronico', },
    { title: 'C.I.', key: 'ci', value: (item) => `${item.ci} ${item.ci_expedido}` },
    { title: 'Acciones', key: 'actions', },
]);
const data = ref([]);

const nombreCompletoCliente = computed(() => {
    if (item_cliente.value.nombres != undefined || item_cliente.value.apellido_paterno != undefined || item_cliente.value.apellido_materno != undefined) {
        return `${item_cliente.value.nombres} ${item_cliente.value.apellido_paterno} ${item_cliente.value.apellido_materno}`
    }
    return "";
});

//methods
const loadDataTable = () => {
    const cliente = new Cliente(ciudad.value);
    loading_data_table.value = 'light-blue-darken-3';
    setTimeout(async () => {
        const response = await cliente.index();
        loading_data_table.value = null;
        if (response.status) {
            data.value = response.records;
        } else {
            toastify('danger', response.message);
        }
    }, 200);
}//loadDataTable

const clear = () => {
    item_cliente.value = {};
    index_data_item.value = -1;
}

const openDeleteData = (item) => {
    //solo asignamos el id, porque al asginar el objeto item, en la vista se mostrara en detalles del cliente
    // los datos y no se ve vistoso entonces para evitar eso asignamos solo el id del registro
    item_cliente.value = assignObjectNew({ id: item.id });
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
    const cliente = new Cliente(ciudad.value, assignObjectNew(item_cliente.value));
    const response = await cliente.destroy();
    if (response.status) {
        data.value.splice(index_data_item.value, 1);
        toastify('success', response.message);
    } else {
        toastify('danger', response.message)
    }
    closeDeleteData();
}

const newForm = () => {
    const cliente = new Cliente();
    item_cliente.value = assignObjectNew(cliente.getAttributes());
    dialog_form.value = true;
}

const editForm = (item) => {
    const cliente = new Cliente();
    cliente.setAttributes(assignObjectNew(item));
    item_cliente.value = assignObjectNew(cliente.getAttributes());
    index_data_item.value = data.value.indexOf(item);
    dialog_form.value = true;
}

const showDetailsCliente = (item) => {
    item_cliente.value = assignObjectNew(item);
}

const localUpdateDataTable = (type, item) => {
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
