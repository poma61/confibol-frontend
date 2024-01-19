
<template>
    <div class="animate__animated animate__fadeInUpBig">
        <div class="d-flex flex-warp mt-2">

            <v-btn v-bind="props" color="secondary" variant="elevated" class="ma-1"
                @click="emit('toHandleElement', 'compra-data-table', null)" rounded>
                <v-icon icon="mdi-table"></v-icon>&nbsp;principal
            </v-btn>

            <v-btn v-bind="props" color="secondary" variant="elevated" class="ma-1" @click="newForm()" rounded>
                <v-icon icon="mdi-plus"></v-icon>&nbsp;nuevo lote producto
            </v-btn>

            <v-btn v-bind="props" color="secondary" variant="elevated" class="ma-1" @click="clear()" rounded>
                <v-icon icon="mdi-delete-sweep"></v-icon>
            </v-btn>

            <v-btn v-bind="props" color="secondary" variant="elevated" class="ma-1" @click="loadDataTable()" rounded>
                <v-icon icon="mdi-refresh"></v-icon>
            </v-btn>

        </div>
        <v-card class="mt-1 flex-grow-1" elevation="10">

            <v-card-title class="bg-secondary">
                <v-icon icon="mdi-text-box"></v-icon>&nbsp;<span class="text-h6">Kardex</span>
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
                                <th class="text-secondary">Fecha de compra:</th>
                                <td>{{ format_date.dateOnlyFormatter(props.is_compra.compra.fecha_compra) }}</td>
                            </tr>

                            <tr>
                                <th class="text-secondary">Tipo de lote_producto:</th>
                                <td>{{ props.is_compra.documento_compra.tipo_compra }}</td>
                            </tr>

                            <tr>
                                <th class="text-secondary">Nota:</th>
                                <td v-if="props.is_compra.compra.nota == null" class="text-warning">Sin nota!</td>
                                <td v-else>{{ props.is_compra.compra.nota }}</td>
                            </tr>

                        </tbody>
                    </v-table>
                </div>
                <v-text-field v-model="search_data" append-inner-icon="mdi-magnify" clearable label="Buscar Registros..."
                    color="amber-darken-4" />
                <v-data-table class="my-3" :hover="true" :items="data" :headers="columns" :search="search_data"
                    :loading="loading_data_table" :items-per-page-options="items_per_page_options" :show-current-page="true"
                    :fixed-header="true" :height="500" :sort-by="[{ key: 'id', order: 'desc' }]">

                    <template v-slot:loading>
                        <v-skeleton-loader type="table-row@13"></v-skeleton-loader>
                    </template>

                    <template v-slot:item.details="{ item }">
                        <v-btn icon="mdi-text-box" @click="showItem(item)" color="success" class="ma-1" />
                    </template>

                    <template v-slot:item.costo_unitario="{ item }">
                        <v-chip color="orange-darken-4">
                            Bs. {{ item.costo_unitario.toFixed(2) }}
                        </v-chip>
                    </template>

                    <template v-slot:item.detalle="{ item }">
                        <p class="text-warning" v-if="item.detalle == null || item.detalle == ''">Sin detalle!</p>
                        <p v-else>{{ item.detalle }}</p>
                    </template>

                    <template v-slot:item.fecha_vencimiento="{ item }">
                        <v-chip color="success">
                            {{ format_date.dateOnlyFormatter(item.fecha_vencimiento) }}
                        </v-chip>
                    </template>

                    <template v-slot:item.actions="{ item }">
                        <div style="min-width: 150px;">
                            <v-btn @click="editForm(item)" class="ma-1" color="success" variant="elevated"
                                rounded>
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
    </div>

    <v-dialog v-model="dialog_form" persistent max-width="900px" scrollable>
        <FormLoteProducto :is_compra="props.is_compra" :is_item_lote_producto="item_lote_producto" @toCloseForm="closeForm"
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
                    <v-btn color="red" variant="elevated" @click="closeDeleteData" class="ma-1">
                        <v-icon icon="mdi-cancel"></v-icon>&nbsp;Cancelar
                    </v-btn>
                    <v-btn color="deep-purple-lighten-1" variant="elevated" class="ma-1" @click="confirmDeleteData()">
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

//props y emits
const props = defineProps(['is_compra']);
const emit = defineEmits(['toHandleElement']);

//data
const index_data_item = ref(-1);
const dialog_delete = ref(false);
const dialog_form = ref(false);
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
    { title: 'Producto', key: 'nombre_producto' },
    { title: 'Fecha de vencimiento', key: 'fecha_vencimiento' },
    { title: 'Detalle', key: 'detalle' },
    { title: 'Cantidad', key: 'cantidad' },
    { title: 'Costo unitario', key: 'costo_unitario' },
    { title: 'Deposito', key: 'nombre_deposito' },
    { title: 'Acciones', key: 'actions' },
]);
const data = ref([]);
//methods

const loadDataTable = () => {
    const lote_producto = new LoteProducto();
    lote_producto.setParameter({id_compra: props.is_compra.compra.id});

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
    item_lote_producto.value = Object.assign({}, item);
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
    const lote_producto = new LoteProducto(Object.assign({}, item_lote_producto.value));

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
    const lote_producto = new LoteProducto();
    item_lote_producto.value = Object.assign({}, lote_producto.getAttributes());
    dialog_form.value = true;
}

const editForm = (item) => {
    const lote_producto = new LoteProducto();
    lote_producto.setAttributes(item);
    item_lote_producto.value = Object.assign({}, lote_producto.getAttributes());
    index_data_item.value = data.value.indexOf(item);
    dialog_form.value = true;
}

const localUpdateDataTable = (type, item) => {
    switch (type) {
        case 'new':
            data.value.push(Object.assign({}, item));
            break;
        case 'edit':
            Object.assign(data.value[index_data_item.value], item);
            break;
        default:
            toastify('danger', 'No se puede reconocer la accion al registrar.');
            break;
    }
}

onMounted(() => {
    loadDataTable();
});

</script>
