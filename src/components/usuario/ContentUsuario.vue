<template>
    <div class="mt-3 as-flex">
        <!-- iterator -->
        <v-card class="as-flex-item as-container-data-iterator animate__animated animate__zoomIn">
            <v-overlay v-model="loading_data_iterator"  class="align-center justify-center">
                <v-progress-circular color="teal-accent-4" indeterminate size="100"></v-progress-circular>
            </v-overlay>

            <v-data-iterator :items="data" :items-per-page="6" :search="search_item"
                :sort-by="[{ key: 'id', order: 'desc' }]">

                <template v-slot:header="{ page, pageCount, prevPage, nextPage }">

                    <div class="d-flex justify-space-between flex-wrap pa-2">
                        <v-text-field v-model="search_item" clearable density="comfortable" hide-details
                            placeholder="Buscar Registros" prepend-inner-icon="mdi-magnify" color="teal-accent-4"
                            class="pa-2" style="min-width: 300px;" />

                        <div class="d-flex align-center">
                            <v-tooltip text="Anterior">
                                <template v-slot:activator="{ props }">
                                    <v-btn v-bind="props" :disabled="page === 1" icon="mdi-arrow-left" density="comfortable"
                                        variant="elevated" color="teal-accent-4" @click="prevPage"></v-btn>
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
                                <v-col v-for="(item, index) in items" :key="index" cols="auto" md="4">

                                    <v-card class="pa-3" variant="tonal" min-height="200px">
                                        <!-- sdf -->
                                        <v-sheet>
                                            <v-img :src="app.BASE_URL + item.raw.foto_image_path" height="150" />
                                            <div class="d-flex flex-column">
                                                <h2 class="text-h6">{{ item.raw.nombres }} {{ item.raw.apellido_paterno }}
                                                    {{ item.raw.apellido_materno }}</h2>
                                                <v-divider></v-divider>
                                                <p class="my-1 text-medium-emphasis">{{ item.raw.user }}</p>
                                                <v-divider></v-divider>
                                                <p class="my-1 text-medium-emphasis">{{ item.raw.rol_name }}</p>
                                            </div>
                                        </v-sheet>

                                        <!-- dfgdfs -->
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
            <div class="as__data-iterator d-flex justify-center align-center" v-if="data.length == 0" >
                <p>No hay datos disponibles.</p>
            </div>
            <div class="float-end">
                <v-btn color="teal-accent-4 " variant="elevated" class="ma-1" @click="changeDataIterator">
                    <v-icon icon="mdi-refresh" />&nbsp;Actualizar tablero
                </v-btn>
            </div>
        </v-card>
        <!-- iterator -->

        <FormUsuario :is_item_usuario="item_usuario" :is_ciudad="ciudad"
            @toLocalUpdateDataIterator="localUpdateDataIterator" @toNewForm="newForm" />

        <v-dialog v-model="dialog_delete" persistent transition="dialog-bottom-transition" max-width="500px">
            <v-card class="px-5 py-5">
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

    </div>
</template>
  
<script setup>
import { ref, defineExpose } from 'vue';
import Usuario from '@/http/services/Usuario';
import toastify from '@/composables/toastify';
import FormUsuario from '@/components/usuario/FormUsuario.vue';
import app from '@/config/app';
import { assignObjectExists, assignObjectNew } from '@/util/objectDyl';

const loading_data_iterator = ref(false);
const data = ref([]);
const item_usuario = ref({});
const index_item = ref(-1);
const search_item = ref("");
const dialog_delete = ref(false);
const ciudad = ref("");

const changeDataIterator = () => {
    loading_data_iterator.value = true;
    setTimeout(async () => {
        const usuario = new Usuario(ciudad.value);
        const respuesta = await usuario.index();
        loading_data_iterator.value = false;
        if (respuesta.status) {
            data.value = respuesta.records;
            search_item.value = "";
        } else {
            toastify('danger', respuesta.message);
        }
    }, 200)
}//changeDataIterator

const clear = () => {
    item_usuario.value = {};
    index_item.value = -1;
}

const openDeleteItem = (item) => {
    index_item.value = data.value.indexOf(item);
    //solo pasamos el id porque si nos se muestra en el formulario los datos
    // y visualmente no se visualiza bien 
    item_usuario.value = assignObjectNew({ id: item.id });
    dialog_delete.value = true;
}

const closeDeleteItem = () => {
    dialog_delete.value = false;
    clear();
}

const confirmDeleteItem = async () => {
    const usuario = new Usuario();
    usuario.setAttributes(assignObjectNew(item_usuario.value));
    const response = await usuario.destroy();
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
    const usuario = new Usuario();
    item_usuario.value = assignObjectNew(usuario.getAttributes());
}

const editForm = (item) => {
    item_usuario.value = assignObjectNew(item);
    index_item.value = data.value.indexOf(item);
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
            toastify('danger', 'No se puede reconocer la accion al registrar.');
            break;
    }
}
const witchParamsRoute = (item) => {
    ciudad.value = item;
}

defineExpose({
    witchParamsRoute,
    changeDataIterator,
    newForm,
});
</script>


<style scoped>
.as-flex {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    gap: 10px;
}

.as-flex .as-flex-item {
    flex-grow: 1;
    width: 500px;
}


.as-container-data-iterator {
    height: 730px;
}

.as__data-iterator {
    overflow: hidden;
    overflow-y: auto;
    height: 600px;
    border-top: 1px solid #c2c2c2;
    border-bottom: 1px solid #c2c2c2;
}

@media only screen and (max-width: 500px) {
    .as-container-data-iterator {
        height: 760px;
    }
}
</style>