<template>
    <OverlayLayer v-show="value">
        <CardBox v-show="value" title="รายละเอียดยอดรับวันนี้"
            class="shadow-lg w-full  overflow-y-auto md:w-3/5 lg:w-1/1 z-50" header-icon="close" modal form
            @submit.prevent="" @header-icon-click="cancel">
            <div class="">
                <CardBox v-if="items.sendToday != null" title="รายการยอดส่ง" class="shadow-lg mb-3" has-table
                    headerIcon="">
                    <div class="overflow-x-auto">
                        <table>
                            <thead>
                                <tr>
                                    <th>วงแชร์</th>
                                    <th>ประเภท</th>
                                    <th>งวดที่</th>
                                    <th>ค่าดูแล</th>
                                    <th>ยอดส่ง</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="text-center" v-for="detail in items.sendToday" :key="detail.id">
                                    <td data-label="วงแชร์" >{{ detail.groupName }}</td>
                                    <td data-label="ประเภท">
                                        {{detail.type}}
                                    </td>
                                    <td data-label="งวดที่" >{{ detail.periodSend }}</td>
                                    <td data-label="ค่าดูแล" >{{ detail.careFree }}</td>
                                    <td data-label="ยอดส่ง" >{{ detail.amount }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-gray-800" />
                </CardBox>

                <CardBox v-if="items.debtToDay != null" title="รายการยอดค้าง" class="shadow-lg mb-3" has-table
                    headerIcon="">
                    <div class="overflow-x-auto">
                        <table>
                            <thead>
                                <tr>
                                    <th>วงแชร์</th>
                                    <th>ประเภท</th>
                                    <th>จำนวนงวดที่ค้าง</th>
                                    <th>ยอดค้าง</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="text-center" v-for="detail in items.debtToDay" :key="detail.id">
                                    <td data-label="วงแชร์" >{{ detail.groupName }}</td>
                                    <td data-label="ประเภท">
                                        {{detail.type}}
                                    </td>
                                    <td data-label="จำนวนงวดที่ค้าง" >{{ detail.numPeriod }}</td>
                                    <td data-label="ยอดค้าง" >{{ sumAmountDebtToDay(detail)}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-gray-800" />
                </CardBox>

            </div>
            <BaseDivider />

            <BaseButtons type="justify-center">
                <BaseButton :label="buttonLabel" color="success" type="submit" icon="checkCircleOutline" />
                <BaseButton v-if="hasCancel" label="ยกเลิก" color="danger" icon="close" @click="cancel" />
            </BaseButtons>
        </CardBox>
    </OverlayLayer>
</template>
  
<script >
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import CardBox from '@/components/CardBox.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import OverlayLayer from '@/components/OverlayLayer.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import ToDaysService from '@/services/todays'
import TableGroupDetail from '@/components/TableGroupDetail.vue'

export default {
    data() {
        return {
            items: [],
            perPage: 10,
            currentPage: 0,
        }
    },
    created() {
    },
    methods: {
        async getToDayAmountReceives() {
            let loader = this.$loading.show();
            const resp = await ToDaysService.getToDayAmountReceiveDetail(this.idModalDetail);
            if (resp.data) {
                this.items = resp.data.data
                console.log("getToDayAmountReceive receiveToday : ", this.items.receiveToday);
                console.log("getToDayAmountReceive sendToday : ", this.items.sendToday);
                console.log("getToDayAmountReceive debtToDay : ", this.items.debtToDay);
            }
            loader.hide()
        },
        confirmCancel(mode) {
            this.value = false
            this.$emit(mode)
        },
        confirm() {
            this.confirmCancel('confirm')
        },
        cancel() {
            this.confirmCancel('cancel')
        },
        formatCurrency(amt) {
            return numeral(amt).format(0, 0)
        },
        sumAmountDebtToDay(items){
            const sumAomunt = (items.amountSend + items.careFree + items.fine) - items.paid;
            return sumAomunt
        }
    },
    watch: {
        idModalDetail: function (n, o) {
            if (n) {
                this.getToDayAmountReceives()
            }
        }
    },
    emits: ['update:modelValue', 'cancel', 'confirm'],
    computed: {
        value: {
            get() {
                return this.modelValue
            },
            set(newValue) {
                this.$emit('update:modelValue', newValue)
            }
        },
        itemsPaginated() {
            return this.items ? this.items.slice(this.perPage * this.currentPage, this.perPage * (this.currentPage + 1)) : []
        },
        numPages() {
            return Math.ceil((this.items ? this.items.length : 0) / this.perPage);
        },
        currentPageHuman() {
            return this.currentPage + 1
        },
        pagesList() {
            const pagesList = []

            for (let i = 0; i < this.numPages; i++) {
                pagesList.push(i)
            }
            return pagesList
        }
    },

    components: {
        BaseButton,
        BaseButtons,
        CardBox,
        BaseDivider,
        OverlayLayer,
        FormField,
        FormControl
    },
    props: {
        title: {
            type: String,
            default: null
        },
        largeTitle: {
            type: String,
            default: null
        },
        button: {
            type: String,
            default: 'info'
        },
        buttonLabel: {
            type: String,
            default: 'Done'
        },
        hasCancel: Boolean,
        modelValue: {
            type: [String, Number, Boolean],
            default: null
        },
        idModalDetail: {
            type: Number,
            default: null
        }
    }
}

</script>
  
  
  