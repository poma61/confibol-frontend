<template>

    <div class="d-flex">
        <div class="d-flex flex-column animate__animated animate__bounceInLeft">
            <v-tooltip text="Actualizar tablero">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" color="light-blue-accent-4" variant="elevated" class="ma-1"
                        @click="loadDataIterator()" icon="mdi-refresh" :disabled="component_show.form" />
                </template>
            </v-tooltip>
            <v-tooltip text="Tablero">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" color="light-blue-accent-4" variant="elevated" class="ma-1"
                        @click="handleComponent('data-iterator')" icon="mdi-table-large" />
                </template>
            </v-tooltip>
            <v-tooltip text="Nuevo producto">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" color="light-blue-accent-4 " variant="elevated" class="ma-1" @click="newForm"
                        icon="mdi-plus" />
                </template>
            </v-tooltip>
        </div>

        <div class="flex-grow-1">
            <!-- iterator -->
            <v-card v-if="component_show.data_iterator"
                class="as-container-data-iterator animate__animated animate__zoomIn" elevation="20">

       
                    <v-overlay v-model="loading_data_iterator" class="align-center justify-center" persistent >
                        <div class="text-center">
                            <v-progress-circular color="light-blue-accent-4" indeterminate
                                size="100"></v-progress-circular>
                            <p class="text-white text-h6">Cargando datos...</p>
                        </div>
                    </v-overlay>
        
                <v-data-iterator :items="data" :items-per-page="16" :search="search_item"
                    :sort-by="[{ key: 'id', order: 'desc' }]">

                    <template v-slot:header>
                        <v-text-field v-model="search_item" clearable density="comfortable" hide-details
                            placeholder="Buscar Registros" prepend-inner-icon="mdi-magnify" color="teal-accent-4"
                            class="pa-2" />
                    </template>

                    <template v-slot:default="{ items }">
                        <div>
                            <v-container class="as__data-iterator" fluid>
                                <v-row justify="center">
                                    <v-col v-for="(item, index) in items" :key="index" cols="auto" md="3">

                                        <v-card class="pa-3" variant="tonal" min-height="200px">
                                            <!-- sdf -->
                                            <v-sheet>
                                                <v-img :src="app.BASE_URL + item.raw.image_path" height="150" />
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
                                                                color="green-darken-1" variant="elevated" class="ma-1"
                                                                @click="editForm(item.raw)" />
                                                        </template>
                                                    </v-tooltip>

                                                    <v-tooltip text="Eliminar registro.">
                                                        <template v-slot:activator="{ props }">
                                                            <v-btn v-bind="props" size="small" icon="mdi-delete"
                                                                color="red" variant="elevated" class="ma-1"
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

                    <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
                        <div class="d-flex align-center justify-end pa-2">
                            <v-btn :disabled="page == 1" icon="mdi-arrow-left" density="comfortable" variant="elevated"
                                @click="prevPage" color="light-blue-accent-4" />

                            <div class="mx-2 text-caption">
                                Página {{ page }} de {{ pageCount }}
                            </div>
                            <v-btn :disabled="page >= pageCount" icon="mdi-arrow-right" density="comfortable"
                                variant="elevated" @click="nextPage" color="light-blue-accent-4" />
                        </div>
                    </template>

                </v-data-iterator>

                <div class="as__data-iterator d-flex justify-center align-center" v-if="data.length == 0">
                    <p>No hay datos disponibles.</p>
                </div>
            </v-card>
            <!-- iterator -->

            <FormProducto v-if="component_show.form" :is_item_producto="item_producto"
                @toLocalUpdateDataIterator="localUpdateDataIterator" @toNewForm="newForm" />
        </div>

    </div>
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
                    <v-btn color="red" variant="elevated" @click="closeDeleteItem" class="ma-1">
                        <v-icon icon="mdi-cancel"></v-icon>&nbsp;Cancelar
                    </v-btn>
                    <v-btn color="light-blue-accent-4" variant="elevated" class="ma-1" @click="confirmDeleteItem">
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
import FormProducto from '@/components/producto/FormProducto.vue';
import app from '@/config/app';
import { assignObjectExists, assignObjectNew } from '@/util/objectDyl';

const activator = ref(null);

const loading_data_iterator = ref(false);
const data = ref([]);
const item_producto = ref({});
const index_item = ref(-1);
const search_item = ref("");
const dialog_delete = ref(false);
const component_show = ref({
    data_iterator: false,
    form: false,
});

const loadDataIterator = async () => {
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
    item_producto.value = assignObjectNew(item);
    dialog_delete.value = true;
}

const closeDeleteItem = () => {
    dialog_delete.value = false;
    clear();
}

const confirmDeleteItem = async () => {
    const producto = new Producto();
    producto.setAttributes(assignObjectNew(item_producto.value));
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
    item_producto.value = assignObjectNew(producto.getAttributes());
    handleComponent('form');
}

const editForm = (item) => {
    clear();
    item_producto.value = assignObjectNew(item);
    index_item.value = data.value.indexOf(item);
    handleComponent('form');
}

const localUpdateDataIterator = (type, item) => {
    switch (type) {
        case 'new':
            data.value.push(assignObjectNew(item));
            break;
        case 'edit':
            assignObjectExists(data.value[index_item.value], item);
            break;
        default:
            toastify('warning', 'Error en el metodo localUpdateDataIterator!');
            break;
    }
}

const handleComponent = (component) => {
    switch (component) {
        case "data-iterator":
            component_show.value.data_iterator = true;
            component_show.value.form = false;
            break;
        case "form":
            component_show.value.data_iterator = false;
            component_show.value.form = true;
            break;
        default: toastify("warning", "Error en el metodo handleComponent.");
            break;
    }//switch
}

onMounted(async () => {
    loadDataIterator();
    handleComponent('data-iterator');
});

</script>

<style scoped>
/* ========================================
data iterator 
el valor height de as-container-data-iterator es +130 o +100 sobre el valor height de as__data-iterator
ejemplo: as__data-iterator =>height700px entonces as-container-data-iterator  => height:130px+700px;
ejemplo2:as__data-iterator =>height700px entonces as-container-data-iterator => height:100px+700px;
========================================== */

.as-container-data-iterator {
    height: 830px;
}

.as__data-iterator {
    overflow: auto;
    height: 700px;
    border-top: 1px solid #c2c2c2;
    border-bottom: 1px solid #c2c2c2;
}
</style>