<template>
    <v-card class="animate__animated animate__flipInX" elevation="24">
        <v-card-title class="bg-light-blue-darken-3">
            <v-icon icon="mdi-account-group"></v-icon>&nbsp;<span class="text-h6">Registrar cliente</span>
        </v-card-title>
        <v-card-text class="pa-3">
            <p class="text-warning text-subtitle-1">Los campos marcados con (*) son obligatorios.</p>
            <v-row>
                <!-- sm => es cuando en modo responsivo se aplica desde 600px aproximadamente-->
                <!-- md=> es cuando en modo responsivo se aplica desde 800px aproximadamente   -->
                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_cliente.nombres" label="Nombres (*)" color="light-blue-darken-3" clearable
                        :error-messages="showFieldsErrors('nombres')" />
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_cliente.apellido_paterno" label="Apellido paterno (*)"
                        color="light-blue-darken-3" clearable :error-messages="showFieldsErrors('apellido_paterno')" />
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_cliente.apellido_materno" label="Apellido materno (*)"
                        color="light-blue-darken-3" clearable :error-messages="showFieldsErrors('apellido_materno')" />
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_cliente.n_de_contacto" label="N° de contacto (*)"
                        color="light-blue-darken-3" clearable :error-messages="showFieldsErrors('n_de_contacto')" />
                </v-col>

                <v-col cols="12" sm="6">
                    <v-autocomplete label="Grupo (*)" v-model="item_cliente.id_grupo" :items="list_grupo" item-value="id"
                        item-title="text" color="primary" clearable :error-messages="showFieldsErrors('id_grupo')">
                        <template v-slot:item="{ props, item }">
                            <v-list-item v-bind="props" :title="item.raw.text"></v-list-item>
                        </template>
                    </v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_cliente.correo_electronico" label="Correo electronico (*)"
                        color="light-blue-darken-3" clearable :error-messages="showFieldsErrors('correo_electronico')" />
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_cliente.ci" label="C.I. (*)" color="light-blue-darken-3" clearable
                        :error-messages="showFieldsErrors('ci')" />
                </v-col>

                <v-col cols="12" sm="6">
                    <v-autocomplete :items="['SC', 'CH', 'CB', 'PT', 'BN', 'LP', 'PA', 'TJ', 'OR', 'SinExp']"
                        v-model="item_cliente.ci_expedido" label="Expedido (*)" color="light-blue-darken-3" clearable
                        :error-messages="showFieldsErrors('ci_expedido')" />
                </v-col>

                <v-col cols="12" sm="6">
                    <v-textarea v-model="item_cliente.direccion" label="Direccion (*)" color="light-blue-darken-3" clearable
                        :error-messages="showFieldsErrors('direccion')" rows="3" />
                </v-col>

                <v-col cols="12" sm="6">
                    <v-textarea v-model="item_cliente.descripcion" label="Descripcion (*)" color="light-blue-darken-3"
                        clearable :error-messages="showFieldsErrors('descripcion')" rows="3" />
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" variant="tonal" @click="emit('toCloseForm')">
                <v-icon icon="mdi-cancel"></v-icon>&nbsp;Cancelar
            </v-btn>
            <v-btn color="light-blue-darken-3" variant="tonal" @click="save()" :loading="loading_btn">
                <v-icon icon="mdi-content-save"></v-icon>&nbsp;Guardar
            </v-btn>
        </v-card-actions>
    </v-card>
    <v-overlay v-model="loading_list_grupo" class="d-flex align-center justify-center" persistent>
        <div class="text-center">
            <v-progress-circular color="yellow-darken-3" indeterminate size="100"></v-progress-circular>
            <p class="text-h6 text-white">Cargando modulos necesarios...</p>
        </div>
    </v-overlay>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, onMounted } from 'vue';
import Cliente from '@/http/services/Cliente';
import Grupo from '@/http/services/Grupo';
import toastify from '@/composables/toastify';
import { assignObjectNew } from '@/util/objectDyl';


//etmis y props
const props = defineProps(['is_item_cliente', 'is_ciudad']);
const emit = defineEmits(['toCloseForm', 'toLocalUpdateDataTable']);

//data
const fields_errors = ref({});
const item_cliente = ref(props.is_item_cliente);
const loading_btn = ref(false);
const list_grupo = ref([]);
const loading_list_grupo = ref(false);

const showFieldsErrors = computed(() => {
    return function (field) {
        if (fields_errors.value[field]) {
            return fields_errors.value[field][0];
        }
        return "";
    }
});

const initListGrupo = () => {
    loading_list_grupo.value = true;
    setTimeout(async () => {
        const grupo = new Grupo(props.is_ciudad);
        const response = await grupo.list();
        loading_list_grupo.value = false;
        if (response.status) {
            const list = response.records;
            list_grupo.value = list.map(item => ({
                text: item.nombre_grupo,
                id: item.id
            }));
        } else {
            toastify('danger', response.message);
        }
    }, 200);
}

const save = () => {
    loading_btn.value = true;
    setTimeout(async () => {
        const cliente = new Cliente(props.is_ciudad, assignObjectNew(item_cliente.value));
        if (cliente.getAttributes().id > 0) {
            //cuando es update
            const response = await cliente.update();
            loading_btn.value = false;
            if (response.status) {
                toastify('success', response.message);
                emit('toLocalUpdateDataTable', 'edit', response.record);
                emit('toCloseForm');
            } else {
                if (response.validation_errors != undefined) {
                    fields_errors.value = assignObjectNew(response.validation_errors);
                }
                toastify('danger', response.message);
            }
        } else {
            //cuando es create
            const response = await cliente.store();
            loading_btn.value = false;
            if (response.status) {
                toastify('success', response.message);
                emit('toLocalUpdateDataTable', 'new', response.record);
                emit('toCloseForm');
            } else {
                if (response.validation_errors != undefined) {
                    fields_errors.value = assignObjectNew(response.validation_errors);
                }
                toastify('danger', response.message);
            }
        }
    }, 200);
}//save

onMounted(() => {
    initListGrupo();
})
</script> 


