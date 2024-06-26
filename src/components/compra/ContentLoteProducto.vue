
<template>
    <div class="animate__animated animate__bounceInDown">
        <div class="d-flex flex-wrap mt-2">
            <v-btn v-bind="props" color="cyan-darken-1" variant="elevated" class="ma-1"
                @click="emit('toHandleComponent', 'compra-data-table', null)" rounded>
                <v-icon icon="mdi-table-large"></v-icon>&nbsp;principal
            </v-btn>

            <v-btn v-bind="props" color="cyan-darken-1" variant="elevated" class="ma-1"
                @click="handleWithComponent('data-table')" rounded>
                <v-icon icon="mdi-table"></v-icon>&nbsp;tablero
            </v-btn>

            <v-btn v-bind="props" color="cyan-darken-1" variant="elevated" class="ma-1" @click="loadDataTable()" rounded>
                <v-icon icon="mdi-refresh"></v-icon>
            </v-btn>

            <v-btn v-bind="props" color="cyan-darken-1" variant="elevated" class="ma-1" @click="newForm()" rounded>
                <v-icon icon="mdi-plus"></v-icon>&nbsp;nuevo lote producto
            </v-btn>
        </div>
        <v-card class="mt-1 flex-grow-1" elevation="10">
            <v-card-title class="bg-cyan-darken-1">
                <v-icon icon="mdi-package-variant"></v-icon>&nbsp;<span class="text-h6">Kardex</span>
            </v-card-title>
            <v-card-text>
                <div class="ma-5 d-flex justify-center align-center">
                    <v-table density="compact" class="is-width-responsive">
                        <tbody>
                            <tr>
                                <td colspan="2" class="text-center text-h6 text-primary">Datos generales de la compra
                                </td>
                            </tr>
                            <tr>
                                <th class="text-cyan-darken-1">Fecha de compra:</th>
                                <td>{{ format_date.dateOnlyFormatter(props.is_compra.compra.fecha_compra) }}</td>
                            </tr>

                            <tr>
                                <th class="text-cyan-darken-1">Tipo de compra:</th>
                                <td>{{ props.is_compra.documento_compra.tipo_compra }}</td>
                            </tr>

                            <tr>
                                <th class="text-cyan-darken-1">Nota:</th>
                                <td v-if="props.is_compra.compra.nota == null" class="text-warning">Sin nota!</td>
                                <td v-else>{{ props.is_compra.compra.nota }}</td>
                            </tr>

                        </tbody>
                    </v-table>
                </div>
            </v-card-text>
        </v-card>
    </div>

    <v-card v-if="component_show.data_table" class="mt-4 animate__animated animate__bounceInDown" elevation="10">
        <v-card-text>
            <v-text-field v-model="search_data" append-inner-icon="mdi-magnify" clearable label="Buscar Registros..."
                color="cyan-darken-1" />
            <v-data-table class="my-3" :hover="true" :items="data" :headers="columns" :search="search_data"
                :loading="loading_data_table" :items-per-page-options="items_per_page_options" :show-current-page="true"
                :fixed-header="true" :height="500" :sort-by="[{ key: 'fecha_vencimiento', order: 'asc' }]">

                <template v-slot:loading>
                    <v-skeleton-loader type="table-row@13"></v-skeleton-loader>
                </template>

                <template v-slot:item.image_path="{ item }">
                    <v-avatar :image="app.BASE_URL + item.image_path" size="64" class="ma-2" />
                </template>

                <template v-slot:item.costo_unitario="{ item }">
                    <v-chip color="orange-darken-4">
                        Bs. {{ item.costo_unitario.toFixed(2) }}
                    </v-chip>
                </template>

                <template v-slot:item.fecha_vencimiento="{ item }">
                    <v-chip color="success">
                        {{ format_date.dateOnlyFormatter(item.fecha_vencimiento) }}
                    </v-chip>
                </template>

                <template v-slot:item.actions="{ item }">
                    <div style="min-width: 150px;">
                        <v-btn @click="editForm(item)" class="ma-1" color="success" variant="elevated" rounded>
                            <v-icon icon="mdi-pencil"></v-icon>
                        </v-btn>
                        <v-btn @click="openDeleteData(item)" class="ma-1" color="red" variant="elevated" rounded>
                            <v-icon icon="mdi-delete"></v-icon>
                        </v-btn>
                    </div>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>


    <FormLoteProducto v-if="component_show.form" :is_compra="props.is_compra" :is_item_lote_producto="item_lote_producto"
        @toLocalUpdateDataTable="localUpdateDataTable" :is_action_form="action_form" />

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
                    <v-btn color="red" variant="elevated" @click="closeDeleteData" class="ma-1">
                        <v-icon icon="mdi-cancel"></v-icon>&nbsp;Cancelar
                    </v-btn>
                    <v-btn color="success" variant="elevated" class="ma-1" @click="confirmDeleteData()">
                        <v-icon icon="mdi-check-circle"></v-icon>&nbsp;Si
                    </v-btn>
                </div>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import FormLoteProducto from '@/components/compra/FormLoteProducto.vue';
import LoteProducto from '@/http/services/LoteProducto';
import { ref, defineProps, defineEmits, onMounted } from 'vue';
import toastify from '@/composables/toastify';
import FormatDateDyl from '@/util/FormatDateDyl';
import { assignObjectNew, assignObjectExists } from '@/util/objectDyl';
import app from '@/config/app';

//props y emits
const props = defineProps(['is_compra']);
const emit = defineEmits(['toHandleComponent']);

//data
const index_data_item = ref(-1);
const dialog_delete = ref(false);
const item_lote_producto = ref({});
const search_data = ref("");
const loading_data_table = ref(null);
const format_date = new FormatDateDyl();
const items_per_page_options = ref([
    { value: 10, title: '10' },
    { value: 25, title: '25' },
    { value: 50, title: '50' },
]);
const columns = ref([
    { title: 'Producto', key: 'producto', value: item => `${item.nombre_producto}, ${item.marca}` },
    { title: 'Producto Imagen', key: 'image_path' },
    { title: 'Codigo', key: 'codigo' },
    { title: 'Fecha de vencimiento', key: 'fecha_vencimiento' },
    { title: 'Peso neto', key: 'peso', value: item => `${item.peso_neto} ${item.unidad_medida_peso_neto}` },
    { title: 'Cantidad', key: 'cantidad' },
    { title: 'Costo unitario', key: 'costo_unitario' },
    { title: 'Deposito', key: 'deposito', value: item => `${item.nombre_deposito}, ${item.ciudad}` },
    { title: 'Acciones', key: 'actions' },
]);
const data = ref([]);
const component_show = ref({
    data_table: false,
    form: false,
});
const action_form = ref("");

//methods
const loadDataTable = () => {
    const lote_producto = new LoteProducto();
    lote_producto.setParameter({ id_compra: props.is_compra.compra.id });

    loading_data_table.value = 'deep-purple-lighten-1';
    setTimeout(async () => {
        const response = await lote_producto.index();
        loading_data_table.value = null;
        if (response.status) {
            data.value = response.records;
        } else {
            toastify('danger', response.message);
        }
    }, 200);

}//loadDataTable

const clear = () => {
    item_lote_producto.value = {};
    index_data_item.value = -1;
}

const openDeleteData = (item) => {
    item_lote_producto.value = assignObjectNew(item);
    index_data_item.value = data.value.indexOf(item);
    dialog_delete.value = true;
}

const closeDeleteData = () => {
    clear();
    dialog_delete.value = false;
}


const confirmDeleteData = async () => {
    const lote_producto = new LoteProducto(assignObjectNew(item_lote_producto.value));

    const response = await lote_producto.destroy();
    if (response.status) {
        data.value.splice(index_data_item.value, 1);
        toastify('success', response.message);
    } else {
        toastify('danger', response.message)
    }
    closeDeleteData();
}

const newForm = () => {
    handleWithComponent("form");
    action_form.value = "new";
    const lote_producto = new LoteProducto();
    item_lote_producto.value = lote_producto.getAttributes();
}

const editForm = (item) => {
    const lote_producto = new LoteProducto();
    lote_producto.setAttributes(item);
    item_lote_producto.value = assignObjectNew(lote_producto.getAttributes());
    index_data_item.value = data.value.indexOf(item);
    handleWithComponent("form");
    action_form.value = "edit";
}

const localUpdateDataTable = (type, item) => {
    switch (type) {
        case 'new':
            //cuando es registro nuevo es carga masiva por lo tanto
            //la variable item es un array de objetos
            item.forEach((obj) => {
                data.value.push(assignObjectNew(obj));
            });
            break;
        case 'edit':
            //cuando es edicion de registro la variable item ya NO es array
            //es solo un objeto
            assignObjectExists(data.value[index_data_item.value], item);
            break;
        default:
            toastify('danger', 'No se puede reconocer la accion al registrar.');
            break;
    }
}

const handleWithComponent = (component) => {
    switch (component) {
        case "data-table":
            component_show.value.data_table = true;
            component_show.value.form = false;
            break;
        case "form":
            component_show.value.data_table = false;
            component_show.value.form = true;
            break;
        default: toastify("warning", "Error en el metodo handleWithComponent.");
            break;
    }//switch
}

onMounted(() => {
    handleWithComponent("data-table");
    loadDataTable();
});

</script>
