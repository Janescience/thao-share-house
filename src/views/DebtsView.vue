<template>
  <LayoutAuthenticated>
    <SectionMain>
        <section class="px-6 sm:px-0 mb-6 flex items-center justify-between">
          <div class="flex items-center justify-start">
            <h1 class="text-2xl">
              ยอดค้างจ่าย
            </h1>
          </div>
          <FormControl
              v-model="searchMember"
              icon="accountSearchOutline"
              class="shadow"
              placeholder="ค้นหาลูกแชร์"
          />
        </section>

        <CardBoxModal
            v-model="modalConfirm"
            title="ยืนยันอีกครั้ง"
            button-label="ยืนยัน"
            @confirm="funcConfirm"
            has-cancel
            >
            <p>{{ textConfirm }}</p>
        </CardBoxModal>

      
        <CardBox
            v-if="itemsPaginated.length > 0"
            :title="'รายการยอดค้างจ่าย ' + countChecked()"
            class="shadow-lg"
            has-table
        >
            <div
            class="p-3 bg-gray-100/50 dark:bg-gray-800"
            v-if="checkedRows.length > 0"
            >
            <span
                v-for="checkedRow in checkedRows"
                :key="checkedRow.memberId"
                class="inline-block px-2 py-1 rounded-sm mr-2 text-sm bg-gray-100 dark:bg-gray-700 mb-1"
            >
                {{ checkedRow.memberName }}
            </span>
            <table>
                <tbody>
                <tr
                >
                    <td >
                    <span class="justify-start">เหลือยอดค้างส่งรวม : </span>
                    <b class="text-red-500 " ><u>{{ formatCurrency(checkedSum().sumDebt) }}</u></b>
                    </td>
                    <td class="before:hidden lg:w-6 whitespace-nowrap">
                    <BaseButtons
                        type="justify-start lg:justify-end"
                        no-wrap
                    >
                        <BaseButton
                        color="success"
                        label="จ่ายยอดค้างทั้งหมด"
                        icon="cashCheck"
                        small
                        @click="isModalActive = true"
                        />
                    </BaseButtons>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>

            <table>
            <thead>
                <tr >
                <th />
                <th />
                <th class="text-center" >ลูกแชร์</th>
                <th class="text-center">ยอดค้าง </th>
                <th class="text-center">จ่ายแล้ว </th>
                <th class="text-center">เหลือจ่าย </th>
                <th />
                </tr>
            </thead>
            <tbody>
                <tr
                v-for="member in itemsPaginated"
                :key="member.memberId"
                >
                <TableCheckboxCell
                    v-if="member.sumDebt > 0"
                    :isChecked="member.checked"
                    class="text-center border-b-0 lg:w-6 before:hidden"
                    @checked="checked($event, member)"
                />
                <td v-else/>
                <td class="border-b-0 lg:w-6 before:hidden">
                    <UserAvatar
                    :username="member.memberId"
                    class="w-24 h-24 mx-auto lg:w-12 lg:h-12"
                    />
                </td>
                <td data-label="ลูกแชร์">
                    <span >{{ member.memberName }}</span>
                </td>
                <td data-label="ยอดค้าง" class="text-right">
                    <b class="text-blue-500 "><u>{{ formatCurrency(member.sumAmountSend) }}</u></b>
                </td>
                <td data-label="จ่ายแล้ว" class="text-right">
                    <b class="text-emerald-500 "><u>{{ formatCurrency(member.sumPaid) }}</u></b>
                </td>
                <td data-label="เหลือจ่าย" class="text-right">
                    <b class="text-red-500 " ><u>{{ member.sumDebt > 0 ? formatCurrency(member.sumDebt) : 'จ่ายครบแล้ว' }}</u></b>
                </td>
                <td class="before:hidden lg:w-6 whitespace-nowrap">
                    <BaseButtons
                    type="justify-end lg:justify-start"
                    no-wrap
                    >
                    
                    <BaseButton
                        :disabled="member.sumDebt > 0"
                        color="danger"
                        label="ยกเลิก"
                        
                        @click="confirm(
                            'ยืนยันยกเลิกยอดค้างทั้งหมดของ '+member.memberName+' ใช่หรือไม่ ?',
                            member.memberId,
                            cancel
                        )"
                    />
                    <BaseButton
                        color="info"
                        label="รายละเอียด"
                        @click="detail(member.memberId)"
                    />
                    <BaseButton
                        :disabled="member.sumDebt <= 0"
                        color="light"
                        label="จ่าย"
                        
                        @click="confirm(
                            'ยืนยันจ่ายยอดค้างทั้งหมดของ '+member.memberName+' ใช่หรือไม่ ?',
                            member.memberId,
                            paid
                        )"
                    />
                    <BaseButton
                        :disabled="member.sumDebt > 0"
                        color="success"
                        label="เสร็จสิ้น"
                        
                        @click="confirm(
                            'ยืนยันเสร็จสิ้นรายการยอดค้างของ '+member.memberName+' ใช่หรือไม่ ?',
                            member.memberId,
                            complete
                        )"
                    />
                    </BaseButtons>
                </td>
                </tr>
            </tbody>
            </table>
            <div
            class="p-3 lg:px-6 border-t border-gray-100 dark:border-gray-800"
            >
            <BaseLevel>
                <BaseButtons>
                <BaseButton
                    v-for="page in pagesList"
                    :key="page"
                    :active="page === currentPage"
                    :label="page + 1"
                    small
                    @click="currentPage = page"
                />
                </BaseButtons>
                <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
            </BaseLevel>
            </div>
        </CardBox>
        <CardBox v-else empty/>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script>
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/SectionMain.vue'
import SectionTitleBar from '@/components/SectionTitleBar.vue'

import CardBox from '@/components/CardBox.vue'
import CardBoxModal from '@/components/CardBoxModal.vue'
import TableCheckboxCell from '@/components/TableCheckboxCell.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseIcon from '@/components/BaseIcon.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import FormControl from '@/components/FormControl.vue'

import DebtService from '@/services/debt'

import numeral from 'numeral'

export default {
    data(){
        return {
            titleStack : ['ยอดค้างจ่าย'],
            textConfirm : "",
            modalConfirm : false,
            funcConfirm : Function,
            idConfirm : null,
            perPage :10,
            currentPage : 0,
            checkedRows : [],
            items : [],
            searchMember : "",
            iconSort : "sort",
            order : ""
        }
    },
    watch : {
      searchMember (value) {
        this.getDebts(value)
      }
    },
    created() {
      this.getDebts()
    },
    computed : {
      itemsPaginated() {
        return this.items ? this.items.slice(this.perPage * this.currentPage, this.perPage * (this.currentPage + 1)) : []
      },
      numPages(){
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
    methods: {
      async getDebts(searchMember = "",order = "DESC",sort = "sumDebt"){
        let loader = this.$loading.show();
        const resp = await DebtService.getDebts({search:searchMember,order:order,sort:sort});
        if(resp.data){
          this.items = resp.data.data
          loader.hide()
        }
      },
      async paid(){
          const resp = await DebtService.paid(this.idConfirm);
          if(resp.data){
              this.idConfirm = null
              this.getDebts()
          }
      },
      async complete(){
          const resp = await DebtService.complete(this.idConfirm);
          if(resp.data){
              this.idConfirm = null
              this.getDebts()
          }
      },
      async cancel(){
          const resp = await DebtService.cancel(this.idConfirm);
          if(resp.data){
              this.idConfirm = null
              this.getDebts()
          }
      },
      detail(memberId){
        this.$router.push({
                name :"debt-detail",
                params: {
                    id: memberId
                }
              })
      },
      countChecked(){
        return (this.checkedRows.length > 0 ? '(เลือก ' + this.checkedRows.length + ' รายการ)':'')
      },
      checked(isChecked, member){
        if (isChecked) {
          member.checked = true
          this.checkedRows.push(member)
        } else {
           member.checked = false
          this.checkedRows = this.remove(this.checkedRows, row => row.memberId === member.memberId)
        }
      },
      checkedSum(){
        let sumAmountSend = 0,sumDebt = 0,sumPaid = 0;
        this.checkedRows.map((row) => {
            sumAmountSend += row.sumAmountSend;
            sumPaid += row.sumPaid;
            sumDebt += row.sumDebt;
        })
        return {
          sumAmountSend,
          sumPaid,
          sumDebt
        }
      },
      remove(arr,cb){
        const newArr = []
        arr.forEach(item => {
          if (!cb(item)) {
            newArr.push(item)
          }
        })
        return newArr
      },
      confirm(text,memberId,func){
        this.textConfirm = text
        this.funcConfirm = func
        this.idConfirm = memberId
        this.modalConfirm = true
      },
      formatCurrency(amt){
        return numeral(amt).format(0,0)
      }
    },
    components : {
        LayoutAuthenticated,
        SectionMain,
        SectionTitleBar,
        CardBoxModal,
        TableCheckboxCell,
        BaseLevel,
        BaseButtons,
        BaseButton,
        UserAvatar,
        CardBox,
        FormControl,
        BaseIcon
    }
}
</script>