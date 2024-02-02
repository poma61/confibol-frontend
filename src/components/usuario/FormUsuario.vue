<template>
    <v-card class="as-flex-item animate__animated animate__zoomIn">
        <v-card-title class="bg-light-blue-accent-4">
            <span class="text-h6">Registrar Usuario</span>
        </v-card-title>
        <v-card-text class="pa-3">
            <p class="text-warning text-subtitle-1">Los campos marcados con (*) son obligatorios.</p>
            <v-form>
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="item_usuario.user" label="Usuario (*)" color="light-blue-accent-4" clearable
                            :error-messages="showFieldsErrors('user')" variant="underlined" />
                    </v-col>

                    <v-col cols="12">
                        <v-text-field v-model="item_usuario.password" label="Contraseña (*)" color="light-blue-accent-4"
                            clearable :error-messages="showFieldsErrors('password')" variant="underlined"
                            :append-inner-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show_password ? 'text' : 'password'" autocomplete="off"
                            @click:append-inner="show_password = !show_password" />
                    </v-col>

                    <v-col cols="12">
                        <v-autocomplete label="Rol (*)" v-model="item_usuario.id_role" :items="list_role" item-value="id"
                            item-title="text" color="light-blue-accent-4" clearable
                            :error-messages="showFieldsErrors('id_role')">
                            <template v-slot:item="{ props, item }">
                                <v-list-item v-bind="props" :title="item.raw.text"></v-list-item>
                            </template>
                        </v-autocomplete>
                    </v-col>

                    <v-col cols="12">
                        <v-text-field color="light-blue-accent-4" label="Personal (*)" readonly v-model="nombreCompleto"
                            :error-messages="showFieldsErrors('id_personal')" />
                    </v-col>

                    <v-col cols="12">
                        <v-text-field label="Buscar Personal" color="light-blue-accent-4" @keyup.enter="searchPersonal()"
                            prepend-inner-icon="mdi-magnify" placeholder="C.I. del personal (Solo numero)."
                            v-model="ci" :loading="change_search_personal">
                            <template v-slot:append>
                                <v-btn icon="mdi-magnify" color="orange-darken-3" @click="searchPersonal"
                                    variant="elevated" />
                            </template>
                        </v-text-field>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" variant="elevated" @click="clear">
                <v-icon icon="mdi-delete-sweep"></v-icon>&nbsp;
            </v-btn>
            <v-btn color="light-blue-accent-4" variant="elevated" @click="save" :loading="loading_btn">
                <v-icon icon="mdi-content-save"></v-icon>&nbsp;Guardar
            </v-btn>
        </v-card-actions>
        <v-overlay v-model="loading_list_role" class="d-flex align-center justify-center" contained persistent>
            <div class="text-center">
                <v-progress-circular color="light-blue-accent-4" indeterminate size="100"></v-progress-circular>
                <p class="text-h6 text-white">Cargando modulos necesarios...</p>
            </div>
        </v-overlay>

    </v-card>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, watch, onMounted } from 'vue';
import toastify from '@/composables/toastify';
import Personal from '@/http/services/Personal';
import Usuario from '@/http/services/Usuario';
import Role from '@/http/services/Role';

const props = defineProps(['is_item_usuario', 'is_ciudad']);
const emit = defineEmits(['toLocalUpdateDataIterator', 'toNewForm']);
const fields_errors = ref({});
const item_usuario = ref(props.is_item_usuario);
const loading_btn = ref(false);
const src_image = ref("");
const change_search_personal = ref(false);
const ci = ref("");
const show_password = ref(false);
const list_role = ref([]);
const loading_list_role = ref(false);

//cuando se ejecuta toNewForm en el componente padre
//entonces los valores de is_item_usuario cambian y debemos actualizar esos mismos valores aca 
watch(() => props.is_item_usuario, () => {
    item_usuario.value = props.is_item_usuario;
    fields_errors.value = {};
});

const showFieldsErrors = computed(() => {
    return function (field) {
        if (fields_errors.value[field]) {
            return fields_errors.value[field][0];
        }
        return "";
    }
});

const nombreCompleto = computed(() => {
    if (item_usuario.value.nombres != undefined && item_usuario.value.apellido_paterno != undefined && item_usuario.value.apellido_materno != undefined) {
        return `${item_usuario.value.nombres} ${item_usuario.value.apellido_paterno} ${item_usuario.value.apellido_materno}`
    } else {
        return "";
    }
});

const clear = () => {
    fields_errors.value = {};
    src_image.value = "";
    emit('toNewForm');
}

const initListRole = () => {
    loading_list_role.value = true;
    setTimeout(async () => {
        const role = new Role();
        const response = await role.list();
        loading_list_role.value = false;
        if (response.status) {
            const list = response.records;
            list_role.value = list.map(item => ({
                text: item.rol_name,
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
        const usuario = new Usuario(props.is_ciudad, Object.assign({}, item_usuario.value));
        if (usuario.getAttributes().id > 0) {
            //cuando es update
            const response = await usuario.update();
            loading_btn.value = false;
            if (response.status) {
                toastify('success', response.message);
                emit('toLocalUpdateDataIterator', 'edit', response.record)
                emit('toNewForm');
                clear();
            } else {
                if (response.validation_errors != undefined) {
                    fields_errors.value = Object.assign({}, response.validation_errors);
                }
                toastify('danger', response.message);
            }
        } else {
            //cuando es store o nuevo registro
            const response = await usuario.store();
            loading_btn.value = false;
            if (response.status) {
                toastify('success', response.message);
                emit('toLocalUpdateDataIterator', 'new', response.record);
                emit('toNewForm');
                clear();
            } else {
                if (response.validation_errors != undefined) {
                    fields_errors.value = Object.assign({}, response.validation_errors);
                }
                toastify('danger', response.message);
            }
        }
    }, 200);
}

const searchPersonal = () => {
    const personal = new Personal(props.is_ciudad, { ci: ci.value });
    change_search_personal.value = true;
    setTimeout(async () => {
        const response = await personal.recordByCIPersonal();
        change_search_personal.value = false;
        if (response.status) {
            item_usuario.value.nombres = response.record.nombres;
            item_usuario.value.apellido_paterno = response.record.apellido_paterno;
            item_usuario.value.apellido_materno = response.record.apellido_materno;
            item_usuario.value.id_personal = response.record.id;
            toastify('success', response.message);
        } else {
            toastify('danger', response.message);
        }
        ci.value = "";
    }, 200);
}

onMounted(() => {
    initListRole();
});
</script> 
