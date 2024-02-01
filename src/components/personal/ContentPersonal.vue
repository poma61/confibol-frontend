<template>
    <div class="my-3 d-flex flex-wrap animate__animated animate__rotateInDownLeft">
        <v-btn color="yellow-darken-2" variant="elevated" class="ma-1" @click="handleComponent('data-table')">
            <v-icon icon="mdi-table" />&nbsp;Tablero
        </v-btn>

        <v-btn color="yellow-darken-2" variant="elevated" class="ma-1" @click="changeDataTable"
            :disabled="component_visible.form">
            <v-icon icon="mdi-refresh" />
        </v-btn>

        <v-btn color="yellow-darken-2" variant="elevated" class="ma-1" @click="newForm">
            <v-icon icon="mdi-note-plus" />&nbsp;Nuevo personal
        </v-btn>

    </div>

    <v-card v-if="component_visible.data_table" class="animate__animated animate__rotateInDownLeft">
        <v-text-field v-model="buscar_data_table" append-inner-icon="mdi-magnify" clearable label="Buscar Registros..."
            color="yellow-darken-4" />
        <v-data-table :hover="true" :items="data" :headers="columns" :search="buscar_data_table"
            :loading="loading_data_table" :items-per-page-options="items_per_page_options" :show-current-page="true"
            :fixed-header="true" :height="550" :sort-by="[{ key: 'id', order: 'desc' }]">

            <template v-slot:loading>
                <v-skeleton-loader type="table-row@12"></v-skeleton-loader>
            </template>

            <template v-slot:item.actions="{ item }">
                <div style="width: 150px;">
                    <v-btn @click="editForm(item)" color="success" class="ma-1" variant="elevated">
                        <v-icon icon="mdi-pencil"></v-icon>
                    </v-btn>
                    <v-btn @click="openDeleteData(item)" color="red" class="ma-1" variant="elevated">
                        <v-icon icon="mdi-delete"></v-icon>
                    </v-btn>
                </div>
            </template>

            <template v-slot:item.foto_image_path="{ item }">
                <v-avatar :image="app.BASE_URL + item.foto_image_path" size="64" class="ma-2" />
            </template>
            <template v-slot:item.correo_electronico="{ item }">
                <p class="text-warning" v-if="item.correo_electronico == null || item.correo_electronico == ''">
                    Sin correo electronico!
                </p>
                <p v-else>
                    {{ item.correo_electronico }}
                </p>
            </template>

            <template v-slot:item.direccion="{ item }">
                <p class="text-warning" v-if="item.direccion == null || item.direccion == ''">
                    Sin direccion!
                </p>
                <p v-else>
                    {{ item.direccion }}
                </p>
            </template>

            <template v-slot:item.n_de_contacto="{ item }">
                <p class="text-warning" v-if="item.n_de_contacto == null || item.n_de_contacto == ''">
                    Sin numero de contacto!
                </p>
                <p v-else>
                    {{ item.n_de_contacto }}
                </p>
            </template>

        </v-data-table>
    </v-card>

    <FormPersonal :is_item_personal="item_personal" @toNewForm="newForm" :is_ciudad="ciudad" v-if="component_visible.form"
        @toLocalUpdateDataTable="localUpdateDataTable" />

    <v-dialog v-model="dialog_delete" persistent max-width="500px">
        <v-card class="px-5 py-5">
            <v-card-text class="text-center">
                <v-icon icon="mdi mdi-trash-can-outline" size="100" color="red"
                    class="animate__animated animate__infinite animate__bounce"></v-icon>
            </v-card-text>
            <p class="text-h6 text-center">
                ¿Esta seguro(a) de eliminar este registro?
            </p>
            <div class="d-flex justify-center">
                <v-btn color="red" variant="elevated" @click="closeDeleteItem" class="ma-1">
                    <v-icon icon="mdi-cancel"></v-icon>&nbsp;Cancelar
                </v-btn>
                <v-btn color="success" variant="elevated" class="ma-1" @click="confirmDeleteData()">
                    <v-icon icon="mdi-check-bold"></v-icon>&nbsp;Aceptar
                </v-btn>
            </div>
        </v-card>
    </v-dialog>
</template>
<script setup>
import FormPersonal from '@/components/personal/FormPersonal.vue';
import Personal from '@/http/services/Personal';
import { defineExpose } from 'vue';
import { ref } from 'vue';
import toastify from '@/composables/toastify';
import app from '@/config/app';
import { assignObjectExists, assignObjectNew } from '@/util/objectDyl';

const index_item = ref(-1);
const component_visible = ref({
    data_table: false,
    form: false,
});
const ciudad = ref("");
const dialog_delete = ref(false);
const item_personal = ref({});
const buscar_data_table = ref("");
const loading_data_table = ref(null);
const items_per_page_options = ref([
    { value: 10, title: '10' },
    { value: 25, title: '25' },
    { value: 50, title: '50' },
]);
const columns = ref([
    { title: 'Nombres', key: 'nombres' },
    { title: 'Apellido paterno', key: 'apellido_paterno' },
    { title: 'Apellido materno', key: 'apellido_materno' },
    { title: 'Cargo', key: 'cargo' },
    { title: 'CI', key: 'ci', value: (item) => `${item.ci} ${item.ci_expedido}` },
    { title: 'N° de contacto', key: 'n_de_contacto' },
    { title: 'Direccion', key: 'direccion' },
    { title: 'Correo electronico', key: 'correo_electronico' },
    { title: 'Foto', key: 'foto_image_path', align: 'center' },
    { title: 'Acciones', key: 'actions', align: 'center' },
]);
const data = ref([]);

//methods
const changeDataTable = () => {
    const personal = new Personal(ciudad.value);
    loading_data_table.value = 'yellow-darken-2';
    setTimeout(async () => {
        const response = await personal.index();
        loading_data_table.value = null;
        if (response.status) {
            data.value = response.records;
        } else {
            toastify('danger', response.message);
        }
    }, 200);
}//changeDataTable
const clear = () => {
    item_personal.value = {};
    index_item.value = -1;
}

const openDeleteData = (item) => {
    item_personal.value = assignObjectNew(item);
    index_item.value = data.value.indexOf(item);
    dialog_delete.value = true;
}
const closeDeleteItem = () => {
    clear();
    dialog_delete.value = false;
}
const confirmDeleteData = async () => {
    const personal = new Personal(ciudad.value, item_personal.value);
    const response = await personal.destroy();
    if (response.status) {
        data.value.splice(index_item.value, 1);
        toastify('success', response.message);
    } else {
        toastify('danger', response.message)
    }
    closeDeleteItem();
}
const newForm = () => {
    clear();
    const personal = new Personal();
    item_personal.value = assignObjectNew(personal.getAttributes());
    handleComponent('form');
}

const editForm = (item) => {
    clear();
    item_personal.value = assignObjectNew(item);
    index_item.value = data.value.indexOf(item);
    handleComponent('form');
}

const localUpdateDataTable = (type, item) => {
    switch (type) {
        case 'new':
            data.value.push(assignObjectNew(item));
            break;
        case 'edit':
            assignObjectExists(data.value[index_item.value], item);
            break;
        default:
            toastify('danger', 'No se puede reconocer la accion al registrar.');
            break;
    }
}

const handleComponent = (component) => {
    switch (component) {
        case 'data-table':
            component_visible.value.data_table = true;
            component_visible.value.form = false;
            break;
        case 'form':
            component_visible.value.data_table = false;
            component_visible.value.form = true;
            break;
        default:
            toastify('waning', 'Error en el metodo handleComponent.');
            break;
    }
}

const witchParamsRoute = (item) => {
    ciudad.value = item;
}
//mantenemos visible la funcion 
defineExpose({
    changeDataTable,
    witchParamsRoute,
    handleComponent,
});

</script>
