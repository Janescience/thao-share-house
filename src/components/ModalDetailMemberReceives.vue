<template>
    <OverlayLayer v-show="value">
        <CardBox v-show="value" title="รายละเอียดยอดรับวันนี้"
            class="shadow-lg w-full  overflow-y-auto md:w-3/5 lg:w-1/1 z-50" header-icon="close" modal form
            @submit.prevent="" @header-icon-click="cancel">
            <div class="">
                <CardBox v-if="items.receiveToday != null" title="รายการยอดรับ" class="shadow-lg mb-3" has-table
                    headerIcon="">
                    <div class="overflow-x-auto">
                        <table>
                            <thead>
                                <tr>
                                    <th class="text-center">วงแชร์</th>
                                    <th class="text-center">ประเภท</th>
                                    <th class="text-center">งวดที่</th>
                                    <th class="text-center">ยอดรับ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="text-center" v-for="detail in items.receiveToday" :key="detail.id">
                                    <td data-label="วงแชร์">{{ detail.groupName }}</td>
                                    <td data-label="ประเภท">
                                        {{getType(detail.type)}}
                                    </td>
                                    <td data-label="งวดที่" class="text-right">{{ detail.periodReceive }}</td>
                                    <td data-label="ยอดรับ" class="text-right">{{ formatCurrency(detail.amount) }}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3">ยอดรวม</td>
                                    <td class="text-right" data-label="รวมยอดรับ"> <b class="">{{formatCurrency(sumAmountReceiveToDay().sumAmountReceive)}}</b>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-gray-800" />
                </CardBox>
                <CardBox v-if="items.sendToday != null" title="รายการยอดส่ง" class="shadow-lg mb-3" has-table
                    headerIcon="">
                    <div class="overflow-x-auto">
                        <table>
                            <thead>
                                <tr>
                                    <th class="text-center">วงแชร์</th>
                                    <th class="text-center">ประเภท</th>
                                    <th class="text-center">งวดที่</th>
                                    <th class="text-center">ค่าดูแล</th>
                                    <th class="text-center">ยอดส่ง</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="text-center" v-for="detail in items.sendToday" :key="detail.id">
                                    <td data-label="วงแชร์">{{ detail.groupName }}</td>
                                    <td data-label="ประเภท">
                                        {{getType(detail.type)}}
                                    </td>
                                    <td data-label="งวดที่" class="text-right">{{ detail.periodSend }}</td>
                                    <td data-label="ค่าดูแล" class="text-right">{{ formatCurrency(detail.careFree )}}</td>
                                    <td data-label="ยอดส่ง" class="text-right">{{ formatCurrency(detail.amount )}}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3">ยอดรวม</td>
                                    <td class="text-right" data-label="รวมยอดส่ง"> <b class="">{{formatCurrency(sumAmountSendToDay().sumAmountCare)}}</b>
                                    </td>
                                    <td class="text-right" data-label="รวมยอดส่ง"> <b class="">{{formatCurrency(sumAmountSendToDay().sumAmountSend)}}</b>
                                    </td>
                                </tr>
                            </tfoot>
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
                                    <th class="text-center">วงแชร์</th>
                                    <th class="text-center">ประเภท</th>
                                    <th class="text-center">จำนวนงวดที่ค้าง</th>
                                    <th class="text-center">ยอดค้าง</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="text-center" v-for="detail in items.debtToDay" :key="detail.id">
                                    <td data-label="วงแชร์">{{ detail.groupName }}</td>
                                    <td data-label="ประเภท">
                                        {{getType(detail.type)}}
                                    </td>
                                    <td data-label="จำนวนงวดที่ค้าง" class="text-right">{{ detail.numPeriod }}</td>
                                    <td data-label="ยอดค้าง" class="text-right">{{ formatCurrency((detail.amountSend + detail.careFree + detail.fine) - detail.paid)}}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3">ยอดรวม</td>
                                    <td class="text-right" data-label="รวมยอดค้าง"> <b class="">{{formatCurrency(sumAmountDebtToDay().sumAmountDebt)}}</b>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-gray-800" />
                </CardBox>

            </div>
            <BaseDivider />

            <!-- <BaseButtons type="justify-center">
                <BaseButton :label="buttonLabel" color="success" type="submit" icon="checkCircleOutline" />
                <BaseButton v-if="hasCancel" label="ยกเลิก" color="danger" icon="close" @click="cancel" />
            </BaseButtons> -->
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
import {getGroupType,getGroupStatus} from '@/constants/group'
import numeral from 'numeral'

export default {
    data() {
        return {
            items: [],
            perPage: 10,
            currentPage: 0,
            parameterType: [
              { id: "", label: 'ทั้งหมด' },
              { id: "1", label: 'ขั้นบันได' },
              { id: "2", label: 'บิทดอกตาม' },
              { id: "3", label: 'เรทดอกตาม' }
            ],
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
        sumAmountReceiveToDay() {
            let sumAmountReceive = 0;
            this.items.receiveToday.map((row) => {
                sumAmountReceive += row.amount;
            })
            return {
                sumAmountReceive
            }
        },
        sumAmountSendToDay() {
            let sumAmountSend = 0;
            let sumAmountCare = 0;
            this.items.sendToday.map((row) => {
                sumAmountSend += row.amount;
                sumAmountCare += row.careFree;
            })
            return {
                sumAmountSend,sumAmountCare
            }
        },
        sumAmountDebtToDay() {
            let sumAmountDebt = 0;
            this.items.debtToDay.map((row) => {
                sumAmountDebt += (row.amountSend + row.careFree + row.fine) - row.paid;
            })
            return {
                sumAmountDebt
            }
        },
        getType(type){
        return getGroupType(type);
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
  
  
  