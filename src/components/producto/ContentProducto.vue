<template>
    <div class="d-flex">
        <div class="d-flex flex-column">
            <v-tooltip text="Actualizar tablero">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" color="amber-darken-3 " variant="elevated" class="ma-1"
                        @click="loadDataIterator()" icon="mdi-refresh" />
                </template>
            </v-tooltip>
            <v-tooltip text="Nuevo producto">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" color="amber-darken-3 " variant="elevated" class="ma-1" @click="newForm"
                        icon="mdi-plus" />
                </template>
            </v-tooltip>
        </div>

        <div class="flex-grow-1">
            <!-- iterator -->
            <v-card class="as-flex-item as-container-data-iterator animate__animated animate__zoomIn">
                <v-overlay v-model="loading_data_iterator" contained class="d-flex align-center justify-center">
                    <v-progress-circular color="teal-accent-4" indeterminate size="64"></v-progress-circular>
                </v-overlay>

                <v-data-iterator :items="data" :items-per-page="16" :search="search_item"
                    :sort-by="[{ key: 'id', order: 'desc' }]">

                    <template v-slot:header="{ page, pageCount, prevPage, nextPage }">

                        <div class="d-flex justify-space-between flex-wrap pa-2">
                            <v-text-field v-model="search_item" clearable density="comfortable" hide-details
                                placeholder="Buscar Registros" prepend-inner-icon="mdi-magnify" color="teal-accent-4"
                                class="pa-2" style="min-width: 300px;" />

                            <div class="d-flex align-center">
                                <v-tooltip text="Anterior">
                                    <template v-slot:activator="{ props }">
                                        <v-btn v-bind="props" :disabled="page == 1" icon="mdi-arrow-left"
                                            density="comfortable" variant="elevated" color="teal-accent-4"
                                            @click="prevPage"></v-btn>
                                    </template>
                                </v-tooltip>

                                <div class="mx-2 text-caption">
                                    Pagina {{ page }} de {{ pageCount }}
                                </div>

                                <v-tooltip text="Siguiente">
                                    <template v-slot:activator="{ props }">
                                        <v-btn v-bind="props" :disabled="page >= pageCount" icon="mdi-arrow-right"
                                            density="comfortable" variant="elevated" color="teal-accent-4 "
                                            @click="nextPage"></v-btn>
                                    </template>
                                </v-tooltip>
                            </div>
                        </div>

                    </template>

                    <template v-slot:default="{ items }">
                        <div>
                            <v-container class="as__data-iterator" fluid>
                                <v-row justify="center">
                                    <v-col v-for="(item, index) in items" :key="index" cols="auto" md="3">

                                        <v-card class="pa-3" variant="tonal" min-height="200px">
                                            <!-- sdf -->
                                            <v-sheet>
                                                <v-img :src="app.BASE_URL + item.raw.img_producto" height="150" />
                                                <v-table density="compact">
                                                    <tbody>
                                                        <tr>
                                                            <th>Producto:</th>
                                                            <td>{{ item.raw.nombre_producto }}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Marca:</th>
                                                            <td>{{ item.raw.marca }}</td>
                                                        </tr>

                                                        <tr>
                                                            <th>Categoria:</th>
                                                            <td>{{ item.raw.categoria }}</td>
                                                        </tr>

                                                    </tbody>
                                                </v-table>

                                            </v-sheet>

                                            <div class="d-flex justify-end px-4 flex-wrap">
                                                <div>
                                                    <v-tooltip text="Editar registro.">
                                                        <template v-slot:activator="{ props }">
                                                            <v-btn v-bind="props" size="small" icon="mdi-pencil"
                                                                color="teal-accent-4" variant="elevated" class="ma-1"
                                                                @click="editForm(item.raw)" />
                                                        </template>
                                                    </v-tooltip>

                                                    <v-tooltip text="Eliminar registro.">
                                                        <template v-slot:activator="{ props }">
                                                            <v-btn v-bind="props" size="small" icon="mdi-delete" color="red"
                                                                variant="elevated" class="ma-1"
                                                                @click="openDeleteItem(item.raw)" />
                                                        </template>
                                                    </v-tooltip>
                                                </div>
                                            </div>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </div>
                    </template>

                </v-data-iterator>

                <div class="as__data-iterator d-flex justify-center align-center" v-if="data.length == 0">
                    <h1 class="text-h6 text-red">No hay datos.</h1>
                </div>
            </v-card>
            <!-- iterator -->
        </div>

    </div>
    <!-- <FormProducto :p_item_producto="item_producto" 
            @toLocalUpdateDataTable="localUpdateDataTable" @toNewForm="newForm" /> -->

    <v-dialog v-model="dialog_delete" persistent max-width="500px">
        <v-card class="px-5 py-5 animate__animated animate__bounceInDown">
            <v-card-text class="text-center">
                <v-icon icon="mdi-trash-can-outline" size="100" color="red"
                    class="animate__animated animate__infinite animate__bounce"></v-icon>
                <p class="text-h6">
                    ¿Esta seguro(a) de eliminar el registro seleccionado?
                </p>
            </v-card-text>
            <v-card-actions>
                <div class="d-flex justify-center" style="width: 100%;">
                    <v-btn color="red" variant="outlined" @click="closeDeleteItem" class="ma-1">
                        <v-icon icon="mdi-cancel"></v-icon>&nbsp;Cancelar
                    </v-btn>
                    <v-btn color="light-blue-accent-4" variant="outlined" class="ma-1" @click="confirmDeleteItem">
                        <v-icon icon="mdi-check-circle"></v-icon>&nbsp;Si
                    </v-btn>
                </div>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import Producto from '@/http/services/Producto';
import toastify from '@/composables/toastify';
//import FormProducto from '@/components/producto/FormProducto.vue';
import app from '@/config/app';

const loading_data_iterator = ref(false);
const data = ref([]);
const item_producto = ref({});
const index_item = ref(-1);
const search_item = ref("");
const dialog_delete = ref(false);

const loadDataIterator = () => {
    loading_data_iterator.value = true;
    setTimeout(async () => {
        const producto = new Producto();
        const respuesta = await producto.index();
        loading_data_iterator.value = false;
        if (respuesta.status) {
            data.value = respuesta.records;
            search_item.value = "";
        } else {
            toastify('danger', respuesta.message);
        }
    }, 200)
}//loadDataIterator

const clear = () => {
    item_producto.value = {};
    index_item.value = -1;
}

const openDeleteItem = (item) => {
    index_item.value = data.value.indexOf(item);
    //solo pasamos el id porque si nos se muestra en el formulario los datos
    item_producto.value = Object.assign({ id: item.id });
    dialog_delete.value = true;
}

const closeDeleteItem = () => {
    dialog_delete.value = false;
    clear();
}

const confirmDeleteItem = async () => {
    const producto = new Producto();
    producto.setAttributes(Object.assign({}, item_producto.value));
    const response = await producto.destroy();
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
    const producto = new Producto();
    item_producto.value = Object.assign({}, producto.getAttributes());
}

const editForm = (item) => {
    item_producto.value = Object.assign({}, item);
    index_item.value = data.value.indexOf(item);
}

const localUpdateDataTable = (type, item) => {
    switch (type) {
        case 'new':
            data.value.push(Object.assign({}, item));
            break;
        case 'edit':
            Object.assign(data.value[index_item.value], item);
            break;
        default:
            toastify('warning', 'Error en el metodo localUpdateDataTable!');
            break;
    }
}
onMounted(async () => {
    loadDataIterator();
});
</script>

<style  scoped>
/* ========================================
data iterator 
el valor height de as-container-data-iterator es +130 o +100 sobre el valor height de as__data-iterator
ejemplo: as__data-iterator =>height700px entonces as-container-data-iterator  => height:130px+700px;
ejemplo2:as__data-iterator =>height700px entonces as-container-data-iterator => height:100px+700px;
========================================== */

.as-container-data-iterator {
    height: 800px;
}

.as__data-iterator {
    overflow: hidden;
    overflow-y: auto;
    height: 700px;
    border-top: 1px solid #c2c2c2;
    border-bottom: 1px solid #c2c2c2;
}

@media only screen and (max-width: 500px) {
    .as-container-data-iterator {
        height: 820px;
    }
}
</style>