<template>
    <div v-if="component_show.compra_data_table" class="animate__animated animate__fadeInUpBig">
        <div class="d-flex flex-wrap mt-2">
            <v-btn color="deep-purple-lighten-1" variant="elevated" class="ma-1" @click="loadDataTable()" rounded>
                <v-icon icon="mdi-refresh"></v-icon>&nbsp;Actualizar
            </v-btn>

            <v-btn color="deep-purple-lighten-1" variant="elevated" class="ma-1" @click="newForm()" rounded>
                <v-icon icon="mdi-plus"></v-icon>&nbsp;Nuevo registro
            </v-btn>
        </div>

        <v-card class="my-2 flex-grow-1">
            <v-card-text>
                <v-text-field v-model="search_data" append-inner-icon="mdi-magnify" clearable label="Buscar Registros..."
                    color="deep-purple-lighten-1" />
                <v-data-table :hover="true" :items="data" :headers="columns" :search="search_data"
                    :loading="loading_data_table" :items-per-page-options="items_per_page_options" :show-current-page="true"
                    :fixed-header="true" :height="550" :sort-by="[{ key: 'id', order: 'desc' }]">

                    <template v-slot:loading>
                        <v-skeleton-loader type="table-row@13"></v-skeleton-loader>
                    </template>

                    <template v-slot:item.fecha_compra="{ item }">
                        <v-chip color="secondary">
                            {{ format_date.dateOnlyFormatter(item.fecha_compra) }}
                        </v-chip>
                    </template>

                    <template v-slot:item.add_product_lote="{ item }">
                        <v-btn @click="handleComponent('lote-producto', item)" class="ma-1" color="cyan-darken-1"
                            variant="elevated" rounded>
                            <v-icon icon="mdi-text-box-plus"></v-icon>
                        </v-btn>
                    </template>

                    <template v-slot:item.nota="{ item }">
                        <p class="text-warning" v-if="item.nota == null">Sin nota!</p>
                        <p v-else> {{ item.nota }}</p>
                    </template>

                    <template v-slot:item.actions="{ item }">
                        <div style="min-width: 150px;">
                            <v-btn @click="editForm(item)" class="ma-1" color="deep-purple-lighten-1" variant="elevated"
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

    <ContentProductoLote v-if="component_show.lote_producto" :is_compra="item_compra" @toHandleComponent="handleComponent" />

    <v-dialog v-model="dialog_form" persistent max-width="900px" scrollable>
        <FormDeposito :is_ciudad="ciudad" :is_item_compra="item_compra" @toCloseForm="closeForm"
            @toLocalUpdateDataTable="localUpdateDataTable" @toHandleComponent="handleComponent" />
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
import FormDeposito from '@/components/compra/FormCompra.vue';
import Compra from '@/http/services/Compra';
import { ref, defineExpose } from 'vue';
import toastify from '@/composables/toastify';
import FormatDateDyl from '@/util/FormatDateDyl';
import ContentProductoLote from '@/components/compra/ContentProductoLote.vue';

//data
const index_data_item = ref(-1);
const dialog_delete = ref(false);
const dialog_form = ref(false);
const item_compra = ref({});
const search_data = ref("");
const loading_data_table = ref(null);
const ciudad = ref("");
const format_date = new FormatDateDyl();
const component_show = ref({
    compra_data_table: false,
    lote_producto: false,
})

const items_per_page_options = ref([
    { value: 10, title: '10' },
    { value: 25, title: '25' },
    { value: 50, title: '50' },
]);

const columns = ref([
    { title: 'Fecha de compra', key: 'fecha_compra' },
    { title: 'Tipo de compra', key: 'tipo_compra' },
    { title: 'Nota', key: 'nota' },
    { title: 'Producto lote', key: 'add_product_lote' },
    { title: 'Acciones', key: 'actions' },
]);
const data = ref([]);
//methods

const loadDataTable = () => {
    handleComponent("compra-data-table", null);
    const compra = new Compra(ciudad.value);
    loading_data_table.value = 'deep-purple-lighten-1';
    setTimeout(async () => {
        const response = await compra.index();
        loading_data_table.value = null;
        if (response.status) {
            data.value = response.records;
        } else {
            toastify('danger', response.message);
        }
    }, 200);

}//loadDataTable

const clear = () => {
    item_compra.value = {};
    index_data_item.value = -1;
}

const openDeleteData = (item) => {
    item_compra.value = {
        compra: {
            id: item.id,
            nota: item.nota,
            fecha_compra: item.fecha_compra,
        }, 
        documento_compra: {
            tipo_compra: item.tipo_compra,
            recibo: item.recibo,
            factura_nacional: item.factura_nacional,
            lista_empaque: item.lista_empaque,
            poliza: item.poliza,
            factura_importacion: item.factura_importacion,
            id_compra: item.id_compra,
        },
    };
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
    const compra = new Compra(ciudad.value);
    compra.setAttributes(item_compra.value);

    const response = await compra.destroy();
    if (response.status) {
        data.value.splice(index_data_item.value, 1);
        toastify('success', response.message);
    } else {
        toastify('danger', response.message)
    }
    closeDeleteData();
}

const newForm = () => {
    const compra = new Compra();
    item_compra.value = Object.assign({}, compra.getAttributes());
    dialog_form.value = true;
}

const editForm = (item) => {
    const compra = new Compra();
    compra.setAttributes({
        compra: {
            id: item.id,
            nota: item.nota,
            fecha_compra: item.fecha_compra,
        },
        documento_compra: {
            tipo_compra: item.tipo_compra,
            recibo: item.recibo,
            factura_nacional: item.factura_nacional,
            lista_empaque: item.lista_empaque,
            poliza: item.poliza,
            factura_importacion: item.factura_importacion,
            id_compra: item.id_compra,
        },
    });

    item_compra.value = Object.assign({}, compra.getAttributes());
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
            toastify('danger', 'Error en el metodo localUpdateDataTable.');
            break;
    }
}

const witchParamsRoute = (item) => {
    ciudad.value = item;
}

const handleComponent = (element, item) => {
    switch (element) {
        case "compra-data-table":
            component_show.value.compra_data_table = true;
            component_show.value.lote_producto = false;
            break;
        case "lote-producto":
            item_compra.value = {
                compra: {
                    id: item.id,
                    nota: item.nota,
                    fecha_compra: item.fecha_compra,
                },
                documento_compra: {
                    tipo_compra: item.tipo_compra,
                    recibo: item.recibo,
                    factura_nacional: item.factura_nacional,
                    lista_empaque: item.lista_empaque,
                    poliza: item.poliza,
                    factura_importacion: item.factura_importacion,
                    id_compra: item.id_compra,
                },
            }
            component_show.value.compra_data_table = false;
            component_show.value.lote_producto = true;
            break;
        default: toastify("warning", "Error en el metodo handleComponent.");
            break;
    }//switch
}

//mantenemos visible la funcion 
defineExpose({
    loadDataTable,
    witchParamsRoute,
});

</script>
